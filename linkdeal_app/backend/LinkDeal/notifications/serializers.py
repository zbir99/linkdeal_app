"""
Serializers for the notifications app.
"""
from rest_framework import serializers
from notifications.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for listing notifications."""
    
    session_id = serializers.SerializerMethodField()
    time_ago = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'title', 'message',
            'link', 'link_text', 'session_id',
            'is_read', 'read_at', 'time_ago', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
    
    def get_session_id(self, obj):
        return str(obj.related_session.id) if obj.related_session else None
    
    def get_time_ago(self, obj):
        """Return human-readable time ago string."""
        from django.utils import timezone
        
        now = timezone.now()
        diff = now - obj.created_at
        
        total_seconds = diff.total_seconds()
        days = diff.days
        
        if total_seconds < 0:
            return 'À l\'instant'
        elif total_seconds < 60:
            return 'À l\'instant'
        elif total_seconds < 3600:
            mins = int(total_seconds // 60)
            return f'Il y a {mins} min'
        elif total_seconds < 86400:
            hours = int(total_seconds // 3600)
            return f'Il y a {hours}h'
        elif days == 1:
            return 'Hier'
        elif days < 7:
            return f'Il y a {days} jours'
        elif days < 30:
            weeks = days // 7
            return f'Il y a {weeks} sem.'
        else:
            months = days // 30
            return f'Il y a {months} mois'


class NotificationDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer including session info."""
    
    session_info = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'id', 'notification_type', 'title', 'message',
            'link', 'link_text', 'session_info',
            'is_read', 'read_at', 'email_sent', 'created_at'
        ]
    
    def get_session_info(self, obj):
        if not obj.related_session:
            return None
        
        session = obj.related_session
        return {
            'id': str(session.id),
            'scheduled_at': session.scheduled_at.isoformat(),
            'duration_minutes': session.duration_minutes,
            'topic': session.topic,
            'status': session.status,
            'mentor_name': session.mentor.full_name if session.mentor else None,
            'mentee_name': session.mentee.full_name if session.mentee else None,
        }


class UnreadCountSerializer(serializers.Serializer):
    """Serializer for unread notification count."""
    
    count = serializers.IntegerField()
