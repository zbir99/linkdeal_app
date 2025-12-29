"""
Billing serializers for LinkDeal platform.
"""
from rest_framework import serializers
from billing.models import Payment, Payout
from core.models import PlatformSettings
from accounts.models import MentorProfile
from decimal import Decimal


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model - read operations."""
    
    mentor_name = serializers.CharField(source='mentor.full_name', read_only=True)
    mentee_name = serializers.CharField(source='mentee.full_name', read_only=True)
    
    # Banking Details (for simulation display)
    mentor_bank_name = serializers.CharField(source='mentor.bank_name', read_only=True)
    mentor_iban = serializers.CharField(source='mentor.iban', read_only=True)
    mentor_swift_bic = serializers.CharField(source='mentor.swift_bic', read_only=True)
    
    platform_bank_name = serializers.CharField(source='PlatformSettings.get_settings().bank_name', read_only=True)
    platform_iban = serializers.CharField(source='PlatformSettings.get_settings().iban', read_only=True)
    platform_swift_bic = serializers.CharField(source='PlatformSettings.get_settings().swift_bic', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'session_id', 'amount', 'currency', 'status', 
            'payment_method', 'reference', 'created_at', 'completed_at',
            'mentor_name', 'mentee_name',
            'platform_fee', 'mentor_payout', 'payout_processed',
            'mentor_bank_name', 'mentor_iban', 'mentor_swift_bic',
            'platform_bank_name', 'platform_iban', 'platform_swift_bic'
        ]

class PayoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payout
        fields = ['id', 'amount', 'currency', 'status', 'created_at', 'processed_at', 'bank_name', 'iban']
        read_only_fields = ['status', 'currency', 'created_at', 'processed_at', 'bank_name', 'iban']

class RequestPayoutSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=Decimal('200.00'))

    def validate_amount(self, value):
        user = self.context['request'].user
        try:
            mentor = MentorProfile.objects.get(user__auth0_id=user.auth0_id)
            if mentor.wallet_balance < value:
                raise serializers.ValidationError("Insufficient wallet balance.")
        except MentorProfile.DoesNotExist:
             pass
        return value


class CreatePaymentSerializer(serializers.Serializer):
    """Serializer for creating a payment from a session."""
    
    session_id = serializers.UUIDField()
    payment_method = serializers.ChoiceField(
        choices=Payment.PAYMENT_METHOD_CHOICES,
        default='bank_transfer'
    )
    
    def validate_session_id(self, value):
        from scheduling.models import Session
        
        try:
            session = Session.objects.get(id=value)
        except Session.DoesNotExist:
            raise serializers.ValidationError("Session not found.")
        
        # Check if payment already exists for this session
        if Payment.objects.filter(session=session).exists():
            raise serializers.ValidationError("Payment already exists for this session.")
        
        # Check session is confirmed
        if session.status not in ['pending', 'confirmed']:
            raise serializers.ValidationError("Cannot create payment for this session status.")
        
        return value
    
    def create(self, validated_data):
        from scheduling.models import Session
        
        session = Session.objects.get(id=validated_data['session_id'])
        
        payment = Payment.objects.create(
            session=session,
            mentee=session.mentee,
            mentor=session.mentor,
            amount=session.price,
            currency=session.currency,
            payment_method=validated_data.get('payment_method', 'bank_transfer'),
        )
        
        return payment


class ConfirmPaymentSerializer(serializers.Serializer):
    """Serializer for confirming a payment."""
    
    reference = serializers.CharField(
        max_length=100,
        required=False,
        allow_blank=True,
        help_text="External payment reference (optional in sandbox mode)"
    )


class PaymentHistorySerializer(serializers.ModelSerializer):
    """Lightweight serializer for payment history list."""
    
    mentor_name = serializers.CharField(source='mentor.full_name', read_only=True)
    time_ago = serializers.SerializerMethodField()
    
    class Meta:
        model = Payment
        fields = ['id', 'mentor_name', 'amount', 'currency', 'status', 'time_ago', 'created_at']
    
    def get_time_ago(self, obj):
        from django.utils import timezone
        from datetime import timedelta
        
        now = timezone.now()
        diff = now - obj.created_at
        
        if diff < timedelta(hours=1):
            minutes = int(diff.total_seconds() / 60)
            return f"{minutes}m ago" if minutes > 1 else "just now"
        elif diff < timedelta(days=1):
            hours = int(diff.total_seconds() / 3600)
            return f"{hours}h ago"
        elif diff < timedelta(days=7):
            days = diff.days
            return f"{days}d ago"
        else:
            return obj.created_at.strftime("%b %d, %Y")
