"""
Email service for sending notification emails.
Handles session reminders and other notification emails.
"""
import logging
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

logger = logging.getLogger(__name__)


class NotificationEmailService:
    """Service for sending notification emails."""
    
    @staticmethod
    def send_session_reminder(user, session, video_url, is_mentor=False):
        """
        Send a session reminder email.
        
        Args:
            user: AppUser to send email to
            session: Session object
            video_url: URL to join the video call
            is_mentor: Boolean indicating if recipient is the mentor
        """
        try:
            # Determine the other participant's name
            if is_mentor:
                other_name = session.mentee.full_name
                role_text = "avec votre mentee"
                subject = f"Rappel : Session avec {other_name} dans 30 minutes"
            else:
                other_name = session.mentor.full_name
                role_text = "avec votre mentor"
                subject = f"Rappel : Session avec {other_name} dans 30 minutes"
            
            # Format the session time
            session_time = session.scheduled_at.strftime("%H:%M")
            session_date = session.scheduled_at.strftime("%d/%m/%Y")
            
            # Build the email HTML
            html_message = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body {{
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }}
                    .header {{
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white;
                        padding: 30px;
                        border-radius: 10px 10px 0 0;
                        text-align: center;
                    }}
                    .content {{
                        background: #f9fafb;
                        padding: 30px;
                        border-radius: 0 0 10px 10px;
                    }}
                    .session-card {{
                        background: white;
                        border-radius: 8px;
                        padding: 20px;
                        margin: 20px 0;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }}
                    .session-info {{
                        display: flex;
                        margin: 10px 0;
                    }}
                    .session-info .icon {{
                        width: 24px;
                        margin-right: 10px;
                    }}
                    .join-button {{
                        display: inline-block;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        color: white !important;
                        text-decoration: none;
                        padding: 15px 30px;
                        border-radius: 8px;
                        font-weight: bold;
                        margin: 20px 0;
                    }}
                    .footer {{
                        text-align: center;
                        color: #666;
                        font-size: 12px;
                        margin-top: 30px;
                    }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>⏰ Rappel de Session</h1>
                    <p>Votre session commence dans 30 minutes</p>
                </div>
                <div class="content">
                    <p>Bonjour <strong>{user.email.split('@')[0]}</strong>,</p>
                    
                    <p>Ceci est un rappel que votre session {role_text} <strong>{other_name}</strong> commence bientôt.</p>
                    
                    <div class="session-card">
                        <div class="session-info">
                            <span class="icon">👤</span>
                            <span><strong>{'Mentee' if is_mentor else 'Mentor'}:</strong> {other_name}</span>
                        </div>
                        <div class="session-info">
                            <span class="icon">📅</span>
                            <span><strong>Date:</strong> {session_date}</span>
                        </div>
                        <div class="session-info">
                            <span class="icon">🕐</span>
                            <span><strong>Heure:</strong> {session_time}</span>
                        </div>
                        <div class="session-info">
                            <span class="icon">⏱️</span>
                            <span><strong>Durée:</strong> {session.duration_minutes} minutes</span>
                        </div>
                        {f'<div class="session-info"><span class="icon">🎯</span><span><strong>Sujet:</strong> {session.topic}</span></div>' if session.topic else ''}
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="{video_url}" class="join-button">
                            🎥 Rejoindre la réunion
                        </a>
                    </div>
                    
                    <p style="color: #666; font-size: 14px;">
                        💡 <strong>Conseil:</strong> Connectez-vous quelques minutes à l'avance pour vérifier votre micro et votre caméra.
                    </p>
                </div>
                <div class="footer">
                    <p>LinkDeal - Plateforme de Mentorat</p>
                    <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
                </div>
            </body>
            </html>
            """
            
            # Plain text version
            plain_message = f"""
Rappel de Session - LinkDeal

Bonjour,

Votre session {role_text} {other_name} commence dans 30 minutes.

📅 Date: {session_date}
🕐 Heure: {session_time}
⏱️ Durée: {session.duration_minutes} minutes
{f"🎯 Sujet: {session.topic}" if session.topic else ""}

🎥 Rejoindre la réunion: {video_url}

Conseil: Connectez-vous quelques minutes à l'avance pour vérifier votre micro et votre caméra.

---
LinkDeal - Plateforme de Mentorat
            """
            
            # Send the email
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"Session reminder email sent to {user.email} for session {session.id}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send session reminder email to {user.email}: {e}")
            return False

    @staticmethod
    def send_booking_confirmation(user, session, is_mentor=False):
        """Send booking confirmation email when a new session is booked."""
        try:
            if is_mentor:
                other_name = session.mentee.full_name
                subject = f"Nouvelle réservation : Session avec {other_name}"
                intro = f"Vous avez une nouvelle demande de session de <strong>{other_name}</strong>."
            else:
                other_name = session.mentor.full_name
                subject = f"Réservation confirmée : Session avec {other_name}"
                intro = f"Votre session avec <strong>{other_name}</strong> a été réservée."
            
            session_time = session.scheduled_at.strftime("%H:%M")
            session_date = session.scheduled_at.strftime("%d/%m/%Y")
            
            html_message = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body {{
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                    }}
                    .header {{
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        color: white;
                        padding: 30px;
                        border-radius: 10px 10px 0 0;
                        text-align: center;
                    }}
                    .content {{
                        background: #f9fafb;
                        padding: 30px;
                        border-radius: 0 0 10px 10px;
                    }}
                    .session-card {{
                        background: white;
                        border-radius: 8px;
                        padding: 20px;
                        margin: 20px 0;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }}
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>✅ {'Nouvelle Réservation' if is_mentor else 'Réservation Confirmée'}</h1>
                </div>
                <div class="content">
                    <p>{intro}</p>
                    
                    <div class="session-card">
                        <p><strong>📅 Date:</strong> {session_date}</p>
                        <p><strong>🕐 Heure:</strong> {session_time}</p>
                        <p><strong>⏱️ Durée:</strong> {session.duration_minutes} minutes</p>
                        {f'<p><strong>🎯 Sujet:</strong> {session.topic}</p>' if session.topic else ''}
                    </div>
                    
                    <p>Vous recevrez un rappel 30 minutes avant le début de la session avec le lien pour rejoindre la réunion.</p>
                </div>
            </body>
            </html>
            """
            
            send_mail(
                subject=subject,
                message=f"Nouvelle session réservée le {session_date} à {session_time}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                html_message=html_message,
                fail_silently=False,
            )
            
            logger.info(f"Booking confirmation email sent to {user.email}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send booking confirmation email: {e}")
            return False
