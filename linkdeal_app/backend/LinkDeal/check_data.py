import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LinkDeal.settings')
django.setup()

from scheduling.models import SessionType, MentorAvailability, Session
from mentoring.models import MentorCategory, ReviewTag, MentorMenteeRelation, Review, MentorFavorite
from accounts.models import MentorProfile, MenteeProfile

print("=== DATA DISPONIBLE ===")
print("Mentors:", MentorProfile.objects.count())
print("  - Approuves:", MentorProfile.objects.filter(status="approved").count())
print("Mentees:", MenteeProfile.objects.count())
print()
print("=== SCHEDULING ===")
print("Session Types:", SessionType.objects.count())
print("Availability:", MentorAvailability.objects.count())
print("Sessions:", Session.objects.count())
print()
print("=== MENTORING ===")
print("Categories:", MentorCategory.objects.count())
print("Review Tags:", ReviewTag.objects.count())
print("Relations:", MentorMenteeRelation.objects.count())
print("Reviews:", Review.objects.count())
print("Favorites:", MentorFavorite.objects.count())
print()
print("=== IDs pour Postman ===")
if MentorProfile.objects.filter(status="approved").exists():
    mentor = MentorProfile.objects.filter(status="approved").first()
    print("mentorId:", mentor.id)
if MenteeProfile.objects.exists():
    mentee = MenteeProfile.objects.first()
    print("menteeId:", mentee.id)
if Session.objects.exists():
    session = Session.objects.first()
    print("sessionId:", session.id)
if MentorAvailability.objects.exists():
    avail = MentorAvailability.objects.first()
    print("availabilityId:", avail.id)
