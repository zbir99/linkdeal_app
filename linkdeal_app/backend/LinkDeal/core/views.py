from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from core.models import PlatformSettings
from accounts.permissions import IsAuthenticatedAuth0, IsAdmin
from accounts.models import AppUser, MentorProfile, MenteeProfile


class PlatformSettingsView(APIView):
    """
    GET: Public access to platform settings (min price, currency)
    PATCH: Admin only - update platform settings
    """

    def get_permissions(self):
        if self.request.method == 'GET':
            return []  # Public access for GET
        return [IsAuthenticatedAuth0(), IsAdmin()]

    def get(self, request):
        """Get current platform settings."""
        settings = PlatformSettings.get_settings()
        return Response({
            "platform_fee_percentage": str(settings.platform_fee_percentage),
            "min_session_price": str(settings.min_session_price),
            "currency": settings.currency,
        })

    def patch(self, request):
        """Update platform settings (admin only)."""
        settings = PlatformSettings.get_settings()

        if 'platform_fee_percentage' in request.data:
            settings.platform_fee_percentage = request.data['platform_fee_percentage']
        if 'min_session_price' in request.data:
            settings.min_session_price = request.data['min_session_price']
        if 'currency' in request.data:
            settings.currency = request.data['currency']

        settings.save()

        return Response({
            "success": True,
            "message": "Platform settings updated successfully.",
            "data": {
                "platform_fee_percentage": str(settings.platform_fee_percentage),
                "min_session_price": str(settings.min_session_price),
                "currency": settings.currency,
            }
        })


class AdminDashboardStatsView(APIView):
    """
    GET: Admin dashboard statistics
    Returns: total users, active mentors, monthly revenue, pending items
    """
    permission_classes = [IsAuthenticatedAuth0, IsAdmin]

    def get(self, request):
        # Count all registered users excluding admins and super admins
        total_users = AppUser.objects.exclude(role__in=['admin', 'super_admin']).count()

        # Active mentors (approved status)
        active_mentors = MentorProfile.objects.filter(status='approved').count()

        # Pending items (pending mentor applications)
        pending_mentors = MentorProfile.objects.filter(status='pending').count()

        # Monthly revenue calculation
        # Try to calculate from completed sessions in the last 30 days
        monthly_revenue = Decimal('0.00')
        try:
            from scheduling.models import Session
            thirty_days_ago = timezone.now() - timedelta(days=30)
            completed_sessions = Session.objects.filter(
                status='completed',
                start_time__gte=thirty_days_ago
            )
            # Sum up session amounts or calculate from session_rate
            total_amount = completed_sessions.aggregate(total=Sum('amount'))['total']
            if total_amount:
                monthly_revenue = Decimal(str(total_amount))
        except Exception:
            # If Session model doesn't exist or has issues, return 0
            pass

        # Format revenue
        if monthly_revenue >= 1000:
            formatted_revenue = f"€{monthly_revenue / 1000:.1f}K"
        else:
            formatted_revenue = f"€{monthly_revenue:.0f}"

        return Response({
            "total_users": total_users,
            "active_mentors": active_mentors,
            "monthly_revenue": formatted_revenue,
            "pending_items": pending_mentors,
        })


class AdminDashboardChartsView(APIView):
    """
    GET: Admin dashboard chart data (User Growth & Revenue Trend)
    Query params: period=day|month|year (default: month)
    """
    permission_classes = [IsAuthenticatedAuth0, IsAdmin]

    def get(self, request):
        period = request.query_params.get('period', 'month')
        
        now = timezone.now()
        
        # Get time periods based on filter
        if period == 'day':
            # Last 7 days
            periods = []
            for i in range(6, -1, -1):
                day = now - timedelta(days=i)
                periods.append({
                    'start': day.replace(hour=0, minute=0, second=0, microsecond=0),
                    'end': day.replace(hour=23, minute=59, second=59, microsecond=999999),
                    'label': day.strftime('%a')  # Mon, Tue, etc.
                })
        elif period == 'year':
            # Last 6 years
            periods = []
            for i in range(5, -1, -1):
                year = now.year - i
                periods.append({
                    'start': timezone.make_aware(timezone.datetime(year, 1, 1)),
                    'end': timezone.make_aware(timezone.datetime(year, 12, 31, 23, 59, 59)),
                    'label': str(year)
                })
        else:  # month (default)
            # Last 6 months
            periods = []
            for i in range(5, -1, -1):
                month_date = now - timedelta(days=30 * i)
                periods.append({
                    'start': month_date.replace(day=1, hour=0, minute=0, second=0, microsecond=0),
                    'end': month_date.replace(hour=23, minute=59, second=59, microsecond=999999),
                    'label': month_date.strftime('%b')  # Jan, Feb, etc.
                })

        # Calculate User Growth (new users registered in each period)
        user_growth_data = []
        user_growth_labels = []
        for p in periods:
            mentor_count = MentorProfile.objects.filter(
                user__created_at__gte=p['start'],
                user__created_at__lte=p['end']
            ).count()
            mentee_count = MenteeProfile.objects.filter(
                user__created_at__gte=p['start'],
                user__created_at__lte=p['end']
            ).count()
            user_growth_data.append(mentor_count + mentee_count)
            user_growth_labels.append(p['label'])

        # Calculate Revenue Trend
        revenue_data = []
        revenue_labels = []
        try:
            from scheduling.models import Session
            for p in periods:
                completed_sessions = Session.objects.filter(
                    status='completed',
                    start_time__gte=p['start'],
                    start_time__lte=p['end']
                )
                total_amount = completed_sessions.aggregate(total=Sum('amount'))['total']
                revenue_data.append(float(total_amount) if total_amount else 0)
                revenue_labels.append(p['label'])
        except Exception:
            revenue_data = [0] * len(periods)
            revenue_labels = [p['label'] for p in periods]

        # Calculate max values for Y-axis ticks
        max_users = max(user_growth_data) if user_growth_data and max(user_growth_data) > 0 else 100
        max_revenue = max(revenue_data) if revenue_data and max(revenue_data) > 0 else 1000

        # Generate Y-axis ticks
        def generate_y_ticks(max_val):
            if max_val == 0:
                return ['0', '25', '50', '75', '100']
            step = max_val / 3
            return [str(int(step * i)) for i in range(4)]

        return Response({
            "user_growth": {
                "data": user_growth_data,
                "labels": user_growth_labels,
                "y_ticks": generate_y_ticks(max_users),
            },
            "revenue_trend": {
                "data": revenue_data,
                "labels": revenue_labels,
                "y_ticks": generate_y_ticks(max_revenue),
            },
            "period": period,
        })
