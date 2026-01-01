"""
LLM Service for AI Chat.
Handles OpenAI API calls and mock responses for development.
"""
import json
import logging
from typing import Dict, Optional, List
from django.conf import settings

logger = logging.getLogger(__name__)


class LLMService:
    """
    Service for interacting with LLM (OpenAI GPT).
    Supports mock mode for development without API key.
    """
    
    CAREER_COACH_SYSTEM_PROMPT = """
You are a warm, professional career coach helping someone find the perfect mentor on LinkDeal.

Your personality:
- Encouraging and supportive
- Ask thoughtful, open-ended questions
- Show genuine interest in their goals
- Professional but friendly tone

Your role:
- Understand their career aspirations
- Learn about their current skills and desired skills
- Discover what kind of mentorship they need
- Guide them toward finding the right mentor

Keep responses concise (2-3 sentences). Be conversational and engaging.
"""

    PROFILE_EXTRACTION_PROMPT = """
Analyze this conversation and extract a JSON profile:

Conversation:
{conversation}

Return ONLY valid JSON with these fields:
- desired_skills: list of skills to learn
- languages: list of languages spoken
- experience_level: beginner/intermediate/advanced
- goals: brief learning goals description
- preferred_mentor_traits: traits mentioned (optional)
"""

    @classmethod
    def _get_client(cls):
        """Get OpenAI client if configured."""
        use_mock = getattr(settings, 'USE_MOCK_AI', True)
        api_key = getattr(settings, 'OPENAI_API_KEY', '')
        
        if use_mock or not api_key:
            return None
        
        try:
            from openai import OpenAI
            return OpenAI(api_key=api_key)
        except ImportError:
            logger.warning("OpenAI package not installed, using mock mode")
            return None

    @classmethod
    def generate_response(cls, messages: List[Dict], message_count: int) -> str:
        """
        Generate a conversational response from the AI coach.
        
        Args:
            messages: List of {role, content} message history
            message_count: Number of user messages in conversation
        
        Returns:
            AI response as string
        """
        client = cls._get_client()
        
        if not client:
            return cls._mock_response(messages, message_count)
        
        try:
            model = getattr(settings, 'OPENAI_MODEL', 'gpt-4o-mini')
            
            # Add offer to recommend after enough messages
            system_prompt = cls.CAREER_COACH_SYSTEM_PROMPT
            if message_count >= 4:
                system_prompt += "\n\nYou should now offer to recommend mentors if you have enough information about their goals and skills."
            
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    *[{"role": m["role"], "content": m["content"]} for m in messages]
                ],
                temperature=0.8,
                max_tokens=300
            )
            
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            logger.error(f"OpenAI API error: {e}")
            return "I apologize, I'm having trouble responding. Please try again."

    @classmethod
    def extract_profile(cls, conversation: str) -> Optional[Dict]:
        """
        Extract structured profile from conversation using LLM.
        """
        client = cls._get_client()
        
        if not client:
            return cls._mock_extract_profile(conversation)
        
        try:
            model = getattr(settings, 'OPENAI_MODEL', 'gpt-4o-mini')
            prompt = cls.PROFILE_EXTRACTION_PROMPT.format(conversation=conversation)
            
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "Extract data as JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=500
            )
            
            content = response.choices[0].message.content.strip()
            
            # Clean markdown code blocks
            if content.startswith("```"):
                content = content.replace("```json", "").replace("```", "").strip()
            
            return json.loads(content)
        
        except Exception as e:
            logger.error(f"Profile extraction error: {e}")
            return None

    @classmethod
    def _mock_response(cls, messages: List[Dict], message_count: int) -> str:
        """Mock responses for development without API key."""
        logger.info("Using MOCK AI response")
        
        # Get last user message for context
        last_message = ""
        for m in reversed(messages):
            if m.get("role") == "user":
                last_message = m.get("content", "").lower()
                break
        
        # Context-aware mock responses
        if message_count == 1:
            return "Welcome to LinkDeal! I'm here to help you find the perfect mentor. What skills or areas would you like to develop?"
        
        elif message_count == 2:
            return "That's great! Can you tell me about your current experience level in this area? Are you just starting out or do you have some background already?"
        
        elif message_count == 3:
            return "I understand. What are your main goals for the next few months? This will help me suggest mentors who can best support your journey."
        
        elif any(word in last_message for word in ['mentor', 'recommend', 'show', 'find']):
            return "Based on our conversation, I can recommend some excellent mentors for you! Would you like me to show you the top matches?"
        
        else:
            return "I have a good understanding of your profile now. Would you like me to recommend some mentors who would be a great fit for your goals?"

    @classmethod
    def _mock_extract_profile(cls, conversation: str) -> Dict:
        """Mock profile extraction for development."""
        logger.info("Using MOCK profile extraction")
        
        # Simple keyword extraction for mock
        conv_lower = conversation.lower()
        
        skills = []
        if 'python' in conv_lower:
            skills.append('Python')
        if 'react' in conv_lower or 'frontend' in conv_lower:
            skills.append('React')
        if 'javascript' in conv_lower or 'js' in conv_lower:
            skills.append('JavaScript')
        if 'data' in conv_lower:
            skills.append('Data Science')
        if not skills:
            skills = ['General Programming']
        
        level = 'beginner'
        if 'intermediate' in conv_lower or 'some experience' in conv_lower:
            level = 'intermediate'
        elif 'advanced' in conv_lower or 'senior' in conv_lower:
            level = 'advanced'
        
        return {
            "desired_skills": skills,
            "languages": ["English"],
            "experience_level": level,
            "goals": "Career development and skill improvement",
            "preferred_mentor_traits": ["patient", "experienced"]
        }
