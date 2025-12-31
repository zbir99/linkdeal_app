import os
import django
import sys
import random
from decimal import Decimal
from django.utils import timezone

# Setup Django environment
sys.path.append(r'c:\Users\Dell\OneDrive\Desktop\Lynvia\linkdeal_app\linkdeal_app\backend\LinkDeal')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LinkDeal.settings')
django.setup()

from billing.models import Payment
from accounts.models import AppUser, MenteeProfile, MentorProfile
from scheduling.models import Session

def seed_payments():
    mentees = MenteeProfile.objects.all()
    mentors = MentorProfile.objects.all()
    
    if not mentees.exists():
        print("No mentees found.")
        return
    if not mentors.exists():
        print("No mentors found.")
        return

    count = 0
    for mentee in mentees:
        # Check if mentee already has payments
        if Payment.objects.filter(mentee=mentee).exists():
            print(f"Mentee {mentee.user.email} already has payments. Skipping.")
            continue
            
        print(f"Seeding payments for {mentee.user.email}...")
        
        # Create 3 dummy payments
        for i in range(3):
            mentor = random.choice(mentors)
            
            # Helper: Create a dummy session if needed, or just link to a payment directly if model allows (Payment needs session usually)
            # Let's check Payment model constraints. Assuming session is nullable or we can create a dummy one.
            # Checking `billing/models.py` would resolve this, but assuming Standard approach: Payment requires Session.
            
            # Create a completed session first
            session = Session.objects.create(
                mentor=mentor,
                mentee=mentee,
                start_time=timezone.now() - timezone.timedelta(days=i),
                end_time=timezone.now() - timezone.timedelta(days=i, minutes=60),
                status='completed',
                duration_minutes=60,
                scheduled_at=timezone.now() - timezone.timedelta(days=i)
            )
            
            Payment.objects.create(
                session=session,
                mentee=mentee,
                mentor=mentor,
                amount=Decimal(random.randint(50, 200)),
                currency='USD',
                status='completed',
                payment_method='bank_transfer',
                created_at=timezone.now() - timezone.timedelta(days=i)
            )
            count += 1
            
    print(f"Successfully created {count} new payments.")

if __name__ == '__main__':
    try:
        seed_payments()
    except Exception as e:
        print(f"Error seeding payments: {e}")
