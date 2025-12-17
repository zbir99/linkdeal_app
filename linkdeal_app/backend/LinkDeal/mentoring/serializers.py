"""
Serializers for the mentoring app.
Handles serialization of mentor listings, reviews, favorites, and relations.
"""
from rest_framework import serializers
from django.db.models import Avg, Count
from django.utils import timezone

from mentoring.models import (
    MentorCategory,
    MentorCategoryAssignment,
    MentorMenteeRelation,
    Review,
    MentorFavorite,
    ReviewTag,
)
from accounts.models import MentorProfile, MenteeProfile


# -------------------------------------------------------------------
# 1. CATEGORY SERIALIZERS
# -------------------------------------------------------------------

class MentorCategorySerializer(serializers.ModelSerializer):
    """Serializer for mentor categories."""
    
    subcategories = serializers.SerializerMethodField()
    mentor_count = serializers.SerializerMethodField()
    
    class Meta:
        model = MentorCategory
        fields = [
            'id', 'name', 'slug', 'description', 'icon',
            'is_active', 'display_order', 'subcategories', 'mentor_count'
        ]
    
    def get_subcategories(self, obj):
        subcats = obj.subcategories.filter(is_active=True)
        return MentorCategorySerializer(subcats, many=True, context=self.context).data
    
    def get_mentor_count(self, obj):
        return obj.mentor_assignments.filter(mentor__status='approved').count()


# -------------------------------------------------------------------
# 2. REVIEW SERIALIZERS
# -------------------------------------------------------------------

class ReviewTagSerializer(serializers.ModelSerializer):
    """Serializer for review tags."""
    
    class Meta:
        model = ReviewTag
        fields = ['id', 'name', 'slug', 'icon', 'is_positive']


class ReviewMenteeSerializer(serializers.ModelSerializer):
    """Compact mentee info for review display."""
    
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = MenteeProfile
        fields = ['id', 'full_name', 'profile_picture_url']
    
    def get_profile_picture_url(self, obj):
        request = self.context.get('request')
        if obj.profile_picture and request:
            return request.build_absolute_uri(obj.profile_picture.url)
        return None


class ReviewListSerializer(serializers.ModelSerializer):
    """Serializer for listing reviews."""
    
    mentee = ReviewMenteeSerializer(read_only=True)
    session_date = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = [
            'id', 'mentee', 'rating', 'comment', 'tags',
            'mentor_response', 'responded_at',
            'session_date', 'created_at'
        ]
    
    def get_session_date(self, obj):
        return obj.session.scheduled_at.date().isoformat() if obj.session else None


class ReviewCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a review after session."""
    
    session_id = serializers.UUIDField(write_only=True)
    
    class Meta:
        model = Review
        fields = ['session_id', 'rating', 'comment', 'tags']
    
    def validate_session_id(self, value):
        from scheduling.models import Session
        try:
            session = Session.objects.get(id=value, status='completed')
        except Session.DoesNotExist:
            raise serializers.ValidationError('Session not found or not completed.')
        
        # Check if review already exists
        if hasattr(session, 'review'):
            raise serializers.ValidationError('Review already exists for this session.')
        
        # Check if user is the mentee of this session
        request = self.context.get('request')
        if session.mentee.user.auth0_id != request.user.auth0_id:
            raise serializers.ValidationError('You can only review your own sessions.')
        
        return session
    
    def create(self, validated_data):
        session = validated_data.pop('session_id')
        
        review = Review.objects.create(
            session=session,
            mentor=session.mentor,
            mentee=session.mentee,
            **validated_data
        )
        
        return review


class ReviewResponseSerializer(serializers.Serializer):
    """Serializer for mentor responding to a review."""
    
    response = serializers.CharField(max_length=2000)
    
    def validate(self, data):
        review = self.context.get('review')
        request = self.context.get('request')
        
        # Check if user is the mentor of this review
        if review.mentor.user.auth0_id != request.user.auth0_id:
            raise serializers.ValidationError('You can only respond to reviews about you.')
        
        return data


# -------------------------------------------------------------------
# 3. FAVORITE SERIALIZERS
# -------------------------------------------------------------------

class MentorForFavoriteSerializer(serializers.ModelSerializer):
    """Mentor info for favorites list."""
    
    profile_picture_url = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    
    class Meta:
        model = MentorProfile
        fields = [
            'id', 'full_name', 'professional_title', 'location',
            'profile_picture_url', 'skills', 'average_rating', 'reviews_count'
        ]
    
    def get_profile_picture_url(self, obj):
        request = self.context.get('request')
        if obj.profile_picture and request:
            return request.build_absolute_uri(obj.profile_picture.url)
        return None
    
    def get_average_rating(self, obj):
        avg = obj.reviews_received.filter(is_public=True, is_approved=True).aggregate(
            avg=Avg('rating')
        )['avg']
        return round(avg, 1) if avg else None
    
    def get_reviews_count(self, obj):
        return obj.reviews_received.filter(is_public=True, is_approved=True).count()


class FavoriteListSerializer(serializers.ModelSerializer):
    """Serializer for listing favorites."""
    
    mentor = MentorForFavoriteSerializer(read_only=True)
    
    class Meta:
        model = MentorFavorite
        fields = ['id', 'mentor', 'created_at']


class FavoriteCreateSerializer(serializers.Serializer):
    """Serializer for adding a favorite."""
    
    mentor_id = serializers.UUIDField()
    
    def validate_mentor_id(self, value):
        try:
            mentor = MentorProfile.objects.get(id=value, status='approved')
            return mentor
        except MentorProfile.DoesNotExist:
            raise serializers.ValidationError('Mentor not found.')
    
    def create(self, validated_data):
        request = self.context.get('request')
        mentee = MenteeProfile.objects.get(user__auth0_id=request.user.auth0_id)
        mentor = validated_data['mentor_id']
        
        favorite, created = MentorFavorite.objects.get_or_create(
            mentee=mentee,
            mentor=mentor
        )
        
        if not created:
            raise serializers.ValidationError({'mentor_id': 'Already in favorites.'})
        
        return favorite


# -------------------------------------------------------------------
# 4. MENTOR-MENTEE RELATION SERIALIZERS
# -------------------------------------------------------------------

class RelationMenteeSerializer(serializers.ModelSerializer):
    """Mentee info for relation display."""
    
    profile_picture_url = serializers.SerializerMethodField()
    
    class Meta:
        model = MenteeProfile
        fields = [
            'id', 'full_name', 'email', 'field_of_study', 
            'country', 'profile_picture_url'
        ]
    
    def get_profile_picture_url(self, obj):
        request = self.context.get('request')
        if obj.profile_picture and request:
            return request.build_absolute_uri(obj.profile_picture.url)
        return None


class MentorMenteeRelationListSerializer(serializers.ModelSerializer):
    """Serializer for listing mentor's mentees."""
    
    mentee = RelationMenteeSerializer(read_only=True)
    
    class Meta:
        model = MentorMenteeRelation
        fields = [
            'id', 'mentee', 'status',
            'total_sessions', 'completed_sessions', 'total_hours',
            'last_session_at', 'started_at'
        ]


class MentorMenteeRelationDetailSerializer(serializers.ModelSerializer):
    """Detailed relation serializer with notes."""
    
    mentee = RelationMenteeSerializer(read_only=True)
    recent_sessions = serializers.SerializerMethodField()
    
    class Meta:
        model = MentorMenteeRelation
        fields = [
            'id', 'mentee', 'status',
            'total_sessions', 'completed_sessions', 'total_hours',
            'mentor_notes', 'last_session_at', 'started_at', 'ended_at',
            'recent_sessions'
        ]
    
    def get_recent_sessions(self, obj):
        from scheduling.models import Session
        from scheduling.serializers import SessionListSerializer
        
        sessions = Session.objects.filter(
            mentor=obj.mentor,
            mentee=obj.mentee
        ).order_by('-scheduled_at')[:5]
        
        return SessionListSerializer(sessions, many=True, context=self.context).data


class MentorMenteeRelationUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating relation (notes, status)."""
    
    class Meta:
        model = MentorMenteeRelation
        fields = ['status', 'mentor_notes']


class MentorMenteesStatsSerializer(serializers.Serializer):
    """Stats for mentor's mentees."""
    
    total_mentees = serializers.IntegerField()
    active_mentees = serializers.IntegerField()
    paused_mentees = serializers.IntegerField()
    total_sessions = serializers.IntegerField()
    total_hours = serializers.DecimalField(max_digits=8, decimal_places=1)


# -------------------------------------------------------------------
# 5. PUBLIC MENTOR LISTING SERIALIZERS
# -------------------------------------------------------------------

class MentorPublicListSerializer(serializers.ModelSerializer):
    """Public mentor listing with ratings and category info."""
    
    profile_picture_url = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.SerializerMethodField()
    categories = serializers.SerializerMethodField()
    is_favorite = serializers.SerializerMethodField()
    
    class Meta:
        model = MentorProfile
        fields = [
            'id', 'full_name', 'professional_title', 'location', 'country',
            'profile_picture_url', 'bio', 'skills', 'languages',
            'average_rating', 'reviews_count', 'categories', 'is_favorite'
        ]
    
    def get_profile_picture_url(self, obj):
        request = self.context.get('request')
        if obj.profile_picture and request:
            return request.build_absolute_uri(obj.profile_picture.url)
        return None
    
    def get_average_rating(self, obj):
        avg = obj.reviews_received.filter(is_public=True, is_approved=True).aggregate(
            avg=Avg('rating')
        )['avg']
        return round(avg, 1) if avg else None
    
    def get_reviews_count(self, obj):
        return obj.reviews_received.filter(is_public=True, is_approved=True).count()
    
    def get_categories(self, obj):
        assignments = obj.category_assignments.select_related('category').filter(
            category__is_active=True
        )
        return [
            {
                'id': a.category.id,
                'name': a.category.name,
                'slug': a.category.slug,
                'is_primary': a.is_primary
            }
            for a in assignments
        ]
    
    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        
        try:
            mentee = MenteeProfile.objects.get(user__auth0_id=request.user.auth0_id)
            return MentorFavorite.objects.filter(mentee=mentee, mentor=obj).exists()
        except MenteeProfile.DoesNotExist:
            return False


class MentorPublicDetailSerializer(MentorPublicListSerializer):
    """Detailed public mentor profile."""
    
    cv_url = serializers.SerializerMethodField()
    recent_reviews = serializers.SerializerMethodField()
    
    class Meta(MentorPublicListSerializer.Meta):
        fields = MentorPublicListSerializer.Meta.fields + [
            'linkedin_url', 'cv_url', 'recent_reviews', 'created_at'
        ]
    
    def get_cv_url(self, obj):
        request = self.context.get('request')
        if obj.cv and request:
            return request.build_absolute_uri(obj.cv.url)
        return None
    
    def get_recent_reviews(self, obj):
        reviews = obj.reviews_received.filter(
            is_public=True, is_approved=True
        ).order_by('-created_at')[:5]
        return ReviewListSerializer(reviews, many=True, context=self.context).data


# -------------------------------------------------------------------
# 6. MENTOR RATING STATS
# -------------------------------------------------------------------

class MentorRatingSerializer(serializers.Serializer):
    """Mentor's rating statistics."""
    
    average_rating = serializers.DecimalField(max_digits=3, decimal_places=2)
    total_reviews = serializers.IntegerField()
    rating_distribution = serializers.DictField()
    featured_reviews_count = serializers.IntegerField()
