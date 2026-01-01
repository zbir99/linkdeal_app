"""
Embedding Service for generating semantic vectors.
Uses OpenAI API for high-quality embeddings.
"""
import logging
import numpy as np
from django.conf import settings

logger = logging.getLogger(__name__)

# Model configuration - using ada-002 which is more widely available
EMBEDDING_MODEL = getattr(settings, 'EMBEDDING_MODEL', 'text-embedding-ada-002')
EMBEDDING_DIMENSION = getattr(settings, 'EMBEDDING_DIMENSION', 1536)


class EmbeddingService:
    """Service for generating semantic embeddings using OpenAI."""
    
    _client = None
    
    @classmethod
    def _get_client(cls):
        """Lazy load the OpenAI client."""
        if cls._client is None:
            use_mock = getattr(settings, 'USE_MOCK_AI', True)
            api_key = getattr(settings, 'OPENAI_API_KEY', '')
            
            if use_mock or not api_key:
                logger.info("Using mock embeddings (USE_MOCK_AI=True or No API Key)")
                cls._client = "mock"
            else:
                try:
                    from openai import OpenAI
                    cls._client = OpenAI(api_key=api_key)
                    logger.info("OpenAI client for embeddings initialized")
                except Exception as e:
                    logger.error(f"Failed to initialize OpenAI client: {e}")
                    cls._client = "mock"
        
        return cls._client
    
    @classmethod
    def generate_embedding(cls, text: str) -> list:
        """
        Generate a normalized embedding vector for the given text.
        """
        if not text or not text.strip():
            return [0.0] * EMBEDDING_DIMENSION
        
        client = cls._get_client()
        
        if client == "mock":
            return cls._generate_mock_embedding(text)
        
        try:
            response = client.embeddings.create(
                input=text,
                model=EMBEDDING_MODEL
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error generating OpenAI embedding: {e}")
            return cls._generate_mock_embedding(text)
    
    @classmethod
    def _generate_mock_embedding(cls, text: str) -> list:
        """Mock embedding for dev."""
        seed = hash(text) % (2**32)
        np.random.seed(seed)
        embedding = np.random.randn(EMBEDDING_DIMENSION)
        embedding = embedding / np.linalg.norm(embedding)
        return embedding.tolist()
    
    @classmethod
    def generate_profile_embedding(cls, profile: dict) -> list:
        """Generate embedding from extracted mentee profile."""
        text_parts = []
        if profile.get('desired_skills'):
            text_parts.append(f"Desired skills: {', '.join(profile['desired_skills'])}")
        if profile.get('languages'):
            text_parts.append(f"Languages: {', '.join(profile['languages'])}")
        if profile.get('experience_level'):
            text_parts.append(f"Experience level: {profile['experience_level']}")
        if profile.get('goals'):
            text_parts.append(f"Goals: {profile['goals']}")
        
        text = '\n'.join(text_parts) if text_parts else "Looking for mentorship"
        return cls.generate_embedding(text)
    
    @classmethod
    def generate_mentor_embedding(cls, mentor) -> list:
        """Generate embedding from mentor profile."""
        text_parts = []
        if mentor.professional_title:
            text_parts.append(f"Title: {mentor.professional_title}")
        if mentor.bio:
            text_parts.append(f"Bio: {mentor.bio}")
        if mentor.skills:
            skills = ', '.join(mentor.skills) if isinstance(mentor.skills, list) else str(mentor.skills)
            text_parts.append(f"Skills: {skills}")
        
        text = '\n'.join(text_parts) if text_parts else "Professional mentor"
        return cls.generate_embedding(text)
