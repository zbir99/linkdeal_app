"""
Views for the scheduling app.
Handles API endpoints for sessions, availability, and video calls.
"""
import logging
from datetime import datetime, timedelta
from decimal import Decimal

from django.db.models import Sum, Count, Q
from django.utils import timezone
from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from accounts.permissions import IsAuthenticatedAuth0, IsMentor, IsMentee
from accounts.models import MentorProfile, MenteeProfile

from scheduling.models import (
    SessionType,
    MentorAvailability,
    Session,
    SessionAttachment,
)
from scheduling.serializers import (
    SessionTypeSerializer,
    MentorAvailabilitySerializer,
    MentorAvailabilityCreateSerializer,
    PublicMentorAvailabilitySerializer,
    SessionListSerializer,
    SessionDetailSerializer,
    SessionCreateSerializer,
    SessionCancelSerializer,
    SessionNotesUpdateSerializer,
    SessionStatsSerializer,
    SessionChartDataSerializer,
    SessionAttachmentSerializer,
)

logger = logging.getLogger(__name__)


# -------------------------------------------------------------------
# 1. SESSION TYPE VIEWS
# -------------------------------------------------------------------

class SessionTypeListView(generics.ListAPIView):
    """
    GET /scheduling/session-types/
    List all active session types.
    """
    queryset = SessionType.objects.filter(is_active=True)
    serializer_class = SessionTypeSerializer
    permission_classes = [AllowAny]


# -------------------------------------------------------------------
# 2. MENTOR AVAILABILITY VIEWS
# -------------------------------------------------------------------

class MentorAvailabilityListCreateView(generics.ListCreateAPIView):
    """
    GET /scheduling/mentor/availability/
    POST /scheduling/mentor/availability/
    List and create availability slots for the logged-in mentor.
    """
    serializer_class = MentorAvailabilitySerializer
    permission_classes = [IsAuthenticatedAuth0, IsMentor]

    def get_queryset(self):
        mentor = MentorProfile.objects.get(user__auth0_id=self.request.user.auth0_id)
        return MentorAvailability.objects.filter(mentor=mentor)


class MentorAvailabilityDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET/PATCH/DELETE /scheduling/mentor/availability/<id>/
    Retrieve, update or delete a specific availability slot.
    """
    serializer_class = MentorAvailabilitySerializer
    permission_classes = [IsAuthenticatedAuth0, IsMentor]

    def get_queryset(self):
        mentor = MentorProfile.objects.get(user__auth0_id=self.request.user.auth0_id)
        return MentorAvailability.objects.filter(mentor=mentor)


class MentorAvailabilityBulkCreateView(APIView):
    """
    POST /scheduling/mentor/availability/bulk/
    Create multiple availability slots at once.
    """
    permission_classes = [IsAuthenticatedAuth0, IsMentor]

    def post(self, request):
        mentor = MentorProfile.objects.get(user__auth0_id=request.user.auth0_id)
        
        slots = request.data.get('slots', [])
        if not slots:
            return Response(
                {'error': 'No slots provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        created = []
        errors = []
        
        for i, slot_data in enumerate(slots):
            serializer = MentorAvailabilityCreateSerializer(data=slot_data)
            if serializer.is_valid():
                availability = MentorAvailability.objects.create(
                    mentor=mentor,
                    **serializer.validated_data
                )
                created.append(MentorAvailabilitySerializer(availability).data)
            else:
                errors.append({'index': i, 'errors': serializer.errors})
        
        return Response({
            'created': created,
            'errors': errors
        }, status=status.HTTP_201_CREATED if created else status.HTTP_400_BAD_REQUEST)


class PublicMentorAvailabilityView(APIView):
    """
    GET /scheduling/mentors/<id>/availability/
    Get public availability for a mentor (for booking).
    """
    permission_classes = [AllowAny]

    def get(self, request, mentor_id):
        mentor = get_object_or_404(MentorProfile, id=mentor_id, status='approved')
        
        # Get date parameter (optional)
        date_str = request.query_params.get('date')
        
        queryset = MentorAvailability.objects.filter(
            mentor=mentor,
            is_available=True
        )
        
        if date_str:
            try:
                target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
                day_of_week = target_date.weekday()
                
                # Get recurring slots for this day OR specific date slots
                queryset = queryset.filter(
                    Q(is_recurring=True, day_of_week=day_of_week) |
                    Q(is_recurring=False, specific_date=target_date)
                )
            except ValueError:
                return Response(
                    {'error': 'Invalid date format. Use YYYY-MM-DD'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        serializer = PublicMentorAvailabilitySerializer(queryset, many=True)
        return Response(serializer.data)


# -------------------------------------------------------------------
# 3. SESSION VIEWS
# -------------------------------------------------------------------

class SessionListView(generics.ListAPIView):
    """
    GET /scheduling/sessions/
    List sessions for the current user (mentor or mentee).
    """
    serializer_class = SessionListSerializer
    permission_classes = [IsAuthenticatedAuth0]

    def get_queryset(self):
        user = self.request.user
        
        # Determine if user is mentor or mentee
        try:
            mentor = MentorProfile.objects.get(user__auth0_id=user.auth0_id)
            queryset = Session.objects.filter(mentor=mentor)
        except MentorProfile.DoesNotExist:
            try:
                mentee = MenteeProfile.objects.get(user__auth0_id=user.auth0_id)
                queryset = Session.objects.filter(mentee=mentee)
            except MenteeProfile.DoesNotExist:
                return Session.objects.none()
        
        # Apply filters
        status_filter = self.request.query_params.get('status')
        if status_filter:
            if status_filter == 'upcoming':
                queryset = queryset.filter(
                    scheduled_at__gt=timezone.now(),
                    status__in=['pending', 'confirmed']
                )
            else:
                queryset = queryset.filter(status=status_filter)
        
        # Date range filter
        from_date = self.request.query_params.get('from')
        to_date = self.request.query_params.get('to')
        if from_date:
            queryset = queryset.filter(scheduled_at__date__gte=from_date)
        if to_date:
            queryset = queryset.filter(scheduled_at__date__lte=to_date)
        
        # Mentor/Mentee filter (for the other side)
        mentor_id = self.request.query_params.get('mentor_id')
        mentee_id = self.request.query_params.get('mentee_id')
        if mentor_id:
            queryset = queryset.filter(mentor_id=mentor_id)
        if mentee_id:
            queryset = queryset.filter(mentee_id=mentee_id)
        
        return queryset.select_related('mentor', 'mentee', 'session_type')


class SessionCreateView(generics.CreateAPIView):
    """
    POST /scheduling/sessions/
    Create a new session (booking).
    """
    serializer_class = SessionCreateSerializer
    permission_classes = [IsAuthenticatedAuth0, IsMentee]


class SessionDetailView(generics.RetrieveAPIView):
    """
    GET /scheduling/sessions/<id>/
    Get session details.
    """
    serializer_class = SessionDetailSerializer
    permission_classes = [IsAuthenticatedAuth0]

    def get_queryset(self):
        user = self.request.user
        
        # User can only view their own sessions
        try:
            mentor = MentorProfile.objects.get(user__auth0_id=user.auth0_id)
            return Session.objects.filter(mentor=mentor)
        except MentorProfile.DoesNotExist:
            try:
                mentee = MenteeProfile.objects.get(user__auth0_id=user.auth0_id)
                return Session.objects.filter(mentee=mentee)
            except MenteeProfile.DoesNotExist:
                return Session.objects.none()


class SessionCancelView(APIView):
    """
    POST /scheduling/sessions/<id>/cancel/
    Cancel a session.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def post(self, request, pk):
        user = request.user
        
        # Get session and verify ownership
        try:
            mentor = MentorProfile.objects.get(user__auth0_id=user.auth0_id)
            session = Session.objects.get(id=pk, mentor=mentor)
            cancelled_by = mentor.user
        except MentorProfile.DoesNotExist:
            try:
                mentee = MenteeProfile.objects.get(user__auth0_id=user.auth0_id)
                session = Session.objects.get(id=pk, mentee=mentee)
                cancelled_by = mentee.user
            except (MenteeProfile.DoesNotExist, Session.DoesNotExist):
                return Response(
                    {'error': 'Session not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        serializer = SessionCancelSerializer(
            data=request.data,
            context={'session': session}
        )
        serializer.is_valid(raise_exception=True)
        
        session.status = 'cancelled'
        session.cancelled_at = timezone.now()
        session.cancelled_by = cancelled_by
        session.cancellation_reason = serializer.validated_data.get('reason', '')
        session.save()
        
        return Response({
            'message': 'Session cancelled successfully',
            'session': SessionDetailSerializer(session, context={'request': request}).data
        })


class SessionConfirmView(APIView):
    """
    POST /scheduling/sessions/<id>/confirm/
    Confirm a pending session (mentor only).
    """
    permission_classes = [IsAuthenticatedAuth0, IsMentor]

    def post(self, request, pk):
        mentor = MentorProfile.objects.get(user__auth0_id=request.user.auth0_id)
        session = get_object_or_404(Session, id=pk, mentor=mentor)
        
        if session.status != 'pending':
            return Response(
                {'error': 'Only pending sessions can be confirmed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        session.status = 'confirmed'
        session.save()
        
        return Response({
            'message': 'Session confirmed',
            'session': SessionDetailSerializer(session, context={'request': request}).data
        })


class SessionCompleteView(APIView):
    """
    POST /scheduling/sessions/<id>/complete/
    Mark session as completed (mentor only).
    """
    permission_classes = [IsAuthenticatedAuth0, IsMentor]

    def post(self, request, pk):
        mentor = MentorProfile.objects.get(user__auth0_id=request.user.auth0_id)
        session = get_object_or_404(Session, id=pk, mentor=mentor)
        
        if session.status not in ['confirmed', 'in_progress']:
            return Response(
                {'error': 'Session cannot be marked as completed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        session.status = 'completed'
        session.save()
        
        # Update mentor-mentee relation stats
        from mentoring.models import MentorMenteeRelation
        try:
            relation = MentorMenteeRelation.objects.get(
                mentor=mentor,
                mentee=session.mentee
            )
            relation.update_stats()
        except MentorMenteeRelation.DoesNotExist:
            pass
        
        return Response({
            'message': 'Session marked as completed',
            'session': SessionDetailSerializer(session, context={'request': request}).data
        })


class SessionNotesUpdateView(APIView):
    """
    PATCH /scheduling/sessions/<id>/notes/
    Update session notes.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def patch(self, request, pk):
        user = request.user
        
        try:
            mentor = MentorProfile.objects.get(user__auth0_id=user.auth0_id)
            session = Session.objects.get(id=pk, mentor=mentor)
            is_mentor = True
        except MentorProfile.DoesNotExist:
            try:
                mentee = MenteeProfile.objects.get(user__auth0_id=user.auth0_id)
                session = Session.objects.get(id=pk, mentee=mentee)
                is_mentor = False
            except (MenteeProfile.DoesNotExist, Session.DoesNotExist):
                return Response(
                    {'error': 'Session not found'},
                    status=status.HTTP_404_NOT_FOUND
                )
        
        serializer = SessionNotesUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        if is_mentor and 'mentor_notes' in serializer.validated_data:
            session.mentor_notes = serializer.validated_data['mentor_notes']
        if not is_mentor and 'mentee_notes' in serializer.validated_data:
            session.mentee_notes = serializer.validated_data['mentee_notes']
        if 'objectives' in serializer.validated_data:
            session.objectives = serializer.validated_data['objectives']
        
        session.save()
        
        return Response(SessionDetailSerializer(session, context={'request': request}).data)


# -------------------------------------------------------------------
# 4. SESSION STATS VIEWS
# -------------------------------------------------------------------

class SessionStatsView(APIView):
    """
    GET /scheduling/sessions/stats/
    Get session statistics for the current user.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def get(self, request):
        user = request.user
        is_mentor = False
        
        try:
            mentor = MentorProfile.objects.get(user__auth0_id=user.auth0_id)
            sessions = Session.objects.filter(mentor=mentor)
            is_mentor = True
        except MentorProfile.DoesNotExist:
            try:
                mentee = MenteeProfile.objects.get(user__auth0_id=user.auth0_id)
                sessions = Session.objects.filter(mentee=mentee)
            except MenteeProfile.DoesNotExist:
                return Response({'error': 'User profile not found'}, status=404)
        
        now = timezone.now()
        this_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        total = sessions.count()
        completed = sessions.filter(status='completed').count()
        upcoming = sessions.filter(
            scheduled_at__gt=now,
            status__in=['pending', 'confirmed']
        ).count()
        cancelled = sessions.filter(status='cancelled').count()
        
        # Total hours
        total_minutes = sessions.filter(status='completed').aggregate(
            total=Sum('duration_minutes')
        )['total'] or 0
        total_hours = Decimal(total_minutes) / 60
        
        # This month stats
        this_month = sessions.filter(scheduled_at__gte=this_month_start)
        this_month_count = this_month.filter(status='completed').count()
        this_month_minutes = this_month.filter(status='completed').aggregate(
            total=Sum('duration_minutes')
        )['total'] or 0
        this_month_hours = Decimal(this_month_minutes) / 60
        
        # Average rating (from sessions)
        from django.db.models import Avg
        avg_rating_result = sessions.filter(rating__isnull=False).aggregate(avg=Avg('rating'))['avg']
        avg_rating = round(avg_rating_result, 1) if avg_rating_result else None
        
        # Total earned (from completed sessions)
        total_earned = sessions.filter(status='completed').aggregate(
            total=Sum('price')
        )['total'] or Decimal('0.00')
        
        data = {
            'total_sessions': total,
            'completed_sessions': completed,
            'upcoming_sessions': upcoming,
            'cancelled_sessions': cancelled,
            'total_hours': round(total_hours, 1),
            'this_month_sessions': this_month_count,
            'this_month_hours': round(this_month_hours, 1),
            'average_rating': avg_rating,
            'total_earned': total_earned,
        }
        
        return Response(SessionStatsSerializer(data).data)


class SessionChartView(APIView):
    """
    GET /scheduling/sessions/chart/
    Get session chart data with granular breakdown.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def get(self, request):
        from django.db.models.functions import ExtractHour, ExtractDay, ExtractMonth, ExtractWeekDay
        from django.utils import timezone
        
        user = request.user
        period = request.query_params.get('period', 'month')
        
        try:
            mentor = MentorProfile.objects.get(user__auth0_id=user.auth0_id)
            base_qs = Session.objects.filter(mentor=mentor)
        except MentorProfile.DoesNotExist:
            try:
                mentee = MenteeProfile.objects.get(user__auth0_id=user.auth0_id)
                base_qs = Session.objects.filter(mentee=mentee)
            except MenteeProfile.DoesNotExist:
                return Response({'error': 'User profile not found'}, status=404)
        
        now = timezone.now()
        data = []

        if period == 'day':
            # Hourly breakdown for today (00-23)
            today = now.replace(hour=0, minute=0, second=0, microsecond=0)
            qs = base_qs.filter(scheduled_at__date=today.date())
            
            # Aggregate by hour
            stats = qs.annotate(hour=ExtractHour('scheduled_at')).values('hour').annotate(
                count=Count('id'), 
                duration=Sum('duration_minutes')
            )
            stats_map = {s['hour']: s for s in stats}
            
            for h in range(24):
                stat = stats_map.get(h, {'count': 0, 'duration': 0})
                data.append({
                    'label': f'{h:02d}:00',
                    'sessions': stat['count'],
                    'hours': round(Decimal(stat['duration'] or 0) / 60, 1)
                })

        elif period == 'week':
            # Daily breakdown for current week (Mon-Sun)
            # Find start of week (Monday)
            start_of_week = now - timedelta(days=now.weekday())
            start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_week = start_of_week + timedelta(days=7)
            
            qs = base_qs.filter(scheduled_at__gte=start_of_week, scheduled_at__lt=end_of_week)
            
            # ExtractWeekDay: 1=Sunday, 2=Monday... 7=Saturday (Django default)
            # But we want 0=Monday... 6=Sunday for python logic
            # Let's just key by date to be safe
            stats = qs.annotate(day=ExtractDay('scheduled_at')).values('scheduled_at__date').annotate(
                count=Count('id'),
                duration=Sum('duration_minutes')
            )
            stats_map = {s['scheduled_at__date']: s for s in stats}
            
            days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            for i in range(7):
                day_date = (start_of_week + timedelta(days=i)).date()
                stat = stats_map.get(day_date, {'count': 0, 'duration': 0})
                data.append({
                    'label': days[i],
                    'sessions': stat['count'],
                    'hours': round(Decimal(stat['duration'] or 0) / 60, 1)
                })

        elif period == 'month':
            # Daily breakdown for current month (1-31)
            start_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            if start_of_month.month == 12:
                end_of_month = start_of_month.replace(year=now.year + 1, month=1)
            else:
                end_of_month = start_of_month.replace(month=now.month + 1)
            
            qs = base_qs.filter(scheduled_at__gte=start_of_month, scheduled_at__lt=end_of_month)
            
            stats = qs.annotate(day=ExtractDay('scheduled_at')).values('day').annotate(
                count=Count('id'),
                duration=Sum('duration_minutes')
            )
            stats_map = {s['day']: s for s in stats}
            
            # Days in month
            import calendar
            _, num_days = calendar.monthrange(now.year, now.month)
            
            for d in range(1, num_days + 1):
                stat = stats_map.get(d, {'count': 0, 'duration': 0})
                data.append({
                    'label': str(d),
                    'sessions': stat['count'],
                    'hours': round(Decimal(stat['duration'] or 0) / 60, 1)
                })

        elif period == 'year':
            # Monthly breakdown for current year (Jan-Dec)
            start_of_year = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
            end_of_year = start_of_year.replace(year=now.year + 1)
            
            qs = base_qs.filter(scheduled_at__gte=start_of_year, scheduled_at__lt=end_of_year)
            
            stats = qs.annotate(month=ExtractMonth('scheduled_at')).values('month').annotate(
                count=Count('id'),
                duration=Sum('duration_minutes')
            )
            stats_map = {s['month']: s for s in stats}
            
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            for i in range(1, 13):
                stat = stats_map.get(i, {'count': 0, 'duration': 0})
                data.append({
                    'label': months[i-1],
                    'sessions': stat['count'],
                    'hours': round(Decimal(stat['duration'] or 0) / 60, 1)
                })

        return Response(data)


# -------------------------------------------------------------------
# 5. VIDEO CALL & RATING VIEWS
# -------------------------------------------------------------------

class SessionRateView(APIView):
    """
    POST /scheduling/sessions/<id>/rate/
    Submit rating and feedback for a session.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def post(self, request, pk):
        try:
            mentee = MenteeProfile.objects.get(user__auth0_id=request.user.auth0_id)
            session = Session.objects.get(id=pk, mentee=mentee)
        except (MenteeProfile.DoesNotExist, Session.DoesNotExist):
            return Response({'error': 'Session not found or access denied'}, status=404)

        if session.status != 'completed':
            # Allow rating if it's past the scheduled time? 
            # Or just update status to completed if not already?
            # For now, let's allow it but maybe warn.
            # Actually, user might rate after call.
            pass

        from scheduling.serializers import SessionRateSerializer
        serializer = SessionRateSerializer(session, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)


class SessionVideoRoomView(APIView):
    """
    GET /scheduling/sessions/<id>/video-room/
    Get or create video room for a session.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def get(self, request, pk):
        try:
            user = request.user
            
            # 1. Resolve Session and User Role
            try:
                mentor = MentorProfile.objects.get(user__auth0_id=user.auth0_id)
                session = Session.objects.get(id=pk, mentor=mentor)
            except MentorProfile.DoesNotExist:
                try:
                    mentee = MenteeProfile.objects.get(user__auth0_id=user.auth0_id)
                    session = Session.objects.get(id=pk, mentee=mentee)
                except (MenteeProfile.DoesNotExist, Session.DoesNotExist):
                    return Response({'error': 'Session not found'}, status=404)
            
            # 2. Check Session Status (Allow pending for testing)
            if session.status not in ['confirmed', 'in_progress', 'pending']:
                return Response(
                    {'error': 'Session is not ready for video call'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 3. Check for Existing Room
            if session.whereby_room_url:
                try:
                    # Determine appropriate URL
                    mentor = MentorProfile.objects.get(user__auth0_id=user.auth0_id)
                    # If user is the mentor, return host URL if available
                    room_url = session.whereby_host_room_url or session.whereby_room_url
                except MentorProfile.DoesNotExist:
                    # If user is mentee, return participant URL
                    room_url = session.whereby_room_url

                return Response({
                    'room_url': room_url,
                    'room_id': session.whereby_meeting_id or session.video_room_id,
                    'provider': 'whereby',
                    'session_id': str(session.id),
                })

            # 4. Create New Whereby Room
            from scheduling.services import WherebyService
            
            meeting = WherebyService.create_meeting(session)
            
            if meeting:
                # Success - update session
                session.whereby_meeting_id = meeting.get('meetingId')
                session.whereby_room_url = meeting.get('roomUrl')
                session.whereby_host_room_url = meeting.get('hostRoomUrl')
                session.video_provider = 'whereby'
                session.video_room_id = meeting.get('meetingId')
                session.save()
                
                # Determine URL for response
                try:
                    mentor = MentorProfile.objects.get(user__auth0_id=user.auth0_id)
                    room_url = session.whereby_host_room_url
                except MentorProfile.DoesNotExist:
                    room_url = session.whereby_room_url

                return Response({
                    'room_url': room_url,
                    'room_id': session.whereby_meeting_id,
                    'provider': 'whereby',
                    'session_id': str(session.id),
                })
            else:
                # Fallback to Jitsi
                logger.warning(f"Whereby creation failed for session {session.id}, falling back to Jitsi")
                room_id = session.generate_video_room_id()
                session.video_provider = 'jitsi'
                session.save()
                
                return Response({
                    'room_id': room_id,
                    'provider': 'jitsi',
                    'session_id': str(session.id),
                    'note': 'Video service fallback active'
                })

        except Exception as e:
            import traceback
            logger.error(f"Error in SessionVideoRoomView: {e}")
            return Response({
                'error': str(e),
                'traceback': traceback.format_exc()
            }, status=500)



class SessionStartCallView(APIView):
    """
    POST /scheduling/sessions/<id>/start-call/
    Mark call as started.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def post(self, request, pk):
        user = request.user
        
        try:
            mentor = MentorProfile.objects.get(user__auth0_id=user.auth0_id)
            session = Session.objects.get(id=pk, mentor=mentor)
        except MentorProfile.DoesNotExist:
            try:
                mentee = MenteeProfile.objects.get(user__auth0_id=user.auth0_id)
                session = Session.objects.get(id=pk, mentee=mentee)
            except (MenteeProfile.DoesNotExist, Session.DoesNotExist):
                return Response({'error': 'Session not found'}, status=404)
        
        if not session.call_started_at:
            session.call_started_at = timezone.now()
            session.status = 'in_progress'
            session.save()
        
        return Response({'message': 'Call started', 'started_at': session.call_started_at})


class SessionEndCallView(APIView):
    """
    POST /scheduling/sessions/<id>/end-call/
    Mark call as ended.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def post(self, request, pk):
        user = request.user
        
        try:
            mentor = MentorProfile.objects.get(user__auth0_id=user.auth0_id)
            session = Session.objects.get(id=pk, mentor=mentor)
        except MentorProfile.DoesNotExist:
            try:
                mentee = MenteeProfile.objects.get(user__auth0_id=user.auth0_id)
                session = Session.objects.get(id=pk, mentee=mentee)
            except (MenteeProfile.DoesNotExist, Session.DoesNotExist):
                return Response({'error': 'Session not found'}, status=404)
        
        session.call_ended_at = timezone.now()
        session.save()
        
        return Response({'message': 'Call ended', 'ended_at': session.call_ended_at})


# -------------------------------------------------------------------
# 6. ATTACHMENT VIEWS
# -------------------------------------------------------------------

class SessionAttachmentListCreateView(generics.ListCreateAPIView):
    """
    GET/POST /scheduling/sessions/<session_id>/attachments/
    List and upload attachments for a session.
    """
    serializer_class = SessionAttachmentSerializer
    permission_classes = [IsAuthenticatedAuth0]

    def get_queryset(self):
        session_id = self.kwargs['session_id']
        return SessionAttachment.objects.filter(session_id=session_id)

    def perform_create(self, serializer):
        session_id = self.kwargs['session_id']
        session = get_object_or_404(Session, id=session_id)
        
        # Verify user is participant
        user = self.request.user
        try:
            mentor = MentorProfile.objects.get(user__auth0_id=user.auth0_id)
            if session.mentor != mentor:
                raise PermissionError()
            uploader = mentor.user
        except MentorProfile.DoesNotExist:
            try:
                mentee = MenteeProfile.objects.get(user__auth0_id=user.auth0_id)
                if session.mentee != mentee:
                    raise PermissionError()
                uploader = mentee.user
            except MenteeProfile.DoesNotExist:
                raise PermissionError()
        
        file = self.request.FILES.get('file')
        serializer.save(
            session=session,
            uploaded_by=uploader,
            file=file,
            filename=file.name,
            file_type=file.content_type,
            file_size=file.size
        )


class SessionAttachmentDeleteView(generics.DestroyAPIView):
    """
    DELETE /scheduling/sessions/<session_id>/attachments/<id>/
    Delete an attachment.
    """
    serializer_class = SessionAttachmentSerializer
    permission_classes = [IsAuthenticatedAuth0]

    def get_queryset(self):
        session_id = self.kwargs['session_id']
        return SessionAttachment.objects.filter(session_id=session_id)
