"""
Billing models for LinkDeal platform.
Handles payment tracking for mentoring sessions.
"""
from django.db import models
from django.utils import timezone
from decimal import Decimal
import uuid


class Payment(models.Model):
    """
    Tracks payments for mentoring sessions.
    Uses PlatformSettings.platform_fee_percentage for fee calculation.
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('refunded', 'Refunded'),
        ('failed', 'Failed'),
    ]

    PAYMENT_METHOD_CHOICES = [
        ('bank_transfer', 'Bank Transfer'),
        ('card', 'Credit/Debit Card'),
        ('paypal', 'PayPal'),
        ('other', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    # Link to session
    session = models.OneToOneField(
        'scheduling.Session',
        on_delete=models.CASCADE,
        related_name='payment'
    )
    
    # Participants (denormalized for easy querying)
    mentee = models.ForeignKey(
        'accounts.MenteeProfile',
        on_delete=models.CASCADE,
        related_name='payments_made'
    )
    mentor = models.ForeignKey(
        'accounts.MentorProfile',
        on_delete=models.CASCADE,
        related_name='payments_received'
    )
    
    # Amounts
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Total payment amount"
    )
    currency = models.CharField(
        max_length=3,
        default='USD',
        help_text="Currency code"
    )
    platform_fee = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Platform fee (calculated from PlatformSettings)"
    )
    mentor_payout = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Amount to be paid to mentor (amount - platform_fee)"
    )
    
    # Status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    
    # Payment details
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        default='card'
    )
    reference = models.CharField(
        max_length=100,
        blank=True,
        help_text="External payment reference (e.g. Stripe ID)"
    )
    payout_processed = models.BooleanField(default=False, help_text="Whether the funds have been transferred to mentor wallet")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def calculate_fees(self):
        """
        Calculate platform fee and mentor payout using PlatformSettings.
        """
        from core.models import PlatformSettings
        
        settings = PlatformSettings.get_settings()
        fee_percentage = settings.platform_fee_percentage
        
        self.platform_fee = self.amount * (fee_percentage / Decimal('100'))
        self.mentor_payout = self.amount - self.platform_fee
        
        return self.platform_fee, self.mentor_payout

    def mark_completed(self):
        """Mark payment as completed."""
        if self.status != 'completed':
            self.status = 'completed'
            self.completed_at = timezone.now()
            self.save()
            
            # Update session payment_id reference
            if self.session:
                self.session.payment_id = str(self.id)
                self.session.save(update_fields=['payment_id'])

    def mark_refunded(self):
        """Mark payment as refunded."""
        self.status = 'refunded'
        self.save()

    def save(self, *args, **kwargs):
        # Auto-calculate fees if not set
        if self.amount and (not self.platform_fee or not self.mentor_payout):
            self.calculate_fees()
        
        # Set currency from session if not set
        if not self.currency and self.session:
            self.currency = self.session.currency
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Payment {self.id} - {self.amount} {self.currency} ({self.status})"


class Payout(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processed', 'Processed'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey('accounts.AppUser', on_delete=models.CASCADE, related_name='payouts')
    amount = models.DecimalField(max_digits=10, decimal_places=2, help_text="Payout amount requested")
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Snapshot of bank details at time of request
    bank_name = models.CharField(max_length=100, blank=True)
    iban = models.CharField(max_length=34, blank=True)
    swift_bic = models.CharField(max_length=11, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Payout {self.id} - {self.amount} {self.currency} to {self.user.email}"
