"""
Matching Service for vector similarity search.
Uses pgvector for cosine similarity matching.
"""
import logging
from django.conf import settings
from django.db import connection
from .embedding_service import EmbeddingService, EMBEDDING_DIMENSION

logger = logging.getLogger(__name__)


class MatchingService:
    """Service for finding mentors using vector similarity search."""
    
    # Confidence level thresholds
    CONFIDENCE_VERY_HIGH = 0.90
    CONFIDENCE_HIGH = 0.75
    CONFIDENCE_MEDIUM = 0.60
    
    @classmethod
    def get_confidence_level(cls, similarity_score: float) -> str:
        """
        Get confidence level based on similarity score.
        
        Args:
            similarity_score: Cosine similarity (0.0 to 1.0)
            
        Returns:
            Confidence level string
        """
        if similarity_score >= cls.CONFIDENCE_VERY_HIGH:
            return 'very_high'
        elif similarity_score >= cls.CONFIDENCE_HIGH:
            return 'high'
        elif similarity_score >= cls.CONFIDENCE_MEDIUM:
            return 'medium'
        else:
            return 'low'
    
    @classmethod
    def find_similar_mentors(cls, mentee_embedding: list, limit: int = 5, min_rating: float = 0.0):
        """
        Find mentors similar to the mentee's needs using vector similarity.
        
        Args:
            mentee_embedding: The mentee's profile embedding (384-dim vector)
            limit: Maximum number of mentors to return
            min_rating: Minimum mentor rating filter
            
        Returns:
            List of mentor dicts with similarity scores
        """
        from accounts.models import MentorProfile
        
        use_mock = getattr(settings, 'USE_MOCK_AI', True)
        
        # Check if we can use pgvector
        if use_mock or not cls._pgvector_available():
            logger.info("Using fallback matching (pgvector not available or mock mode)")
            return cls._fallback_matching(limit)
        
        try:
            # Use raw SQL for pgvector cosine similarity
            embedding_str = '[' + ','.join(map(str, mentee_embedding)) + ']'
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT 
                        id,
                        1 - (embedding <=> %s::vector) AS similarity
                    FROM accounts_mentorprofile
                    WHERE 
                        status = 'approved'
                        AND embedding IS NOT NULL
                    ORDER BY embedding <=> %s::vector
                    LIMIT %s
                """, [embedding_str, embedding_str, limit])
                
                results = cursor.fetchall()
            
            # Get full mentor objects
            mentor_ids = [row[0] for row in results]
            similarity_map = {row[0]: row[1] for row in results}
            
            mentors = MentorProfile.objects.filter(id__in=mentor_ids)
            
            # Build response with similarity scores
            mentor_list = []
            for mentor in mentors:
                similarity = similarity_map.get(mentor.id, 0.5)
                mentor_list.append({
                    'mentor': mentor,
                    'similarity_score': round(similarity, 4),
                    'confidence': cls.get_confidence_level(similarity)
                })
            
            # Sort by similarity
            mentor_list.sort(key=lambda x: x['similarity_score'], reverse=True)
            
            return mentor_list
            
        except Exception as e:
            logger.error(f"Vector similarity search failed: {e}")
            return cls._fallback_matching(limit)
    
    @classmethod
    def _pgvector_available(cls) -> bool:
        """Check if pgvector extension is available."""
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1 FROM pg_extension WHERE extname = 'vector'")
                return cursor.fetchone() is not None
        except Exception:
            return False
    
    @classmethod
    def _fallback_matching(cls, limit: int = 5):
        """
        Fallback matching when pgvector is not available.
        Returns random mentors with simulated similarity scores.
        """
        from accounts.models import MentorProfile
        import random
        
        mentors = list(MentorProfile.objects.filter(status='approved')[:limit])
        
        # Simulate similarity scores for mock mode
        results = []
        for mentor in mentors:
            # Generate consistent mock similarity based on mentor id
            mock_similarity = 0.60 + (hash(str(mentor.id)) % 40) / 100  # 0.60 - 1.00
            results.append({
                'mentor': mentor,
                'similarity_score': round(mock_similarity, 4),
                'confidence': cls.get_confidence_level(mock_similarity)
            })
        
        results.sort(key=lambda x: x['similarity_score'], reverse=True)
        return results
    
    @classmethod
    def generate_explanation(cls, mentee_profile: dict, mentor, similarity_score: float) -> str:
        """
        Generate a personalized explanation for why this mentor is a good match.
        
        Args:
            mentee_profile: The extracted mentee profile
            mentor: The MentorProfile object
            similarity_score: The cosine similarity score
            
        Returns:
            Explanation string
        """
        # Always use template-based explanations for performance
        # Real AI explanations can be added later with proper LLM integration
        return cls._generate_mock_explanation(mentee_profile, mentor, similarity_score)
    
    @classmethod
    def _generate_mock_explanation(cls, mentee_profile: dict, mentor, similarity_score: float) -> str:
        """Generate a template-based explanation for mock mode."""
        confidence = cls.get_confidence_level(similarity_score)
        
        mentor_skills = mentor.skills[:3] if mentor.skills else ['expertise']
        skills_str = ', '.join(mentor_skills)
        
        desired_skills = mentee_profile.get('desired_skills', [])[:2]
        desired_str = ', '.join(desired_skills) if desired_skills else 'your interests'
        
        if confidence in ['very_high', 'high']:
            return f"{mentor.full_name} is an excellent match for you! With expertise in {skills_str}, they can guide you effectively in {desired_str}. Their experience aligns perfectly with your learning goals."
        elif confidence == 'medium':
            return f"{mentor.full_name} is a good match for your needs. They have strong skills in {skills_str} that can help you develop in {desired_str}."
        else:
            return f"{mentor.full_name} can offer valuable guidance in {skills_str}. While not a perfect match, their experience could still benefit your journey."
