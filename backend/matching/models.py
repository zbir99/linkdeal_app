"""
Django models for mentor-mentee matching with pgvector embeddings.
"""
import uuid
from django.db import models
from pgvector.django import VectorField


class Mentor(models.Model):
    """
    Mentor profile with AI embeddings for semantic matching.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    bio = models.TextField(help_text="Mentor biography and experience")
    
    # Skills and languages stored as JSON arrays
    skills = models.JSONField(
        default=list,
        help_text="List of skills (e.g., ['Python', 'Django', 'React'])"
    )
    languages = models.JSONField(
        default=list,
        help_text="Languages spoken (e.g., ['English', 'French'])"
    )
    
    experience_years = models.IntegerField(default=0)
    rating = models.FloatField(default=0.0, help_text="Average rating from mentees")
    availability = models.TextField(
        blank=True,
        default="",
        help_text="Availability schedule or notes"
    )
    
    # Vector embedding for semantic search (SentenceTransformer all-MiniLM-L6-v2 uses 384 dimensions)
    embedding = VectorField(dimensions=384, null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'mentors'
        ordering = ['-rating', '-experience_years']
        indexes = [
            models.Index(fields=['rating']),
            models.Index(fields=['experience_years']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.experience_years}y exp, {self.rating}⭐)"
    
    def get_embedding_text(self):
        """
        Generate text representation for embedding generation.
        Combines bio, skills, and experience.
        """
        skills_text = ", ".join(self.skills) if self.skills else ""
        languages_text = ", ".join(self.languages) if self.languages else ""
        
        return (
            f"Mentor: {self.name}\n"
            f"Bio: {self.bio}\n"
            f"Skills: {skills_text}\n"
            f"Languages: {languages_text}\n"
            f"Experience: {self.experience_years} years\n"
            f"Rating: {self.rating}/5"
        )


class MenteeConversation(models.Model):
    """
    Stores mentee chat conversations and extracted profiles.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Full conversation history (can be incremental or full snapshot)
    conversation = models.TextField(help_text="Full conversation text")
    
    # Extracted structured profile from LLM
    extracted_profile = models.JSONField(
        null=True,
        blank=True,
        help_text="Structured profile extracted from conversation (JSON)"
    )
    
    # NEW: Structured message history
    messages = models.JSONField(
        default=list,
        help_text="Message history as list of {role, content, timestamp}"
    )
    
    # NEW: Conversation state
    message_count = models.IntegerField(
        default=0,
        help_text="Number of messages in this conversation"
    )
    
    # NEW: Progressive profile analysis
    profile_analysis = models.JSONField(
        default=dict,
        help_text="Progressive analysis of user profile built over conversation"
    )
    
    # Vector embedding for the mentee's needs (SentenceTransformer uses 384 dimensions)
    embedding = VectorField(dimensions=384, null=True, blank=True)
    
    # NEW: Recommendation status
    ready_for_recommendations = models.BooleanField(
        default=False,
        help_text="Whether enough info gathered to recommend mentors"
    )
    
    recommendations_shown = models.BooleanField(
        default=False,
        help_text="Whether recommendations have been shown to user"
    )
    
    # Metadata
    session_id = models.CharField(
        max_length=255,
        blank=True,
        default="",
        help_text="Optional session identifier for grouping conversations"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'mentee_conversations'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['session_id']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        preview = self.conversation[:50] + "..." if len(self.conversation) > 50 else self.conversation
        return f"Conversation {self.id} - {preview}"
    
    def get_profile_summary(self):
        """
        Get a human-readable summary of the extracted profile.
        """
        if not self.extracted_profile:
            return "No profile extracted yet"
        
        profile = self.extracted_profile
        return (
            f"Skills: {', '.join(profile.get('desired_skills', []))}\n"
            f"Languages: {', '.join(profile.get('languages', []))}\n"
            f"Goals: {profile.get('goals', 'Not specified')}"
        )
