"""
Admin configuration for AI Chat app.
"""
from django.contrib import admin
from .models import ChatConversation


@admin.register(ChatConversation)
class ChatConversationAdmin(admin.ModelAdmin):
    list_display = ['session_id', 'mentee', 'message_count', 'recommendations_shown', 'created_at']
    list_filter = ['recommendations_shown', 'created_at']
    search_fields = ['session_id', 'conversation_text']
    readonly_fields = ['id', 'created_at', 'updated_at']
    ordering = ['-updated_at']
