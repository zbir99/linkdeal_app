"""
Models for AI Chat app.
"""
import uuid
from django.db import models


class ChatConversation(models.Model):
    """
    Stores mentee conversation sessions with the AI coach.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Link to mentee (optional - allow anonymous chats for now)
    mentee = models.ForeignKey(
        'accounts.MenteeProfile',
        on_delete=models.CASCADE,
        related_name='ai_conversations',
        null=True,
        blank=True
    )
    
    # Session tracking
    session_id = models.CharField(max_length=100, unique=True, db_index=True)
    
    # Custom title (for rename feature)
    title = models.CharField(max_length=200, blank=True, null=True, help_text="Custom chat title")
    
    # Conversation data
    messages = models.JSONField(
        default=list,
        help_text="List of message objects [{role, content, timestamp}]"
    )
    
    conversation_text = models.TextField(
        blank=True,
        help_text="Full conversation as text for profile extraction"
    )
    
    message_count = models.IntegerField(default=0)
    
    # Extracted profile from conversation
    extracted_profile = models.JSONField(
        null=True,
        blank=True,
        help_text="Extracted mentee profile from conversation"
    )
    
    # Status flags
    recommendations_shown = models.BooleanField(default=False)
    
    # Vector embedding for mentee's needs (384-dimension for all-MiniLM-L6-v2)
    embedding = models.JSONField(
        null=True,
        blank=True,
        help_text="384-dimensional vector embedding for mentee's needs"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
        verbose_name = 'Chat Conversation'
        verbose_name_plural = 'Chat Conversations'
    
    def __str__(self):
        return f"Chat {self.session_id} ({self.message_count} messages)"
    
    def add_message(self, role: str, content: str):
        """Add a message to the conversation."""
        from datetime import datetime
        
        self.messages.append({
            'role': role,
            'content': content,
            'timestamp': datetime.now().isoformat()
        })
        self.conversation_text += f"{role.capitalize()}: {content}\n"
        
        if role == 'user':
            self.message_count += 1
