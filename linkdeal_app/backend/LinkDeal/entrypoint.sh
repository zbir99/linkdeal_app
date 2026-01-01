#!/bin/bash

# Run migrations
echo "Running migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Create superuser if it doesn't exist
echo "Checking for superuser..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
import os

email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@linkdeal.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'Admin2026')

if not User.objects.filter(email=email).exists():
    print(f'Creating superuser: {email}')
    user = User.objects.create_superuser(
        email=email,
        password=password,
        first_name='Admin',
        last_name='LinkDeal'
    )
    print('Superuser created successfully!')
else:
    print(f'Superuser {email} already exists.')
"

# Start gunicorn
echo "Starting gunicorn..."
exec gunicorn --bind 0.0.0.0:8000 --workers 4 --threads 2 --timeout 120 LinkDeal.wsgi:application
