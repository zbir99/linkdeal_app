"""
URL configuration for the notifications app.
"""
from django.urls import path
from notifications import views

urlpatterns = [
    # List and get notifications
    path('', views.NotificationListView.as_view(), name='notification-list'),
    path('<uuid:pk>/', views.NotificationDetailView.as_view(), name='notification-detail'),
    
    # Mark as read
    path('<uuid:pk>/read/', views.NotificationMarkReadView.as_view(), name='notification-mark-read'),
    path('read-all/', views.NotificationMarkAllReadView.as_view(), name='notification-mark-all-read'),
    
    # Unread count
    path('unread-count/', views.NotificationUnreadCountView.as_view(), name='notification-unread-count'),
    
    # Delete
    path('<uuid:pk>/delete/', views.NotificationDeleteView.as_view(), name='notification-delete'),
    path('clear-read/', views.NotificationDeleteAllReadView.as_view(), name='notification-clear-read'),
]
