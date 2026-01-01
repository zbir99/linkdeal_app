from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from django.db.models import Sum
from django.db import connection
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from core.models import PlatformSettings
from accounts.permissions import IsAuthenticatedAuth0, IsAdmin
from accounts.models import AppUser, MentorProfile, MenteeProfile


class HealthCheckView(APIView):
    """
    Health check endpoint for Docker and load balancers.
    Returns 200 if the service is healthy.
    """
    permission_classes = [AllowAny]
    authentication_classes = []  # No auth required

    def get(self, request):
        """Check if the application is healthy."""
        health_status = {
            "status": "healthy",
            "service": "linkdeal-backend",
            "version": "1.0.0",
        }
        
        # Check database connection
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            health_status["database"] = "connected"
        except Exception as e:
            health_status["database"] = "disconnected"
            health_status["status"] = "unhealthy"
            return Response(health_status, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        return Response(health_status, status=status.HTTP_200_OK)


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
    Returns: total users, active mentors, monthly revenue, pending items, total payments, platform earnings
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

        # Calculate total payments and platform earnings from billing
        total_payments = Decimal('0.00')
        platform_earnings = Decimal('0.00')
        try:
            from billing.models import Payment
            # Get all completed payments
            completed_payments = Payment.objects.filter(status='completed')
            
            # Total of all payments (full amount)
            total_payments_sum = completed_payments.aggregate(total=Sum('amount'))['total']
            if total_payments_sum:
                total_payments = Decimal(str(total_payments_sum))
            
            # Platform earnings (platform fees only, not mentor payouts)
            platform_fees_sum = completed_payments.aggregate(total=Sum('platform_fee'))['total']
            if platform_fees_sum:
                platform_earnings = Decimal(str(platform_fees_sum))
        except Exception:
            pass

        # Format total payments
        if total_payments >= 1000:
            formatted_total_payments = f"${total_payments / 1000:.1f}K"
        else:
            formatted_total_payments = f"${total_payments:.2f}"

        # Format platform earnings
        if platform_earnings >= 1000:
            formatted_platform_earnings = f"${platform_earnings / 1000:.1f}K"
        else:
            formatted_platform_earnings = f"${platform_earnings:.2f}"

        return Response({
            "total_users": total_users,
            "active_mentors": active_mentors,
            "monthly_revenue": formatted_revenue,
            "pending_items": pending_mentors,
            "total_payments": formatted_total_payments,
            "platform_earnings": formatted_platform_earnings,
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

        # Calculate Revenue Trend (from billing payments - platform earnings)
        revenue_data = []
        revenue_labels = []
        try:
            from billing.models import Payment
            for p in periods:
                # Get completed payments in this period
                completed_payments = Payment.objects.filter(
                    status='completed',
                    completed_at__gte=p['start'],
                    completed_at__lte=p['end']
                )
                # Sum platform fees (platform earnings, not total payments)
                total_fees = completed_payments.aggregate(total=Sum('platform_fee'))['total']
                revenue_data.append(float(total_fees) if total_fees else 0)
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
