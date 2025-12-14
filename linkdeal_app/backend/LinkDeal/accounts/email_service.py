# accounts/email_service.py
import logging
from django.conf import settings
from django.core.mail import send_mail
from typing import Optional

logger = logging.getLogger(__name__)

# LinkDeal Logo URL
LINKDEAL_LOGO_URL = "https://i.postimg.cc/vH0VfQzT/growth.png"

# Email template base with modern styling - White background with purple accents
def get_email_base_template(content: str, title: str = "LinkDeal") -> str:
    """
    Returns a modern, responsive HTML email template with consistent styling.
    White background with purple accent colors.
    """
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f7; min-height: 100vh;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="min-height: 100vh;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background: #ffffff; border-radius: 20px; box-shadow: 0 10px 40px rgba(112, 8, 231, 0.1); border: 1px solid rgba(112, 8, 231, 0.1);">
                    <!-- Header with Logo -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 30px 40px; background: linear-gradient(135deg, #7008E7 0%, #8E51FF 100%); border-radius: 20px 20px 0 0;">
                            <img src="{LINKDEAL_LOGO_URL}" alt="LinkDeal" width="70" height="70" style="display: block; margin-bottom: 15px;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff;">LinkDeal</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            {content}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; border-top: 1px solid #e5e5e5; text-align: center;">
                            <p style="margin: 0 0 10px 0; font-size: 14px; color: #666666;">
                                &copy; 2024 LinkDeal. All rights reserved.
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #999999;">
                                Connecting Mentors and Mentees Worldwide
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>"""


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
        subject = f"🎉 Your {user_type_display} Account Has Been Approved - LinkDeal"
        message = f"""Hello {user_name},

Great news! Your {user_type_display.lower()} account on LinkDeal has been approved.

You can now log in and start using all the features available to you.

We're excited to have you on board!

Best regards,
LinkDeal Team
"""
        content = f"""
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.05) 100%); border-radius: 50%; margin-bottom: 20px; line-height: 80px;">
                    <span style="font-size: 40px;">✅</span>
                </div>
                <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600; color: #4CAF50;">Account Approved!</h2>
            </div>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">
                Hello <strong style="color: #7008E7;">{user_name}</strong>,
            </p>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #555555; line-height: 1.6;">
                Great news! Your <strong>{user_type_display.lower()}</strong> account on LinkDeal has been <strong style="color: #4CAF50;">approved</strong>. 🎉
            </p>
            
            <p style="margin: 0 0 30px 0; font-size: 16px; color: #555555; line-height: 1.6;">
                You can now log in and start using all the features available to you. We're excited to have you on board!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://linkdeal.com/login" style="display: inline-block; background: linear-gradient(135deg, #7008E7 0%, #8E51FF 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 25px rgba(112, 8, 231, 0.3);">
                    🚀 Start Exploring
                </a>
            </div>
            
            <p style="margin: 30px 0 0 0; font-size: 14px; color: #888888; line-height: 1.6;">
                Best regards,<br>
                <strong style="color: #7008E7;">The LinkDeal Team</strong>
            </p>
        """
    
    elif status == "rejected":
        subject = f"Your {user_type_display} Application Status - LinkDeal"
        message = f"""Hello {user_name},

We regret to inform you that your {user_type_display.lower()} application on LinkDeal has been rejected.

If you have any questions or would like to discuss this decision, please contact our support team.

Thank you for your interest in LinkDeal.

Best regards,
LinkDeal Team
"""
        content = f"""
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(211, 47, 47, 0.15) 0%, rgba(211, 47, 47, 0.05) 100%); border-radius: 50%; margin-bottom: 20px; line-height: 80px;">
                    <span style="font-size: 40px;">📋</span>
                </div>
                <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600; color: #d32f2f;">Application Status Update</h2>
            </div>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">
                Hello <strong style="color: #7008E7;">{user_name}</strong>,
            </p>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #555555; line-height: 1.6;">
                We regret to inform you that your <strong>{user_type_display.lower()}</strong> application on LinkDeal has been <strong style="color: #d32f2f;">rejected</strong>.
            </p>
            
            <div style="background: linear-gradient(135deg, rgba(112, 8, 231, 0.08) 0%, rgba(142, 81, 255, 0.05) 100%); border: 1px solid rgba(112, 8, 231, 0.2); border-radius: 12px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #555555; line-height: 1.6;">
                    If you have any questions or would like to discuss this decision, please contact our support team. We value your interest in LinkDeal and are happy to help.
                </p>
            </div>
            
            <p style="margin: 30px 0 0 0; font-size: 14px; color: #888888; line-height: 1.6;">
                Thank you for your interest in LinkDeal.<br><br>
                Best regards,<br>
                <strong style="color: #7008E7;">The LinkDeal Team</strong>
            </p>
        """
    
    elif status == "banned":
        reason_text = f"\n\nReason: {ban_reason}" if ban_reason else ""
        subject = f"Important: Your {user_type_display} Account Status - LinkDeal"
        message = f"""Hello {user_name},

Your {user_type_display.lower()} account on LinkDeal has been banned.{reason_text}

Your access to the platform has been suspended. If you believe this is an error or would like to appeal this decision, please contact our support team.

Best regards,
LinkDeal Team
"""
        reason_html = f'''
            <div style="background: linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(211, 47, 47, 0.05) 100%); border: 1px solid rgba(211, 47, 47, 0.3); border-radius: 12px; padding: 16px 20px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #555555;">
                    <strong style="color: #d32f2f;">Reason:</strong> {ban_reason}
                </p>
            </div>
        ''' if ban_reason else ''
        
        content = f"""
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(211, 47, 47, 0.15) 0%, rgba(211, 47, 47, 0.05) 100%); border-radius: 50%; margin-bottom: 20px; line-height: 80px;">
                    <span style="font-size: 40px;">⚠️</span>
                </div>
                <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600; color: #d32f2f;">Account Suspended</h2>
            </div>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">
                Hello <strong style="color: #7008E7;">{user_name}</strong>,
            </p>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #555555; line-height: 1.6;">
                Your <strong>{user_type_display.lower()}</strong> account on LinkDeal has been <strong style="color: #d32f2f;">suspended</strong>.
            </p>
            
            {reason_html}
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #555555; line-height: 1.6;">
                Your access to the platform has been suspended. If you believe this is an error or would like to appeal this decision, please contact our support team.
            </p>
            
            <p style="margin: 30px 0 0 0; font-size: 14px; color: #888888; line-height: 1.6;">
                Best regards,<br>
                <strong style="color: #7008E7;">The LinkDeal Team</strong>
            </p>
        """
    
    elif status == "unbanned":
        subject = f"🎉 Your {user_type_display} Account Has Been Restored - LinkDeal"
        message = f"""Hello {user_name},

Good news! Your {user_type_display.lower()} account on LinkDeal has been restored.

Your access to the platform has been reinstated. You can now log in and use all the features available to you.

Welcome back!

Best regards,
LinkDeal Team
"""
        content = f"""
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.05) 100%); border-radius: 50%; margin-bottom: 20px; line-height: 80px;">
                    <span style="font-size: 40px;">🎊</span>
                </div>
                <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600; color: #4CAF50;">Account Restored!</h2>
            </div>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">
                Hello <strong style="color: #7008E7;">{user_name}</strong>,
            </p>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #555555; line-height: 1.6;">
                Good news! Your <strong>{user_type_display.lower()}</strong> account on LinkDeal has been <strong style="color: #4CAF50;">restored</strong>. 🎉
            </p>
            
            <p style="margin: 0 0 30px 0; font-size: 16px; color: #555555; line-height: 1.6;">
                Your access to the platform has been reinstated. You can now log in and use all the features available to you. Welcome back!
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://linkdeal.com/login" style="display: inline-block; background: linear-gradient(135deg, #7008E7 0%, #8E51FF 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 25px rgba(112, 8, 231, 0.3);">
                    🚀 Log In Now
                </a>
            </div>
            
            <p style="margin: 30px 0 0 0; font-size: 14px; color: #888888; line-height: 1.6;">
                Best regards,<br>
                <strong style="color: #7008E7;">The LinkDeal Team</strong>
            </p>
        """
    
    else:
        logger.warning(f"Unknown status for email: {status}")
        return
    
    html_message = get_email_base_template(content, f"LinkDeal - {status.title()}")
    
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
        subject = "🎉 Welcome to LinkDeal - Your Mentor Application is Under Review"
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
        content = f"""
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(112, 8, 231, 0.15) 0%, rgba(142, 81, 255, 0.08) 100%); border-radius: 50%; margin-bottom: 20px; line-height: 80px;">
                    <span style="font-size: 40px;">🌟</span>
                </div>
                <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600; color: #333333;">Welcome to LinkDeal!</h2>
            </div>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">
                Hello <strong style="color: #7008E7;">{user_name}</strong>,
            </p>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #555555; line-height: 1.6;">
                Welcome to LinkDeal! Thank you for registering as a <strong style="color: #7008E7;">mentor</strong>. 🎓
            </p>
            
            <div style="background: linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%); border: 1px solid rgba(255, 152, 0, 0.3); border-radius: 12px; padding: 16px 20px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #333333;">
                    ⏳ <strong style="color: #F57C00;">Application Status:</strong> Under Review
                </p>
                <p style="margin: 8px 0 0 0; font-size: 13px; color: #666666;">
                    Our team will review your profile and get back to you soon.
                </p>
            </div>
            
            <p style="margin: 20px 0 15px 0; font-size: 15px; font-weight: 600; color: #333333;">
                Once approved, you'll be able to:
            </p>
            
            <div style="background: linear-gradient(135deg, rgba(112, 8, 231, 0.08) 0%, rgba(142, 81, 255, 0.05) 100%); border-radius: 12px; padding: 20px; margin: 0 0 20px 0;">
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #555555;">✨ Connect with mentees seeking guidance</p>
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #555555;">💡 Share your expertise and experience</p>
                <p style="margin: 0; font-size: 14px; color: #555555;">🤝 Build meaningful mentoring relationships</p>
            </div>
            
            <p style="margin: 0 0 20px 0; font-size: 14px; color: #888888; line-height: 1.6;">
                We'll notify you via email once your application has been reviewed.
            </p>
            
            <p style="margin: 30px 0 0 0; font-size: 14px; color: #888888; line-height: 1.6;">
                Best regards,<br>
                <strong style="color: #7008E7;">The LinkDeal Team</strong>
            </p>
        """
    else:  # mentee
        subject = "🎉 Welcome to LinkDeal - Your Account is Ready!"
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
        content = f"""
            <div style="text-align: center; margin-bottom: 30px;">
                <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.08) 100%); border-radius: 50%; margin-bottom: 20px; line-height: 80px;">
                    <span style="font-size: 40px;">🚀</span>
                </div>
                <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600; color: #333333;">Welcome to LinkDeal!</h2>
            </div>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">
                Hello <strong style="color: #7008E7;">{user_name}</strong>,
            </p>
            
            <p style="margin: 0 0 20px 0; font-size: 16px; color: #555555; line-height: 1.6;">
                Welcome to LinkDeal! We're excited to have you join our community. 🎉
            </p>
            
            <div style="background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.05) 100%); border: 1px solid rgba(76, 175, 80, 0.3); border-radius: 12px; padding: 16px 20px; margin: 20px 0;">
                <p style="margin: 0; font-size: 14px; color: #333333;">
                    ✅ <strong style="color: #4CAF50;">Account Status:</strong> Active
                </p>
                <p style="margin: 8px 0 0 0; font-size: 13px; color: #666666;">
                    You can start exploring and connecting with mentors right away!
                </p>
            </div>
            
            <p style="margin: 20px 0 15px 0; font-size: 15px; font-weight: 600; color: #333333;">
                Here's what you can do:
            </p>
            
            <div style="background: linear-gradient(135deg, rgba(112, 8, 231, 0.08) 0%, rgba(142, 81, 255, 0.05) 100%); border-radius: 12px; padding: 20px; margin: 0 0 30px 0;">
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #555555;">🔍 Browse available mentors</p>
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #555555;">🤝 Connect with mentors who match your interests</p>
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #555555;">📅 Schedule mentoring sessions</p>
                <p style="margin: 0; font-size: 14px; color: #555555;">🌐 Build your professional network</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://linkdeal.com/login" style="display: inline-block; background: linear-gradient(135deg, #7008E7 0%, #8E51FF 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 25px rgba(112, 8, 231, 0.3);">
                    🚀 Start Exploring
                </a>
            </div>
            
            <p style="margin: 30px 0 0 0; font-size: 14px; color: #888888; line-height: 1.6;">
                Best regards,<br>
                <strong style="color: #7008E7;">The LinkDeal Team</strong>
            </p>
        """
    
    html_message = get_email_base_template(content, "Welcome to LinkDeal")
    
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


def send_verification_email(
    recipient_email: str,
    user_name: str,
    verification_token: str,
) -> None:
    """
    Send email verification email with a secure token link.
    
    Args:
        recipient_email: Email address of the user
        user_name: Full name of the user
        verification_token: Secure token for verification
    """
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
    verification_url = f"{frontend_url}/verify-email/{verification_token}"
    
    subject = "✉️ Verify Your Email - LinkDeal"
    message = f"""Hello {user_name},

Thank you for registering on LinkDeal! Please verify your email to activate your account.

Click the link below to verify your email:
{verification_url}

This link will expire in 24 hours.

If you didn't create an account on LinkDeal, please ignore this email.

Best regards,
LinkDeal Team
"""
    content = f"""
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(112, 8, 231, 0.15) 0%, rgba(142, 81, 255, 0.08) 100%); border-radius: 50%; line-height: 80px; margin-bottom: 20px;">
                <span style="font-size: 40px;">✉️</span>
            </div>
            <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600; color: #333333;">Verify Your Email</h2>
        </div>
        
        <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">
            Hello <strong style="color: #7008E7;">{user_name}</strong>,
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 16px; color: #555555; line-height: 1.6;">
            Thank you for registering on LinkDeal! Please verify your email to activate your account. 📧
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{verification_url}" style="display: inline-block; background: linear-gradient(135deg, #7008E7 0%, #8E51FF 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 25px rgba(112, 8, 231, 0.3);">
                ✅ Verify My Email
            </a>
        </div>
        
        <div style="background: linear-gradient(135deg, rgba(112, 8, 231, 0.08) 0%, rgba(142, 81, 255, 0.05) 100%); border: 1px solid rgba(112, 8, 231, 0.2); border-radius: 12px; padding: 16px 20px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #7008E7;">Verification Link:</p>
            <a href="{verification_url}" style="word-break: break-all; color: #7008E7; text-decoration: underline; font-size: 14px; line-height: 1.5;">{verification_url}</a>
        </div>
        
        <div style="background: linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%); border: 1px solid rgba(255, 152, 0, 0.3); border-radius: 12px; padding: 16px 20px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #333333; text-align: center;">
                ⏳ <strong style="color: #F57C00;">This link expires in 24 hours</strong>
            </p>
        </div>
        
        <p style="margin: 20px 0; font-size: 14px; color: #888888; line-height: 1.6; text-align: center;">
            If you didn't create an account on LinkDeal, please ignore this email.
        </p>
        
        <p style="margin: 30px 0 0 0; font-size: 14px; color: #888888; line-height: 1.6;">
            Best regards,<br>
            <strong style="color: #7008E7;">The LinkDeal Team</strong>
        </p>
    """
    
    html_message = get_email_base_template(content, "Verify Your Email - LinkDeal")
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Successfully sent verification email to {recipient_email}")
    except Exception as e:
        logger.error(f"Failed to send verification email to {recipient_email}: {e}", exc_info=True)
        raise  # Re-raise to let caller handle


def send_password_reset_email(
    recipient_email: str,
    user_name: str,
    reset_token: str,
) -> None:
    """
    Send password reset email with a secure token link.
    
    Args:
        recipient_email: Email address of the user
        user_name: Full name of the user (or email if name not available)
        reset_token: Secure token for password reset
    """
    frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
    reset_url = f"{frontend_url}/reset-password/{reset_token}"
    
    subject = "🔐 Reset Your Password - LinkDeal"
    message = f"""Hello {user_name},

You have requested to reset your password on LinkDeal.

Click the link below to set a new password:
{reset_url}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email. Your password will remain unchanged.

Best regards,
LinkDeal Team
"""
    content = f"""
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(255, 152, 0, 0.08) 100%); border-radius: 50%; line-height: 80px; margin-bottom: 20px;">
                <span style="font-size: 40px;">🔐</span>
            </div>
            <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600; color: #333333;">Reset Your Password</h2>
        </div>
        
        <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">
            Hello <strong style="color: #7008E7;">{user_name}</strong>,
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 16px; color: #555555; line-height: 1.6;">
            You have requested to reset your password on LinkDeal. Click the button below to set a new password.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="{reset_url}" style="display: inline-block; background: linear-gradient(135deg, #7008E7 0%, #8E51FF 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 25px rgba(112, 8, 231, 0.3);">
                🔑 Reset My Password
            </a>
        </div>
        
        <div style="background: linear-gradient(135deg, rgba(112, 8, 231, 0.08) 0%, rgba(142, 81, 255, 0.05) 100%); border: 1px solid rgba(112, 8, 231, 0.2); border-radius: 12px; padding: 16px 20px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600; color: #7008E7;">Reset Link:</p>
            <a href="{reset_url}" style="word-break: break-all; color: #7008E7; text-decoration: underline; font-size: 14px; line-height: 1.5;">{reset_url}</a>
        </div>
        
        <div style="background: linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%); border: 1px solid rgba(255, 152, 0, 0.3); border-radius: 12px; padding: 16px 20px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #333333; text-align: center;">
                ⏳ <strong style="color: #F57C00;">This link expires in 1 hour</strong>
            </p>
        </div>
        
        <div style="background: linear-gradient(135deg, rgba(211, 47, 47, 0.1) 0%, rgba(211, 47, 47, 0.05) 100%); border: 1px solid rgba(211, 47, 47, 0.3); border-radius: 12px; padding: 16px 20px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #333333; text-align: center;">
                ⚠️ <strong style="color: #d32f2f;">If you didn't request this</strong>, please ignore this email or contact support.
            </p>
        </div>
        
        <p style="margin: 30px 0 0 0; font-size: 14px; color: #888888; line-height: 1.6;">
            Best regards,<br>
            <strong style="color: #7008E7;">The LinkDeal Team</strong>
        </p>
    """
    
    html_message = get_email_base_template(content, "Reset Your Password - LinkDeal")
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Successfully sent password reset email to {recipient_email}")
    except Exception as e:
        logger.error(f"Failed to send password reset email to {recipient_email}: {e}", exc_info=True)
        raise  # Re-raise to let caller handle
