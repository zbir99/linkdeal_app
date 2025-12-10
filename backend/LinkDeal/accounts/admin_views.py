# accounts/admin_views.py
import logging
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework import status

from accounts.models import MentorProfile, MenteeProfile, AppUser
from accounts.auth0_client import Auth0Client
from accounts.permissions import IsAuthenticatedAuth0, IsAdmin, IsSuperAdmin
from core.exceptions import ExternalServiceError
from accounts.serializers import (
    AdminMentorSerializer,
    AdminMentorDetailSerializer,
    AdminMenteeSerializer,
    AdminInviteSerializer,
)

logger = logging.getLogger(__name__)


# ---------- already existing ----------
class PendingMentorsView(ListAPIView):
    permission_classes = [IsAuthenticatedAuth0, IsAdmin]
    serializer_class = AdminMentorSerializer

    def get_queryset(self):
        # Optional filter by status to allow viewing banned/rejected/approved lists
        status_param = self.request.query_params.get("status", "pending")
        allowed_statuses = ["pending", "approved", "rejected", "banned"]
        if status_param not in allowed_statuses:
            status_param = "pending"
        return MentorProfile.objects.filter(status=status_param).select_related("user")


class ApproveMentorView(APIView):
    permission_classes = [IsAuthenticatedAuth0, IsAdmin]

    @transaction.atomic
    def post(self, request, pk):
        mentor = get_object_or_404(MentorProfile, pk=pk)
        auth0_id = mentor.user.auth0_id

        # Update Auth0 metadata properly
        Auth0Client.update_user_app_metadata(
            auth0_user_id=auth0_id,
            metadata={"approval_status": "approved"},
        )

        mentor.status = "approved"
        mentor.save(update_fields=["status"])

        serializer = AdminMentorDetailSerializer(mentor, context={"request": request})
        return Response(
            {
                "success": True,
                "message": "Mentor approved successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class RejectMentorView(APIView):
    """
    POST /auth/admin/mentors/<uuid:pk>/reject/
    
    Rejects a mentor by updating their status to "rejected".
    The mentor profile and related data are preserved.
    """
    permission_classes = [IsAuthenticatedAuth0, IsAdmin]

    @transaction.atomic
    def post(self, request, pk):
        mentor = get_object_or_404(MentorProfile, pk=pk)
        auth0_id = mentor.user.auth0_id

        # Update Auth0 metadata to reflect rejection
        Auth0Client.update_user_app_metadata(
            auth0_user_id=auth0_id,
            metadata={"approval_status": "rejected"},
        )

        # Update mentor status in local database
        mentor.status = "rejected"
        mentor.save(update_fields=["status"])

        serializer = AdminMentorDetailSerializer(mentor, context={"request": request})
        return Response(
            {
                "success": True,
                "message": "Mentor rejected successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class BanMentorView(APIView):
    """
    POST /auth/admin/mentors/<uuid:pk>/ban/

    Admins can ban an already-approved mentor.
    Banned mentors lose access; data is retained for audit.
    """
    permission_classes = [IsAuthenticatedAuth0, IsAdmin]

    @transaction.atomic
    def post(self, request, pk):
        mentor = get_object_or_404(MentorProfile, pk=pk)

        if mentor.status == "banned":
            return Response(
                {
                    "success": False,
                    "message": "Mentor is already banned.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if mentor.status != "approved":
            return Response(
                {
                    "success": False,
                    "message": "Only approved mentors can be banned.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        ban_reason = request.data.get("reason", "") or None

        # Identify the admin performing the ban (if present in DB)
        banned_by = None
        try:
            banned_by = AppUser.objects.get(auth0_id=request.user.auth0_id)
        except AppUser.DoesNotExist:
            logger.warning("Banning admin AppUser not found for auth0_id=%s", request.user.auth0_id)

        # Update Auth0 metadata to reflect banned status
        metadata = {"approval_status": "banned"}
        if ban_reason:
            metadata["ban_reason"] = ban_reason
        Auth0Client.update_user_app_metadata(
            auth0_user_id=mentor.user.auth0_id,
            metadata=metadata,
        )

        mentor.status = "banned"
        mentor.banned_at = timezone.now()
        mentor.banned_by = banned_by
        mentor.ban_reason = ban_reason
        mentor.save(update_fields=["status", "banned_at", "banned_by", "ban_reason"])

        serializer = AdminMentorDetailSerializer(mentor, context={"request": request})
        return Response(
            {
                "success": True,
                "message": "Mentor banned successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class UnbanMentorView(APIView):
    """
    POST /auth/admin/mentors/<uuid:pk>/unban/

    Only super_admins can unban a mentor. Restores status to approved.
    """
    permission_classes = [IsAuthenticatedAuth0, IsSuperAdmin]

    @transaction.atomic
    def post(self, request, pk):
        mentor = get_object_or_404(MentorProfile, pk=pk)

        if mentor.status != "banned":
            return Response(
                {
                    "success": False,
                    "message": "Mentor is not banned.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Update Auth0 metadata back to approved
        Auth0Client.update_user_app_metadata(
            auth0_user_id=mentor.user.auth0_id,
            metadata={"approval_status": "approved", "ban_reason": None},
        )

        mentor.status = "approved"
        # Keep ban metadata for audit trail (do not clear)
        mentor.save(update_fields=["status"])

        serializer = AdminMentorDetailSerializer(mentor, context={"request": request})
        return Response(
            {
                "success": True,
                "message": "Mentor unbanned and restored to approved.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


# ---------- NEW: mentor detail ----------
class MentorDetailAdminView(RetrieveAPIView):
    """
    GET /auth/admin/mentors/<uuid:pk>/
    Full mentor detail for admin (for review modal/page).
    """
    permission_classes = [IsAuthenticatedAuth0, IsAdmin]
    serializer_class = AdminMentorDetailSerializer
    queryset = MentorProfile.objects.select_related("user")
    


# ---------- NEW: mentee list ----------
class MenteesListAdminView(ListAPIView):
    """
    GET /auth/admin/mentees/
    List all mentees (can add filters later).
    """
    permission_classes = [IsAuthenticatedAuth0, IsAdmin]
    serializer_class = AdminMenteeSerializer

    def get_queryset(self):
        status_param = self.request.query_params.get("status", "active")
        allowed_statuses = ["active", "banned"]
        if status_param not in allowed_statuses:
            status_param = "active"
        return MenteeProfile.objects.filter(status=status_param).select_related("user").order_by("-created_at")


# ---------- NEW: mentee detail ----------
class MenteeDetailAdminView(RetrieveAPIView):
    """
    GET /auth/admin/mentees/<uuid:pk>/
    Full mentee detail for admin.
    """
    permission_classes = [IsAuthenticatedAuth0, IsAdmin]
    serializer_class = AdminMenteeSerializer
    queryset = MenteeProfile.objects.select_related("user")


class BanMenteeView(APIView):
    """
    POST /auth/admin/mentees/<uuid:pk>/ban/

    Admins can ban an active mentee.
    """
    permission_classes = [IsAuthenticatedAuth0, IsAdmin]

    @transaction.atomic
    def post(self, request, pk):
        mentee = get_object_or_404(MenteeProfile, pk=pk)

        if mentee.status == "banned":
            return Response(
                {
                    "success": False,
                    "message": "Mentee is already banned.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if mentee.status != "active":
            return Response(
                {
                    "success": False,
                    "message": "Only active mentees can be banned.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        ban_reason = request.data.get("reason", "") or None

        banned_by = None
        try:
            banned_by = AppUser.objects.get(auth0_id=request.user.auth0_id)
        except AppUser.DoesNotExist:
            logger.warning("Banning admin AppUser not found for auth0_id=%s", request.user.auth0_id)

        # Update Auth0 metadata to reflect banned status
        metadata = {"approval_status": "banned"}
        if ban_reason:
            metadata["ban_reason"] = ban_reason
        Auth0Client.update_user_app_metadata(
            auth0_user_id=mentee.user.auth0_id,
            metadata=metadata,
        )

        mentee.status = "banned"
        mentee.banned_at = timezone.now()
        mentee.banned_by = banned_by
        mentee.ban_reason = ban_reason
        mentee.save(update_fields=["status", "banned_at", "banned_by", "ban_reason"])

        serializer = AdminMenteeSerializer(mentee, context={"request": request})
        return Response(
            {
                "success": True,
                "message": "Mentee banned successfully.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class UnbanMenteeView(APIView):
    """
    POST /auth/admin/mentees/<uuid:pk>/unban/

    Only super_admins can unban a mentee. Restores status to active.
    """
    permission_classes = [IsAuthenticatedAuth0, IsSuperAdmin]

    @transaction.atomic
    def post(self, request, pk):
        mentee = get_object_or_404(MenteeProfile, pk=pk)

        if mentee.status != "banned":
            return Response(
                {
                    "success": False,
                    "message": "Mentee is not banned.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        Auth0Client.update_user_app_metadata(
            auth0_user_id=mentee.user.auth0_id,
            metadata={"approval_status": "approved", "ban_reason": None},
        )

        mentee.status = "active"
        mentee.save(update_fields=["status"])

        serializer = AdminMenteeSerializer(mentee, context={"request": request})
        return Response(
            {
                "success": True,
                "message": "Mentee unbanned and restored to active.",
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


# ---------- NEW: admin invitation ----------
class AdminInviteView(CreateAPIView):
    """
    POST /admin/admins/
    
    Invite a new admin user. Only accessible to super_admin.
    Creates user in Auth0 without password and sends password reset email.
    """
    permission_classes = [IsAuthenticatedAuth0, IsSuperAdmin]
    serializer_class = AdminInviteSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        app_user = serializer.save()
        
        return Response(
            {
                "success": True,
                "data": {
                    "id": str(app_user.id),
                    "email": app_user.email,
                    "role": app_user.role,
                    "status": app_user.status,
                }
            },
            status=status.HTTP_201_CREATED,
        )


# ---------- NEW: Delete user (sync with Auth0) ----------
class DeleteUserView(APIView):
    """
    DELETE /auth/admin/users/<uuid:pk>/
    
    Delete an AppUser and their Auth0 account.
    Only accessible to super_admin.
    This will cascade delete related profiles (MentorProfile, MenteeProfile).
    """
    permission_classes = [IsAuthenticatedAuth0, IsSuperAdmin]

    @transaction.atomic
    def delete(self, request, pk):
        app_user = get_object_or_404(AppUser, pk=pk)
        auth0_id = app_user.auth0_id
        email = app_user.email
        # 1) Delete on Auth0 first so we fail fast if Auth0 is unreachable
        try:
            Auth0Client.delete_user(auth0_user_id=auth0_id, ignore_not_found=False)
        except ExternalServiceError as e:
            logger.error("Auth0 deletion failed for %s (%s): %s", auth0_id, email, e)
            return Response(
                {
                    "success": False,
                    "message": f"Failed to delete Auth0 user for {email}.",
                    "details": str(e),
                },
                status=status.HTTP_502_BAD_GATEWAY,
            )
        except Exception as e:
            logger.exception("Unexpected error deleting Auth0 user %s (%s)", auth0_id, email)
            return Response(
                {
                    "success": False,
                    "message": "Unexpected error while deleting Auth0 user.",
                    "details": str(e),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # 2) Delete AppUser (pre_delete signal will attempt Auth0 deletion again with ignore_not_found=True)
        try:
            app_user.delete()
            logger.info(
                "Super admin %s deleted AppUser %s (%s) and Auth0 user %s",
                request.user.auth0_id,
                pk,
                email,
                auth0_id,
            )
            return Response(
                {
                    "success": True,
                    "message": f"User {email} and their Auth0 account have been deleted successfully.",
                },
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            logger.exception(f"Error deleting AppUser {pk}: {e}")
            return Response(
                {
                    "success": False,
                    "message": "Failed to delete user. Please check logs for details.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class SyncFromAuth0View(APIView):
    """
    POST /auth/admin/users/sync-from-auth0/
    
    Check if a user exists in Auth0 and sync deletion if needed.
    Only accessible to super_admin.
    
    Body: { "auth0_id": "auth0|abc123" } or { "email": "user@example.com" }
    
    If user doesn't exist in Auth0 but exists in Django → delete from Django.
    If user exists in both → return info.
    If user doesn't exist in either → return 404.
    """
    permission_classes = [IsAuthenticatedAuth0, IsSuperAdmin]

    def post(self, request):
        auth0_id = request.data.get("auth0_id")
        email = request.data.get("email")

        if not auth0_id and not email:
            return Response(
                {
                    "success": False,
                    "message": "Either 'auth0_id' or 'email' must be provided.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Find AppUser in Django
        try:
            if auth0_id:
                app_user = AppUser.objects.get(auth0_id=auth0_id)
            else:
                app_user = AppUser.objects.get(email=email)
        except AppUser.DoesNotExist:
            return Response(
                {
                    "success": False,
                    "message": "User not found in Django database.",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        # Check if user exists in Auth0
        try:
            auth0_user = Auth0Client.get_user(user_id=app_user.auth0_id)
            # User exists in Auth0
            return Response(
                {
                    "success": True,
                    "message": "User exists in both Django and Auth0.",
                    "data": {
                        "django_user": {
                            "id": str(app_user.id),
                            "email": app_user.email,
                            "role": app_user.role,
                        },
                        "auth0_user": {
                            "user_id": auth0_user.get("user_id"),
                            "email": auth0_user.get("email"),
                        },
                    },
                },
                status=status.HTTP_200_OK,
            )
        except ExternalServiceError as e:
            # User doesn't exist in Auth0 (or Auth0 error)
            # Check if it's a 404 (user not found) or other error
            if "404" in str(e) or "not found" in str(e).lower():
                # User deleted from Auth0 but still in Django → delete from Django
                logger.warning(
                    f"User {app_user.email} ({app_user.auth0_id}) exists in Django but not in Auth0. "
                    f"Deleting from Django to sync."
                )
                app_user.delete()
                return Response(
                    {
                        "success": True,
                        "message": "User was deleted from Auth0 but existed in Django. User has been deleted from Django to sync.",
                    },
                    status=status.HTTP_200_OK,
                )
            else:
                # Other Auth0 error
                return Response(
                    {
                        "success": False,
                        "message": f"Error checking Auth0: {str(e)}",
                    },
                    status=status.HTTP_502_BAD_GATEWAY,
                )
