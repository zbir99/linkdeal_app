"""
LLM service for profile extraction and explanation generation.
Supports OpenAI (v1.x) and mock mode for local development.
"""
import json
import logging
from typing import Dict, Optional, List
from django.conf import settings
from openai import OpenAI

logger = logging.getLogger(__name__)

class LLMService:
    """
    Service for interacting with LLM (OpenAI).
    """
    
    PROFILE_EXTRACTION_PROMPT_EN = """
You are an AI assistant helping to extract structured information from a mentee's conversation.

Analyze the following conversation and extract a JSON profile with these fields:
- desired_skills: list of skills the mentee wants to learn (e.g., ["Python", "Django"])
- languages: list of languages the mentee speaks (e.g., ["English", "French"])
- experience_level: beginner, intermediate, or advanced
- goals: brief description of the mentee's learning goals
- preferred_mentor_traits: any specific traits mentioned (e.g., ["patient", "experienced"])

Conversation:
{conversation}

Return ONLY valid JSON, no other text.
"""
    
    PROFILE_EXTRACTION_PROMPT_FR = """
Vous êtes un assistant IA qui aide à extraire des informations structurées d'une conversation avec un mentoré.

Analysez la conversation suivante et extrayez un profil JSON avec ces champs :
- desired_skills: liste des compétences que le mentoré souhaite apprendre (ex : ["Python", "Django"])
- languages: liste des langues parlées par le mentoré (ex : ["Anglais", "Français"])
- experience_level: débutant, intermédiaire ou avancé
- goals: brève description des objectifs d'apprentissage
- preferred_mentor_traits: traits spécifiques mentionnés (ex : ["patient", "expérimenté"])

Conversation :
{conversation}

Retournez UNIQUEMENT du JSON valide, aucun autre texte.
"""
    
    EXPLANATION_PROMPT_EN = """
You are an AI mentor matching assistant. Explain why this mentor is a good match for the mentee.

Mentee Profile:
{mentee_profile}

Mentor:
Name: {mentor_name}
Bio: {mentor_bio}
Skills: {mentor_skills}
Experience: {mentor_experience} years
Rating: {mentor_rating}/5

Provide a brief, friendly explanation (2-3 sentences) of why this mentor is recommended.
"""
    
    EXPLANATION_PROMPT_FR = """
Vous êtes un assistant de matching de mentors. Expliquez pourquoi ce mentor correspond bien au mentoré.

Profil du Mentoré :
{mentee_profile}

Mentor :
Nom : {mentor_name}
Bio : {mentor_bio}
Compétences : {mentor_skills}
Expérience : {mentor_experience} ans
Note : {mentor_rating}/5

Fournissez une explication brève et amicale (2-3 phrases) expliquant pourquoi ce mentor est recommandé.
"""

    # NEW: Career Coach Conversation Prompts
    CAREER_COACH_SYSTEM_PROMPT_EN = """
You are a warm, professional career coach helping someone find the perfect mentor.

Your personality:
- Encouraging and supportive
- Ask thoughtful, open-ended questions
- Show genuine interest in their goals
- Professional but friendly tone

Your role:
- Understand their career aspirations
- Learn about their current skills and desired skills
- Discover what kind of mentorship they need
- After 5-6 messages, offer to recommend mentors

IMPORTANT: Do NOT recommend mentors yet. Just have a natural conversation.
"""

    CAREER_COACH_SYSTEM_PROMPT_FR = """
Vous êtes un career coach chaleureux et professionnel qui aide quelqu'un à trouver le mentor parfait.

Votre personnalité :
- Encourageant et bienveillant
- Posez des questions réfléchies et ouvertes
- Montrez un intérêt sincère pour leurs objectifs  
- Ton professionnel mais amical

Votre rôle :
- Comprendre leurs aspirations professionnelles
- Apprendre leurs compétences actuelles et désirées
- Découvrir quel type de mentorat ils recherchent
- Après 5-6 messages, proposer de recommander des mentors

IMPORTANT : NE recommandez PAS encore de mentors. Ayez simplement une conversation naturelle.
"""

    OFFER_RECOMMENDATIONS_PROMPT_EN = """
Based on our conversation, I now have a good understanding of your profile and goals.

Would you like me to recommend some mentors who would be a great match for you?
"""

    OFFER_RECOMMENDATIONS_PROMPT_FR = """
D'après notre conversation, j'ai maintenant une bonne compréhension de votre profil et de vos objectifs.

Souhaitez-vous que je vous recommande des mentors qui correspondent parfaitement à vos besoins ?
"""
    
    @classmethod
    def _get_client(cls):
        """Get OpenAI client if configured"""
        if not settings.USE_MOCK_AI and settings.OPENAI_API_KEY:
            return OpenAI(api_key=settings.OPENAI_API_KEY)
        return None

    @classmethod
    def generate_conversational_response(
        cls,
        messages: List[Dict],
        message_count: int,
        language: str = "en"
    ) -> str:
        """
        Generate a conversational response from the career coach.
        
        Args:
            messages: List of {role, content} message history
            message_count: Number of messages in conversation
            language: "en" or "fr"
        
        Returns:
            AI response as string
        """
        if settings.USE_MOCK_AI:
            return cls._mock_conversational_response(message_count)
        
        try:
            client = cls._get_client()
            if not client:
                logger.error("OpenAI client not configured")
                return "I'm sorry, I'm having technical difficulties. Please try again."

            system_prompt = (
                cls.CAREER_COACH_SYSTEM_PROMPT_EN if language == "en"
                else cls.CAREER_COACH_SYSTEM_PROMPT_FR
            )
            
            # Add context about when to offer recommendations
            if message_count >= 3:
                offer_prompt = (
                    cls.OFFER_RECOMMENDATIONS_PROMPT_EN if language == "en"
                    else cls.OFFER_RECOMMENDATIONS_PROMPT_FR
                )
                system_prompt += f"\n\nNote: After this message, you can naturally mention: '{offer_prompt}'"
            
            response = client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": system_prompt},
                    *messages  # Include full conversation history
                ],
                temperature=0.8,  # More creative for natural conversation
                max_tokens=300
            )
            
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            logger.error(f"Error generating conversational response: {e}")
            return "I apologize, I'm having trouble responding right now. Could you please try again?"

    @classmethod
    def extract_profile(cls, conversation: str, language: str = "en") -> Optional[Dict]:
        """
        Extract structured profile from conversation using LLM.
        """
        if settings.USE_MOCK_AI:
            return cls._mock_extract_profile(conversation)
        
        try:
            client = cls._get_client()
            if not client:
                logger.error("OpenAI client not configured")
                return None

            prompt_template = (
                cls.PROFILE_EXTRACTION_PROMPT_EN if language == "en"
                else cls.PROFILE_EXTRACTION_PROMPT_FR
            )
            prompt = prompt_template.format(conversation=conversation)
            
            response = client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that extracts structured data in JSON format."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )
            
            content = response.choices[0].message.content.strip()
            logger.info(f"LLM response for profile extraction: {content}")
            
            # Clean up markdown code blocks if present
            if content.startswith("```json"):
                content = content.replace("```json", "").replace("```", "").strip()
            elif content.startswith("```"):
                content = content.replace("```", "").strip()
            
            # Parse JSON response
            profile = json.loads(content)
            return profile
        
        except Exception as e:
            logger.error(f"Error extracting profile: {e}")
            return None
    
    @classmethod
    def generate_explanation(
        cls,
        mentee_profile: Dict,
        mentor_data: Dict,
        language: str = "en"
    ) -> str:
        """
        Generate an explanation of why a mentor matches the mentee.
        """
        if settings.USE_MOCK_AI:
            return cls._mock_generate_explanation(mentor_data)
        
        try:
            client = cls._get_client()
            if not client:
                return "AI explanation unavailable (configuration error)."

            prompt_template = (
                cls.EXPLANATION_PROMPT_EN if language == "en"
                else cls.EXPLANATION_PROMPT_FR
            )
            prompt = prompt_template.format(
                mentee_profile=json.dumps(mentee_profile, indent=2),
                mentor_name=mentor_data.get('name', ''),
                mentor_bio=mentor_data.get('bio', ''),
                mentor_skills=', '.join(mentor_data.get('skills', [])),
                mentor_experience=mentor_data.get('experience_years', 0),
                mentor_rating=mentor_data.get('rating', 0)
            )
            
            response = client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {"role": "system", "content": "You are a helpful mentor matching assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=200
            )
            
            explanation = response.choices[0].message.content.strip()
            return explanation
        
        except Exception as e:
            logger.error(f"Error generating explanation: {e}")
            return "This mentor matches your profile based on their skills and experience."
    
    @staticmethod
    def _mock_extract_profile(conversation: str) -> Dict:
        """
        Mock profile extraction for local development.
        """
        logger.info("Using MOCK profile extraction")
        return {
            "desired_skills": ["Python", "Django", "React"],
            "languages": ["English", "French"],
            "experience_level": "beginner",
            "goals": "Learn full-stack web development",
            "preferred_mentor_traits": ["patient", "experienced"]
        }
    
    @staticmethod
    def _mock_generate_explanation(mentor_data: Dict) -> str:
        """
        Mock explanation generation for local development.
        """
        logger.info("Using MOCK explanation generation")
        return (
            f"{mentor_data.get('name', 'This mentor')} is an excellent match for you! "
            f"With {mentor_data.get('experience_years', 0)} years of experience and expertise in "
            f"{', '.join(mentor_data.get('skills', [])[:3])}, they can guide you effectively."
        )
    
    @staticmethod
    def _mock_conversational_response(message_count: int) -> str:
        """
        Mock conversational response for local development.
        """
        logger.info("Using MOCK conversational response")
        
        responses = [
            "Hello! I'm excited to help you find the perfect mentor. Tell me, what skills are you hoping to develop?",
            "That's wonderful! And what's your current experience level with these skills?",
            "Great! What are your main career goals for the next 6-12 months?",
            "Perfect! Based on what you've shared, I have a good understanding of your needs. Would you like me to recommend some mentors who would be a great fit for you?"
        ]
        
        idx = min(message_count, len(responses) - 1)
        return responses[idx]
