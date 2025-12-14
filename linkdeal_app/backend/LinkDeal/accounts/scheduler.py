from apscheduler.schedulers.background import BackgroundScheduler
from django.core.management import call_command
import logging

logger = logging.getLogger(__name__)

def cleanup_job():
    """
    Job that runs the cleanup command.
    """
    logger.info("Scheduler: Running cleanup_unverified_users...")
    try:
        call_command("cleanup_unverified_users")
    except Exception as e:
        logger.error(f"Scheduler: Error running cleanup job: {e}")

def start():
    """
    Initialize and start the scheduler.
    """
    scheduler = BackgroundScheduler()
    # We use MemoryJobStore by default (simpler setup). 
    # If users restart server, jobs are re-added.
    
    # Run every 24 hours (production setting)
    scheduler.add_job(cleanup_job, "interval", hours=24, id="cleanup_users", replace_existing=True)
    
    scheduler.start()
    logger.info("Scheduler: Started! Cleanup job set to run every 1 minute.")
