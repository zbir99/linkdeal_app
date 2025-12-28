"""
Embedding Service for generating semantic vectors.
Uses SentenceTransformers for 384-dimensional embeddings.
"""
import logging
import numpy as np
from django.conf import settings

logger = logging.getLogger(__name__)

# Model configuration
EMBEDDING_MODEL = getattr(settings, 'SENTENCE_EMBEDDING_MODEL', 'sentence-transformers/all-MiniLM-L6-v2')
EMBEDDING_DIMENSION = getattr(settings, 'EMBEDDING_DIMENSION', 384)


class EmbeddingService:
    """Service for generating semantic embeddings using SentenceTransformers."""
    
    _model = None
    
    @classmethod
    def _get_model(cls):
        """Lazy load the embedding model."""
        if cls._model is None:
            use_mock = getattr(settings, 'USE_MOCK_AI', True)
            
            if use_mock:
                logger.info("Using mock embeddings (USE_MOCK_AI=True)")
                cls._model = "mock"
            else:
                try:
                    from sentence_transformers import SentenceTransformer
                    logger.info(f"Loading embedding model: {EMBEDDING_MODEL}")
                    cls._model = SentenceTransformer(EMBEDDING_MODEL)
                    logger.info("Embedding model loaded successfully")
                except Exception as e:
                    logger.error(f"Failed to load embedding model: {e}")
                    logger.info("Falling back to mock embeddings")
                    cls._model = "mock"
        
        return cls._model
    
    @classmethod
    def generate_embedding(cls, text: str) -> list:
        """
        Generate a normalized embedding vector for the given text.
        
        Args:
            text: The text to embed
            
        Returns:
            A list of floats representing the embedding (384 dimensions)
        """
        if not text or not text.strip():
            # Return zero vector for empty text
            return [0.0] * EMBEDDING_DIMENSION
        
        model = cls._get_model()
        
        if model == "mock":
            return cls._generate_mock_embedding(text)
        
        try:
            # Generate embedding
            embedding = model.encode(text, normalize_embeddings=True)
            return embedding.tolist()
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            return cls._generate_mock_embedding(text)
    
    @classmethod
    def _generate_mock_embedding(cls, text: str) -> list:
        """
        Generate a mock embedding for testing/development.
        Uses a deterministic random seed based on text content.
        """
        # Use hash of text as seed for reproducible results
        seed = hash(text) % (2**32)
        np.random.seed(seed)
        
        # Generate random normalized vector
        embedding = np.random.randn(EMBEDDING_DIMENSION)
        embedding = embedding / np.linalg.norm(embedding)  # Normalize
        
        return embedding.tolist()
    
    @classmethod
    def generate_profile_embedding(cls, profile: dict) -> list:
        """
        Generate embedding from extracted mentee profile.
        
        Args:
            profile: Dict with desired_skills, languages, experience_level, goals
            
        Returns:
            Embedding vector for the profile
        """
        # Convert profile to descriptive text
        text_parts = []
        
        if profile.get('desired_skills'):
            skills = ', '.join(profile['desired_skills'])
            text_parts.append(f"Desired skills: {skills}")
        
        if profile.get('languages'):
            languages = ', '.join(profile['languages'])
            text_parts.append(f"Languages: {languages}")
        
        if profile.get('experience_level'):
            text_parts.append(f"Experience level: {profile['experience_level']}")
        
        if profile.get('goals'):
            text_parts.append(f"Goals: {profile['goals']}")
        
        if profile.get('preferred_mentor_traits'):
            traits = ', '.join(profile['preferred_mentor_traits'])
            text_parts.append(f"Looking for mentors who are: {traits}")
        
        text = '\n'.join(text_parts) if text_parts else "Looking for a mentor"
        
        return cls.generate_embedding(text)
    
    @classmethod
    def generate_mentor_embedding(cls, mentor) -> list:
        """
        Generate embedding from mentor profile.
        
        Args:
            mentor: MentorProfile object
            
        Returns:
            Embedding vector for the mentor
        """
        text_parts = []
        
        if mentor.professional_title:
            text_parts.append(f"Title: {mentor.professional_title}")
        
        if mentor.bio:
            text_parts.append(f"Bio: {mentor.bio}")
        
        if mentor.skills:
            skills = ', '.join(mentor.skills) if isinstance(mentor.skills, list) else str(mentor.skills)
            text_parts.append(f"Skills: {skills}")
        
        if mentor.languages:
            languages = ', '.join(mentor.languages) if isinstance(mentor.languages, list) else str(mentor.languages)
            text_parts.append(f"Languages: {languages}")
        
        if hasattr(mentor, 'experience_years') and mentor.experience_years:
            text_parts.append(f"Experience: {mentor.experience_years} years")
        
        text = '\n'.join(text_parts) if text_parts else "Professional mentor"
        
        return cls.generate_embedding(text)
