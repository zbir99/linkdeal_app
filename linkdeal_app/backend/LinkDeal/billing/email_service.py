import logging
from django.conf import settings
from django.core.mail import send_mail
from accounts.email_service import get_email_base_template

logger = logging.getLogger(__name__)

def send_payment_confirmation_email(mentee_email, mentee_name, amount, currency, reference):
    """
    Send email to mentee confirming their payment.
    """
    subject = "✅ Payment Successful - LinkDeal"
    message = f"Hello {mentee_name},\n\nYour payment of {amount} {currency} has been successfully processed.\nReference: {reference}\n\nThank you for using LinkDeal!"
    
    content = f"""
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.05) 100%); border-radius: 50%; margin-bottom: 20px; line-height: 80px;">
                <span style="font-size: 40px;">💰</span>
            </div>
            <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600; color: #4CAF50;">Payment Successful</h2>
        </div>
        
        <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">
            Hello <strong style="color: #7008E7;">{mentee_name}</strong>,
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 16px; color: #555555; line-height: 1.6;">
            Your payment for the mentoring session has been successfully processed.
        </p>
        
        <div style="background: linear-gradient(135deg, rgba(112, 8, 231, 0.08) 0%, rgba(142, 81, 255, 0.05) 100%); border: 1px solid rgba(112, 8, 231, 0.2); border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: 700; color: #333333;">{amount} {currency}</p>
            <p style="margin: 0; font-size: 14px; color: #666666;">Reference: {reference}</p>
        </div>
        
        <p style="margin: 30px 0 0 0; font-size: 14px; color: #888888; line-height: 1.6;">
            Best regards,<br>
            <strong style="color: #7008E7;">The LinkDeal Team</strong>
        </p>
    """
    
    html_message = get_email_base_template(content, "Payment Confirmation")
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[mentee_email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Payment confirmation email sent to {mentee_email}")
    except Exception as e:
        logger.error(f"Failed to send payment confirmation email: {e}")

def send_new_booking_email(mentor_email, mentor_name, session_date, mentee_name):
    """
    Send email to mentor about a new paid booking.
    """
    subject = "📅 New Session Booked & Paid - LinkDeal"
    message = f"Hello {mentor_name},\n\nYou have a new confirmed session with {mentee_name} on {session_date}.\nThe payment is secured."
    
    content = f"""
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(112, 8, 231, 0.15) 0%, rgba(142, 81, 255, 0.08) 100%); border-radius: 50%; margin-bottom: 20px; line-height: 80px;">
                <span style="font-size: 40px;">📅</span>
            </div>
            <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600; color: #333333;">New Paid Session!</h2>
        </div>
        
        <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">
            Hello <strong style="color: #7008E7;">{mentor_name}</strong>,
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 16px; color: #555555; line-height: 1.6;">
            Great news! You have a new confirmed session with <strong>{mentee_name}</strong>.
        </p>
        
        <div style="background: linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%); border: 1px solid rgba(255, 152, 0, 0.3); border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 5px 0; font-size: 14px; color: #666666;">Date & Time:</p>
            <p style="margin: 0; font-size: 16px; font-weight: 600; color: #333333;">{session_date}</p>
        </div>
        
        <p style="margin: 20px 0; font-size: 14px; color: #555555;">
            The payment is secured by LinkDeal. Funds will be released to your wallet upon session completion.
        </p>

        <div style="text-align: center; margin: 30px 0;">
            <a href="https://linkdeal.com/dashboard" style="display: inline-block; background: linear-gradient(135deg, #7008E7 0%, #8E51FF 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 8px 25px rgba(112, 8, 231, 0.3);">
                View Session
            </a>
        </div>
        
        <p style="margin: 30px 0 0 0; font-size: 14px; color: #888888; line-height: 1.6;">
            Best regards,<br>
            <strong style="color: #7008E7;">The LinkDeal Team</strong>
        </p>
    """
    
    html_message = get_email_base_template(content, "New Session Booked")
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[mentor_email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"New booking email sent to {mentor_email}")
    except Exception as e:
        logger.error(f"Failed to send new booking email: {e}")

def send_session_completion_funds_email(mentor_email, mentor_name, amount, currency, session_id):
    """
    Send email to mentor when funds are added to wallet after session.
    """
    subject = "💵 Funds Added to Wallet - LinkDeal"
    message = f"Hello {mentor_name},\n\nThe session {session_id} is complete. {amount} {currency} has been added to your wallet."
    
    content = f"""
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.05) 100%); border-radius: 50%; margin-bottom: 20px; line-height: 80px;">
                <span style="font-size: 40px;">💵</span>
            </div>
            <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600; color: #4CAF50;">Funds Received</h2>
        </div>
        
        <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">
            Hello <strong style="color: #7008E7;">{mentor_name}</strong>,
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 16px; color: #555555; line-height: 1.6;">
            The session has been successfully completed.
        </p>
        
        <div style="background: linear-gradient(135deg, rgba(112, 8, 231, 0.08) 0%, rgba(142, 81, 255, 0.05) 100%); border: 1px solid rgba(112, 8, 231, 0.2); border-radius: 12px; padding: 20px; margin: 20px 0;">
             <p style="margin: 0 0 5px 0; font-size: 14px; color: #666666;">Added to Wallet:</p>
            <p style="margin: 0; font-size: 20px; font-weight: 700; color: #333333;">{amount} {currency}</p>
        </div>
        
        <p style="margin: 20px 0; font-size: 14px; color: #555555;">
            You can request a payout once your balance reaches $200.
        </p>

        <p style="margin: 30px 0 0 0; font-size: 14px; color: #888888; line-height: 1.6;">
            Best regards,<br>
            <strong style="color: #7008E7;">The LinkDeal Team</strong>
        </p>
    """
    
    html_message = get_email_base_template(content, "Funds Received")
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[mentor_email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Funds received email sent to {mentor_email}")
    except Exception as e:
        logger.error(f"Failed to send funds received email: {e}")

def send_payout_processed_email(mentor_email, mentor_name, amount, currency, iban):
    """
    Send email to mentor when payout is processed.
    """
    subject = "🏦 Payout Processed - LinkDeal"
    message = f"Hello {mentor_name},\n\nYour payout of {amount} {currency} has been sent to your bank account ending in {iban[-4:]}."
    
    content = f"""
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, rgba(33, 150, 243, 0.15) 0%, rgba(33, 150, 243, 0.05) 100%); border-radius: 50%; margin-bottom: 20px; line-height: 80px;">
                <span style="font-size: 40px;">🏦</span>
            </div>
            <h2 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 600; color: #2196F3;">Payout Sent</h2>
        </div>
        
        <p style="margin: 0 0 20px 0; font-size: 16px; color: #333333; line-height: 1.6;">
            Hello <strong style="color: #7008E7;">{mentor_name}</strong>,
        </p>
        
        <p style="margin: 0 0 20px 0; font-size: 16px; color: #555555; line-height: 1.6;">
            Your payout request has been processed and funds are on the way to your bank.
        </p>
        
        <div style="background: linear-gradient(135deg, rgba(112, 8, 231, 0.08) 0%, rgba(142, 81, 255, 0.05) 100%); border: 1px solid rgba(112, 8, 231, 0.2); border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: 700; color: #333333;">{amount} {currency}</p>
            <p style="margin: 0; font-size: 14px; color: #666666;">IBAN: ...{iban[-4:]}</p>
        </div>
        
        <p style="margin: 20px 0; font-size: 14px; color: #555555;">
            Please allow 1-3 business days for the funds to appear in your account.
        </p>

        <p style="margin: 30px 0 0 0; font-size: 14px; color: #888888; line-height: 1.6;">
            Best regards,<br>
            <strong style="color: #7008E7;">The LinkDeal Team</strong>
        </p>
    """
    
    html_message = get_email_base_template(content, "Payout Processed")
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[mentor_email],
            html_message=html_message,
            fail_silently=False,
        )
        logger.info(f"Payout email sent to {mentor_email}")
    except Exception as e:
        logger.error(f"Failed to send payout email: {e}")
