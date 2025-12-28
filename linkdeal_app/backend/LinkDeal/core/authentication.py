# accounts/authentication.py
import logging
from functools import lru_cache

import requests
from jose import jwt
from django.conf import settings
from django.db import transaction
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from accounts.models import AppUser, MentorProfile, MenteeProfile
from accounts.services import IdentityMappingService

logger = logging.getLogger(__name__)


@lru_cache(maxsize=1)
def _get_jwks():
    url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"
    try:
        resp = requests.get(url, timeout=5)
        resp.raise_for_status()
        return resp.json()
    except requests.RequestException as e:
        logger.error("Failed to fetch Auth0 JWKS: %s", e)
        raise AuthenticationFailed("Unable to fetch JWKS from Auth0")


class Auth0User:
    """
    Lightweight user object constructed from the Auth0 access token payload.
    """

    @staticmethod
    def _extract_email_verified(payload: dict) -> bool:
        """
        Extract email_verified flag from multiple possible locations.
        Defaults to False if not explicitly present (safer for DB identities).
        """
        ns = getattr(settings, "AUTH0_CUSTOM_NAMESPACE", "https://linkdeal.com/claims/")

        if "email_verified" in payload:
            return bool(payload.get("email_verified"))

        if f"{ns}email_verified" in payload:
            return bool(payload.get(f"{ns}email_verified"))

        app_metadata = payload.get(f"{ns}app_metadata", {}) or payload.get("app_metadata", {}) or {}
        if "email_verified" in app_metadata:
            return bool(app_metadata.get("email_verified"))

        # Default: assume False unless explicitly true
        return False

    def __init__(self, payload):
        self._payload = payload
        ns = getattr(settings, "AUTH0_CUSTOM_NAMESPACE", "https://linkdeal.com/claims/")

        # Core identifiers
        self.auth0_id = payload.get("sub")
        
        # Email: try multiple sources (token, app_metadata, user_metadata)
        self.email = (
            payload.get("email") or
            payload.get(f"{ns}email") or
            payload.get("https://linkdeal.com/email") or
            None
        )
        # Email verified flag with robust extraction
        self.email_verified = self._extract_email_verified(payload)
        
        # If email still not found, try to get from app_metadata or user_metadata
        if not self.email:
            app_metadata = payload.get(f"{ns}app_metadata", {}) or payload.get("app_metadata", {}) or {}
            user_metadata = payload.get(f"{ns}user_metadata", {}) or payload.get("user_metadata", {}) or {}
            self.email = app_metadata.get("email") or user_metadata.get("email")

        # Extract name from identity provider
        self.name = payload.get("name")

        # Get app_metadata first (needed for fallbacks)
        self.app_metadata = payload.get(f"{ns}app_metadata", {}) or payload.get("app_metadata", {}) or {}
        
        # RBAC info - try multiple sources
        # 1. First try namespaced claims (custom)
        self.roles = payload.get(f"{ns}roles", []) or []
        self.permissions = payload.get(f"{ns}permissions", []) or []
        
        # 2. Try Auth0 RBAC standard location (authorization object)
        authorization = payload.get("authorization", {}) or {}
        if authorization:
            # RBAC roles from authorization object
            rbac_roles = authorization.get("roles", []) or []
            if rbac_roles and not self.roles:
                self.roles = rbac_roles
            
            # RBAC permissions from authorization object
            # Permissions can be objects with 'permission_name' or simple strings
            rbac_permissions = authorization.get("permissions", []) or []
            if rbac_permissions and not self.permissions:
                # Normalize permissions: extract permission_name if it's an object, otherwise use as string
                normalized_permissions = []
                for perm in rbac_permissions:
                    if isinstance(perm, dict):
                        normalized_permissions.append(perm.get("permission_name", perm))
                    else:
                        normalized_permissions.append(perm)
                self.permissions = normalized_permissions
        
        # 3. Fallback to standard permissions claim (if not namespaced)
        if not self.permissions:
            self.permissions = payload.get("permissions", []) or []
        
        # 4. If roles still empty, try to extract from app_metadata
        if not self.roles and self.app_metadata:
            role_from_metadata = self.app_metadata.get("role")
            if role_from_metadata:
                self.roles = [role_from_metadata]

        # Derive main role for convenience (super_admin > admin > mentor > mentee)
        # First try from roles array
        role = None
        if "super_admin" in self.roles:
            role = "super_admin"
        elif "admin" in self.roles:
            role = "admin"
        elif "mentor" in self.roles:
            role = "mentor"
        elif "mentee" in self.roles:
            role = "mentee"
        
        # If no role from roles array, try app_metadata
        if not role:
            role = self.app_metadata.get("role")
        
        self.role = role

    @property
    def is_authenticated(self):
        return True

    @property
    def pk(self):
        """
        Primary key for throttling and caching.
        Returns auth0_id as a string identifier.
        """
        return self.auth0_id

    def has_role(self, role_name: str) -> bool:
        return role_name in (self.roles or [])

    def has_permission(self, perm: str) -> bool:
        return perm in (self.permissions or [])


class Auth0JWTAuthentication(BaseAuthentication):
    """
    Production-grade Auth0 RS256 JWT authentication.
    Automatically syncs/creates AppUser in local database on authentication.
    """

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return None  # let DRF treat as unauthenticated

        if not auth_header.startswith("Bearer "):
            raise AuthenticationFailed("Invalid Authorization header format")

        token = auth_header.split()[1]

        payload = self._verify_token(token)
        user = Auth0User(payload)
        
        # Sync AppUser in local database
        self._sync_app_user(user)
        
        return user, None

    def _sync_app_user(self, auth0_user: Auth0User):
        """
        Sync AppUser in local database based on Auth0 token.
        Registration is required before login - no auto-creation during authentication.
        """
        if not auth0_user.auth0_id or not auth0_user.email:
            logger.warning("Auth0 token missing auth0_id or email, skipping sync")
            return

        # Enforce email verification for Auth0 DB identities (provider auth0)
        is_db_identity = auth0_user.auth0_id.startswith("auth0|")
        if is_db_identity and not auth0_user.email_verified:
            logger.warning("DB user %s attempted login without verified email", auth0_user.email)
            raise AuthenticationFailed("Email not verified.")

        # Use IdentityMappingService - only finds, never creates
        # User must register first via registration endpoint
        try:
            with transaction.atomic():
                app_user = IdentityMappingService.map_identity_to_app_user(
                    auth0_user=auth0_user,
                    chosen_role=None,  # Not used anymore
                )

                # Update email if it changed in Auth0 (identity linking case)
                if app_user.email != auth0_user.email and auth0_user.email:
                    app_user.email = auth0_user.email
                    app_user.save(update_fields=["email"])
                    logger.info(f"Updated AppUser email for {auth0_user.auth0_id}")

                # ----------------------------------------------------
                # Enforce role requirement - user must have a role
                # ----------------------------------------------------
                # Check if user has a role in either token or DB
                has_token_role = bool(auth0_user.role) or bool(auth0_user.roles)
                has_db_role = bool(app_user.role)
                
                if not has_token_role and not has_db_role:
                    logger.warning(
                        f"User {auth0_user.email} ({auth0_user.auth0_id}) attempted login without a role"
                    )
                    raise AuthenticationFailed(
                        "User account has no role assigned. Please contact support."
                    )
                
                # If token has role but DB doesn't, update DB (sync from Auth0)
                if has_token_role and not has_db_role:
                    # Use the primary role from token, or extract from roles array
                    role_to_sync = auth0_user.role
                    if not role_to_sync and auth0_user.roles:
                        # Extract primary role from roles array (priority: super_admin > admin > mentor > mentee)
                        if "super_admin" in auth0_user.roles:
                            role_to_sync = "super_admin"
                        elif "admin" in auth0_user.roles:
                            role_to_sync = "admin"
                        elif "mentor" in auth0_user.roles:
                            role_to_sync = "mentor"
                        elif "mentee" in auth0_user.roles:
                            role_to_sync = "mentee"
                        else:
                            # Use first role as fallback
                            role_to_sync = auth0_user.roles[0] if auth0_user.roles else None
                    
                    if role_to_sync:
                        # Validate role is in allowed choices before saving
                        valid_roles = ["super_admin", "admin", "mentor", "mentee"]
                        if role_to_sync not in valid_roles:
                            logger.warning(
                                f"Invalid role '{role_to_sync}' from token for {auth0_user.auth0_id}. "
                                f"Valid roles: {valid_roles}"
                            )
                            # If role is invalid, block authentication
                            raise AuthenticationFailed(
                                f"Invalid role assigned to user account. Please contact support."
                            )
                        
                        app_user.role = role_to_sync
                        app_user.save(update_fields=["role"])
                        logger.info(
                            f"Updated AppUser role for {auth0_user.auth0_id} from token: {role_to_sync}"
                        )
                    else:
                        # This should not happen if has_token_role is True, but handle edge case
                        logger.error(
                            f"Failed to extract valid role from token for {auth0_user.auth0_id}. "
                            f"auth0_user.role={auth0_user.role}, auth0_user.roles={auth0_user.roles}"
                        )
                        raise AuthenticationFailed(
                            "Unable to determine user role from authentication token. Please contact support."
                        )

                # ----------------------------------------------------
                # Enforce status/ban using local DB (identity-agnostic)
                # ----------------------------------------------------
                # If Auth0User has no role but DB does, use DB role for this request context
                # This fixes the issue where a fresh login token might not have the role claim yet
                if not auth0_user.role and app_user.role:
                    auth0_user.role = app_user.role
                    auth0_user.roles = [app_user.role]
                    logger.info(f"Backfilled Auth0User role from DB: {app_user.role}")

                # Safety check: ensure app_user.role is set after validation/sync
                if not app_user.role:
                    logger.error(
                        f"AppUser {app_user.email} ({app_user.auth0_id}) has no role after validation/sync. "
                        f"This should not happen."
                    )
                    raise AuthenticationFailed(
                        "User account role is missing. Please contact support."
                    )
                
                if app_user.role == "mentor":
                    try:
                        mentor = MentorProfile.objects.select_related("user").get(user=app_user)
                        if mentor.status == "banned":
                            logger.warning("Mentor %s is banned (DB check)", app_user.email)
                            raise AuthenticationFailed("Mentor account is banned.")
                        if mentor.status == "rejected":
                            logger.warning("Mentor %s is rejected (DB check)", app_user.email)
                            raise AuthenticationFailed("Mentor account was rejected.")
                        if mentor.status != "approved":
                            logger.warning("Mentor %s is pending (DB check)", app_user.email)
                            raise AuthenticationFailed("Mentor account is pending approval.")
                    except MentorProfile.DoesNotExist:
                        logger.warning("Mentor profile missing for %s", app_user.email)
                        raise AuthenticationFailed("Mentor profile not found.")

                if app_user.role == "mentee":
                    try:
                        mentee = MenteeProfile.objects.select_related("user").get(user=app_user)
                        if mentee.status == "banned":
                            logger.warning("Mentee %s is banned (DB check)", app_user.email)
                            raise AuthenticationFailed("Mentee account is banned.")
                    except MenteeProfile.DoesNotExist:
                        # Block authentication - profile should exist after registration
                        logger.warning("Mentee profile missing for %s", app_user.email)
                        raise AuthenticationFailed("Mentee profile not found. Please complete registration first.")

        except ValueError as e:
            # AppUser not found by auth0_id - check if email exists with different auth method
            logger.info(f"AppUser not found for auth0_id {auth0_user.auth0_id}: {e}")
            
            # Check if there's an existing account with this email (registered via different method)
            existing_user = AppUser.objects.filter(email=auth0_user.email).first()
            if existing_user:
                # Email exists with different auth0_id - this is a linking case!
                # Store info in auth0_user for the view to return to frontend
                auth0_user.requires_linking = True
                auth0_user.existing_role = existing_user.role
                logger.info(
                    f"Email {auth0_user.email} exists with different auth0_id. "
                    f"Existing: {existing_user.auth0_id}, New: {auth0_user.auth0_id}. "
                    f"Account linking required."
                )
                # Return and let the view handle this - don't raise exception
                return
            
            # No existing account - registration required
            raise AuthenticationFailed(
                "Account not found. Please complete registration first."
            )
        except AuthenticationFailed:
            # Propagate auth failures to block login
            raise
        except Exception as e:
            # Fail authentication if sync fails - AppUser must exist for proper authorization
            logger.error(f"Failed to sync AppUser for {auth0_user.email}: {e}", exc_info=True)
            raise AuthenticationFailed(
                "Failed to sync user account. Please contact support."
            )

    def _verify_token(self, token: str) -> dict:
        try:
            unverified_header = jwt.get_unverified_header(token)
        except jwt.JWTError as e:
            raise AuthenticationFailed(f"Invalid token header: {e}")

        kid = unverified_header.get("kid")
        if not kid:
            raise AuthenticationFailed("Missing 'kid' in token header")

        jwks = _get_jwks()
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == kid:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }
                break

        if not rsa_key:
            raise AuthenticationFailed("Unable to find a matching JWK for token")

        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                audience=settings.AUTH0_AUDIENCE,
                issuer=f"https://{settings.AUTH0_DOMAIN}/",
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired")
        except jwt.JWTClaimsError as e:
            raise AuthenticationFailed(f"Invalid token claims: {e}")
        except Exception as e:
            logger.error("Auth0 token verification error: %s", e)
            raise AuthenticationFailed("Token verification failed")


class Auth0JWTRegistrationAuthentication(BaseAuthentication):
    """
    Auth0 JWT authentication for REGISTRATION endpoints only.
    
    This class validates the Auth0 JWT but does NOT require the AppUser to exist.
    It's used for social registration endpoints where we're creating the user.
    
    Unlike Auth0JWTAuthentication, this class:
    - Does NOT call _sync_app_user()
    - Does NOT require the user to exist in the database
    - Only validates the JWT token from Auth0
    """

    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return None  # let DRF treat as unauthenticated

        if not auth_header.startswith("Bearer "):
            raise AuthenticationFailed("Invalid Authorization header format")

        token = auth_header.split()[1]

        payload = self._verify_token(token)
        user = Auth0User(payload)
        
        # For registration: Do NOT sync AppUser - the registration endpoint will create it
        # Just validate the token and return the Auth0User
        logger.info(f"Registration auth: validated token for {user.email} ({user.auth0_id})")
        
        return user, None

    def _verify_token(self, token: str) -> dict:
        """Verify the Auth0 JWT token (same logic as Auth0JWTAuthentication)."""
        try:
            unverified_header = jwt.get_unverified_header(token)
        except jwt.JWTError:
            raise AuthenticationFailed("Invalid token header")

        jwks = _get_jwks()
        rsa_key = {}
        for key in jwks["keys"]:
            if key["kid"] == unverified_header["kid"]:
                rsa_key = {
                    "kty": key["kty"],
                    "kid": key["kid"],
                    "use": key["use"],
                    "n": key["n"],
                    "e": key["e"],
                }
                break

        if not rsa_key:
            raise AuthenticationFailed("Unable to find a matching JWK for token")

        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=["RS256"],
                audience=settings.AUTH0_AUDIENCE,
                issuer=f"https://{settings.AUTH0_DOMAIN}/",
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token has expired")
        except jwt.JWTClaimsError as e:
            raise AuthenticationFailed(f"Invalid token claims: {e}")
        except Exception as e:
            logger.error("Auth0 token verification error: %s", e)
            raise AuthenticationFailed("Token verification failed")
