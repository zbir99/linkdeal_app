"""
Serializers for AI Chat app.
"""
from rest_framework import serializers
from .models import ChatConversation


class ChatMessageSerializer(serializers.Serializer):
    """Serializer for incoming chat messages."""
    message = serializers.CharField(max_length=2000)
    session_id = serializers.CharField(max_length=100, required=False, allow_blank=True)
    get_recommendations = serializers.BooleanField(default=False)


class ChatResponseSerializer(serializers.Serializer):
    """Serializer for chat responses."""
    conversation_id = serializers.UUIDField()
    session_id = serializers.CharField()
    message = serializers.CharField()
    message_count = serializers.IntegerField()
    has_recommendations = serializers.BooleanField()
    recommended_mentors = serializers.ListField(required=False)
    extracted_profile = serializers.DictField(required=False)


class ChatConversationSerializer(serializers.ModelSerializer):
    """Serializer for ChatConversation model."""
    
    class Meta:
        model = ChatConversation
        fields = [
            'id', 'session_id', 'messages', 'message_count',
            'extracted_profile', 'recommendations_shown',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
