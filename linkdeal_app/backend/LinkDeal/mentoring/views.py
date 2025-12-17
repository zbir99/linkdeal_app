"""
Views for the mentoring app.
Handles API endpoints for mentor listings, reviews, favorites, and relations.
"""
import logging
from decimal import Decimal

from django.db.models import Avg, Count
from django.shortcuts import get_object_or_404
from django.utils import timezone

from rest_framework import generics, status, filters
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from accounts.permissions import IsAuthenticatedAuth0, IsMentor, IsMentee
from accounts.models import MentorProfile, MenteeProfile

from mentoring.models import (
    MentorCategory,
    MentorMenteeRelation,
    Review,
    MentorFavorite,
    ReviewTag,
)
from mentoring.serializers import (
    MentorCategorySerializer,
    ReviewTagSerializer,
    ReviewListSerializer,
    ReviewCreateSerializer,
    ReviewResponseSerializer,
    FavoriteListSerializer,
    FavoriteCreateSerializer,
    MentorMenteeRelationListSerializer,
    MentorMenteeRelationDetailSerializer,
    MentorMenteeRelationUpdateSerializer,
    MentorMenteesStatsSerializer,
    MentorPublicListSerializer,
    MentorPublicDetailSerializer,
    MentorRatingSerializer,
)

logger = logging.getLogger(__name__)


# -------------------------------------------------------------------
# 1. CATEGORY VIEWS
# -------------------------------------------------------------------

class MentorCategoryListView(generics.ListAPIView):
    """
    GET /mentoring/categories/
    List all active mentor categories.
    """
    queryset = MentorCategory.objects.filter(is_active=True, parent__isnull=True)
    serializer_class = MentorCategorySerializer
    permission_classes = [AllowAny]


# -------------------------------------------------------------------
# 2. PUBLIC MENTOR LISTING VIEWS
# -------------------------------------------------------------------

class MentorPublicListView(generics.ListAPIView):
    """
    GET /mentoring/mentors/
    List approved mentors with search and filters.
    """
    serializer_class = MentorPublicListSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['full_name', 'professional_title', 'skills', 'bio']
    ordering_fields = ['created_at', 'full_name']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = MentorProfile.objects.filter(status='approved')
        
        # Category filter
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(
                category_assignments__category__slug=category
            )
        
        # Language filter
        language = self.request.query_params.get('language')
        if language:
            queryset = queryset.filter(languages__icontains=language)
        
        # Country filter
        country = self.request.query_params.get('country')
        if country:
            queryset = queryset.filter(country__iexact=country)
        
        # Skills filter
        skills = self.request.query_params.get('skills')
        if skills:
            skill_list = skills.split(',')
            for skill in skill_list:
                queryset = queryset.filter(skills__icontains=skill.strip())
        
        # Rating filter (minimum rating)
        min_rating = self.request.query_params.get('min_rating')
        if min_rating:
            try:
                min_val = float(min_rating)
                # Annotate with average rating and filter
                queryset = queryset.annotate(
                    avg_rating=Avg('reviews_received__rating')
                ).filter(avg_rating__gte=min_val)
            except ValueError:
                pass
        
        return queryset.distinct()


class MentorPublicDetailView(generics.RetrieveAPIView):
    """
    GET /mentoring/mentors/<id>/
    Get detailed public profile of a mentor.
    """
    queryset = MentorProfile.objects.filter(status='approved')
    serializer_class = MentorPublicDetailSerializer
    permission_classes = [AllowAny]
    lookup_field = 'id'


# -------------------------------------------------------------------
# 3. REVIEW VIEWS
# -------------------------------------------------------------------

class ReviewTagListView(generics.ListAPIView):
    """
    GET /mentoring/review-tags/
    List available review tags.
    """
    queryset = ReviewTag.objects.filter(is_active=True)
    serializer_class = ReviewTagSerializer
    permission_classes = [AllowAny]


class MentorReviewsView(generics.ListAPIView):
    """
    GET /mentoring/mentors/<mentor_id>/reviews/
    List public reviews for a mentor.
    """
    serializer_class = ReviewListSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        mentor_id = self.kwargs['mentor_id']
        return Review.objects.filter(
            mentor_id=mentor_id,
            is_public=True,
            is_approved=True
        ).select_related('mentee', 'session')


class ReviewCreateView(generics.CreateAPIView):
    """
    POST /mentoring/reviews/
    Create a review for a completed session.
    """
    serializer_class = ReviewCreateSerializer
    permission_classes = [IsAuthenticatedAuth0, IsMentee]


class ReviewResponseView(APIView):
    """
    PATCH /mentoring/reviews/<id>/respond/
    Mentor responds to a review.
    """
    permission_classes = [IsAuthenticatedAuth0, IsMentor]

    def patch(self, request, pk):
        mentor = MentorProfile.objects.get(user__auth0_id=request.user.auth0_id)
        review = get_object_or_404(Review, id=pk, mentor=mentor)
        
        if review.mentor_response:
            return Response(
                {'error': 'Already responded to this review'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = ReviewResponseSerializer(
            data=request.data,
            context={'review': review, 'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        review.mentor_response = serializer.validated_data['response']
        review.responded_at = timezone.now()
        review.save()
        
        return Response(ReviewListSerializer(review, context={'request': request}).data)


class MentorReceivedReviewsView(generics.ListAPIView):
    """
    GET /mentoring/mentor/reviews/
    List reviews received by the logged-in mentor.
    """
    serializer_class = ReviewListSerializer
    permission_classes = [IsAuthenticatedAuth0, IsMentor]

    def get_queryset(self):
        mentor = MentorProfile.objects.get(user__auth0_id=self.request.user.auth0_id)
        return Review.objects.filter(mentor=mentor).select_related('mentee', 'session')


# -------------------------------------------------------------------
# 4. FAVORITE VIEWS
# -------------------------------------------------------------------

class FavoriteListView(generics.ListAPIView):
    """
    GET /mentoring/favorites/
    List mentee's favorite mentors.
    """
    serializer_class = FavoriteListSerializer
    permission_classes = [IsAuthenticatedAuth0, IsMentee]

    def get_queryset(self):
        mentee = MenteeProfile.objects.get(user__auth0_id=self.request.user.auth0_id)
        return MentorFavorite.objects.filter(mentee=mentee).select_related('mentor')


class FavoriteCreateView(generics.CreateAPIView):
    """
    POST /mentoring/favorites/
    Add a mentor to favorites.
    """
    serializer_class = FavoriteCreateSerializer
    permission_classes = [IsAuthenticatedAuth0, IsMentee]


class FavoriteDeleteView(APIView):
    """
    DELETE /mentoring/favorites/<mentor_id>/
    Remove a mentor from favorites.
    """
    permission_classes = [IsAuthenticatedAuth0, IsMentee]

    def delete(self, request, mentor_id):
        mentee = MenteeProfile.objects.get(user__auth0_id=request.user.auth0_id)
        
        try:
            favorite = MentorFavorite.objects.get(mentee=mentee, mentor_id=mentor_id)
            favorite.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except MentorFavorite.DoesNotExist:
            return Response(
                {'error': 'Favorite not found'},
                status=status.HTTP_404_NOT_FOUND
            )


class MentorIsFavoriteView(APIView):
    """
    GET /mentoring/mentors/<mentor_id>/is-favorite/
    Check if mentor is in favorites.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def get(self, request, mentor_id):
        try:
            mentee = MenteeProfile.objects.get(user__auth0_id=request.user.auth0_id)
            is_favorite = MentorFavorite.objects.filter(
                mentee=mentee,
                mentor_id=mentor_id
            ).exists()
            return Response({'is_favorite': is_favorite})
        except MenteeProfile.DoesNotExist:
            return Response({'is_favorite': False})


# -------------------------------------------------------------------
# 5. MENTOR-MENTEE RELATION VIEWS
# -------------------------------------------------------------------

class MentorMenteesListView(generics.ListAPIView):
    """
    GET /mentoring/mentor/mentees/
    List mentor's mentees.
    """
    serializer_class = MentorMenteeRelationListSerializer
    permission_classes = [IsAuthenticatedAuth0, IsMentor]

    def get_queryset(self):
        mentor = MentorProfile.objects.get(user__auth0_id=self.request.user.auth0_id)
        queryset = MentorMenteeRelation.objects.filter(mentor=mentor)
        
        # Status filter
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(mentee__full_name__icontains=search)
        
        return queryset.select_related('mentee')


class MentorMenteeDetailView(generics.RetrieveUpdateAPIView):
    """
    GET/PATCH /mentoring/mentor/mentees/<id>/
    Get or update relation details.
    """
    permission_classes = [IsAuthenticatedAuth0, IsMentor]
    lookup_field = 'id'

    def get_queryset(self):
        mentor = MentorProfile.objects.get(user__auth0_id=self.request.user.auth0_id)
        return MentorMenteeRelation.objects.filter(mentor=mentor)

    def get_serializer_class(self):
        if self.request.method == 'PATCH':
            return MentorMenteeRelationUpdateSerializer
        return MentorMenteeRelationDetailSerializer


class MentorMenteesStatsView(APIView):
    """
    GET /mentoring/mentor/mentees/stats/
    Get stats about mentor's mentees.
    """
    permission_classes = [IsAuthenticatedAuth0, IsMentor]

    def get(self, request):
        mentor = MentorProfile.objects.get(user__auth0_id=request.user.auth0_id)
        relations = MentorMenteeRelation.objects.filter(mentor=mentor)
        
        total = relations.count()
        active = relations.filter(status='active').count()
        paused = relations.filter(status='paused').count()
        
        # Aggregate session stats
        from django.db.models import Sum
        totals = relations.aggregate(
            sessions=Sum('total_sessions'),
            hours=Sum('total_hours')
        )
        
        data = {
            'total_mentees': total,
            'active_mentees': active,
            'paused_mentees': paused,
            'total_sessions': totals['sessions'] or 0,
            'total_hours': totals['hours'] or Decimal('0'),
        }
        
        return Response(MentorMenteesStatsSerializer(data).data)


# -------------------------------------------------------------------
# 6. MENTOR RATING VIEW
# -------------------------------------------------------------------

class MentorRatingView(APIView):
    """
    GET /mentoring/mentor/rating/
    Get logged-in mentor's rating stats.
    """
    permission_classes = [IsAuthenticatedAuth0, IsMentor]

    def get(self, request):
        mentor = MentorProfile.objects.get(user__auth0_id=request.user.auth0_id)
        reviews = Review.objects.filter(mentor=mentor, is_approved=True)
        
        # Average & count
        stats = reviews.aggregate(
            avg=Avg('rating'),
            total=Count('id')
        )
        
        # Rating distribution
        distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        for r in reviews.values('rating').annotate(count=Count('id')):
            distribution[r['rating']] = r['count']
        
        # Featured count
        featured = reviews.filter(is_featured=True).count()
        
        data = {
            'average_rating': round(stats['avg'] or 0, 2),
            'total_reviews': stats['total'] or 0,
            'rating_distribution': distribution,
            'featured_reviews_count': featured,
        }
        
        return Response(MentorRatingSerializer(data).data)


# -------------------------------------------------------------------
# 7. MENTEE PROGRESS VIEW (for mentor to see mentee's progress)
# -------------------------------------------------------------------

class MenteeProgressView(APIView):
    """
    GET /mentoring/mentees/<mentee_id>/progress/
    Get mentee's progress with the logged-in mentor.
    """
    permission_classes = [IsAuthenticatedAuth0, IsMentor]

    def get(self, request, mentee_id):
        mentor = MentorProfile.objects.get(user__auth0_id=request.user.auth0_id)
        
        try:
            relation = MentorMenteeRelation.objects.get(
                mentor=mentor,
                mentee_id=mentee_id
            )
        except MentorMenteeRelation.DoesNotExist:
            return Response(
                {'error': 'Mentee not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Get session history
        from scheduling.models import Session
        sessions = Session.objects.filter(
            mentor=mentor,
            mentee_id=mentee_id
        ).order_by('-scheduled_at')
        
        # Calculate progress metrics
        completed = sessions.filter(status='completed').count()
        total_hours = sum(s.duration_minutes for s in sessions.filter(status='completed')) / 60
        
        # Sessions trend (last 3 months vs previous 3 months)
        from django.utils import timezone
        from datetime import timedelta
        now = timezone.now()
        three_months_ago = now - timedelta(days=90)
        six_months_ago = now - timedelta(days=180)
        
        recent = sessions.filter(
            scheduled_at__gte=three_months_ago,
            status='completed'
        ).count()
        previous = sessions.filter(
            scheduled_at__gte=six_months_ago,
            scheduled_at__lt=three_months_ago,
            status='completed'
        ).count()
        
        trend = 'stable'
        if recent > previous:
            trend = 'increasing'
        elif recent < previous:
            trend = 'decreasing'
        
        return Response({
            'mentee_id': str(mentee_id),
            'total_sessions': relation.total_sessions,
            'completed_sessions': completed,
            'total_hours': round(total_hours, 1),
            'started_at': relation.started_at,
            'last_session_at': relation.last_session_at,
            'status': relation.status,
            'trend': trend,
            'recent_sessions_count': recent,
        })
