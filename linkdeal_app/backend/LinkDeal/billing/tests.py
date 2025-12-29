from django.test import TestCase
from django.utils import timezone
from decimal import Decimal
import uuid
from datetime import timedelta

from accounts.models import AppUser, MenteeProfile, MentorProfile, Language
from scheduling.models import Session, SessionType
from billing.models import Payment
from core.models import PlatformSettings


class BillingTestCase(TestCase):
    def setUp(self):
        # Create Language
        self.language = Language.objects.create(name="English")
        
        # Create Mentor
        self.mentor_user = AppUser.objects.create(
            email="mentor@test.com",
            role="mentor",
            auth0_id="auth0|mentor123"
        )
        self.mentor = MentorProfile.objects.create(
            user=self.mentor_user,
            email="mentor@test.com",
            full_name="Test Mentor",
            professional_title="Senior Dev",
            location="Remote",
            linkedin_url="https://linkedin.com/in/mentor",
            bio="Great mentor",
            languages=["English"],
            country="USA",
            # Mentor charges $100/hr
            session_rate=Decimal("100.00")
        )

        # Create Mentee
        self.mentee_user = AppUser.objects.create(
            email="mentee@test.com",
            role="mentee",
            auth0_id="auth0|mentee123"
        )
        self.mentee = MenteeProfile.objects.create(
            user=self.mentee_user,
            email="mentee@test.com",
            full_name="Test Mentee",
            country="Canada",
            languages=["English"]
        )
        
        # Create Session Type
        self.session_type = SessionType.objects.create(
            name="1:1 Mentoring",
            default_duration=60
        )
        
        # Create Session
        self.session = Session.objects.create(
            mentor=self.mentor,
            mentee=self.mentee,
            session_type=self.session_type,
            scheduled_at=timezone.now() + timedelta(days=1),
            duration_minutes=60,
            status='confirmed',
            # Price should auto-calculate to 100.00
            price=Decimal("100.00"),
            currency="USD"
        )
        
        # Ensure platform settings (default 10%)
        self.settings = PlatformSettings.get_settings()
        self.settings.platform_fee_percentage = Decimal("10.00")
        self.settings.save()

    def test_payment_model_fee_calculation(self):
        """Test that payment fees are calculated correctly on save"""
        payment = Payment.objects.create(
            session=self.session,
            mentee=self.mentee,
            mentor=self.mentor,
            amount=self.session.price,
            payment_method='card'
        )
        
        # Calculations: 
        # Amount: 100.00
        # Fee: 10% of 100 = 10.00
        # Payout: 100 - 10 = 90.00
        
        self.assertEqual(payment.platform_fee, Decimal("10.00"))
        self.assertEqual(payment.mentor_payout, Decimal("90.00"))
        self.assertEqual(payment.status, 'pending')
        
    def test_payment_mark_completed(self):
        """Test marking payment as completed"""
        payment = Payment.objects.create(
            session=self.session,
            mentee=self.mentee,
            mentor=self.mentor,
            amount=self.session.price,
        )
        
        self.assertIsNone(payment.completed_at)
        payment.mark_completed()
        
        self.assertEqual(payment.status, 'completed')
        self.assertIsNotNone(payment.completed_at)
        
        # Check session updated
        self.session.refresh_from_db()
        self.assertEqual(self.session.payment_id, str(payment.id))
