"""
URL configuration for the scheduling app.
"""
from django.urls import path
from scheduling import views

urlpatterns = [
    # Session Types
    path('session-types/', views.SessionTypeListView.as_view(), name='session-types'),

    # Mentor Availability (for logged-in mentor)
    path('mentor/availability/', views.MentorAvailabilityListCreateView.as_view(), name='mentor-availability-list'),
    path('mentor/availability/bulk/', views.MentorAvailabilityBulkCreateView.as_view(), name='mentor-availability-bulk'),
    path('mentor/availability/<uuid:pk>/', views.MentorAvailabilityDetailView.as_view(), name='mentor-availability-detail'),

    # Public Mentor Availability (for booking)
    path('mentors/<uuid:mentor_id>/availability/', views.PublicMentorAvailabilityView.as_view(), name='public-mentor-availability'),

    # Sessions
    path('sessions/', views.SessionListView.as_view(), name='session-list'),
    path('sessions/create/', views.SessionCreateView.as_view(), name='session-create'),
    path('sessions/stats/', views.SessionStatsView.as_view(), name='session-stats'),
    path('sessions/chart/', views.SessionChartView.as_view(), name='session-chart'),
    path('sessions/<uuid:pk>/', views.SessionDetailView.as_view(), name='session-detail'),
    path('sessions/<uuid:pk>/notes/', views.SessionNotesUpdateView.as_view(), name='session-notes'),
    path('sessions/<uuid:pk>/cancel/', views.SessionCancelView.as_view(), name='session-cancel'),
    path('sessions/<uuid:pk>/confirm/', views.SessionConfirmView.as_view(), name='session-confirm'),
    path('sessions/<uuid:pk>/complete/', views.SessionCompleteView.as_view(), name='session-complete'),

    # Video Call
    path('sessions/<uuid:pk>/video-room/', views.SessionVideoRoomView.as_view(), name='session-video-room'),
    path('sessions/<uuid:pk>/rate/', views.SessionRateView.as_view(), name='session-rate'),
    path('sessions/<uuid:pk>/start-call/', views.SessionStartCallView.as_view(), name='session-start-call'),
    path('sessions/<uuid:pk>/end-call/', views.SessionEndCallView.as_view(), name='session-end-call'),

    # Attachments
    path('sessions/<uuid:session_id>/attachments/', views.SessionAttachmentListCreateView.as_view(), name='session-attachments'),
    path('sessions/<uuid:session_id>/attachments/<uuid:pk>/', views.SessionAttachmentDeleteView.as_view(), name='session-attachment-delete'),
]
