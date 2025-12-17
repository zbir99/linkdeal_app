"""
Management command to create test data for scheduling and mentoring apps.
Run with: python manage.py create_test_data
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
import uuid


class Command(BaseCommand):
    help = 'Create test data for scheduling and mentoring apps'

    def handle(self, *args, **options):
        self.stdout.write('Creating test data...\n')
        
        # Import models
        from scheduling.models import SessionType, MentorAvailability, Session
        from mentoring.models import MentorCategory, ReviewTag, MentorMenteeRelation, Review
        from accounts.models import MentorProfile, MenteeProfile
        
        # =====================
        # 1. SESSION TYPES
        # =====================
        self.stdout.write('Creating session types...')
        session_types = [
            {'name': 'One-on-One', 'description': 'Session individuelle de mentorat', 'default_duration': 60},
            {'name': 'Quick Call', 'description': 'Appel rapide de 30 minutes', 'default_duration': 30},
            {'name': 'Code Review', 'description': 'Revue de code détaillée', 'default_duration': 45},
            {'name': 'Career Coaching', 'description': 'Coaching de carrière', 'default_duration': 60},
        ]
        for st in session_types:
            SessionType.objects.get_or_create(name=st['name'], defaults=st)
        self.stdout.write(self.style.SUCCESS(f'  ✓ {SessionType.objects.count()} session types'))
        
        # =====================
        # 2. MENTOR CATEGORIES
        # =====================
        self.stdout.write('Creating mentor categories...')
        categories = [
            {'name': 'Web Development', 'slug': 'web-development', 'icon': 'code'},
            {'name': 'Data Science', 'slug': 'data-science', 'icon': 'chart'},
            {'name': 'Mobile Development', 'slug': 'mobile-development', 'icon': 'phone'},
            {'name': 'DevOps', 'slug': 'devops', 'icon': 'server'},
            {'name': 'UX/UI Design', 'slug': 'ux-ui-design', 'icon': 'design'},
            {'name': 'Machine Learning', 'slug': 'machine-learning', 'icon': 'brain'},
        ]
        for cat in categories:
            MentorCategory.objects.get_or_create(slug=cat['slug'], defaults=cat)
        self.stdout.write(self.style.SUCCESS(f'  ✓ {MentorCategory.objects.count()} categories'))
        
        # =====================
        # 3. REVIEW TAGS
        # =====================
        self.stdout.write('Creating review tags...')
        tags = [
            {'name': 'Helpful', 'slug': 'helpful'},
            {'name': 'Professional', 'slug': 'professional'},
            {'name': 'Patient', 'slug': 'patient'},
            {'name': 'Clear Explanations', 'slug': 'clear-explanations'},
            {'name': 'Great Mentor', 'slug': 'great-mentor'},
            {'name': 'Knowledgeable', 'slug': 'knowledgeable'},
        ]
        for tag in tags:
            ReviewTag.objects.get_or_create(slug=tag['slug'], defaults=tag)
        self.stdout.write(self.style.SUCCESS(f'  ✓ {ReviewTag.objects.count()} review tags'))
        
        # =====================
        # 4. MENTOR AVAILABILITY (if mentors exist)
        # =====================
        self.stdout.write('Creating mentor availability...')
        mentors = MentorProfile.objects.filter(status='approved')
        availability_count = 0
        for mentor in mentors:
            # Create availability for weekdays
            for day in range(5):  # Monday to Friday
                MentorAvailability.objects.get_or_create(
                    mentor=mentor,
                    day_of_week=day,
                    start_time='09:00',
                    defaults={
                        'end_time': '12:00',
                        'is_recurring': True,
                        'is_available': True
                    }
                )
                MentorAvailability.objects.get_or_create(
                    mentor=mentor,
                    day_of_week=day,
                    start_time='14:00',
                    defaults={
                        'end_time': '18:00',
                        'is_recurring': True,
                        'is_available': True
                    }
                )
                availability_count += 2
        self.stdout.write(self.style.SUCCESS(f'  ✓ {MentorAvailability.objects.count()} availability slots'))
        
        # =====================
        # 5. SESSIONS (if mentors and mentees exist)
        # =====================
        self.stdout.write('Creating test sessions...')
        mentees = MenteeProfile.objects.all()
        session_type = SessionType.objects.first()
        
        if mentors.exists() and mentees.exists() and session_type:
            mentor = mentors.first()
            mentee = mentees.first()
            
            # Create various sessions with different statuses
            sessions_data = [
                {'status': 'pending', 'days_delta': 7},
                {'status': 'confirmed', 'days_delta': 3},
                {'status': 'completed', 'days_delta': -7},
                {'status': 'completed', 'days_delta': -14},
                {'status': 'cancelled', 'days_delta': -5},
            ]
            
            for s in sessions_data:
                scheduled_at = timezone.now() + timedelta(days=s['days_delta'])
                Session.objects.get_or_create(
                    mentor=mentor,
                    mentee=mentee,
                    scheduled_at=scheduled_at,
                    defaults={
                        'status': s['status'],
                        'session_type': session_type,
                        'duration_minutes': 60,
                        'mentee_notes': 'Session de test',
                    }
                )
            
            # Create mentor-mentee relation
            MentorMenteeRelation.objects.get_or_create(
                mentor=mentor,
                mentee=mentee,
                defaults={
                    'status': 'active',
                    'started_at': timezone.now() - timedelta(days=30)
                }
            )
            
        self.stdout.write(self.style.SUCCESS(f'  ✓ {Session.objects.count()} sessions'))
        self.stdout.write(self.style.SUCCESS(f'  ✓ {MentorMenteeRelation.objects.count()} relations'))
        
        # =====================
        # Summary
        # =====================
        self.stdout.write('\n' + '='*50)
        self.stdout.write(self.style.SUCCESS('Test data created successfully!'))
        self.stdout.write('='*50)
        self.stdout.write(f'Session Types: {SessionType.objects.count()}')
        self.stdout.write(f'Categories: {MentorCategory.objects.count()}')
        self.stdout.write(f'Review Tags: {ReviewTag.objects.count()}')
        self.stdout.write(f'Availability Slots: {MentorAvailability.objects.count()}')
        self.stdout.write(f'Sessions: {Session.objects.count()}')
        self.stdout.write(f'Relations: {MentorMenteeRelation.objects.count()}')
