from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from decimal import Decimal
from django.utils import timezone
from scheduling.models import Session
from billing.models import Payment, Payout
from accounts.models import MenteeProfile, MentorProfile
from core.models import PlatformSettings

class Command(BaseCommand):
    help = 'Verify Payout Flow logic'

    def handle(self, *args, **kwargs):
        self.stdout.write("🚀 Starting Payout Flow Verification...")
        
        # 1. Setup Data
        from accounts.models import AppUser
        
        # Create AppUsers
        mentor_user, _ = AppUser.objects.get_or_create(
            auth0_id='auth0|mentor_verify',
            defaults={
                'email': 'mentor_verify@test.com', 
                'role': 'mentor',
                'status': 'active'
            }
        )
        mentee_user, _ = AppUser.objects.get_or_create(
            auth0_id='auth0|mentee_verify',
            defaults={
                'email': 'mentee_verify@test.com', 
                'role': 'mentee',
                'status': 'active'
            }
        )
        
        # Create Profiles
        mentor, _ = MentorProfile.objects.get_or_create(
            user=mentor_user,
            defaults={
                'full_name': 'Mentor Verify',
                'email': 'mentor_verify@test.com',
                'professional_title': 'Senior Developer',
                'location': 'New York',
                'linkedin_url': 'https://linkedin.com/in/mentor',
                'bio': 'A test mentor bio.'
            }
        )
        mentee, _ = MenteeProfile.objects.get_or_create(
            user=mentee_user,
            defaults={
                'full_name': 'Mentee Verify',
                'email': 'mentee_verify@test.com',
                'country': 'USA'
            }
        )
        
        # Reset Mentor Wallet
        mentor.wallet_balance = Decimal('0.00')
        mentor.bank_name = "Test Bank"
        mentor.iban = "US123456789"
        mentor.swift_bic = "TESTUS33"
        mentor.save()
        
        # Session & Payment
        session = Session.objects.create(
            mentor=mentor,
            mentee=mentee,
            price=Decimal('100.00'),
            duration_minutes=60,
            status='confirmed',
            scheduled_at=timezone.now()
        )
        
        payment = Payment.objects.create(
            session=session,
            mentee=mentee,
            mentor=mentor,
            amount=Decimal('100.00'),
            currency='USD',
            status='pending'
        )
        
        mentee_user.is_authenticated = True
        mentor_user.is_authenticated = True

        # 2. Confirm Payment
        client = APIClient()
        client.force_authenticate(user=mentee_user)
        
        response = client.post(f'/billing/payments/{payment.id}/confirm/', {'reference': 'REF_123'})
        if response.status_code != 200:
             self.stderr.write(self.style.ERROR(f"❌ Payment Confirmation Failed: {response.data}"))
             return
        
        payment.refresh_from_db()
        self.stdout.write(self.style.SUCCESS(f"✅ Payment Confirmed. Status: {payment.status}"))
        
        # Check Platform Wallet (should hold 100 or fee?)
        # View implementation added `payment.amount` (100) to Platform Wallet.
        settings = PlatformSettings.get_settings()
        self.stdout.write(f"ℹ️ Platform Wallet Balance: {settings.wallet_balance}")
        
        # 3. Complete Session -> Trigger Signal -> Transfer Funds
        # Need to simulate session completion.
        # Signal is hooked on post_save of Session.
        session.status = 'completed'
        session.save() 
        
        # 4. Check Mentor Wallet
        mentor.refresh_from_db()
        payment.refresh_from_db()
        
        expected_payout = Decimal('100.00') * Decimal('0.90') # 90.00
        
        if mentor.wallet_balance == expected_payout:
            self.stdout.write(self.style.SUCCESS(f"✅ Funds Transferred to Mentor. Balance: {mentor.wallet_balance}"))
        else:
            self.stderr.write(self.style.ERROR(f"❌ Wallet Balance Mismatch. Expected {expected_payout}, Got {mentor.wallet_balance}"))
            
        if payment.payout_processed:
             self.stdout.write(self.style.SUCCESS("✅ Payment marked as payout_processed"))
        else:
             self.stderr.write(self.style.ERROR("❌ Payment NOT marked as payout_processed"))

        # 5. Request Payout (Should Fail < 200)
        client.force_authenticate(user=mentor_user)
        response = client.post('/billing/payouts/request/', {'amount': '50.00'})
        if response.status_code == 400:
             self.stdout.write(self.style.SUCCESS("✅ Payout Request Failed correctly (Balance < 200)"))
        else:
             self.stderr.write(self.style.ERROR(f"❌ Payout Request should have failed but got {response.status_code}: {getattr(response, 'data', 'No Data')}"))

        # 6. Request Payout (Success)
        # Bump balance manually
        mentor.wallet_balance = Decimal('250.00')
        mentor.save()
        
        response = client.post('/billing/payouts/request/', {'amount': '200.00'})
        if response.status_code == 201:
             self.stdout.write(self.style.SUCCESS("✅ Payout Request Succeeded ($200)"))
             mentor.refresh_from_db()
             if mentor.wallet_balance == Decimal('50.00'):
                 self.stdout.write(self.style.SUCCESS("✅ Wallet Balance Deducted Correctly"))
             else:
                 self.stderr.write(self.style.ERROR(f"❌ Wallet Balance Incorrect: {mentor.wallet_balance}"))
                 
             # Check Payout Record
             payout = Payout.objects.last()
             if payout and payout.amount == Decimal('200.00'):
                  self.stdout.write(self.style.SUCCESS("✅ Payout Record Created"))
             else:
                  self.stderr.write(self.style.ERROR("❌ Payout Record Missing or Incorrect"))
        else:
             self.stderr.write(self.style.ERROR(f"❌ Payout Request Failed: {response.status_code} - {getattr(response, 'data', 'No Data')}"))

        self.stdout.write(self.style.SUCCESS("🎉 All Verification Steps Completed."))
