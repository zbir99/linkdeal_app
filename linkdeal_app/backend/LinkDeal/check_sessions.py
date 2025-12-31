import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LinkDeal.settings')
django.setup()

from scheduling.models import Session, MentorAvailability
from accounts.models import MentorProfile
from datetime import datetime, timedelta
from django.utils import timezone

mentor_id = '45183804-8cf7-4849-9d5f-44d635a675b1'

# Get mentor
try:
    mentor = MentorProfile.objects.get(id=mentor_id)
    print(f"Mentor: {mentor.full_name}")
except:
    print("Mentor not found")
    exit()

# Get sessions
print("\n=== Active Sessions ===")
sessions = Session.objects.filter(
    mentor=mentor,
    status__in=['pending', 'confirmed', 'in_progress']
).order_by('scheduled_at')

for s in sessions:
    print(f"  ID: {s.id}")
    print(f"  Date: {s.scheduled_at.date()}")
    print(f"  Time (UTC): {s.scheduled_at.strftime('%H:%M')}")
    print(f"  Local: {timezone.localtime(s.scheduled_at).strftime('%H:%M')}")
    print(f"  Status: {s.status}")
    print(f"  Duration: {s.duration_minutes}min")
    print("  ---")

# Now test the API logic for a specific date
print("\n=== Testing API logic ===")
test_date_str = '2026-01-06'
target_date = datetime.strptime(test_date_str, '%Y-%m-%d').date()
day_of_week = target_date.weekday()
print(f"Date: {target_date}, Day of week: {day_of_week}")

from django.db.models import Q

availability_queryset = MentorAvailability.objects.filter(
    mentor=mentor,
    is_available=True
).filter(
    Q(is_recurring=True, day_of_week=day_of_week) |
    Q(is_recurring=False, specific_date=target_date)
)

print(f"Availability slots for this day: {availability_queryset.count()}")
for a in availability_queryset:
    print(f"  {a.start_time} - {a.end_time}")

# Check booked sessions for this date
booked = Session.objects.filter(
    mentor=mentor,
    scheduled_at__date=target_date,
    status__in=['pending', 'confirmed', 'in_progress']
)
print(f"\nBooked sessions on {target_date}: {booked.count()}")
for b in booked:
    print(f"  {b.scheduled_at.strftime('%H:%M')} (Duration: {b.duration_minutes}min)")
