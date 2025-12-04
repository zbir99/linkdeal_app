"""
Django REST Framework serializers for the matching app.
"""
from rest_framework import serializers
from matching.models import Mentor, MenteeConversation


class MentorSerializer(serializers.ModelSerializer):
    """
    Serializer for Mentor model.
    """
    similarity_score = serializers.FloatField(read_only=True, required=False)
    confidence = serializers.CharField(read_only=True, required=False)
    explanation = serializers.CharField(read_only=True, required=False)
    
    class Meta:
        model = Mentor
        fields = [
            'id',
            'name',
            'bio',
            'skills',
            'languages',
            'experience_years',
            'rating',
            'availability',
            'created_at',
            'updated_at',
            # Match-specific fields (added dynamically in matching results)
            'similarity_score',
            'confidence',
            'explanation'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class MentorCreateSerializer(serializers.Serializer):
    """
    Serializer for creating mentors.
    """
    name = serializers.CharField(max_length=255)
    bio = serializers.CharField()
    skills = serializers.ListField(
        child=serializers.CharField(max_length=100),
        allow_empty=True
    )
    languages = serializers.ListField(
        child=serializers.CharField(max_length=50),
        allow_empty=True
    )
    experience_years = serializers.IntegerField(min_value=0)
    rating = serializers.FloatField(min_value=0.0, max_value=5.0, default=0.0)
    availability = serializers.CharField(allow_blank=True, default='')


class MenteeConversationSerializer(serializers.ModelSerializer):
    """
    Serializer for MenteeConversation model.
    """
    class Meta:
        model = MenteeConversation
        fields = [
            'id',
            'conversation',
            'extracted_profile',
            'session_id',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'extracted_profile', 'created_at', 'updated_at']


class ChatRequestSerializer(serializers.Serializer):
    """
    Serializer for chat API requests.
    """
    conversation = serializers.CharField(
        max_length=10000,  # Protect against huge payloads
        help_text="Full conversation text"
    )
    session_id = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
        default='',
        help_text="Optional session identifier"
    )


class ChatResponseSerializer(serializers.Serializer):
    """
    Serializer for chat API responses.
    """
    conversation_id = serializers.UUIDField()
    extracted_profile = serializers.JSONField()
    recommended_mentors = MentorSerializer(many=True)
    message = serializers.CharField()
