"""
Views for the notifications app.
Handles API endpoints for listing, reading, and managing notifications.
"""
import logging
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone

from accounts.permissions import IsAuthenticatedAuth0
from notifications.models import Notification
from notifications.serializers import (
    NotificationSerializer,
    NotificationDetailSerializer,
    UnreadCountSerializer,
)

logger = logging.getLogger(__name__)


class NotificationListView(generics.ListAPIView):
    """
    GET /notifications/
    List all notifications for the current user.
    
    Query params:
    - unread_only: true/false - Filter to unread notifications only
    - type: notification_type - Filter by type
    """
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticatedAuth0]

    def get_queryset(self):
        from accounts.models import AppUser
        
        try:
            user = AppUser.objects.get(auth0_id=self.request.user.auth0_id)
        except AppUser.DoesNotExist:
            return Notification.objects.none()
        
        queryset = Notification.objects.filter(recipient=user)
        
        # Filter by unread only
        unread_only = self.request.query_params.get('unread_only', 'false').lower() == 'true'
        if unread_only:
            queryset = queryset.filter(is_read=False)
        
        # Filter by type
        notification_type = self.request.query_params.get('type')
        if notification_type:
            queryset = queryset.filter(notification_type=notification_type)
        
        return queryset.order_by('-created_at')


class NotificationDetailView(generics.RetrieveAPIView):
    """
    GET /notifications/<id>/
    Get a single notification detail.
    """
    serializer_class = NotificationDetailSerializer
    permission_classes = [IsAuthenticatedAuth0]

    def get_queryset(self):
        from accounts.models import AppUser
        
        try:
            user = AppUser.objects.get(auth0_id=self.request.user.auth0_id)
        except AppUser.DoesNotExist:
            return Notification.objects.none()
        
        return Notification.objects.filter(recipient=user)


class NotificationMarkReadView(APIView):
    """
    POST /notifications/<id>/read/
    Mark a single notification as read.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def post(self, request, pk):
        from accounts.models import AppUser
        
        try:
            user = AppUser.objects.get(auth0_id=request.user.auth0_id)
        except AppUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
        try:
            notification = Notification.objects.get(id=pk, recipient=user)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found'}, status=404)
        
        notification.mark_as_read()
        
        return Response({
            'success': True,
            'message': 'Notification marked as read',
            'notification': NotificationSerializer(notification).data
        })


class NotificationMarkAllReadView(APIView):
    """
    POST /notifications/read-all/
    Mark all notifications as read for the current user.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def post(self, request):
        from accounts.models import AppUser
        
        try:
            user = AppUser.objects.get(auth0_id=request.user.auth0_id)
        except AppUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
        # Update all unread notifications
        updated_count = Notification.objects.filter(
            recipient=user,
            is_read=False
        ).update(
            is_read=True,
            read_at=timezone.now()
        )
        
        return Response({
            'success': True,
            'message': f'{updated_count} notifications marked as read',
            'count': updated_count
        })


class NotificationUnreadCountView(APIView):
    """
    GET /notifications/unread-count/
    Get the count of unread notifications.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def get(self, request):
        from accounts.models import AppUser
        
        try:
            user = AppUser.objects.get(auth0_id=request.user.auth0_id)
        except AppUser.DoesNotExist:
            return Response({'count': 0})
        
        count = Notification.objects.filter(
            recipient=user,
            is_read=False
        ).count()
        
        return Response({'count': count})


class NotificationDeleteView(APIView):
    """
    DELETE /notifications/<id>/
    Delete a notification.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def delete(self, request, pk):
        from accounts.models import AppUser
        
        try:
            user = AppUser.objects.get(auth0_id=request.user.auth0_id)
        except AppUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
        try:
            notification = Notification.objects.get(id=pk, recipient=user)
            notification.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found'}, status=404)


class NotificationDeleteAllReadView(APIView):
    """
    DELETE /notifications/clear-read/
    Delete all read notifications for the current user.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def delete(self, request):
        from accounts.models import AppUser
        
        try:
            user = AppUser.objects.get(auth0_id=request.user.auth0_id)
        except AppUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
        deleted_count, _ = Notification.objects.filter(
            recipient=user,
            is_read=True
        ).delete()
        
        return Response({
            'success': True,
            'message': f'{deleted_count} read notifications deleted',
            'count': deleted_count
        })
