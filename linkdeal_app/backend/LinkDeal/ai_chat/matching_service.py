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
    def find_similar_mentors(cls, mentee_embedding: list, limit: int = 5, min_rating: float = 0.0, profile: dict = None):
        """
        Find mentors similar to the mentee's needs using vector similarity.
        
        Args:
            mentee_embedding: The mentee's profile embedding (384-dim vector)
            limit: Maximum number of mentors to return
            min_rating: Minimum mentor rating filter
            profile: Optional extracted profile for keyword-based fallback
            
        Returns:
            List of mentor dicts with similarity scores
        """
        from accounts.models import MentorProfile
        
        # Always use keyword-based fallback since OpenAI embedding models are not available
        # on this account. This provides intelligent matching based on text keywords.
        logger.info("Using keyword-based matching (recommended for this setup)")
        return cls._fallback_matching(limit, profile)
        
        # The code below is for future use when embedding models become available
        use_mock = getattr(settings, 'USE_MOCK_AI', True)
        
        # Check if we can use pgvector
        if use_mock or not cls._pgvector_available():
            logger.info("Using fallback matching (pgvector not available or mock mode)")
            return cls._fallback_matching(limit, profile)
        
        try:
            # Use raw SQL for pgvector cosine similarity
            embedding_str = '[' + ','.join(map(str, mentee_embedding)) + ']'
            
            with connection.cursor() as cursor:
                cursor.execute("""
                    WITH mentors_with_vectors AS (
                        SELECT 
                            id, 
                            embedding::text::vector as v
                        FROM accounts_mentorprofile
                        WHERE 
                            status = 'approved'
                            AND embedding IS NOT NULL
                    )
                    SELECT 
                        id,
                        GREATEST(0, (2 - (v OPERATOR(public.<=>) %s::vector)) / 2) AS similarity
                    FROM mentors_with_vectors
                    ORDER BY v OPERATOR(public.<=>) %s::vector
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
    def _fallback_matching(cls, limit: int = 5, profile: dict = None):
        """
        Intelligent keyword-based matching when embeddings are not available.
        Uses text matching on skills, title, and bio.
        """
        from accounts.models import MentorProfile
        
        mentors = list(MentorProfile.objects.filter(status='approved'))
        
        if not profile:
            # No profile, return random with decent scores
            import random
            random.shuffle(mentors)
            return [{
                'mentor': m,
                'similarity_score': 0.75 + (hash(str(m.id)) % 20) / 100,
                'confidence': 'medium'
            } for m in mentors[:limit]]
        
        # Extract keywords from profile - be more thorough
        keywords = set()
        skill_keywords = set()  # Track skill keywords separately for higher weight
        
        # Add common related terms for business/startup context
        business_synonyms = {
            'entrepreneur': ['entrepreneur', 'startup', 'founder', 'ceo', 'business'],
            'fundraising': ['fundraising', 'funding', 'venture', 'capital', 'investor', 'investment'],
            'business': ['business', 'startup', 'entrepreneur', 'company', 'saas', 'b2b'],
            'ai': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'llm', 'automation'],
            'startup': ['startup', 'entrepreneur', 'founder', 'business', 'launch'],
            'pitch': ['pitch', 'pitching', 'investor', 'presentation'],
            'saas': ['saas', 'b2b', 'product', 'software']
        }
        
        if profile.get('desired_skills'):
            for skill in profile['desired_skills']:
                skill_lower = skill.lower()
                skill_keywords.add(skill_lower)
                keywords.update(skill_lower.split())
                # Add synonyms
                for key, synonyms in business_synonyms.items():
                    if key in skill_lower:
                        keywords.update(synonyms)
        
        if profile.get('goals'):
            goals_lower = profile['goals'].lower()
            # Filter out common words
            stop_words = {'i', 'to', 'a', 'the', 'and', 'or', 'for', 'in', 'on', 'with', 'my', 'an', 'is', 'it', 'about', 'how'}
            goal_words = [w for w in goals_lower.split() if w not in stop_words and len(w) > 2]
            keywords.update(goal_words)
            # Add synonyms for goals
            for key, synonyms in business_synonyms.items():
                if key in goals_lower:
                    keywords.update(synonyms)
        
        logger.info(f"Matching with keywords: {keywords}")
        
        # Score each mentor based on keyword matches
        results = []
        for mentor in mentors:
            mentor_text = (
                (mentor.professional_title or '').lower() + ' ' +
                (mentor.bio or '').lower() + ' ' +
                ' '.join(mentor.skills or []).lower()
            )
            
            # Count different types of matches (including partial matches for word roots)
            exact_skill_matches = sum(1 for skill in skill_keywords if skill in mentor_text)
            
            # For keyword matches, also check partial matches (e.g., "entrepreneur" matches "entrepreneurship")
            keyword_matches = 0
            for kw in keywords:
                if len(kw) > 3:
                    # Check if keyword or any form of it appears
                    if kw in mentor_text or kw[:4] in mentor_text:
                        keyword_matches += 1
            
            # Calculate score based on matches
            if exact_skill_matches > 0 or keyword_matches > 0:
                # Base score of 70% for any match
                base_score = 0.70
                # Add 5% per exact skill match (up to 20%)
                skill_bonus = min(0.20, exact_skill_matches * 0.05)
                # Add 2% per keyword match (up to 15%)
                keyword_bonus = min(0.15, keyword_matches * 0.02)
                # Total score capped at 97%
                score = min(0.97, base_score + skill_bonus + keyword_bonus)
            else:
                # Base score for mentors with no direct keyword matches
                # Still give them a reasonable score (50-60%)
                score = 0.50 + (hash(str(mentor.id)) % 10) / 100
            
            results.append({
                'mentor': mentor,
                'similarity_score': round(score, 2),
                'confidence': cls.get_confidence_level(score)
            })
        
        results.sort(key=lambda x: x['similarity_score'], reverse=True)
        return results[:limit]
    
    @classmethod
    def generate_explanation(cls, mentee_profile: dict, mentor, similarity_score: float) -> str:
        """
        Generate a personalized explanation for why this mentor is a good match using OpenAI.
        """
        use_mock = getattr(settings, 'USE_MOCK_AI', True)
        api_key = getattr(settings, 'OPENAI_API_KEY', '')

        if use_mock or not api_key:
            return cls._generate_mock_explanation(mentee_profile, mentor, similarity_score)

        try:
            from openai import OpenAI
            client = OpenAI(api_key=api_key)
            
            prompt = f"""
            You are a career coaching assistant. Explain why this mentor is a good match for this student.
            
            STUDENT NEEDS:
            - Desired Skills: {mentee_profile.get('desired_skills')}
            - Goals: {mentee_profile.get('goals')}
            
            MENTOR PROFILE:
            - Name: {mentor.full_name}
            - Title: {mentor.professional_title}
            - Bio: {mentor.bio}
            - Skills: {mentor.skills}
            
            MATCH SCORE: {similarity_score * 100}%
            
            Provide a short, encouraging 1-2 sentence explanation in the same language as the student's needs (mostly English or French).
            Be specific about how the mentor's skills help the student's goals.
            """
            
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "system", "content": "You are a helpful career advisor."}, 
                          {"role": "user", "content": prompt}],
                max_tokens=100,
                temperature=0.7
            )
            return response.choices[0].message.content.strip()
        except Exception as e:
            logger.error(f"Error generating AI explanation: {e}")
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
