"""
Scheduler for sending session reminders.
Uses APScheduler to check for upcoming sessions every minute.
"""
import logging
from datetime import timedelta
from django.utils import timezone
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

logger = logging.getLogger(__name__)

# Global scheduler instance
_scheduler = None


def get_or_create_video_room(session):
    """
    Get existing video room URL or create a new one.
    Returns the appropriate URL for joining the session.
    """
    # If we already have a Whereby room URL, use it
    if session.whereby_room_url:
        return session.whereby_room_url
    
    # Try to create a Whereby room
    try:
        from scheduling.services import WherebyService
        
        meeting = WherebyService.create_meeting(session)
        if meeting:
            session.whereby_meeting_id = meeting.get('meetingId')
            session.whereby_room_url = meeting.get('roomUrl')
            session.whereby_host_room_url = meeting.get('hostRoomUrl')
            session.video_provider = 'whereby'
            session.video_room_id = meeting.get('meetingId')
            session.save()
            return session.whereby_room_url
    except Exception as e:
        logger.warning(f"Could not create Whereby room: {e}")
    
    # Fallback: Generate a Jitsi room ID
    if not session.video_room_id:
        session.generate_video_room_id()
        session.video_provider = 'jitsi'
        session.save()
    
    # Return Jitsi URL
    return f"https://meet.jit.si/{session.video_room_id}"


def check_upcoming_sessions():
    """
    Check for sessions starting in ~30 minutes and send reminders.
    This job runs every minute.
    """
    try:
        # Import here to avoid circular imports
        from scheduling.models import Session
        from notifications.models import Notification
        from notifications.email_service import NotificationEmailService
        
        now = timezone.now()
        
        # Window: 29-31 minutes from now (to handle timing variations)
        reminder_window_start = now + timedelta(minutes=29)
        reminder_window_end = now + timedelta(minutes=31)
        
        # Find sessions that need reminders
        sessions = Session.objects.filter(
            scheduled_at__gte=reminder_window_start,
            scheduled_at__lte=reminder_window_end,
            status__in=['pending', 'confirmed'],
            reminder_sent=False
        ).select_related('mentor', 'mentee', 'mentor__user', 'mentee__user')
        
        if sessions.exists():
            logger.info(f"Found {sessions.count()} sessions needing reminders")
        
        for session in sessions:
            try:
                # Get or create video room URL
                video_url = get_or_create_video_room(session)
                
                session_time = session.scheduled_at.strftime("%H:%M")
                mentor_name = session.mentor.full_name
                mentee_name = session.mentee.full_name
                
                # === MENTOR NOTIFICATION ===
                mentor_user = session.mentor.user
                
                # Create in-app notification for mentor
                Notification.objects.create(
                    recipient=mentor_user,
                    notification_type='session_reminder',
                    title="Session dans 30 minutes",
                    message=f"Rappel : Votre session avec {mentee_name} commence à {session_time}. "
                            f"Durée : {session.duration_minutes} minutes.",
                    link=video_url,
                    link_text="Rejoindre la réunion",
                    related_session=session,
                    email_sent=True
                )
                
                # Send email to mentor
                NotificationEmailService.send_session_reminder(
                    user=mentor_user,
                    session=session,
                    video_url=session.whereby_host_room_url or video_url,  # Host URL for mentor
                    is_mentor=True
                )
                
                logger.info(f"Sent reminder to mentor {mentor_user.email} for session {session.id}")
                
                # === MENTEE NOTIFICATION ===
                mentee_user = session.mentee.user
                
                # Create in-app notification for mentee
                Notification.objects.create(
                    recipient=mentee_user,
                    notification_type='session_reminder',
                    title="Session dans 30 minutes",
                    message=f"Rappel : Votre session avec {mentor_name} commence à {session_time}. "
                            f"Durée : {session.duration_minutes} minutes.",
                    link=video_url,
                    link_text="Rejoindre la réunion",
                    related_session=session,
                    email_sent=True
                )
                
                # Send email to mentee
                NotificationEmailService.send_session_reminder(
                    user=mentee_user,
                    session=session,
                    video_url=video_url,  # Participant URL for mentee
                    is_mentor=False
                )
                
                logger.info(f"Sent reminder to mentee {mentee_user.email} for session {session.id}")
                
                # Mark session as reminder sent
                session.reminder_sent = True
                session.save(update_fields=['reminder_sent'])
                
                logger.info(f"Successfully processed reminders for session {session.id}")
                
            except Exception as e:
                logger.error(f"Error sending reminder for session {session.id}: {e}")
                continue
                
    except Exception as e:
        logger.error(f"Error in check_upcoming_sessions: {e}")


def start_scheduler():
    """Start the background scheduler for sending reminders."""
    global _scheduler
    
    if _scheduler is not None:
        logger.warning("Scheduler already running")
        return
    
    _scheduler = BackgroundScheduler()
    
    # Add job to check for upcoming sessions every minute
    _scheduler.add_job(
        check_upcoming_sessions,
        trigger=IntervalTrigger(minutes=1),
        id='check_session_reminders',
        name='Check for sessions needing reminders',
        replace_existing=True
    )
    
    _scheduler.start()
    logger.info("Notification scheduler started - checking for session reminders every minute")


def stop_scheduler():
    """Stop the scheduler gracefully."""
    global _scheduler
    
    if _scheduler is not None:
        _scheduler.shutdown()
        _scheduler = None
        logger.info("Notification scheduler stopped")
