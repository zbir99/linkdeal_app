# Generated migration for matching app
from django.db import migrations, models
import uuid
from pgvector.django import VectorField


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        # Enable pgvector extension
        migrations.RunSQL(
            "CREATE EXTENSION IF NOT EXISTS vector;",
            reverse_sql="DROP EXTENSION IF EXISTS vector;"
        ),
        
        # Create Mentor model
        migrations.CreateModel(
            name='Mentor',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('bio', models.TextField(help_text='Mentor biography and experience')),
                ('skills', models.JSONField(default=list, help_text="List of skills (e.g., ['Python', 'Django', 'React'])")),
                ('languages', models.JSONField(default=list, help_text="Languages spoken (e.g., ['English', 'French'])")),
                ('experience_years', models.IntegerField(default=0)),
                ('rating', models.FloatField(default=0.0, help_text='Average rating from mentees')),
                ('availability', models.TextField(blank=True, default='', help_text='Availability schedule or notes')),
                ('embedding', VectorField(dimensions=1536, blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'mentors',
                'ordering': ['-rating', '-experience_years'],
            },
        ),
        
        # Create MenteeConversation model
        migrations.CreateModel(
            name='MenteeConversation',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('conversation', models.TextField(help_text='Full conversation text')),
                ('extracted_profile', models.JSONField(blank=True, help_text='Structured profile extracted from conversation (JSON)', null=True)),
                ('embedding', VectorField(dimensions=1536, blank=True, null=True)),
                ('session_id', models.CharField(blank=True, default='', help_text='Optional session identifier for grouping conversations', max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'mentee_conversations',
                'ordering': ['-created_at'],
            },
        ),
        
        # Add indexes
        migrations.AddIndex(
            model_name='mentor',
            index=models.Index(fields=['rating'], name='mentors_rating_idx'),
        ),
        migrations.AddIndex(
            model_name='mentor',
            index=models.Index(fields=['experience_years'], name='mentors_exp_idx'),
        ),
        migrations.AddIndex(
            model_name='menteeconversation',
            index=models.Index(fields=['session_id'], name='mentee_session_idx'),
        ),
        migrations.AddIndex(
            model_name='menteeconversation',
            index=models.Index(fields=['created_at'], name='mentee_created_idx'),
        ),
    ]
