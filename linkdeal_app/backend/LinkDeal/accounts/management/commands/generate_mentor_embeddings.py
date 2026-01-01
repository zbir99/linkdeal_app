import logging
from django.core.management.base import BaseCommand
from accounts.models import MentorProfile
from ai_chat.embedding_service import EmbeddingService

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Generate vector embeddings for all approved mentors.'

    def add_arguments(self, parser):
        parser.add_argument('--force', action='store_true', help='Force regenerate all embeddings')

    def handle(self, *args, **options):
        force = options.get('force', False)
        
        if force:
            mentors = MentorProfile.objects.filter(status='approved')
        else:
            mentors = MentorProfile.objects.filter(status='approved', embedding__isnull=True)
            
        total = mentors.count()
        self.stdout.write(self.style.SUCCESS(f'Found {total} mentors to process.'))
        
        count = 0
        for mentor in mentors:
            try:
                self.stdout.write(f'Generating embedding for: {mentor.full_name}...')
                embedding = EmbeddingService.generate_mentor_embedding(mentor)
                mentor.embedding = embedding
                mentor.save()
                count += 1
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Failed for {mentor.full_name}: {e}'))
        
        self.stdout.write(self.style.SUCCESS(f'Successfully generated {count} embeddings.'))
