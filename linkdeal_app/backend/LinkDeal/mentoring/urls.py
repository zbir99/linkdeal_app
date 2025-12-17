"""
URL configuration for the mentoring app.
"""
from django.urls import path
from mentoring import views

urlpatterns = [
    # Categories
    path('categories/', views.MentorCategoryListView.as_view(), name='mentor-categories'),

    # Public Mentor Listing
    path('mentors/', views.MentorPublicListView.as_view(), name='mentor-list'),
    path('mentors/<uuid:id>/', views.MentorPublicDetailView.as_view(), name='mentor-detail'),
    path('mentors/<uuid:mentor_id>/reviews/', views.MentorReviewsView.as_view(), name='mentor-reviews'),
    path('mentors/<uuid:mentor_id>/is-favorite/', views.MentorIsFavoriteView.as_view(), name='mentor-is-favorite'),

    # Review Tags
    path('review-tags/', views.ReviewTagListView.as_view(), name='review-tags'),

    # Reviews
    path('reviews/', views.ReviewCreateView.as_view(), name='review-create'),
    path('reviews/<uuid:pk>/respond/', views.ReviewResponseView.as_view(), name='review-respond'),

    # Mentor's received reviews
    path('mentor/reviews/', views.MentorReceivedReviewsView.as_view(), name='mentor-received-reviews'),
    path('mentor/rating/', views.MentorRatingView.as_view(), name='mentor-rating'),

    # Favorites (for mentees)
    path('favorites/', views.FavoriteListView.as_view(), name='favorite-list'),
    path('favorites/add/', views.FavoriteCreateView.as_view(), name='favorite-create'),
    path('favorites/<uuid:mentor_id>/', views.FavoriteDeleteView.as_view(), name='favorite-delete'),

    # Mentor's Mentees
    path('mentor/mentees/', views.MentorMenteesListView.as_view(), name='mentor-mentees-list'),
    path('mentor/mentees/stats/', views.MentorMenteesStatsView.as_view(), name='mentor-mentees-stats'),
    path('mentor/mentees/<uuid:id>/', views.MentorMenteeDetailView.as_view(), name='mentor-mentee-detail'),

    # Mentee Progress
    path('mentees/<uuid:mentee_id>/progress/', views.MenteeProgressView.as_view(), name='mentee-progress'),
]
