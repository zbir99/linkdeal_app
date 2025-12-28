"""
Management command to generate embeddings for all mentors.
"""
from django.core.management.base import BaseCommand
from accounts.models import MentorProfile
from ai_chat.embedding_service import EmbeddingService


class Command(BaseCommand):
    help = 'Generate embeddings for all mentor profiles'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Regenerate embeddings even if they already exist',
        )

    def handle(self, *args, **options):
        force = options['force']
        
        mentors = MentorProfile.objects.filter(status='approved')
        total = mentors.count()
        
        self.stdout.write(f"Found {total} approved mentors")
        
        updated = 0
        skipped = 0
        
        for i, mentor in enumerate(mentors):
            # Skip if embedding exists and not forcing
            if mentor.embedding and not force:
                skipped += 1
                continue
            
            # Generate embedding
            try:
                embedding = EmbeddingService.generate_mentor_embedding(mentor)
                mentor.embedding = embedding
                mentor.save(update_fields=['embedding'])
                updated += 1
                
                if (i + 1) % 10 == 0:
                    self.stdout.write(f"Processed {i + 1}/{total} mentors...")
                    
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"Error generating embedding for {mentor.full_name}: {e}")
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f"\nDone! Updated: {updated}, Skipped: {skipped}"
            )
        )
