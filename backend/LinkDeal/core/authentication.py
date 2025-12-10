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
        Create or update AppUser in local database based on Auth0 token.
        This ensures local DB stays in sync with Auth0.
        """
        if not auth0_user.auth0_id or not auth0_user.email:
            logger.warning("Auth0 token missing auth0_id or email, skipping sync")
            return

        # Enforce email verification for Auth0 DB identities (provider auth0)
        is_db_identity = auth0_user.auth0_id.startswith("auth0|")
        if is_db_identity and not auth0_user.email_verified:
            logger.warning("DB user %s attempted login without verified email", auth0_user.email)
            raise AuthenticationFailed("Email not verified.")

        # For social logins, check if a DB identity exists but is not verified.
        # This prevents linking social accounts to unverified DB accounts.
        # If we cannot verify, we fail-closed to stay safe.
        if not is_db_identity and auth0_user.email:
            # Import lazily to avoid circular imports during module load
            from accounts.auth0_client import Auth0Client
            from core.exceptions import ExternalServiceError

            # First check if AppUser already exists with this exact auth0_id (STEP 1 of mapping)
            # If it does, no linking is needed, so skip the verification check
            try:
                existing_app_user = AppUser.objects.get(auth0_id=auth0_user.auth0_id)
                logger.debug(
                    "AppUser already exists with auth0_id %s, skipping DB verification check",
                    auth0_user.auth0_id,
                )
            except AppUser.DoesNotExist:
                # AppUser doesn't exist with this auth0_id, check if linking would occur
                # and if so, verify that any existing DB identity is verified
                try:
                    unverified_db_auth0_id = Auth0Client.get_unverified_db_identity(email=auth0_user.email)
                    if unverified_db_auth0_id:
                        # Check if AppUser exists with this email and has the unverified DB auth0_id
                        existing_app_user = AppUser.objects.filter(email=auth0_user.email).first()
                        if existing_app_user and existing_app_user.auth0_id == unverified_db_auth0_id:
                            logger.warning(
                                "Social login %s attempted to link to unverified DB account %s",
                                auth0_user.auth0_id,
                                auth0_user.email,
                            )
                            raise AuthenticationFailed(
                                "Un compte base de données non vérifié existe pour cet email. "
                                "Veuillez vérifier votre email avant de lier ce compte social."
                            )
                except ExternalServiceError:
                    # Fail-closed: if we cannot verify the DB identity status, block to stay safe
                    logger.warning(
                        "Failed to check for unverified DB identity; blocking login for safety (email=%s)",
                        auth0_user.email,
                    )
                    raise AuthenticationFailed(
                        "Unable to verify account status. Please retry or contact support."
                    )

        # Use IdentityMappingService for consistent identity mapping
        # Note: During authentication, we don't have a "chosen_role" from registration,
        # so we infer it from the token (which should have been set during registration)
        try:
            with transaction.atomic():
                app_user, created = IdentityMappingService.map_identity_to_app_user(
                    auth0_user=auth0_user,
                    chosen_role=None,  # Infer from token during auth
                )

                # Update email if it changed in Auth0 (identity linking case)
                if app_user.email != auth0_user.email and auth0_user.email:
                    app_user.email = auth0_user.email
                    app_user.save(update_fields=["email"])
                    logger.info(f"Updated AppUser email for {auth0_user.auth0_id}")

                if created:
                    # Check if this is an admin/super_admin created outside the invite flow
                    if app_user.role in ["admin", "super_admin"]:
                        logger.info(
                            f"Auto-created AppUser for {auth0_user.email} (role: {app_user.role}) "
                            f"- user was created directly in Auth0, not via invite flow"
                        )
                    else:
                        logger.info(f"Auto-created AppUser for {auth0_user.email} (role: {app_user.role})")

                # ----------------------------------------------------
                # Enforce status/ban using local DB (identity-agnostic)
                # ----------------------------------------------------
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
                        # Allow social registration to create the profile; block only at post-registration flows
                        logger.warning("Mentee profile missing for %s; allowing auth to proceed for registration", app_user.email)

        except AuthenticationFailed:
            # Propagate auth failures to block login
            raise
        except Exception as e:
            # Don't fail authentication if sync fails, but log it
            logger.error(f"Failed to sync AppUser for {auth0_user.email}: {e}", exc_info=True)

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
