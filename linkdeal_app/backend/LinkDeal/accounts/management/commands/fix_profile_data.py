# accounts/management/commands/fix_profile_data.py
import json
from django.core.management.base import BaseCommand
from accounts.models import MentorProfile, MenteeProfile

class Command(BaseCommand):
    help = 'Fix data inconsistencies in Mentor and Mentee profiles (convert strings to lists)'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Cleaning up profile data...'))

        # Fix Mentor Profiles
        mentors = MentorProfile.objects.all()
        mentor_count = 0
        for mentor in mentors:
            updated = False
            
            # Fix Languages
            if mentor.languages and isinstance(mentor.languages, str):
                mentor.languages = [lang.strip() for lang in mentor.languages.split(',') if lang.strip()]
                updated = True
                
            # Fix Skills
            if mentor.skills and isinstance(mentor.skills, str):
                mentor.skills = [skill.strip() for skill in mentor.skills.split(',') if skill.strip()]
                updated = True
                
            if updated:
                mentor.save()
                mentor_count += 1
                self.stdout.write(f'Fixed mentor profile: {mentor.full_name}')

        # Fix Mentee Profiles
        mentees = MenteeProfile.objects.all()
        mentee_count = 0
        for mentee in mentees:
            updated = False
            
            # Fix Languages
            if mentee.languages and isinstance(mentee.languages, str):
                mentee.languages = [lang.strip() for lang in mentee.languages.split(',') if lang.strip()]
                updated = True
                
            if updated:
                mentee.save()
                mentee_count += 1
                self.stdout.write(f'Fixed mentee profile: {mentee.full_name}')

        self.stdout.write(self.style.SUCCESS(f'Successfully fixed {mentor_count} mentors and {mentee_count} mentees!'))
