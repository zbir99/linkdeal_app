
import os
import openai
from openai import OpenAI

api_key = os.environ.get("OPENAI_API_KEY")
print(f"API Key present: {bool(api_key)}")
print(f"API Key prefix: {api_key[:10] if api_key else 'None'}")

client = OpenAI(api_key=api_key)

try:
    print("Testing ChatCompletion...")
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": "Hello"}],
        max_tokens=10
    )
    print("Success!")
    print(response.choices[0].message.content)
except Exception as e:
    print(f"Error: {e}")
