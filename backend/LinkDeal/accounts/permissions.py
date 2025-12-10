# accounts/permissions.py
from rest_framework.permissions import BasePermission


class IsAuthenticatedAuth0(BasePermission):
    def has_permission(self, request, view):
        return bool(getattr(request.user, "is_authenticated", False))


class HasRole(BasePermission):
    """
    Generic role checker: HasRole(["admin"]), HasRole(["mentor", "admin"])
    """

    allowed_roles = None

    def __init__(self, roles=None):
        if roles is not None:
            self.allowed_roles = roles

    def has_permission(self, request, view):
        user = request.user
        if not getattr(user, "is_authenticated", False):
            return False

        # Use derived 'role' and full roles array
        if self.allowed_roles is None:
            return True

        # main role shortcut
        if getattr(user, "role", None) in self.allowed_roles:
            return True

        roles = getattr(user, "roles", []) or []
        return any(r in self.allowed_roles for r in roles)


class IsAdmin(HasRole):
    """
    Allows both admin and super_admin roles.
    super_admin has all admin privileges plus exclusive ones.
    """
    def __init__(self):
        super().__init__(roles=["admin", "super_admin"])

    def has_permission(self, request, view):
        user = request.user
        if not getattr(user, "is_authenticated", False):
            return False

        # Check token roles first
        token_has_role = (
            getattr(user, "role", None) in ["admin", "super_admin"]
            or "admin" in (user.roles or [])
            or "super_admin" in (user.roles or [])
        )

        if not token_has_role:
            return False

        # Check DB role to be identity-agnostic (AppUser-level enforcement)
        try:
            from accounts.models import AppUser
            app_user = AppUser.objects.get(auth0_id=user.auth0_id)
            return app_user.role in ["admin", "super_admin"]
        except AppUser.DoesNotExist:
            return False


class IsMentor(HasRole):
    def __init__(self):
        super().__init__(roles=["mentor"])


class IsMentee(HasRole):
    def __init__(self):
        super().__init__(roles=["mentee"])


class IsSuperAdmin(BasePermission):
    """
    Permission class that requires both:
    1. Auth0 token has 'super_admin' role
    2. AppUser.role == 'super_admin' in DB
    """
    def has_permission(self, request, view):
        user = request.user
        if not getattr(user, "is_authenticated", False):
            return False

        # Check Auth0 token role
        has_auth0_role = (
            user.role == "super_admin" or 
            user.has_role("super_admin") or
            "super_admin" in (user.roles or [])
        )

        if not has_auth0_role:
            return False

        # Check DB role - need to get AppUser from DB
        try:
            from accounts.models import AppUser
            app_user = AppUser.objects.get(auth0_id=user.auth0_id)
            has_db_role = app_user.role == "super_admin"
            return has_db_role
        except AppUser.DoesNotExist:
            # If AppUser doesn't exist yet, auto-sync will create it
            # But for super_admin, we should be more strict
            return False


class IsApprovedMentor(BasePermission):
    """
    For endpoints only available to mentors that have been approved.
    """

    def has_permission(self, request, view):
        user = request.user
        if not getattr(user, "is_authenticated", False):
            return False

        if not (user.role == "mentor" or user.has_role("mentor")):
            return False

        # Enforce using DB MentorProfile to avoid identity-based bypass
        try:
            from accounts.models import AppUser, MentorProfile
            app_user = AppUser.objects.get(auth0_id=user.auth0_id)
            mentor = MentorProfile.objects.get(user=app_user)
            return mentor.status == "approved"
        except (AppUser.DoesNotExist, MentorProfile.DoesNotExist):
            return False
