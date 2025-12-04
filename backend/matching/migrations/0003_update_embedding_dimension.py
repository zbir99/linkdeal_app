from django.db import migrations
from pgvector.django import VectorField


def clear_embeddings(apps, schema_editor):
    Mentor = apps.get_model('matching', 'Mentor')
    MenteeConversation = apps.get_model('matching', 'MenteeConversation')
    Mentor.objects.all().update(embedding=None)
    MenteeConversation.objects.all().update(embedding=None)


class Migration(migrations.Migration):

    dependencies = [
        ('matching', '0002_rename_mentee_session_idx_mentee_conv_session_a1ac23_idx_and_more'),
    ]

    operations = [
        migrations.RunPython(clear_embeddings, reverse_code=migrations.RunPython.noop),
        migrations.AlterField(
            model_name='mentor',
            name='embedding',
            field=VectorField(dimensions=384, null=True, blank=True),
        ),
        migrations.AlterField(
            model_name='menteeconversation',
            name='embedding',
            field=VectorField(dimensions=384, null=True, blank=True),
        ),
    ]

