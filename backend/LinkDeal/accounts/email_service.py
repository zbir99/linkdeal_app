# accounts/email_service.py
import logging
from django.conf import settings
from django.core.mail import send_mail
from typing import Optional

logger = logging.getLogger(__name__)


def send_status_change_email(
    recipient_email: str,
    user_name: str,
    status: str,
    user_type: str = "mentor",  # "mentor" or "mentee"
    ban_reason: Optional[str] = None,
) -> None:
    """
    Send email notification when a user's status changes.
    
    Args:
        recipient_email: Email address of the user
        user_name: Full name of the user
        status: New status ("approved", "rejected", "banned", "unbanned")
        user_type: Type of user ("mentor" or "mentee")
        ban_reason: Optional reason for ban (only used when status="banned")
    """
    user_type_display = "Mentor" if user_type == "mentor" else "Mentee"
    
    # Subject and message content based on status
    if status == "approved":
        subject = f"Your {user_type_display} Account Has Been Approved - LinkDeal"
        message = f"""Hello {user_name},

Great news! Your {user_type_display.lower()} account on LinkDeal has been approved.

You can now log in and start using all the features available to you.

We're excited to have you on board!

Best regards,
LinkDeal Team
"""
        html_message = f"""<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4CAF50;">Account Approved</h2>
        <p>Hello {user_name},</p>
        <p>Great news! Your {user_type_display.lower()} account on LinkDeal has been <strong style="color: #4CAF50;">approved</strong>.</p>
        <p>You can now log in and start using all the features available to you.</p>
        <p>We're excited to have you on board!</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">Best regards,<br>LinkDeal Team</p>
    </div>
</body>
</html>"""
    
    elif status == "rejected":
        subject = f"Your {user_type_display} Application Status - LinkDeal"
        message = f"""Hello {user_name},

We regret to inform you that your {user_type_display.lower()} application on LinkDeal has been rejected.

If you have any questions or would like to discuss this decision, please contact our support team.

Thank you for your interest in LinkDeal.

Best regards,
LinkDeal Team
"""
        html_message = f"""<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #d32f2f;">Application Status Update</h2>
        <p>Hello {user_name},</p>
        <p>We regret to inform you that your {user_type_display.lower()} application on LinkDeal has been <strong style="color: #d32f2f;">rejected</strong>.</p>
        <p>If you have any questions or would like to discuss this decision, please contact our support team.</p>
        <p>Thank you for your interest in LinkDeal.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">Best regards,<br>LinkDeal Team</p>
    </div>
</body>
</html>"""
    
    elif status == "banned":
        reason_text = f"\n\nReason: {ban_reason}" if ban_reason else ""
        subject = f"Your {user_type_display} Account Has Been Banned - LinkDeal"
        message = f"""Hello {user_name},

Your {user_type_display.lower()} account on LinkDeal has been banned.{reason_text}

Your access to the platform has been suspended. If you believe this is an error or would like to appeal this decision, please contact our support team.

Best regards,
LinkDeal Team
"""
        html_message = f"""<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #d32f2f;">Account Banned</h2>
        <p>Hello {user_name},</p>
        <p>Your {user_type_display.lower()} account on LinkDeal has been <strong style="color: #d32f2f;">banned</strong>.</p>
        {f'<p><strong>Reason:</strong> {ban_reason}</p>' if ban_reason else ''}
        <p>Your access to the platform has been suspended. If you believe this is an error or would like to appeal this decision, please contact our support team.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">Best regards,<br>LinkDeal Team</p>
    </div>
</body>
</html>"""
    
    elif status == "unbanned":
        subject = f"Your {user_type_display} Account Has Been Restored - LinkDeal"
        message = f"""Hello {user_name},

Good news! Your {user_type_display.lower()} account on LinkDeal has been restored.

Your access to the platform has been reinstated. You can now log in and use all the features available to you.

Welcome back!

Best regards,
LinkDeal Team
"""
        html_message = f"""<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4CAF50;">Account Restored</h2>
        <p>Hello {user_name},</p>
        <p>Good news! Your {user_type_display.lower()} account on LinkDeal has been <strong style="color: #4CAF50;">restored</strong>.</p>
        <p>Your access to the platform has been reinstated. You can now log in and use all the features available to you.</p>
        <p>Welcome back!</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">Best regards,<br>LinkDeal Team</p>
    </div>
</body>
</html>"""
    
    else:
        logger.warning(f"Unknown status for email: {status}")
        return
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Successfully sent {status} status email to {recipient_email}")
    except Exception as e:
        logger.error(f"Failed to send {status} status email to {recipient_email}: {e}", exc_info=True)
        # Don't raise exception - email failure shouldn't block status change


def send_welcome_email(
    recipient_email: str,
    user_name: str,
    user_type: str = "mentee",  # "mentee" or "mentor"
) -> None:
    """
    Send welcome email when a user registers.
    
    Args:
        recipient_email: Email address of the user
        user_name: Full name of the user
        user_type: Type of user ("mentee" or "mentor")
    """
    user_type_display = "Mentor" if user_type == "mentor" else "Mentee"
    
    if user_type == "mentor":
        subject = "Welcome to LinkDeal - Your Mentor Application is Under Review"
        message = f"""Hello {user_name},

Welcome to LinkDeal! Thank you for registering as a mentor.

Your application is currently under review. Our team will review your profile and get back to you soon.

Once your application is approved, you'll be able to:
- Connect with mentees
- Share your expertise
- Build meaningful mentoring relationships

We'll notify you via email once your application has been reviewed.

If you have any questions, please don't hesitate to contact our support team.

Best regards,
LinkDeal Team
"""
        html_message = f"""<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4CAF50;">Welcome to LinkDeal!</h2>
        <p>Hello {user_name},</p>
        <p>Welcome to LinkDeal! Thank you for registering as a <strong>mentor</strong>.</p>
        <p>Your application is currently <strong style="color: #FF9800;">under review</strong>. Our team will review your profile and get back to you soon.</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Once your application is approved, you'll be able to:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Connect with mentees</li>
                <li>Share your expertise</li>
                <li>Build meaningful mentoring relationships</li>
            </ul>
        </div>
        <p>We'll notify you via email once your application has been reviewed.</p>
        <p>If you have any questions, please don't hesitate to contact our support team.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">Best regards,<br>LinkDeal Team</p>
    </div>
</body>
</html>"""
    else:  # mentee
        subject = "Welcome to LinkDeal - Your Account is Ready!"
        message = f"""Hello {user_name},

Welcome to LinkDeal! We're excited to have you join our community.

Your mentee account has been successfully created and is now active. You can start exploring and connecting with mentors right away!

Here's what you can do:
- Browse available mentors
- Connect with mentors who match your interests
- Schedule mentoring sessions
- Build your professional network

We're here to support you on your journey. If you have any questions, feel free to reach out to our support team.

Best regards,
LinkDeal Team
"""
        html_message = f"""<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4CAF50;">Welcome to LinkDeal!</h2>
        <p>Hello {user_name},</p>
        <p>Welcome to LinkDeal! We're excited to have you join our community.</p>
        <p>Your <strong>mentee</strong> account has been successfully created and is now <strong style="color: #4CAF50;">active</strong>. You can start exploring and connecting with mentors right away!</p>
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Here's what you can do:</strong></p>
            <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Browse available mentors</li>
                <li>Connect with mentors who match your interests</li>
                <li>Schedule mentoring sessions</li>
                <li>Build your professional network</li>
            </ul>
        </div>
        <p>We're here to support you on your journey. If you have any questions, feel free to reach out to our support team.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">Best regards,<br>LinkDeal Team</p>
    </div>
</body>
</html>"""
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Successfully sent welcome email to {recipient_email} ({user_type})")
    except Exception as e:
        logger.error(f"Failed to send welcome email to {recipient_email}: {e}", exc_info=True)
        # Don't raise exception - email failure shouldn't block registration

