# accounts/auth0_client.py
import logging
import secrets
import string
import requests
from django.conf import settings
from core.exceptions import ExternalServiceError
from typing import Optional, Dict, Any, List


logger = logging.getLogger(__name__)


def _generate_random_password(length: int = 32) -> str:
    """
    Generate a cryptographically secure random password.
    Used for creating users who will set their own password via reset email.
    """
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    # Ensure at least one of each required character type
    password = [
        secrets.choice(string.ascii_uppercase),
        secrets.choice(string.ascii_lowercase),
        secrets.choice(string.digits),
        secrets.choice("!@#$%^&*"),
    ]
    # Fill the rest with random characters
    password += [secrets.choice(alphabet) for _ in range(length - 4)]
    # Shuffle to avoid predictable positions
    secrets.SystemRandom().shuffle(password)
    return "".join(password)


class Auth0Client:
    """
    Small wrapper around Auth0 Management API.

    Uses client-credentials flow to obtain a short-lived token
    and then calls the /api/v2 endpoints.
    """

    @classmethod
    def _get_mgmt_token(cls) -> str:
        """
        Get a Management API token using client_credentials.
        """
        url = f"https://{settings.AUTH0_DOMAIN}/oauth/token"

        payload = {
            "grant_type": "client_credentials",
            "client_id": settings.AUTH0_MGMT_CLIENT_ID,
            "client_secret": settings.AUTH0_MGMT_CLIENT_SECRET,
            "audience": f"https://{settings.AUTH0_DOMAIN}/api/v2/",
        }

        try:
            resp = requests.post(url, json=payload, timeout=5)
        except requests.RequestException as exc:
            logger.exception("Error calling Auth0 /oauth/token")
            raise ExternalServiceError("Could not contact Auth0 for management token") from exc

        if resp.status_code != 200:
            logger.error("MGMT TOKEN ERROR: %s %s", resp.status_code, resp.text)
            raise ExternalServiceError("Auth0 management token request failed")

        data = resp.json()
        return data["access_token"]

    @classmethod
    def _headers(cls) -> Dict[str, str]:
        """
        Common headers for Management API calls.
        """
        token = cls._get_mgmt_token()
        return {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

    # ------------------------------------------------------------------ #
    # User operations
    # ------------------------------------------------------------------ #

    @classmethod
    def create_user(
        cls,
        *,
        email: str,
        password: str,
        role: str,
        approval_status: Optional[str] = None,
        user_metadata: Optional[Dict[str, Any]] = None,
        extra_app_metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Create a user in Auth0 with given role + approval_status in app_metadata.

        :param email: user email
        :param password: plain text password (will be hashed by Auth0)
        :param role: "mentor", "mentee", "admin", ...
        :param approval_status: e.g. "pending" or "approved"
        :param user_metadata: optional user_metadata dict
        :param extra_app_metadata: extra app_metadata merged on top
        :return: JSON dict returned by Auth0
        """
        mgmt_token = cls._get_mgmt_token()
        url = f"https://{settings.AUTH0_DOMAIN}/api/v2/users"

        connection = getattr(
            settings,
            "AUTH0_DB_CONNECTION",
            "Username-Password-Authentication",
        )

        app_metadata = {
            "role": role,
        }
        if approval_status is not None:
            app_metadata["approval_status"] = approval_status
        if extra_app_metadata:
            app_metadata.update(extra_app_metadata)

        payload = {
            "email": email,
            "password": password,
            "connection": connection,
            "verify_email": True,
            "email_verified": False,
            "user_metadata": user_metadata or {},
            "app_metadata": app_metadata,
        }

        headers = {
            "Authorization": f"Bearer {mgmt_token}",
            "Content-Type": "application/json",
        }

        try:
            resp = requests.post(url, json=payload, headers=headers, timeout=10)
            try:
                data = resp.json()
            except Exception:
                data = resp.text

            if not resp.ok:
                logger.error("Auth0 create_user error: %s %s", resp.status_code, data)
                resp.raise_for_status()

            return data
        except requests.RequestException as e:
            logger.exception("Error creating Auth0 user")
            raise ExternalServiceError("Error creating user in Auth0") from e


    @classmethod
    def update_user_app_metadata(cls, auth0_user_id: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Patch app_metadata for an Auth0 user.
        """
        url = f"https://{settings.AUTH0_DOMAIN}/api/v2/users/{auth0_user_id}"

        payload = {"app_metadata": metadata}

        try:
            resp = requests.patch(url, json=payload, headers=cls._headers(), timeout=5)
        except requests.RequestException as exc:
            logger.exception("Error calling Auth0 update_user_app_metadata")
            raise ExternalServiceError("Could not contact Auth0 to update app_metadata") from exc

        if resp.status_code not in (200, 201):
            logger.error("Auth0 update_user_app_metadata error: %s %s", resp.status_code, resp.text)
            raise ExternalServiceError("Auth0 app_metadata update failed")

        return resp.json()

    @classmethod
    def assign_role(cls, auth0_user_id: str, role_id: str) -> None:
        """
        Assign one role to an Auth0 user.
        """
        url = f"https://{settings.AUTH0_DOMAIN}/api/v2/users/{auth0_user_id}/roles"

        payload = {"roles": [role_id]}

        try:
            resp = requests.post(url, json=payload, headers=cls._headers(), timeout=5)
        except requests.RequestException as exc:
            logger.exception("Error calling Auth0 assign_role")
            raise ExternalServiceError("Could not contact Auth0 to assign role") from exc

        if resp.status_code not in (204, 201):
            logger.error("Auth0 assign_role error: %s %s", resp.status_code, resp.text)
            raise ExternalServiceError("Auth0 role assignment failed")


    @classmethod
    def get_user(cls, user_id: str) -> dict:
        """
        Fetch Auth0 user profile (optional helper).
        
        :param user_id: The Auth0 user ID (e.g. "auth0|abc123")
        :return: User profile dict from Auth0
        :raises ExternalServiceError: If the user doesn't exist (404) or other error
        """
        url = f"https://{settings.AUTH0_DOMAIN}/api/v2/users/{user_id}"

        try:
            resp = requests.get(url, headers=cls._headers(), timeout=10)
        except requests.RequestException as e:
            logger.error("Auth0 get_user request error: %s", e)
            raise ExternalServiceError("Unable to contact Auth0 when fetching user.")

        if resp.status_code == 404:
            # User not found in Auth0
            logger.info(f"Auth0 user {user_id} not found (404)")
            raise ExternalServiceError("Auth0 user not found (404)")

        if not resp.ok:
            logger.error("Auth0 get_user error [%s]: %s", resp.status_code, resp.text)
            raise ExternalServiceError(f"Auth0 failed to fetch user profile: HTTP {resp.status_code}")

        return resp.json()

    @classmethod
    def find_users_by_email(cls, email: str) -> List[Dict[str, Any]]:
        """
        Find Auth0 users by email.

        :param email: Email to search for
        :return: List of user dicts returned by Auth0
        :raises ExternalServiceError: If the search fails
        """
        url = f"https://{settings.AUTH0_DOMAIN}/api/v2/users-by-email"

        try:
            resp = requests.get(
                url,
                headers=cls._headers(),
                params={"email": email},
                timeout=10,
            )
        except requests.RequestException as exc:
            logger.exception("Error calling Auth0 users-by-email")
            raise ExternalServiceError("Could not contact Auth0 to search users by email") from exc

        if not resp.ok:
            logger.error("Auth0 users-by-email error [%s]: %s", resp.status_code, resp.text)
            raise ExternalServiceError(f"Auth0 failed to search users by email: HTTP {resp.status_code}")

        try:
            return resp.json()
        except ValueError:
            logger.error("Auth0 users-by-email returned non-JSON response")
            raise ExternalServiceError("Invalid response from Auth0 users-by-email")

    @classmethod
    def user_has_db_identity(cls, email: str) -> bool:
        """
        Check if the user (by email) has a DB (Auth0) identity.
        Social-only users (Google/LinkedIn) should return False.
        """
        users = cls.find_users_by_email(email=email)

        for user in users:
            identities = user.get("identities") or []
            for identity in identities:
                provider = identity.get("provider")
                # Auth0 database connection uses provider "auth0"
                if provider == "auth0":
                    return True

        return False

    @classmethod
    def get_unverified_db_identity(cls, email: str) -> Optional[str]:
        """
        Return the Auth0 user_id of a DB (auth0) identity whose email is NOT verified.
        If none found, return None.
        """
        users = cls.find_users_by_email(email=email)

        for user in users:
            identities = user.get("identities") or []
            for identity in identities:
                if identity.get("provider") != "auth0":
                    continue

                auth0_user_id = user.get("user_id")
                is_verified = identity.get("profileData", {}).get(
                    "email_verified",
                    user.get("email_verified", False),
                )
                if not is_verified:
                    return auth0_user_id

        return None

    @classmethod
    def delete_user(cls, auth0_user_id: str, ignore_not_found: bool = False) -> None:
        """
        Delete a user from Auth0.
        This is a permanent operation and cannot be undone.
        
        :param auth0_user_id: The Auth0 user ID (e.g. "auth0|abc123")
        :param ignore_not_found: If True, don't raise error if user doesn't exist (404)
        :raises ExternalServiceError: If the deletion fails (unless ignore_not_found=True and 404)
        """
        url = f"https://{settings.AUTH0_DOMAIN}/api/v2/users/{auth0_user_id}"

        try:
            resp = requests.delete(url, headers=cls._headers(), timeout=10)
        except requests.RequestException as exc:
            logger.exception("Error calling Auth0 delete_user")
            raise ExternalServiceError("Could not contact Auth0 to delete user") from exc

        if resp.status_code == 404:
            # User doesn't exist in Auth0
            if ignore_not_found:
                logger.info(f"Auth0 user {auth0_user_id} not found (404), ignoring as requested")
                return
            else:
                logger.warning(f"Auth0 user {auth0_user_id} not found (404)")
                raise ExternalServiceError("Auth0 user not found (404)")

        if resp.status_code not in (204, 200):
            logger.error("Auth0 delete_user error: %s %s", resp.status_code, resp.text)
            raise ExternalServiceError(f"Auth0 user deletion failed: HTTP {resp.status_code}")
        
        logger.info(f"Successfully deleted Auth0 user: {auth0_user_id}")

    @classmethod
    def create_user_without_password(
        cls,
        *,
        email: str,
        role: str,
        approval_status: Optional[str] = None,
        user_metadata: Optional[Dict[str, Any]] = None,
        extra_app_metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Create a user in Auth0 WITHOUT setting a password.
        The user will need to set their password via password reset email.
        
        :param email: user email
        :param role: "admin", "super_admin", etc.
        :param approval_status: e.g. "approved" for admins
        :param user_metadata: optional user_metadata dict
        :param extra_app_metadata: extra app_metadata merged on top
        :return: JSON dict returned by Auth0 with user_id
        """
        mgmt_token = cls._get_mgmt_token()
        url = f"https://{settings.AUTH0_DOMAIN}/api/v2/users"

        connection = getattr(
            settings,
            "AUTH0_DB_CONNECTION",
            "Username-Password-Authentication",
        )

        app_metadata = {
            "role": role,
        }
        if approval_status is not None:
            app_metadata["approval_status"] = approval_status
        if extra_app_metadata:
            app_metadata.update(extra_app_metadata)

        # Auth0 requires a password for database connections.
        # Generate a secure random password that user will never use
        # (they will set their own via password reset email)
        temp_password = _generate_random_password()

        payload = {
            "email": email,
            "password": temp_password,
            "connection": connection,
            "verify_email": False,  # We'll send password reset instead
            "email_verified": False,
            "user_metadata": user_metadata or {},
            "app_metadata": app_metadata,
        }

        headers = {
            "Authorization": f"Bearer {mgmt_token}",
            "Content-Type": "application/json",
        }

        try:
            resp = requests.post(url, json=payload, headers=headers, timeout=10)
            try:
                data = resp.json()
            except ValueError:
                data = {}

            if resp.status_code not in (200, 201):
                error_msg = data.get("message", resp.text) or f"HTTP {resp.status_code}"
                logger.error("Auth0 create_user_without_password error: %s", error_msg)
                raise ExternalServiceError(f"Auth0 user creation failed: {error_msg}")

            logger.info(f"Created Auth0 user without password: {data.get('user_id')} ({email})")
            return data

        except requests.RequestException as exc:
            logger.exception("Error calling Auth0 create_user_without_password")
            raise ExternalServiceError("Could not contact Auth0 to create user") from exc
        except ExternalServiceError:
            raise
        except Exception as e:
            logger.exception("Unexpected error in create_user_without_password")
            raise ExternalServiceError("Error creating user in Auth0") from e

    @classmethod
    def send_password_reset_email(cls, email: str) -> None:
        """
        Send a password reset email to a user via Auth0's Authentication API.
        This triggers Auth0's password change flow.
        
        :param email: The user's email address
        :raises ExternalServiceError: If the email sending fails
        """
        # Use Auth0 Authentication API (not Management API)
        url = f"https://{settings.AUTH0_DOMAIN}/dbconnections/change_password"

        connection = getattr(
            settings,
            "AUTH0_DB_CONNECTION",
            "Username-Password-Authentication",
        )

        payload = {
            "client_id": settings.AUTH0_SPA_CLIENT_ID,
            "email": email,
            "connection": connection,
        }

        headers = {
            "Content-Type": "application/json",
        }

        try:
            resp = requests.post(url, json=payload, headers=headers, timeout=10)
        except requests.RequestException as exc:
            logger.exception("Error calling Auth0 change_password endpoint")
            raise ExternalServiceError("Could not contact Auth0 to send password reset email") from exc

        # Auth0 returns 200 with a message like "We've just sent you an email to reset your password."
        if resp.status_code != 200:
            logger.error("Auth0 send_password_reset_email error: %s %s", resp.status_code, resp.text)
            raise ExternalServiceError("Auth0 password reset email sending failed")
        
        logger.info(f"Successfully sent password reset email to: {email}")

    # ------------------------------------------------------------------ #
    # Email verification
    # ------------------------------------------------------------------ #
    @classmethod
    def send_verification_email(cls, auth0_user_id: str) -> None:
        """
        Trigger Auth0 verification email for a given Auth0 user_id.
        Requires Management API scope: create:email_verification_tickets (or send email verification).
        """
        url = f"https://{settings.AUTH0_DOMAIN}/api/v2/jobs/verification-email"

        payload = {"user_id": auth0_user_id}

        try:
            resp = requests.post(url, json=payload, headers=cls._headers(), timeout=10)
        except requests.RequestException as exc:
            logger.exception("Error calling Auth0 verification-email job")
            raise ExternalServiceError("Could not contact Auth0 to send verification email") from exc

        if resp.status_code not in (200, 201):
            logger.error("Auth0 send_verification_email error: %s %s", resp.status_code, resp.text)
            raise ExternalServiceError("Auth0 verification email sending failed")

        logger.info(f"Successfully triggered verification email for Auth0 user: {auth0_user_id}")

    @classmethod
    def link_identities(cls, primary_user_id: str, secondary_user_id: str) -> Dict[str, Any]:
        """
        Link two Auth0 user identities together.
        
        After linking, both identities will share the same Auth0 user_id (the primary one).
        Users can then log in with either identity provider and get the same account.
        
        :param primary_user_id: The main Auth0 user ID (e.g., "auth0|db123")
        :param secondary_user_id: The identity to link (e.g., "google-oauth2|g123")
        :return: Updated user object from Auth0
        :raises ExternalServiceError: If linking fails
        """
        url = f"https://{settings.AUTH0_DOMAIN}/api/v2/users/{primary_user_id}/identities"
        
        # Extract provider and user_id from secondary_user_id
        # Format: "provider|user_id" (e.g., "google-oauth2|123456789")
        parts = secondary_user_id.split("|", 1)
        if len(parts) != 2:
            raise ExternalServiceError(f"Invalid secondary_user_id format: {secondary_user_id}")
        
        provider = parts[0]
        provider_user_id = parts[1]
        
        payload = {
            "provider": provider,
            "user_id": provider_user_id,
        }
        
        try:
            resp = requests.post(url, json=payload, headers=cls._headers(), timeout=10)
        except requests.RequestException as exc:
            logger.exception("Error calling Auth0 link_identities")
            raise ExternalServiceError("Could not contact Auth0 to link identities") from exc
        
        if resp.status_code not in (200, 201):
            logger.error("Auth0 link_identities error: %s %s", resp.status_code, resp.text)
            raise ExternalServiceError(f"Auth0 identity linking failed: HTTP {resp.status_code}")
        
        logger.info(f"Successfully linked {secondary_user_id} to {primary_user_id}")
        return resp.json()

    @classmethod
    def list_users(
        cls,
        connection: Optional[str] = None,
        per_page: int = 100,
        page: int = 0,
        include_totals: bool = False,
    ) -> Dict[str, Any]:
        """
        List users from Auth0 Management API.
        
        :param connection: Filter by connection name (e.g., "google-oauth2", "linkedin")
        :param per_page: Number of results per page (max 100)
        :param page: Page number (0-indexed)
        :param include_totals: Include total count in response
        :return: Dict with 'users' list and optionally 'total' count (if include_totals=True)
        :raises ExternalServiceError: If the request fails
        """
        url = f"https://{settings.AUTH0_DOMAIN}/api/v2/users"
        
        params = {
            "per_page": min(per_page, 100),  # Auth0 max is 100
            "page": page,
        }
        
        if include_totals:
            params["include_totals"] = "true"
        
        if connection:
            # Auth0 uses 'q' parameter for Lucene query syntax
            # Filter by connection using the identities array
            params["q"] = f'identities.connection:"{connection}"'
        
        try:
            resp = requests.get(url, params=params, headers=cls._headers(), timeout=10)
        except requests.RequestException as exc:
            logger.exception("Error calling Auth0 list_users")
            raise ExternalServiceError("Could not contact Auth0 to list users") from exc
        
        if not resp.ok:
            logger.error("Auth0 list_users error: %s %s", resp.status_code, resp.text)
            raise ExternalServiceError(f"Auth0 failed to list users: HTTP {resp.status_code}")
        
        data = resp.json()
        
        # Auth0 returns list directly if include_totals=False, or dict with 'users' and 'total' if include_totals=True
        if isinstance(data, list):
            return {"users": data, "total": len(data)}
        
        return data

    @classmethod
    def update_user_password(cls, auth0_user_id: str, new_password: str) -> None:
        """
        Update a user's password in Auth0 using the Management API.
        
        :param auth0_user_id: The Auth0 user ID (e.g., "auth0|abc123")
        :param new_password: The new password to set
        :raises ExternalServiceError: If the password update fails
        """
        url = f"https://{settings.AUTH0_DOMAIN}/api/v2/users/{auth0_user_id}"
        
        payload = {"password": new_password}
        
        try:
            resp = requests.patch(url, json=payload, headers=cls._headers(), timeout=10)
        except requests.RequestException as exc:
            logger.exception("Error calling Auth0 update_user_password")
            raise ExternalServiceError("Could not contact Auth0 to update password") from exc
        
        if resp.status_code not in (200, 201):
            logger.error("Auth0 update_user_password error: %s %s", resp.status_code, resp.text)
            raise ExternalServiceError(f"Auth0 password update failed: HTTP {resp.status_code}")
        
        logger.info(f"Successfully updated password for Auth0 user: {auth0_user_id}")

    @classmethod
    def mark_email_verified(cls, auth0_user_id: str) -> None:
        """
        Mark a user's email as verified in Auth0 using the Management API.
        
        :param auth0_user_id: The Auth0 user ID (e.g., "auth0|abc123")
        :raises ExternalServiceError: If the update fails
        """
        url = f"https://{settings.AUTH0_DOMAIN}/api/v2/users/{auth0_user_id}"
        
        payload = {"email_verified": True}
        
        try:
            resp = requests.patch(url, json=payload, headers=cls._headers(), timeout=10)
        except requests.RequestException as exc:
            logger.exception("Error calling Auth0 mark_email_verified")
            raise ExternalServiceError("Could not contact Auth0 to verify email") from exc
        
        if resp.status_code not in (200, 201):
            logger.error("Auth0 mark_email_verified error: %s %s", resp.status_code, resp.text)
            raise ExternalServiceError(f"Auth0 email verification failed: HTTP {resp.status_code}")
        
        logger.info(f"Successfully marked email as verified for Auth0 user: {auth0_user_id}")
