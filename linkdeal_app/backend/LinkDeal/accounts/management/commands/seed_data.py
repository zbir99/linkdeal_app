# accounts/management/commands/seed_data.py
import random
import uuid
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from accounts.models import AppUser, MentorProfile, MenteeProfile
from mentoring.models import MentorCategory, MentorCategoryAssignment, Review, MentorMenteeRelation
from scheduling.models import Session, SessionType, MentorAvailability

class Command(BaseCommand):
    help = 'Seed the database with mock mentors, mentees, and sessions'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Seeding data...'))

        # 1. Create Categories
        categories_data = [
            {'name': 'AI & Data Science', 'slug': 'ai-data-science', 'icon': 'brain'},
            {'name': 'Software Engineering', 'slug': 'software-engineering', 'icon': 'code'},
            {'name': 'Entrepreneurship', 'slug': 'entrepreneurship', 'icon': 'lightbulb'},
            {'name': 'IT & Cloud', 'slug': 'it-cloud', 'icon': 'cloud'},
            {'name': 'UX/UI Design', 'slug': 'ux-ui-design', 'icon': 'palette'},
            {'name': 'Product Management', 'slug': 'product-management', 'icon': 'briefcase'},
        ]
        
        categories = {}
        for cat_data in categories_data:
            cat, created = MentorCategory.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=cat_data
            )
            categories[cat.slug] = cat
            if created:
                self.stdout.write(f'Created category: {cat.name}')

        # 2. Create Session Types
        session_types_data = [
            {'name': 'Standard Session', 'description': '1-on-1 mentoring session', 'default_duration': 60},
            {'name': 'Quick Check-in', 'description': 'Short 30min check-in', 'default_duration': 30},
        ]
        
        session_types = []
        for st_data in session_types_data:
            st, created = SessionType.objects.get_or_create(
                name=st_data['name'],
                defaults=st_data
            )
            session_types.append(st)

        # 3. Create Specific Mentors
        mentors_list = [
            {
                'name': 'Nouinou',
                'email': 'nouinou@linkdeal.com',
                'title': 'AI Entrepreneur & Tech Leader',
                'cat': 'entrepreneurship',
                'skills': ['AI Strategy', 'SaaS', 'Venture Capital'],
                'bio': 'Passionate AI entrepreneur with multiple successful exits.'
            },
            {
                'name': 'Samar Mouchawrab',
                'email': 'samar@linkdeal.com',
                'title': 'IT Infrastructure Specialist',
                'cat': 'it-cloud',
                'skills': ['Cloud Architecture', 'DevOps', 'Security'],
                'bio': 'Expert in enterprise IT systems and cloud migrations.'
            },
            {
                'name': 'Ayad Habib',
                'email': 'ayad@linkdeal.com',
                'title': 'Data Scientist & IoT Engineer',
                'cat': 'ai-data-science',
                'skills': ['Machine Learning', 'IoT', 'Python'],
                'bio': 'Bridging the gap between Physical World and Data.'
            },
            {
                'name': 'Omar El-Fassi',
                'email': 'omar@linkdeal.com',
                'title': 'Full Stack Developer',
                'cat': 'software-engineering',
                'skills': ['Django', 'React', 'Docker'],
                'bio': 'Building scalable web applications for a decade.'
            },
            {
                'name': 'Fatima Zahra',
                'email': 'fatima@linkdeal.com',
                'title': 'UX/UI Design Lead',
                'cat': 'ux-ui-design',
                'skills': ['User Research', 'Figma', 'Prototyping'],
                'bio': 'Creating beautiful and functional user experiences.'
            },
            {
                'name': 'Karim Al-Mansour',
                'email': 'karim@linkdeal.com',
                'title': 'Product Manager',
                'cat': 'product-management',
                'skills': ['Agile', 'Roadmapping', 'User Stories'],
                'bio': 'Turning vision into product reality.'
            },
            {
                'name': 'Zineb Amrani',
                'email': 'zineb@linkdeal.com',
                'title': 'AI Researcher',
                'cat': 'ai-data-science',
                'skills': ['NLP', 'Deep Learning', 'PyTorch'],
                'bio': 'Specialized in Natural Language Processing.'
            },
            {
                'name': 'Walid Benjelloun',
                'email': 'walid@linkdeal.com',
                'title': 'Startup Consultant',
                'cat': 'entrepreneurship',
                'skills': ['Business Model', 'Pitching', 'Growth'],
                'bio': 'Helping early-stage startups scale fast.'
            },
            {
                'name': 'Laila El-Malki',
                'email': 'laila@linkdeal.com',
                'title': 'Cybersecurity Expert',
                'cat': 'it-cloud',
                'skills': ['Pentesting', 'ISO 27001', 'Network Security'],
                'bio': 'Securing the future of digital assets.'
            },
            {
                'name': 'Hassan Idrissi',
                'email': 'hassan@linkdeal.com',
                'title': 'Backend Architect',
                'cat': 'software-engineering',
                'skills': ['Microservices', 'Go', 'Kubernetes'],
                'bio': 'Loves complex systems and distributed architectures.'
            }
        ]
        
        mentors = []
        for m_data in mentors_list:
            if not AppUser.objects.filter(email=m_data['email']).exists():
                user = AppUser.objects.create(
                    auth0_id=f'seed|{m_data["name"].lower().replace(" ", "")}',
                    email=m_data['email'],
                    role='mentor',
                    status='active'
                )
                
                mentor = MentorProfile.objects.create(
                    user=user,
                    email=m_data['email'],
                    full_name=m_data['name'],
                    professional_title=m_data['title'],
                    location='Casablanca, Morocco',
                    linkedin_url=f'https://linkedin.com/in/{m_data["name"].lower().replace(" ", "")}',
                    bio=m_data['bio'],
                    languages=['Arabic', 'French', 'English'],
                    country='Morocco',
                    status='approved',
                    skills=m_data['skills'],
                    session_rate=random.randint(50, 200),
                )
                mentors.append(mentor)
                
                # Assign to primary category
                cat = categories[m_data['cat']]
                MentorCategoryAssignment.objects.create(
                    mentor=mentor,
                    category=cat,
                    is_primary=True
                )
                
                self.stdout.write(f'Created mentor: {m_data["name"]}')
            else:
                mentors.append(AppUser.objects.get(email=m_data['email']).mentor_profile)

        # 4. Create Mentees
        mentee_names = [
            'Yassine Arhal', 'Sami Tazi', 'Amira Alaoui', 'Nour El-Houda', 'Idris Mansouri',
            'Salma Belghiti', 'Rayan Abbas', 'Lina El-Amrani', 'Anas Berrada', 'Hiba Kabbaj'
        ]
        
        mentees = []
        for i, name in enumerate(mentee_names):
            email = f'mentee{i+1}@example.com'
            if not AppUser.objects.filter(email=email).exists():
                user = AppUser.objects.create(
                    auth0_id=f'seed|mentee{i+1}',
                    email=email,
                    role='mentee',
                    status='active'
                )
                
                mentee = MenteeProfile.objects.create(
                    user=user,
                    full_name=name,
                    email=email,
                    country='Morocco',
                    languages=['Arabic', 'French', 'English'],
                    user_type=random.choice(['student', 'professional', 'entrepreneur']),
                    status='active'
                )
                mentees.append(mentee)
                self.stdout.write(f'Created mentee: {name}')
            else:
                mentees.append(AppUser.objects.get(email=email).mentee_profile)

        # 5. Create Availabilities
        for mentor in mentors:
            for day in range(0, 5):  # Mon-Fri
                MentorAvailability.objects.get_or_create(
                    mentor=mentor,
                    day_of_week=day,
                    start_time='09:00:00',
                    end_time='12:00:00'
                )
                MentorAvailability.objects.get_or_create(
                    mentor=mentor,
                    day_of_week=day,
                    start_time='14:00:00',
                    end_time='18:00:00'
                )

        # 6. Create Sessions & Relations
        now = timezone.now()
        
        for _ in range(30):
            mentor = random.choice(mentors)
            mentee = random.choice(mentees)
            
            # Create Session
            is_past = random.choice([True, False])
            days_offset = random.randint(1, 15)
            if is_past:
                scheduled_at = now - timedelta(days=days_offset)
                status = random.choice(['completed', 'completed', 'cancelled'])
            else:
                scheduled_at = now + timedelta(days=days_offset)
                status = random.choice(['confirmed', 'pending'])
            
            session, created = Session.objects.get_or_create(
                mentor=mentor,
                mentee=mentee,
                scheduled_at=scheduled_at,
                defaults={
                    'session_type': random.choice(session_types),
                    'duration_minutes': 60,
                    'status': status,
                    'topic': 'Mentoring Session about Tech & Career',
                    'mentee_notes': 'I want to improve my skills and discuss the roadmap.',
                }
            )
            
            # Create Relation
            rel, _ = MentorMenteeRelation.objects.get_or_create(
                mentor=mentor,
                mentee=mentee
            )
            rel.update_stats()
            
            # Create Review if completed
            if status == 'completed' and created:
                Review.objects.create(
                    session=session,
                    mentor=mentor,
                    mentee=mentee,
                    rating=random.randint(4, 5),
                    comment='Excellent mentor, very clear explanations!',
                    is_public=True
                )

        self.stdout.write(self.style.SUCCESS('Successfully seeded LinkDeal with realistic Arabic data!'))
