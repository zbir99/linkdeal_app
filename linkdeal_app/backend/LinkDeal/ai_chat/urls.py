"""
URL configuration for AI Chat app.
"""
from django.urls import path
from . import views

urlpatterns = [
    path('chat/', views.ChatView.as_view(), name='ai-chat'),
    path('chat/<str:session_id>/', views.ChatHistoryView.as_view(), name='chat-history'),
    path('conversations/', views.ConversationsListView.as_view(), name='conversations-list'),
    path('conversations/<uuid:conversation_id>/', views.ConversationDetailView.as_view(), name='conversation-detail'),
]
