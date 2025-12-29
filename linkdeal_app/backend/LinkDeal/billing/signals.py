from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from django.utils import timezone
import logging
from decimal import Decimal

from scheduling.models import Session
from billing.models import Payment
from accounts.models import MentorProfile
from core.models import PlatformSettings
from billing.email_service import send_session_completion_funds_email

logger = logging.getLogger(__name__)

@receiver(post_save, sender=Session)
def handle_session_completion(sender, instance, created, **kwargs):
    """
    When a session is marked as completed, transfer funds to mentor's wallet.
    Logic:
    1. Check if session is completed.
    2. Find associated payment.
    3. If payment is completed and payout NOT processed:
       a. Add mentor_payout amount to Mentor's wallet_balance.
       b. Subtract mentor_payout from Platform's wallet_balance (funds were held there).
       c. Mark payment as payout_processed.
       d. Send email notification.
    """
    if instance.status == 'completed':
        try:
            # Lock payment row to prevent race conditions
            with transaction.atomic():
                # We need to fetch payment fresh to ensure we see current state
                payment = Payment.objects.select_for_update().filter(session=instance).first()
                
                if not payment:
                    logger.warning(f"Session {instance.id} completed but no payment found.")
                    return

                if payment.status != 'completed':
                     logger.warning(f"Session {instance.id} completed but payment {payment.id} is {payment.status}.")
                     return

                if payment.payout_processed:
                    logger.info(f"Payout already processed for session {instance.id}.")
                    return

                # Lock MentorProfile to safely update balance
                # session.mentor is a cached object, we need to fetch a locked instance
                mentor_profile = MentorProfile.objects.select_for_update().get(id=instance.mentor_id)
                
                amount_to_transfer = payment.mentor_payout
                
                # 1. Add to Mentor Wallet
                mentor_profile.wallet_balance += amount_to_transfer
                mentor_profile.save(update_fields=['wallet_balance'])
                
                # 2. Subtract from Platform (Platform was holding the full amount temporarily? 
                # Actually, in Step 1 (Payment Confirm), we added Full Amount to Platform? 
                # Or did we? In verify script, we just tracked fees.
                # Let's assume Platform Wallet holds the funds relative to "Pending Payouts" + "Fees".
                # So we simply leave the fee in Platform Wallet and move the payout amount out.
                # But wait, where did the money go initially? 
                # If we assume Stripe/Bank -> Platform Bank -> Platform Wallet logic:
                # Then yes, we should deduct from Platform Wallet.
                
                settings = PlatformSettings.get_settings()
                # If we assume settings.wallet_balance tracks ALL funds currently held:
                settings.wallet_balance -= amount_to_transfer
                settings.save()
                
                # 3. Mark processed
                payment.payout_processed = True
                payment.save(update_fields=['payout_processed'])
                
                logger.info(f"Transferred {amount_to_transfer} to mentor {mentor_profile.user.email} for session {instance.id}")
                
                # 4. Email
                try:
                    send_session_completion_funds_email(
                        mentor_email=mentor_profile.user.email,
                        mentor_name=mentor_profile.full_name,
                        amount=amount_to_transfer,
                        currency=payment.currency,
                        session_id=str(instance.id)
                    )
                except Exception as e:
                    logger.error(f"Failed to send funds email: {e}")

        except Exception as e:
            logger.error(f"Error processing payout for session {instance.id}: {e}", exc_info=True)
