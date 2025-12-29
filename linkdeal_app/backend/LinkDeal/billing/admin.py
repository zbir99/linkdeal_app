from django.contrib import admin
from billing.models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['id', 'mentee', 'mentor', 'amount', 'currency', 'status', 'created_at']
    list_filter = ['status', 'currency', 'payment_method']
    search_fields = ['mentee__full_name', 'mentor__full_name', 'reference']
    readonly_fields = ['id', 'platform_fee', 'mentor_payout', 'created_at', 'completed_at']
    ordering = ['-created_at']
