"""
Views for AI Chat app.
Provides conversational AI for mentor matching.
"""
import logging
from datetime import datetime
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db.models import Q

from .models import ChatConversation
from .services import LLMService
from .serializers import ChatMessageSerializer
from .embedding_service import EmbeddingService
from .matching_service import MatchingService
from accounts.models import MentorProfile

logger = logging.getLogger(__name__)


class ChatView(APIView):
    """
    AI Chat endpoint for conversational mentor matching.
    
    POST /ai/chat/
    {
        "message": "I want to learn Python",
        "session_id": "optional-session-id",
        "get_recommendations": false
    }
    """
    permission_classes = [AllowAny]  # Allow both authenticated and anonymous
    
    def post(self, request):
        serializer = ChatMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            print("=== ChatView POST received ===")
            user_message = serializer.validated_data['message']
            session_id = serializer.validated_data.get('session_id') or f"session-{datetime.now().timestamp()}"
            get_recommendations = serializer.validated_data.get('get_recommendations', False)
            print(f"Message: {user_message}")
            print(f"Session: {session_id}")
            print(f"Get recommendations: {get_recommendations}")
            
            # Find or create conversation
            conversation, created = ChatConversation.objects.get_or_create(
                session_id=session_id,
                defaults={
                    'messages': [],
                    'message_count': 0,
                    'conversation_text': ''
                }
            )
            print(f"Conversation: {conversation.id}, created: {created}")
            
            # Link to authenticated mentee if available
            if request.user.is_authenticated and not conversation.mentee:
                try:
                    from accounts.models import MenteeProfile
                    mentee = MenteeProfile.objects.get(user__auth0_id=request.user.auth0_id)
                    conversation.mentee = mentee
                except (MenteeProfile.DoesNotExist, AttributeError):
                    pass
            
            # Add user message
            conversation.add_message('user', user_message)
            print(f"Message count: {conversation.message_count}")
            
            # Check if user wants recommendations
            user_wants_recs = self._wants_recommendations(user_message, get_recommendations)
            print(f"User wants recs: {user_wants_recs}")
            
            if user_wants_recs:
                print("=== Calling _handle_recommendations ===")
                return self._handle_recommendations(conversation, user_message, request)
            
            # Generate AI response
            ai_response = LLMService.generate_response(
                messages=conversation.messages,
                message_count=conversation.message_count
            )
            
            # Add AI response
            conversation.add_message('assistant', ai_response)
            conversation.save()
            
            return Response({
                'conversation_id': str(conversation.id),
                'session_id': session_id,
                'message': ai_response,
                'message_count': conversation.message_count,
                'has_recommendations': False
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f"Chat error: {e}", exc_info=True)
            return Response({
                'error': 'An error occurred processing your message'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _wants_recommendations(self, message: str, explicit_flag: bool) -> bool:
        """Check if user wants mentor recommendations."""
        if explicit_flag:
            return True
        
        msg_lower = message.lower()
        recommendation_phrases = [
            'show me mentors', 'recommend mentors', 'find mentor',
            'show recommendations', 'give me recommendations',
            'yes', 'sure', 'please', 'ok',  # Common affirmations after offer
            'montre moi des mentors', 'trouve un mentor'  # French
        ]
        
        return any(phrase in msg_lower for phrase in recommendation_phrases)
    
    def _handle_recommendations(self, conversation: ChatConversation, user_message: str, request):
        """Handle mentor recommendation request."""
        
        print("=== _handle_recommendations called ===")
        logger.info("=== _handle_recommendations called ===")
        logger.info(f"Conversation ID: {conversation.id}")
        logger.info(f"User message: {user_message}")
        
        try:
            # Extract profile from conversation
            print("Extracting profile from conversation...")
            logger.info("Extracting profile from conversation...")
            extracted_profile = LLMService.extract_profile(conversation.conversation_text)
            print(f"Extracted profile: {extracted_profile}")
            logger.info(f"Extracted profile: {extracted_profile}")
            
            if not extracted_profile:
                print("No profile extracted, asking for more info")
                logger.warning("No profile extracted, asking for more info")
                ai_response = "I'd love to recommend mentors, but I need a bit more information. What specific skills are you hoping to learn?"
                conversation.add_message('assistant', ai_response)
                conversation.save()
                
                return Response({
                    'conversation_id': str(conversation.id),
                    'session_id': conversation.session_id,
                    'message': ai_response,
                    'message_count': conversation.message_count,
                    'has_recommendations': False
                }, status=status.HTTP_200_OK)
            
            # Save extracted profile
            logger.info("Saving extracted profile to conversation...")
            conversation.extracted_profile = extracted_profile
            
            # Find matching mentors from existing MentorProfile
            logger.info("Finding mentors...")
            mentors = self._find_mentors(extracted_profile, request)
            logger.info(f"Found {len(mentors) if mentors else 0} mentors")
            
            conversation.recommendations_shown = True
            conversation.save()
            logger.info("Conversation saved")
            
            # Format response
            if mentors:
                message = f"Great news! I found {len(mentors)} mentor(s) that match your profile. Here are my top recommendations:"
            else:
                logger.info("No mentors found, getting fallback mentors...")
                message = "I couldn't find exact matches, but here are some mentors you might like:"
                mentors = self._get_fallback_mentors(request)
                logger.info(f"Fallback mentors: {len(mentors) if mentors else 0}")
            
            logger.info("=== Returning recommendation response ===")
            return Response({
                'conversation_id': str(conversation.id),
                'session_id': conversation.session_id,
                'message': message,
                'message_count': conversation.message_count,
                'has_recommendations': True,
                'extracted_profile': extracted_profile,
                'recommended_mentors': mentors
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            logger.error(f"=== Error in _handle_recommendations: {e} ===", exc_info=True)
            raise
    
    def _find_mentors_with_embeddings(self, profile: dict, request, limit: int = 5):
        """Find mentors using vector similarity search."""
        
        logger.info(f"=== Starting _find_mentors_with_embeddings ===")
        logger.info(f"Profile: {profile}")
        logger.info(f"Limit: {limit}")
        
        try:
            # Generate embedding for mentee profile
            logger.info("Generating mentee embedding...")
            mentee_embedding = EmbeddingService.generate_profile_embedding(profile)
            logger.info(f"Mentee embedding generated, length: {len(mentee_embedding) if mentee_embedding else 'None'}")
            
            # Use MatchingService to find similar mentors
            logger.info("Finding similar mentors...")
            results = MatchingService.find_similar_mentors(mentee_embedding, limit=limit)
            logger.info(f"Found {len(results)} mentors")
            
            # Helper function for profile picture URLs
            def get_profile_picture_url(mentor):
                try:
                    if mentor.profile_picture:
                        return request.build_absolute_uri(mentor.profile_picture.url)
                except Exception as e:
                    logger.error(f"Error getting profile picture URL: {e}")
                return None
            
            # Format results with similarity scores and explanations
            mentor_list = []
            for i, result in enumerate(results):
                logger.info(f"Processing mentor {i+1}/{len(results)}")
                try:
                    mentor = result['mentor']
                    similarity = result['similarity_score']
                    confidence = result['confidence']
                    
                    logger.info(f"Mentor: {mentor.full_name}, Similarity: {similarity}, Confidence: {confidence}")
                    
                    # Generate personalized explanation
                    logger.info("Generating explanation...")
                    explanation = MatchingService.generate_explanation(profile, mentor, similarity)
                    logger.info(f"Explanation generated: {explanation[:50]}...")
                    
                    mentor_list.append({
                        'id': str(mentor.id),
                        'name': mentor.full_name,
                        'title': mentor.professional_title,
                        'bio': mentor.bio[:200] + '...' if len(mentor.bio or '') > 200 else (mentor.bio or ''),
                        'skills': mentor.skills[:5] if mentor.skills else [],
                        'languages': mentor.languages or [],
                        'session_rate': float(mentor.session_rate) if mentor.session_rate else 0,
                        'profile_picture_url': get_profile_picture_url(mentor),
                        'similarity_score': similarity,
                        'confidence': confidence,
                        'explanation': explanation,
                        'match_reason': explanation  # For backward compatibility
                    })
                    logger.info(f"Mentor {mentor.full_name} added to list")
                except Exception as e:
                    logger.error(f"Error processing mentor: {e}", exc_info=True)
            
            logger.info(f"=== Returning {len(mentor_list)} mentors ===")
            return mentor_list
            
        except Exception as e:
            logger.error(f"=== Error in _find_mentors_with_embeddings: {e} ===", exc_info=True)
            raise
    
    def _find_mentors(self, profile: dict, request, limit: int = 5):
        """Find mentors matching the extracted profile."""
        print("=== _find_mentors called ===")
        
        try:
            from accounts.models import MentorProfile
            
            # Simple direct query - no embeddings for now
            desired_skills = profile.get('desired_skills', [])
            print(f"Desired skills: {desired_skills}")
            
            # Get approved mentors
            mentors = list(MentorProfile.objects.filter(status='approved')[:limit])
            print(f"Found {len(mentors)} approved mentors")
            
            if not mentors:
                print("No approved mentors found!")
                return []
            
            # Helper for profile picture URLs
            def get_profile_picture_url(mentor):
                try:
                    if mentor.profile_picture:
                        return request.build_absolute_uri(mentor.profile_picture.url)
                except Exception as e:
                    print(f"Error getting profile picture URL: {e}")
                return None
            
            # Format mentor list
            mentor_list = []
            for mentor in mentors:
                print(f"Processing mentor: {mentor.full_name}")
                
                # Simple skill matching
                mentor_skills = mentor.skills or []
                matching_skills = set(s.lower() for s in desired_skills) & set(s.lower() for s in mentor_skills)
                
                # Calculate simple similarity
                if desired_skills and mentor_skills:
                    similarity = len(matching_skills) / max(len(desired_skills), 1)
                    similarity = max(0.5, min(1.0, similarity + 0.5))  # Ensure reasonable range
                else:
                    similarity = 0.75  # Default similarity
                
                confidence = 'high' if similarity >= 0.8 else 'medium' if similarity >= 0.6 else 'low'
                
                # Create explanation
                if matching_skills:
                    explanation = f"{mentor.full_name} is a great match! They have expertise in {', '.join(list(matching_skills)[:3])} which aligns with your goals."
                else:
                    explanation = f"{mentor.full_name} is an experienced mentor who can help you develop your skills and reach your career goals."
                
                mentor_list.append({
                    'id': str(mentor.id),
                    'name': mentor.full_name,
                    'title': mentor.professional_title or 'Mentor',
                    'bio': (mentor.bio[:200] + '...') if mentor.bio and len(mentor.bio) > 200 else (mentor.bio or ''),
                    'skills': (mentor.skills or [])[:5],
                    'languages': mentor.languages or [],
                    'session_rate': float(mentor.session_rate) if mentor.session_rate else 0,
                    'profile_picture_url': get_profile_picture_url(mentor),
                    'similarity_score': round(similarity, 2),
                    'confidence': confidence,
                    'explanation': explanation,
                    'match_reason': explanation
                })
                print(f"Added mentor: {mentor.full_name}")
            
            print(f"=== Returning {len(mentor_list)} mentors ===")
            return mentor_list
            
        except Exception as e:
            print(f"=== Error in _find_mentors: {e} ===")
            import traceback
            traceback.print_exc()
            return []
    
    def _get_fallback_mentors(self, request, limit: int = 3):
        """Get fallback mentors when no matches found."""
        # Use MatchingService fallback
        results = MatchingService._fallback_matching(limit)
        
        def get_profile_picture_url(mentor):
            if mentor.profile_picture:
                return request.build_absolute_uri(mentor.profile_picture.url)
            return None
        
        mentor_list = []
        for result in results:
            mentor = result['mentor']
            mentor_list.append({
                'id': str(mentor.id),
                'name': mentor.full_name,
                'title': mentor.professional_title,
                'bio': mentor.bio[:200] + '...' if len(mentor.bio or '') > 200 else (mentor.bio or ''),
                'skills': mentor.skills[:5] if mentor.skills else [],
                'languages': mentor.languages or [],
                'session_rate': float(mentor.session_rate) if mentor.session_rate else 0,
                'profile_picture_url': get_profile_picture_url(mentor),
                'similarity_score': result['similarity_score'],
                'confidence': result['confidence'],
                'match_reason': "Top-rated mentor on LinkDeal"
            })
        
        return mentor_list


class ChatHistoryView(APIView):
    """
    Get chat history for a session.
    """
    permission_classes = [AllowAny]
    
    def get(self, request, session_id):
        try:
            conversation = ChatConversation.objects.get(session_id=session_id)
            return Response({
                'conversation_id': str(conversation.id),
                'session_id': conversation.session_id,
                'messages': conversation.messages,
                'message_count': conversation.message_count,
                'has_recommendations': conversation.recommendations_shown
            })
        except ChatConversation.DoesNotExist:
            return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)


class ConversationsListView(APIView):
    """
    List all conversations for the current user.
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        # Get conversations - filter by mentee if authenticated, otherwise return recent
        try:
            if request.user.is_authenticated:
                from accounts.models import MenteeProfile
                try:
                    mentee = MenteeProfile.objects.get(user__auth0_id=request.user.auth0_id)
                    conversations = ChatConversation.objects.filter(mentee=mentee).order_by('-updated_at')[:20]
                except MenteeProfile.DoesNotExist:
                    conversations = ChatConversation.objects.order_by('-updated_at')[:20]
            else:
                # For anonymous users, return recent conversations (limited)
                conversations = ChatConversation.objects.order_by('-updated_at')[:20]
            
            return Response({
                'conversations': [
                    {
                        'id': str(conv.id),
                        'session_id': conv.session_id,
                        'message_count': conv.message_count,
                        'messages': conv.messages[:3] if conv.messages else [],  # First 3 messages for preview
                        'created_at': conv.created_at.isoformat(),
                        'updated_at': conv.updated_at.isoformat(),
                        'has_recommendations': conv.recommendations_shown
                    }
                    for conv in conversations
                ]
            })
        except Exception as e:
            logger.error(f"Error listing conversations: {e}", exc_info=True)
            return Response({'conversations': []})


class ConversationDetailView(APIView):
    """
    Get, update (rename), or delete a specific conversation.
    """
    permission_classes = [AllowAny]
    
    def get(self, request, conversation_id):
        """Get a specific conversation by ID."""
        try:
            conversation = ChatConversation.objects.get(id=conversation_id)
            return Response({
                'id': str(conversation.id),
                'session_id': conversation.session_id,
                'title': conversation.title,
                'messages': conversation.messages,
                'message_count': conversation.message_count,
                'created_at': conversation.created_at.isoformat(),
                'updated_at': conversation.updated_at.isoformat(),
            })
        except ChatConversation.DoesNotExist:
            return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def patch(self, request, conversation_id):
        """Rename a conversation."""
        try:
            conversation = ChatConversation.objects.get(id=conversation_id)
            new_title = request.data.get('title')
            
            if new_title is not None:
                conversation.title = new_title
                conversation.save()
                
                return Response({
                    'id': str(conversation.id),
                    'title': conversation.title,
                    'message': 'Conversation renamed successfully'
                })
            else:
                return Response({'error': 'Title is required'}, status=status.HTTP_400_BAD_REQUEST)
                
        except ChatConversation.DoesNotExist:
            return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, conversation_id):
        """Delete a conversation."""
        try:
            conversation = ChatConversation.objects.get(id=conversation_id)
            conversation.delete()
            return Response({'message': 'Conversation deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        except ChatConversation.DoesNotExist:
            return Response({'error': 'Conversation not found'}, status=status.HTTP_404_NOT_FOUND)


