# accounts/urls.py
from django.urls import path

from accounts.views import (
    MenteeRegisterView,
    MentorRegisterView,
    SocialMenteeRegisterView,
    SocialMentorRegisterView,
    MeView,
    LogoutView,
    PasswordResetRequestView,
)

from accounts.admin_views import (
    PendingMentorsView,
    ApproveMentorView,
    RejectMentorView,
    BanMentorView,
    UnbanMentorView,
    MentorDetailAdminView,
    MenteesListAdminView,
    MenteeDetailAdminView,
    BanMenteeView,
    UnbanMenteeView,
    AdminInviteView,
    DeleteUserView,
)

from accounts.linking_views import (
    CheckEmailView,
    RequestLinkingView,
    VerifyLinkingView,
)

urlpatterns = [
    # Public auth
    path("register/mentee/", MenteeRegisterView.as_view(), name="register-mentee"),
    path("register/mentor/", MentorRegisterView.as_view(), name="register-mentor"),
    path("register/mentee/social/", SocialMenteeRegisterView.as_view(), name="register-mentee-social"),
    path("register/mentor/social/", SocialMentorRegisterView.as_view(), name="register-mentor-social"),
    
    # Account linking routes
    path("register/check-email/", CheckEmailView.as_view(), name="check-email"),
    path("register/request-linking/", RequestLinkingView.as_view(), name="request-linking"),
    path("register/verify-linking/<str:token>/", VerifyLinkingView.as_view(), name="verify-linking"),
    
    path("me/", MeView.as_view(), name="me"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("password/reset/", PasswordResetRequestView.as_view(), name="password-reset"),
    path("reset-password/", PasswordResetRequestView.as_view(), name="password-reset-alias"),

    # Admin mentor review
    path("admin/mentors/pending/", PendingMentorsView.as_view(), name="pending-mentors"),
    path("admin/mentors/<uuid:pk>/", MentorDetailAdminView.as_view(), name="mentor-detail-admin"),
    path("admin/mentors/<uuid:pk>/approve/", ApproveMentorView.as_view(), name="approve-mentor"),
    path("admin/mentors/<uuid:pk>/reject/", RejectMentorView.as_view(), name="reject-mentor"),
    path("admin/mentors/<uuid:pk>/ban/", BanMentorView.as_view(), name="ban-mentor"),
    path("admin/mentors/<uuid:pk>/unban/", UnbanMentorView.as_view(), name="unban-mentor"),

    # Admin mentee management
    path("admin/mentees/", MenteesListAdminView.as_view(), name="admin-mentees-list"),
    path("admin/mentees/<uuid:pk>/", MenteeDetailAdminView.as_view(), name="admin-mentee-detail"),
    path("admin/mentees/<uuid:pk>/ban/", BanMenteeView.as_view(), name="ban-mentee"),
    path("admin/mentees/<uuid:pk>/unban/", UnbanMenteeView.as_view(), name="unban-mentee"),

    # Super admin - admin invitation
    path("admin/admins/", AdminInviteView.as_view(), name="admin-invite"),
    
    # Super admin - user deletion
    path("admin/users/<uuid:pk>/", DeleteUserView.as_view(), name="delete-user"),
]
