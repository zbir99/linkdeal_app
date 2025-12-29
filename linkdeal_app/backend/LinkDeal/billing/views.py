import logging
from decimal import Decimal
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.db import transaction

from accounts.permissions import IsAuthenticatedAuth0
from accounts.models import AppUser, MenteeProfile, MentorProfile
from core.models import PlatformSettings
from billing.models import Payment, Payout
from billing.serializers import (
    PaymentSerializer,
    CreatePaymentSerializer,
    ConfirmPaymentSerializer,
    PaymentHistorySerializer,
    PayoutSerializer,
    RequestPayoutSerializer,
)
from billing.email_service import (
    send_payment_confirmation_email,
    send_new_booking_email,
    send_payout_processed_email
)

logger = logging.getLogger(__name__)


class CreatePaymentView(APIView):
    """
    POST /billing/payments/
    Create a payment for a session.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def post(self, request):
        serializer = CreatePaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        payment = serializer.save()
        
        logger.info(f"Payment created: {payment.id} for session {payment.session.id}")
        
        return Response(
            {
                "success": True,
                "message": "Payment created successfully",
                "data": PaymentSerializer(payment).data,
            },
            status=status.HTTP_201_CREATED,
        )


class ConfirmPaymentView(APIView):
    """
    POST /billing/payments/<id>/confirm/
    Confirm a payment. In sandbox mode, always succeeds immediately.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def post(self, request, payment_id):
        try:
            payment = Payment.objects.get(id=payment_id)
        except Payment.DoesNotExist:
            return Response(
                {"success": False, "message": "Payment not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        if payment.status == 'completed':
            return Response(
                {"success": True, "message": "Payment already completed"},
                status=status.HTTP_200_OK,
            )
        
        if payment.status not in ['pending']:
            return Response(
                {"success": False, "message": f"Cannot confirm payment with status: {payment.status}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        serializer = ConfirmPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Update reference if provided
        if serializer.validated_data.get('reference'):
            payment.reference = serializer.validated_data['reference']
        
        # 1. Add Funds to Platform Wallet (Holding)
        settings = PlatformSettings.get_settings()
        settings.wallet_balance += payment.amount
        settings.save()

        # 2. Mark Payment Completed
        payment.mark_completed()
        
        # Note: We do NOT credit mentor wallet here. 
        # Funds are held in Platform Wallet until session is completed.
        # This is handled by billing.signals.handle_session_completion
        
        # 3. Send Notifications
        try:
            # To Mentee
            send_payment_confirmation_email(
                mentee_email=payment.mentee.user.email,
                mentee_name=payment.mentee.full_name,
                amount=payment.amount,
                currency=payment.currency,
                reference=payment.reference or "N/A"
            )
            # To Mentor
            send_new_booking_email(
                mentor_email=payment.mentor.user.email,
                mentor_name=payment.mentor.full_name,
                session_date=payment.session.scheduled_at.strftime("%Y-%m-%d %H:%M"),
                mentee_name=payment.mentee.full_name
            )
        except Exception as e:
            logger.error(f"Failed to send payment emails: {e}")
        
        return Response(
            {
                "success": True,
                "message": "Payment confirmed successfully",
                "data": PaymentSerializer(payment).data,
            },
            status=status.HTTP_200_OK,
        )


class PaymentListView(APIView):
    """
    GET /billing/payments/
    List payments for the authenticated user (as mentee or mentor).
    """
    permission_classes = [IsAuthenticatedAuth0]

    def get(self, request):
        user = request.user
        
        try:
            app_user = AppUser.objects.get(auth0_id=user.auth0_id)
        except AppUser.DoesNotExist:
            return Response(
                {"success": False, "message": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        role = app_user.role
        
        if role == 'mentee':
            try:
                mentee_profile = MenteeProfile.objects.get(user=app_user)
                payments = Payment.objects.filter(mentee=mentee_profile)
            except MenteeProfile.DoesNotExist:
                payments = Payment.objects.none()
        elif role == 'mentor':
            try:
                mentor_profile = MentorProfile.objects.get(user=app_user)
                payments = Payment.objects.filter(mentor=mentor_profile)
            except MentorProfile.DoesNotExist:
                payments = Payment.objects.none()
        else:
            payments = Payment.objects.all()
        
        limit = request.query_params.get('limit', 10)
        try:
            limit = int(limit)
        except ValueError:
            limit = 10
        
        payments = payments[:limit]
        serializer = PaymentHistorySerializer(payments, many=True)
        
        return Response(
            {
                "success": True,
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


class PaymentDetailView(APIView):
    """
    GET /billing/payments/<id>/
    Get details of a specific payment.
    """
    permission_classes = [IsAuthenticatedAuth0]

    def get(self, request, payment_id):
        try:
            payment = Payment.objects.get(id=payment_id)
        except Payment.DoesNotExist:
            return Response(
                {"success": False, "message": "Payment not found"},
                status=status.HTTP_404_NOT_FOUND,
            )
        
        serializer = PaymentSerializer(payment)
        
        return Response(
            {
                "success": True,
                "data": serializer.data,
            },
            status=status.HTTP_200_OK,
        )


# -------------------------------------------------------------------
# PAYOUT VIEWS
# -------------------------------------------------------------------

class RequestPayoutView(APIView):
    """
    POST /billing/payouts/request/
    Request a payout if wallet balance >= 200.
    """
    permission_classes = [IsAuthenticatedAuth0]


    def post(self, request):
        user = request.user
        
        with transaction.atomic():
            try:
                # Lock the mentor profile to prevent race conditions (double spending)
                mentor = MentorProfile.objects.select_for_update().get(user__auth0_id=user.auth0_id)
            except MentorProfile.DoesNotExist:
                return Response(
                    {"error": "Only mentors can request payouts."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Re-validate constraints inside the lock (Serializer validation was preliminary)
            serializer = RequestPayoutSerializer(data=request.data, context={'request': request})
            serializer.is_valid(raise_exception=True)
            
            amount = serializer.validated_data['amount']
            
            if mentor.wallet_balance < amount:
                 return Response(
                    {"error": "Insufficient wallet balance (race condition detected)."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Deduct from Wallet
            mentor.wallet_balance -= amount
            mentor.save()
            
            # Create Payout Record
            payout = Payout.objects.create(
                user=mentor.user,
                amount=amount,
                currency="USD", # Should ideally come from settings or mentor profile
                status='processed',
                bank_name=mentor.bank_name,
                iban=mentor.iban,
                swift_bic=mentor.swift_bic,
                processed_at=timezone.now()
            )
        
        logger.info(f"Payout {payout.id} processed for {mentor.user.email} - Amount: {amount}")
        
        # Send Email
        try:
            send_payout_processed_email(
                mentor_email=mentor.user.email,
                mentor_name=mentor.full_name,
                amount=amount,
                currency="USD", # Default currency for now
                iban=mentor.iban
            )
        except Exception as e:
            logger.error(f"Failed to send payout email: {e}")
            
        return Response(
            {
                "success": True,
                "message": "Payout processed successfully.",
                "data": PayoutSerializer(payout).data,
                "new_balance": mentor.wallet_balance
            },
            status=status.HTTP_201_CREATED
        )


class PayoutListView(generics.ListAPIView):
    """
    GET /billing/payouts/
    List payout history.
    """
    permission_classes = [IsAuthenticatedAuth0]
    serializer_class = PayoutSerializer

    def get_queryset(self):
        user = self.request.user
        try:
            # Ensure user exists in our DB
            app_user = AppUser.objects.get(auth0_id=user.auth0_id)
            return Payout.objects.filter(user=app_user)
        except AppUser.DoesNotExist:
            return Payout.objects.none()
