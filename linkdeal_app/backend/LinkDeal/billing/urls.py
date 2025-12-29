"""
Billing URL configuration.
"""
from django.urls import path
from billing.views import (
    CreatePaymentView,
    ConfirmPaymentView,
    PaymentListView,
    PaymentDetailView,
    RequestPayoutView,
    PayoutListView,
)

urlpatterns = [
    path('payments/', CreatePaymentView.as_view(), name='create-payment'),
    path('payments/list/', PaymentListView.as_view(), name='list-payments'),
    path('payments/<uuid:payment_id>/', PaymentDetailView.as_view(), name='payment-detail'),
    path('payments/<uuid:payment_id>/confirm/', ConfirmPaymentView.as_view(), name='confirm-payment'),
    
    # Payouts
    path('payouts/', PayoutListView.as_view(), name='list-payouts'),
    path('payouts/request/', RequestPayoutView.as_view(), name='request-payout'),
]
