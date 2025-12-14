from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        """
        Import signals when the app is ready.
        This ensures signals are registered and avoids circular import issues.
        """
        import accounts.signals  # noqa
        
        # Start the scheduler only in the main process (not in auto-reloader threads)
        # We can check using os.environ or a lock, but simplest for dev is try/except 
        # or checking if it's already running. 
        # A common trick for runserver is checking sys.argv or RUN_MAIN env var.
        
        import os
        if os.environ.get("RUN_MAIN") == "true":
            from . import scheduler
            scheduler.start()