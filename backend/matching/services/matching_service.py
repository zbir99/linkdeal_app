"""
Matching service for finding similar mentors using pgvector.
Performs semantic search with vector similarity and filtering.
"""
import logging
from typing import List, Dict, Optional
from django.db import connection
from django.conf import settings
from matching.models import Mentor
from matching.services.embedding_service import EmbeddingService
from matching.services.llm_service import LLMService

logger = logging.getLogger(__name__)


class MatchingService:
    """
    Service for matching mentees with mentors using vector similarity.
    """
    
    @classmethod
    def find_matching_mentors(
        cls,
        mentee_embedding: List[float],
        mentee_profile: Dict,
        limit: int = 5,
        min_rating: float = 0.0,
        required_languages: Optional[List[str]] = None
    ) -> List[Dict]:
        """
        Find mentors that match the mentee's profile using vector similarity.
        
        Args:
            mentee_embedding: Mentee's embedding vector
            mentee_profile: Extracted mentee profile (for explanation generation)
            limit: Maximum number of mentors to return
            min_rating: Minimum mentor rating filter
            required_languages: Optional list of required languages
        
        Returns:
            List of dicts with mentor info, similarity score, and explanation
        """
        try:
            # Use pgvector's <-> operator for L2 distance (cosine distance)
            # Note: pgvector uses <-> for L2 distance, <#> for inner product, <=> for cosine distance
            # We'll use <=> for cosine distance which is best for normalized embeddings
            
            with connection.cursor() as cursor:
                # Build the query with parameterized inputs
                query = """
                    SELECT 
                        id,
                        name,
                        bio,
                        skills,
                        languages,
                        experience_years,
                        rating,
                        availability,
                        1 - (embedding <=> %s::vector) AS similarity
                    FROM mentors
                    WHERE 
                        rating >= %s
                        AND embedding IS NOT NULL
                        {language_filter}
                    ORDER BY embedding <=> %s::vector
                    LIMIT %s
                """
                
                # Add language filter if specified
                language_filter = ""
                params = [mentee_embedding, min_rating]
                
                if required_languages:
                    # Check if any of the required languages is in the mentor's languages array
                    placeholders = ', '.join(['%s'] * len(required_languages))
                    language_filter = f"AND languages ?| ARRAY[{placeholders}]"
                    params.extend(required_languages)
                
                query = query.format(language_filter=language_filter)
                params.extend([mentee_embedding, limit])
                
                # Execute the query
                cursor.execute(query, params)
                
                # Fetch results
                columns = [col[0] for col in cursor.description]
                results = []
                
                for row in cursor.fetchall():
                    mentor_dict = dict(zip(columns, row))
                    
                    # Generate explanation for this match
                    explanation = LLMService.generate_explanation(
                        mentee_profile=mentee_profile,
                        mentor_data={
                            'name': mentor_dict['name'],
                            'bio': mentor_dict['bio'],
                            'skills': mentor_dict['skills'],
                            'experience_years': mentor_dict['experience_years'],
                            'rating': mentor_dict['rating']
                        },
                        language="en"  # TODO: Make this configurable
                    )
                    
                    results.append({
                        'id': str(mentor_dict['id']),
                        'name': mentor_dict['name'],
                        'bio': mentor_dict['bio'],
                        'skills': mentor_dict['skills'],
                        'languages': mentor_dict['languages'],
                        'experience_years': mentor_dict['experience_years'],
                        'rating': mentor_dict['rating'],
                        'availability': mentor_dict['availability'],
                        'similarity_score': float(mentor_dict['similarity']),
                        'confidence': cls._calculate_confidence(mentor_dict['similarity']),
                        'explanation': explanation
                    })
                
                logger.info(f"Found {len(results)} matching mentors")
                return results
        
        except Exception as e:
            logger.error(f"Error finding matching mentors: {e}")
            return []
    
    @staticmethod
    def _calculate_confidence(similarity_score: float) -> str:
        """
        Convert similarity score to confidence level.
        
        Args:
            similarity_score: Similarity score (0 to 1)
        
        Returns:
            Confidence level string
        """
        if similarity_score >= 0.9:
            return "very_high"
        elif similarity_score >= 0.75:
            return "high"
        elif similarity_score >= 0.6:
            return "medium"
        else:
            return "low"
    
    @classmethod
    def create_mentor_with_embedding(cls, mentor_data: Dict) -> Optional[Mentor]:
        """
        Create a new mentor and generate their embedding.
        
        Args:
            mentor_data: Dict with mentor fields
        
        Returns:
            Created Mentor instance or None
        """
        try:
            # Create mentor instance
            mentor = Mentor.objects.create(
                name=mentor_data.get('name'),
                bio=mentor_data.get('bio', ''),
                skills=mentor_data.get('skills', []),
                languages=mentor_data.get('languages', []),
                experience_years=mentor_data.get('experience_years', 0),
                rating=mentor_data.get('rating', 0.0),
                availability=mentor_data.get('availability', '')
            )
            
            # Generate embedding
            embedding_text = mentor.get_embedding_text()
            embedding = EmbeddingService.generate_embedding(embedding_text)
            
            if embedding:
                mentor.embedding = embedding
                mentor.save()
                logger.info(f"Created mentor '{mentor.name}' with embedding")
            else:
                logger.warning(f"Created mentor '{mentor.name}' but embedding generation failed")
            
            return mentor
        
        except Exception as e:
            logger.error(f"Error creating mentor: {e}")
            return None
    
    @classmethod
    def update_all_mentor_embeddings(cls) -> int:
        """
        Regenerate embeddings for all mentors.
        Useful when changing embedding model or fixing data.
        
        Returns:
            Number of mentors updated
        """
        mentors = Mentor.objects.all()
        updated_count = 0
        
        # Batch process for efficiency
        texts = [mentor.get_embedding_text() for mentor in mentors]
        embeddings = EmbeddingService.generate_batch_embeddings(texts)
        
        for mentor, embedding in zip(mentors, embeddings):
            if embedding:
                mentor.embedding = embedding
                mentor.save()
                updated_count += 1
        
        logger.info(f"Updated {updated_count} mentor embeddings")
        return updated_count
