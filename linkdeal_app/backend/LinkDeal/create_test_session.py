import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LinkDeal.settings')
django.setup()

from datetime import datetime, timedelta
from django.utils import timezone
from scheduling.models import MentoringSession
from accounts.models import MentorProfile, MenteeProfile

# Get first mentor and mentee
mentor = MentorProfile.objects.filter(status='approved').first()
mentee = MenteeProfile.objects.first()

if mentor and mentee:
    print(f"Mentor: {mentor.full_name}")
    print(f"Mentee: {mentee.full_name}")
    
    # Create a session starting in 2 minutes
    session_time = timezone.now() + timedelta(minutes=2)
    
    session = MentoringSession.objects.create(
        mentor=mentor,
        mentee=mentee,
        scheduled_at=session_time,
        duration_minutes=60,
        status='confirmed',  # Already confirmed for testing
        topic='Test Session - Whereby Integration',
        mentee_notes='This is a test session to verify Whereby video calls work correctly.'
    )
    
    print(f"\n=== TEST SESSION CREATED ===")
    print(f"Session ID: {session.id}")
    print(f"Scheduled at: {session_time}")
    print(f"Status: {session.status}")
    print(f"\nYou can now go to the session and click 'Join Call' to test Whereby!")
else:
    print("Could not find mentor or mentee profiles")
