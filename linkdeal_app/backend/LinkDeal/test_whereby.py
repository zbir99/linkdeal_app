import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LinkDeal.settings')
django.setup()

import requests
from django.conf import settings

api_key = os.getenv('WHEREBY_API_KEY', '')
print(f"API Key exists: {bool(api_key)}")
print(f"API Key length: {len(api_key)}")

headers = {
    "Authorization": f"Bearer {api_key}",
    "Content-Type": "application/json"
}

# Test by listing meetings (GET request)
try:
    response = requests.get("https://api.whereby.dev/v1/meetings", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
