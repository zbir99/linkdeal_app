from django.urls import path
from core.views import PlatformSettingsView, AdminDashboardStatsView, AdminDashboardChartsView

urlpatterns = [
    path('settings/platform/', PlatformSettingsView.as_view(), name='platform-settings'),
    path('admin/dashboard/stats/', AdminDashboardStatsView.as_view(), name='admin-dashboard-stats'),
    path('admin/dashboard/charts/', AdminDashboardChartsView.as_view(), name='admin-dashboard-charts'),
]
