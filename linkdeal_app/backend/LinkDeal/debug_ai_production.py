import os
import django
import sys
from pathlib import Path

# Setup Django
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LinkDeal.settings')
django.setup()

from ai_chat.services import LLMService
from django.conf import settings

def debug_ai():
    print(f"DEBUG: {settings.DEBUG}")
    print(f"USE_MOCK_AI: {getattr(settings, 'USE_MOCK_AI', 'NOT SET')}")
    print(f"OPENAI_MODEL: {getattr(settings, 'OPENAI_MODEL', 'NOT SET')}")
    api_key = getattr(settings, 'OPENAI_API_KEY', '')
    if api_key:
        print(f"OPENAI_API_KEY: Found (starts with {api_key[:10]}...)")
    else:
        print("OPENAI_API_KEY: NOT FOUND")

    print("\n--- Testing generate_response ---")
    try:
        messages = [{"role": "user", "content": "Hello, how are you?"}]
        response = LLMService.generate_response(messages, 1)
        print(f"Response: {response}")
    except Exception as e:
        print(f"ERROR calling generate_response: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    debug_ai()
