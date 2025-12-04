"""
Django REST Framework views for the matching API with progressive conversation.
"""
import logging
import json
from datetime import datetime
from rest_framework import status, viewsets
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator

from matching.models import Mentor, MenteeConversation
from matching.serializers import (
    MentorSerializer,
    MentorCreateSerializer,
    MenteeConversationSerializer,
    ChatRequestSerializer,
    ChatResponseSerializer
)
from matching.services.llm_service import LLMService
from matching.services.embedding_service import EmbeddingService
from matching.services.matching_service import MatchingService

logger = logging.getLogger(__name__)


class MentorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for listing and retrieving mentors.
    """
    queryset = Mentor.objects.all()
    serializer_class = MentorSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """
        Filter queryset based on query parameters.
        """
        queryset = super().get_queryset()
        
        # Filter by minimum rating
        min_rating = self.request.query_params.get('min_rating')
        if min_rating:
            try:
                queryset = queryset.filter(rating__gte=float(min_rating))
            except ValueError:
                pass
        
        # Filter by skill
        skill = self.request.query_params.get('skill')
        if skill:
            queryset = queryset.filter(skills__contains=[skill])
        
        # Filter by language
        language = self.request.query_params.get('language')
        if language:
            queryset = queryset.filter(languages__contains=[language])
        
        return queryset
    
    @action(detail=False, methods=['post'])
    @method_decorator(ratelimit(key='ip', rate='10/h', method='POST'))
    def seed(self, request):
        """
        Seed database with sample mentors.
        POST /api/mentors/seed/
        """
        sample_mentors = [
            {
                "name": "Sarah Chen",
                "bio": "Full-stack developer with 10 years of experience in Python and React. Passionate about teaching and mentoring junior developers.",
                "skills": ["Python", "Django", "React", "PostgreSQL", "Docker"],
                "languages": ["English", "Mandarin"],
                "experience_years": 10,
                "rating": 4.9,
                "availability": "Weekday evenings and weekends"
            },
            {
                "name": "Marcus Johnson",
                "bio": "Senior backend engineer specializing in scalable systems. Love helping beginners understand complex concepts.",
                "skills": ["Python", "FastAPI", "Kubernetes", "AWS", "Microservices"],
                "languages": ["English", "French"],
                "experience_years": 8,
                "rating": 4.7,
                "availability": "Flexible schedule"
            },
            {
                "name": "Amélie Dubois",
                "bio": "Frontend specialist with a focus on modern React and TypeScript. Patient mentor for beginners.",
                "skills": ["React", "TypeScript", "Next.js", "Tailwind CSS", "JavaScript"],
                "languages": ["French", "English"],
                "experience_years": 6,
                "rating": 4.8,
                "availability": "Weekend mornings"
            },
            {
                "name": "Raj Patel",
                "bio": "Data scientist and machine learning engineer. Expertise in Python, ML frameworks, and AI applications.",
                "skills": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas"],
                "languages": ["English", "Hindi"],
                "experience_years": 12,
                "rating": 4.9,
                "availability": "Flexible"
            },
            {
                "name": "Elena Rodriguez",
                "bio": "DevOps engineer with strong background in cloud infrastructure and CI/CD. Enjoy teaching best practices.",
                "skills": ["Docker", "Kubernetes", "AWS", "GitLab CI", "Terraform"],
                "languages": ["Spanish", "English"],
                "experience_years": 7,
                "rating": 4.6,
                "availability": "Weekday evenings"
            }
        ]
        
        created_mentors = []
        for mentor_data in sample_mentors:
            mentor = MatchingService.create_mentor_with_embedding(mentor_data)
            if mentor:
                created_mentors.append(mentor)
        
        serializer = MentorSerializer(created_mentors, many=True)
        return Response({
            "message": f"Successfully created {len(created_mentors)} mentors",
            "mentors": serializer.data
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
@ratelimit(key='ip', rate='50/h', method='POST')
def chat_view(request):
    """
    Progressive conversation with mentor recommendations on demand.
    POST /api/chat/
    
    Request body:
    {
        "message": "I want to learn Python",
        "session_id": "optional-session-id",
        "get_recommendations": false  // Set true to get mentor matches
    }
    """
    try:
        user_message = request.data.get('message', '') or request.data.get('conversation', '')
        session_id = request.data.get('session_id', '')
        get_recommendations = request.data.get('get_recommendations', False)
        language = request.data.get('language', 'en')
        
        if not user_message:
            return Response({
                "error": "Message is required"
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user explicitly asks for mentor recommendations
        explicit_phrases = [
            'show me recommendations',
            'show recommendations',
            'give me recommendations',
            'show me mentors',
            'show mentors',
            'mentor recommendations',
            'recommend mentors',
            'find me a mentor',
            'match me with a mentor',
            'donne moi des mentors',
            'montre moi des mentors',
            'trouve un mentor'
        ]
        mentor_keywords = [
            'mentor', 'mentors', 'coach', 'coaches', 'teacher', 'tutor',
            'menteur', 'formateur', 'professeur'
        ]
        action_keywords = [
            'show', 'find', 'get', 'give', 'match', 'recommande', 'recommend',
            'montre', 'trouve', 'donne'
        ]
        
        msg_lower = user_message.lower()
        
        explicit_request = any(phrase in msg_lower for phrase in explicit_phrases)
        mentor_intent = any(word in msg_lower for word in mentor_keywords) and any(
            action in msg_lower for action in action_keywords
        )
        
        user_wants_recs = bool(get_recommendations) or explicit_request or mentor_intent
        
        # Find or create conversation
        mentee_conv = None
        if session_id:
            mentee_conv = MenteeConversation.objects.filter(session_id=session_id).first()
        
        if not mentee_conv:
            mentee_conv = MenteeConversation.objects.create(
                conversation="",
                session_id=session_id or f"session-{datetime.now().timestamp()}",
                messages=[],
                message_count=0
            )
        
        # Add user message to history
        mentee_conv.messages.append({
            "role": "user",
            "content": user_message,
            "timestamp": datetime.now().isoformat()
        })
        mentee_conv.message_count += 1
        mentee_conv.conversation += f"User: {user_message}\n"
        
        # Provide recommendations only when explicitly requested
        if user_wants_recs:
            # Extract profile
            extracted_profile = LLMService.extract_profile(
                conversation=mentee_conv.conversation,
                language=language
            )
            
            if not extracted_profile:
                # Not enough info - ask for more
                ai_response = "I need a bit more information to find the right mentors. What specific skills are you hoping to learn?"
                mentee_conv.messages.append({
                    "role": "assistant",
                    "content": ai_response,
                    "timestamp": datetime.now().isoformat()
                })
                mentee_conv.conversation += f"AI: {ai_response}\n"
                mentee_conv.save()
                
                return Response({
                    "conversation_id": str(mentee_conv.id),
                    "message": ai_response,
                    "message_count": mentee_conv.message_count,
                    "has_recommendations": False
                }, status=status.HTTP_200_OK)
            
            mentee_conv.extracted_profile = extracted_profile
            
            # Generate embedding
            profile_text = (
                f"Desired skills: {', '.join(extracted_profile.get('desired_skills', []))}\n"
                f"Languages: {', '.join(extracted_profile.get('languages', []))}\n"
                f"Experience level: {extracted_profile.get('experience_level', 'beginner')}\n"
                f"Goals: {extracted_profile.get('goals', '')}"
            )
            
            mentee_embedding = EmbeddingService.generate_embedding(profile_text)
            if mentee_embedding:
                mentee_conv.embedding = mentee_embedding
            
            # Find mentors
            matching_mentors = MatchingService.find_matching_mentors(
                mentee_embedding=mentee_embedding if mentee_embedding else [],
                mentee_profile=extracted_profile,
                limit=5
            )
            
            mentee_conv.recommendations_shown = True
            mentee_conv.save()
            
            return Response({
                "conversation_id": str(mentee_conv.id),
                "extracted_profile": extracted_profile,
                "recommended_mentors": matching_mentors,
                "message": f"Found {len(matching_mentors)} mentor(s) matching your profile!",
                "has_recommendations": True,
                "message_count": mentee_conv.message_count
            }, status=status.HTTP_200_OK)
        
        # Progressive conversation mode
        ai_response = LLMService.generate_conversational_response(
            messages=mentee_conv.messages,
            message_count=mentee_conv.message_count,
            language=language
        )
        
        # Add AI response to history
        mentee_conv.messages.append({
            "role": "assistant",
            "content": ai_response,
            "timestamp": datetime.now().isoformat()
        })
        mentee_conv.conversation += f"AI: {ai_response}\n"
        mentee_conv.save()
        
        return Response({
            "conversation_id": str(mentee_conv.id),
            "message": ai_response,
            "message_count": mentee_conv.message_count,
            "has_recommendations": False
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"Error in chat_view: {e}", exc_info=True)
        return Response({
            "error": "An error occurred"
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
