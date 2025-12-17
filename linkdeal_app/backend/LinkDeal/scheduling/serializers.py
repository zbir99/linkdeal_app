"""
Serializers for the scheduling app.
Handles serialization/deserialization of session and availability data.
"""
from rest_framework import serializers
from django.utils import timezone
from django.db import transaction

from scheduling.models import (
    SessionType,
    MentorAvailability,
    Session,
    SessionAttachment,
)
from accounts.models import MentorProfile, MenteeProfile, AppUser


# -------------------------------------------------------------------
# 1. SESSION TYPE SERIALIZERS
# -------------------------------------------------------------------

class SessionTypeSerializer(serializers.ModelSerializer):
    """Serializer for session types (read-only for users)."""
    
    class Meta:
        model = SessionType
        fields = [
            'id', 'name', 'description', 
            'default_duration', 'is_active'
        ]
        read_only_fields = ['id']


# -------------------------------------------------------------------
# 2. MENTOR AVAILABILITY SERIALIZERS
# -------------------------------------------------------------------

class MentorAvailabilitySerializer(serializers.ModelSerializer):
    """Serializer for mentor availability slots."""
    
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = MentorAvailability
        fields = [
            'id', 'day_of_week', 'day_name',
            'start_time', 'end_time',
            'is_recurring', 'specific_date',
            'is_available', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, data):
        """Validate time slots."""
        start_time = data.get('start_time')
        end_time = data.get('end_time')
        
        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError({
                'end_time': 'End time must be after start time.'
            })
        
        is_recurring = data.get('is_recurring', True)
        specific_date = data.get('specific_date')
        
        if not is_recurring and not specific_date:
            raise serializers.ValidationError({
                'specific_date': 'Non-recurring slots require a specific date.'
            })
        
        return data

    def create(self, validated_data):
        """Create availability with mentor from request."""
        request = self.context.get('request')
        mentor_profile = MentorProfile.objects.get(user__auth0_id=request.user.auth0_id)
        validated_data['mentor'] = mentor_profile
        return super().create(validated_data)


class MentorAvailabilityCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating multiple availability slots."""
    
    class Meta:
        model = MentorAvailability
        fields = [
            'day_of_week', 'start_time', 'end_time',
            'is_recurring', 'specific_date', 'is_available'
        ]


class PublicMentorAvailabilitySerializer(serializers.ModelSerializer):
    """Public view of mentor availability (for booking)."""
    
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = MentorAvailability
        fields = ['day_of_week', 'day_name', 'start_time', 'end_time']


# -------------------------------------------------------------------
# 3. SESSION SERIALIZERS
# -------------------------------------------------------------------

class SessionAttachmentSerializer(serializers.ModelSerializer):
    """Serializer for session attachments."""
    
    uploaded_by_name = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = SessionAttachment
        fields = [
            'id', 'filename', 'file_type', 'file_size',
            'file_url', 'uploaded_by_name', 'created_at'
        ]
        read_only_fields = ['id', 'filename', 'file_type', 'file_size', 'created_at']
    
    def get_uploaded_by_name(self, obj):
        return obj.uploaded_by.email
    
    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None


class SessionMentorSerializer(serializers.ModelSerializer):
    """Compact mentor info for session display."""
    
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = MentorProfile
        fields = ['id', 'full_name', 'professional_title', 'profile_picture_url']
    
    def get_profile_picture_url(self, obj):
        request = self.context.get('request')
        if obj.profile_picture and request:
            return request.build_absolute_uri(obj.profile_picture.url)
        return None


class SessionMenteeSerializer(serializers.ModelSerializer):
    """Compact mentee info for session display."""
    
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = MenteeProfile
        fields = ['id', 'full_name', 'profile_picture_url']
    
    def get_profile_picture_url(self, obj):
        request = self.context.get('request')
        if obj.profile_picture and request:
            return request.build_absolute_uri(obj.profile_picture.url)
        return None


class SessionListSerializer(serializers.ModelSerializer):
    """Serializer for session list view."""
    
    mentor = SessionMentorSerializer(read_only=True)
    mentee = SessionMenteeSerializer(read_only=True)
    session_type_name = serializers.CharField(source='session_type.name', read_only=True)
    end_time = serializers.SerializerMethodField()
    is_upcoming = serializers.BooleanField(read_only=True)
    has_review = serializers.SerializerMethodField()
    
    class Meta:
        model = Session
        fields = [
            'id', 'mentor', 'mentee',
            'session_type_name', 'scheduled_at', 'end_time',
            'duration_minutes', 'status', 'is_upcoming',
            'has_review', 'created_at'
        ]
    
    def get_end_time(self, obj):
        return obj.end_time.isoformat() if obj.end_time else None
    
    def get_has_review(self, obj):
        return hasattr(obj, 'review')


class SessionDetailSerializer(serializers.ModelSerializer):
    """Detailed session serializer."""
    
    mentor = SessionMentorSerializer(read_only=True)
    mentee = SessionMenteeSerializer(read_only=True)
    session_type = SessionTypeSerializer(read_only=True)
    attachments = SessionAttachmentSerializer(many=True, read_only=True)
    end_time = serializers.SerializerMethodField()
    is_upcoming = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Session
        fields = [
            'id', 'mentor', 'mentee', 'session_type',
            'scheduled_at', 'end_time', 'duration_minutes', 'timezone',
            'status', 'mentee_notes', 'mentor_notes', 'objectives',
            'video_room_id', 'video_provider',
            'call_started_at', 'call_ended_at',
            'cancelled_at', 'cancellation_reason',
            'attachments', 'is_upcoming',
            'created_at', 'updated_at'
        ]
    
    def get_end_time(self, obj):
        return obj.end_time.isoformat() if obj.end_time else None


class SessionCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a new session (booking)."""
    
    mentor_id = serializers.UUIDField(write_only=True)
    session_type_id = serializers.UUIDField(required=False, allow_null=True, write_only=True)
    
    class Meta:
        model = Session
        fields = [
            'mentor_id', 'session_type_id',
            'scheduled_at', 'duration_minutes', 'timezone',
            'mentee_notes', 'objectives'
        ]
    
    def validate_mentor_id(self, value):
        try:
            mentor = MentorProfile.objects.get(id=value, status='approved')
            return mentor
        except MentorProfile.DoesNotExist:
            raise serializers.ValidationError('Mentor not found or not available.')
    
    def validate_scheduled_at(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError('Session must be scheduled in the future.')
        return value
    
    def validate(self, data):
        # TODO: Check mentor availability for the requested time slot
        return data
    
    @transaction.atomic
    def create(self, validated_data):
        request = self.context.get('request')
        mentee_profile = MenteeProfile.objects.get(user__auth0_id=request.user.auth0_id)
        
        mentor = validated_data.pop('mentor_id')
        session_type_id = validated_data.pop('session_type_id', None)
        
        session_type = None
        if session_type_id:
            try:
                session_type = SessionType.objects.get(id=session_type_id)
            except SessionType.DoesNotExist:
                pass
        
        session = Session.objects.create(
            mentor=mentor,
            mentee=mentee_profile,
            session_type=session_type,
            status='pending',
            **validated_data
        )
        
        # Generate video room ID
        session.generate_video_room_id()
        session.save()
        
        # Create or update mentor-mentee relation
        from mentoring.models import MentorMenteeRelation
        MentorMenteeRelation.objects.get_or_create(
            mentor=mentor,
            mentee=mentee_profile,
            defaults={'status': 'active'}
        )
        
        return session


class SessionCancelSerializer(serializers.Serializer):
    """Serializer for cancelling a session."""
    
    reason = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, data):
        session = self.context.get('session')
        if session.status in ['completed', 'cancelled']:
            raise serializers.ValidationError('Cannot cancel this session.')
        if session.scheduled_at <= timezone.now():
            raise serializers.ValidationError('Cannot cancel past sessions.')
        return data


class SessionNotesUpdateSerializer(serializers.Serializer):
    """Serializer for updating session notes."""
    
    mentee_notes = serializers.CharField(required=False, allow_blank=True)
    mentor_notes = serializers.CharField(required=False, allow_blank=True)
    objectives = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )


# -------------------------------------------------------------------
# 4. SESSION STATS SERIALIZERS
# -------------------------------------------------------------------

class SessionStatsSerializer(serializers.Serializer):
    """Serializer for session statistics."""
    
    total_sessions = serializers.IntegerField()
    completed_sessions = serializers.IntegerField()
    upcoming_sessions = serializers.IntegerField()
    cancelled_sessions = serializers.IntegerField()
    total_hours = serializers.DecimalField(max_digits=8, decimal_places=1)
    this_month_sessions = serializers.IntegerField()
    this_month_hours = serializers.DecimalField(max_digits=8, decimal_places=1)


class SessionChartDataSerializer(serializers.Serializer):
    """Serializer for session chart data."""
    
    month = serializers.CharField()
    sessions = serializers.IntegerField()
    hours = serializers.DecimalField(max_digits=8, decimal_places=1)
