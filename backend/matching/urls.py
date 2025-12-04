"""
URL configuration for the matching app.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from matching import views

router = DefaultRouter()
router.register(r'mentors', views.MentorViewSet, basename='mentor')

urlpatterns = [
    path('', include(router.urls)),
    path('chat/', views.chat_view, name='chat'),
]
