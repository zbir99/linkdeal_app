from django.apps import AppConfig


class NotificationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'notifications'
    
    def ready(self):
        """Start the scheduler when Django starts."""
        import os
        # Only start scheduler in the main process (not in migrations or shell)
        if os.environ.get('RUN_MAIN') == 'true':
            from notifications.scheduler import start_scheduler
            start_scheduler()
