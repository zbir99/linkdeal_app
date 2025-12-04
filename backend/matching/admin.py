from django.contrib import admin
from matching.models import Mentor, MenteeConversation

@admin.register(Mentor)
class MentorAdmin(admin.ModelAdmin):
    list_display = ['name', 'experience_years', 'rating', 'created_at']
    list_filter = ['rating', 'experience_years']
    search_fields = ['name', 'bio']
    readonly_fields = ['id', 'created_at', 'updated_at']

@admin.register(MenteeConversation)
class MenteeConversationAdmin(admin.ModelAdmin):
    list_display = ['id', 'session_id', 'created_at']
    list_filter = ['created_at']
    readonly_fields = ['id', 'created_at', 'updated_at']
    search_fields = ['conversation', 'session_id']
