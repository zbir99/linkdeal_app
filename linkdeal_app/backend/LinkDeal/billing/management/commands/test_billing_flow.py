"""
Custom command to verify billing logic.
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal
import uuid

from accounts.models import AppUser, MenteeProfile, MentorProfile
from scheduling.models import Session, SessionType
from billing.models import Payment
from core.models import PlatformSettings

class Command(BaseCommand):
    help = 'Verify billing logic manually'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting billing verification...")

        # 1. Ensure Platform Settings
        settings = PlatformSettings.get_settings()
        settings.platform_fee_percentage = Decimal("10.00")
        settings.save()
        self.stdout.write(f"- Platform fee set to {settings.platform_fee_percentage}%")

        # 2. Get or Create Users
        # Mentor
        mentor_user, _ = AppUser.objects.get_or_create(
            email="test_mentor_billing@example.com",
            defaults={'role': 'mentor', 'auth0_id': 'auth0|billing_mentor'}
        )
        mentor, _ = MentorProfile.objects.get_or_create(
            user=mentor_user,
            defaults={
                'full_name': 'Billing Mentor',
                'email': 'test_mentor_billing@example.com',
                'country': 'US',
                'languages': ['en'],
                'session_rate': Decimal("100.00"),
                'bank_name': 'Mentor Bank',
                'iban': 'US123456789',
                'swift_bic': 'MENTUS33'
            }
        )
        # Ensure bank details are set (in case user already existed)
        mentor.bank_name = 'Mentor Bank'
        mentor.iban = 'US123456789'
        mentor.save()

        # Update Platform Settings Bank Details
        settings.bank_name = 'LinkDeal HQ Bank'
        settings.iban = 'FR7654321'
        settings.save()
        
        # Mentee
        mentee_user, _ = AppUser.objects.get_or_create(
            email="test_mentee_billing@example.com",
            defaults={'role': 'mentee', 'auth0_id': 'auth0|billing_mentee'}
        )
        mentee, _ = MenteeProfile.objects.get_or_create(
            user=mentee_user,
            defaults={
                'full_name': 'Billing Mentee',
                'email': 'test_mentee_billing@example.com',
                'country': 'US',
                'languages': ['en']
            }
        )
        self.stdout.write("- Users ready")

        # 3. Create Session
        session = Session.objects.create(
            mentor=mentor,
            mentee=mentee,
            scheduled_at=timezone.now() + timedelta(days=1),
            duration_minutes=60,
            status='confirmed',
            price=Decimal("100.00"),
            currency="USD"
        )
        self.stdout.write(f"- Session created: {session.id} (Price: {session.price})")

        # 4. Create Payment
        payment = Payment.objects.create(
            session=session,
            mentee=mentee,
            mentor=mentor,
            amount=session.price,
            payment_method='card'
        )
        
        # 5. Verify Calculations
        expected_fee = Decimal("10.00") # 10% of 100
        expected_payout = Decimal("90.00") # 100 - 10
        
        if payment.platform_fee == expected_fee:
            self.stdout.write(self.style.SUCCESS(f"✔ Fee calculation correct: {payment.platform_fee}"))
        else:
            self.stdout.write(self.style.ERROR(f"✘ Fee calculation incorrect: Got {payment.platform_fee}, expected {expected_fee}"))

        if payment.mentor_payout == expected_payout:
            self.stdout.write(self.style.SUCCESS(f"✔ Payout calculation correct: {payment.mentor_payout}"))
        else:
            self.stdout.write(self.style.ERROR(f"✘ Payout calculation incorrect: Got {payment.mentor_payout}, expected {expected_payout}"))

        # 6. Verify Serializer Output (API Response)
        from billing.serializers import PaymentSerializer
        data = PaymentSerializer(payment).data
        
        # Check Mentor Bank Details
        if data.get('mentor_bank_name') == 'Mentor Bank' and data.get('mentor_iban') == 'US123456789':
             self.stdout.write(self.style.SUCCESS(f"✔ Serializer: Mentor bank details present"))
        else:
             self.stdout.write(self.style.ERROR(f"✘ Serializer: Missing Mentor bank details. Got: {data.get('mentor_bank_name')}"))

        # Check Platform Bank Details
        if data.get('platform_bank_name') == 'LinkDeal HQ Bank' and data.get('platform_iban') == 'FR7654321':
             self.stdout.write(self.style.SUCCESS(f"✔ Serializer: Platform bank details present"))
        else:
             self.stdout.write(self.style.ERROR(f"✘ Serializer: Missing Platform bank details. Got: {data.get('platform_bank_name')}"))

        # 7. Verify Status Update
        payment.mark_completed()
        if payment.status == 'completed' and payment.completed_at:
             self.stdout.write(self.style.SUCCESS(f"✔ Payment completion logic works"))
        else:
             self.stdout.write(self.style.ERROR(f"✘ Payment completion failed"))

        # Cleanup
        payment.delete()
        session.delete()
        self.stdout.write("Cleanup done.")
