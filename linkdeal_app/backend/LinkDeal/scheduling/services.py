import os
import requests
import logging
from datetime import timedelta
from django.conf import settings

logger = logging.getLogger(__name__)

class WherebyService:
    BASE_URL = "https://api.whereby.dev/v1"
    
    @staticmethod
    def get_headers():
        api_key = getattr(settings, 'WHEREBY_API_KEY', '') or os.getenv('WHEREBY_API_KEY', '')
        if not api_key:
            logger.warning("WHEREBY_API_KEY is not set.")
            return None
        return {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    @classmethod
    def create_meeting(cls, session_obj, is_locked=True):
        """
        Create a meeting room in Whereby.
        Returns a dict with meeting details or None if failed.
        """
        headers = cls.get_headers()
        if not headers:
            return None

        # Determine end time from session duration
        end_time = session_obj.scheduled_at + timedelta(minutes=session_obj.duration_minutes + 30) # +30min buffer
        
        payload = {
            "endDate": end_time.isoformat(),
            "isLocked": is_locked,
            "roomNamePrefix": "linkdeal-",
            "roomMode": "group", # or "normal"
            "fields": ["hostRoomUrl"] # Request host URL in response
        }

        try:
            response = requests.post(f"{cls.BASE_URL}/meetings", json=payload, headers=headers)
            if response.status_code == 201:
                data = response.json()
                logger.info(f"Whereby meeting created: {data.get('meetingId')}")
                return data
            else:
                logger.error(f"Failed to create Whereby meeting: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            logger.error(f"Error creating Whereby meeting: {e}")
            return None

    @classmethod
    def delete_meeting(cls, meeting_id):
        """
        Delete a meeting room.
        """
        headers = cls.get_headers()
        if not headers:
            return False

        try:
            response = requests.delete(f"{cls.BASE_URL}/meetings/{meeting_id}", headers=headers)
            if response.status_code == 204:
                logger.info(f"Whereby meeting deleted: {meeting_id}")
                return True
            else:
                logger.error(f"Failed to delete Whereby meeting: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            logger.error(f"Error deleting Whereby meeting: {e}")
            return False

    @classmethod
    def get_meeting_info(cls, meeting_id):
        """
        Get info about a meeting.
        """
        headers = cls.get_headers()
        if not headers:
            return None
            
        try:
            response = requests.get(f"{cls.BASE_URL}/meetings/{meeting_id}", headers=headers)
            if response.status_code == 200:
                return response.json()
            return None
        except Exception as e:
            logger.error(f"Error getting Whereby meeting info: {e}")
            return None
