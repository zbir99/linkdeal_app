import os
import django
import sys

# Setup Django environment
sys.path.append(r'c:\Users\Dell\OneDrive\Desktop\Lynvia\linkdeal_app\linkdeal_app\backend\LinkDeal')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LinkDeal.settings')
django.setup()

from billing.models import Payment
from accounts.models import MenteeProfile

print(f"Total Payments in DB: {Payment.objects.count()}")
print(f"Total Mentee Profiles: {MenteeProfile.objects.count()}")

# List first few payments if any
for p in Payment.objects.all()[:5]:
    print(f"Payment: {p.id} - Mentee: {p.mentee.user.email} - Status: {p.status} - Amount: {p.amount}")
