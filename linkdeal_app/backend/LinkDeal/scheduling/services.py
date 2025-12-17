"""
Whereby integration service for video calls.
Handles creating, managing, and deleting Whereby rooms.
"""
import logging
import requests
from datetime import timedelta
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)


class WherebyService:
    """
    Service to interact with Whereby API for video room management.
    
    Whereby API docs: https://docs.whereby.com/reference/whereby-rest-api-reference
    """
    
    BASE_URL = "https://api.whereby.dev/v1"
    
    def __init__(self):
        self.api_key = getattr(settings, 'WHEREBY_API_KEY', '')
        if not self.api_key:
            logger.warning("WHEREBY_API_KEY not configured")
    
    @property
    def headers(self):
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    def create_meeting(self, session):
        """
        Create a Whereby meeting room for a session.
        
        Args:
            session: Session model instance
            
        Returns:
            dict with room_url, host_room_url, meeting_id
        """
        if not self.api_key:
            logger.error("Cannot create Whereby meeting: API key not configured")
            return None
        
        # Calculate end time (session time + 30 min buffer)
        end_time = session.scheduled_at + timedelta(minutes=session.duration_minutes + 30)
        
        # Room name based on session
        room_name = f"linkdeal-{session.id}"
        
        payload = {
            "roomNamePrefix": room_name[:39],  # Max 39 chars
            "roomMode": "group",  # or "normal" for 1:1
            "endDate": end_time.isoformat(),
            "fields": ["hostRoomUrl"],
        }
        
        try:
            response = requests.post(
                f"{self.BASE_URL}/meetings",
                json=payload,
                headers=self.headers,
                timeout=30
            )
            
            if response.status_code == 201:
                data = response.json()
                
                # Update session with Whereby data
                session.whereby_room_url = data.get("roomUrl", "")
                session.whereby_host_room_url = data.get("hostRoomUrl", "")
                session.whereby_meeting_id = data.get("meetingId", "")
                session.video_room_id = data.get("meetingId", "")
                session.save(update_fields=[
                    'whereby_room_url', 
                    'whereby_host_room_url', 
                    'whereby_meeting_id',
                    'video_room_id'
                ])
                
                logger.info(f"Created Whereby room for session {session.id}")
                
                return {
                    "room_url": data.get("roomUrl"),
                    "host_room_url": data.get("hostRoomUrl"),
                    "meeting_id": data.get("meetingId"),
                }
            else:
                logger.error(f"Whereby API error: {response.status_code} - {response.text}")
                return None
                
        except requests.RequestException as e:
            logger.error(f"Whereby request failed: {str(e)}")
            return None
    
    def delete_meeting(self, meeting_id):
        """
        Delete a Whereby meeting room.
        
        Args:
            meeting_id: Whereby meeting ID
            
        Returns:
            bool: True if deleted successfully
        """
        if not self.api_key or not meeting_id:
            return False
        
        try:
            response = requests.delete(
                f"{self.BASE_URL}/meetings/{meeting_id}",
                headers=self.headers,
                timeout=30
            )
            
            if response.status_code in [200, 204]:
                logger.info(f"Deleted Whereby meeting {meeting_id}")
                return True
            else:
                logger.error(f"Failed to delete Whereby meeting: {response.status_code}")
                return False
                
        except requests.RequestException as e:
            logger.error(f"Whereby delete request failed: {str(e)}")
            return False
    
    def get_meeting_info(self, meeting_id):
        """
        Get information about a Whereby meeting.
        
        Args:
            meeting_id: Whereby meeting ID
            
        Returns:
            dict with meeting info or None
        """
        if not self.api_key or not meeting_id:
            return None
        
        try:
            response = requests.get(
                f"{self.BASE_URL}/meetings/{meeting_id}",
                headers=self.headers,
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()
            return None
            
        except requests.RequestException as e:
            logger.error(f"Whereby get request failed: {str(e)}")
            return None


# Singleton instance
whereby_service = WherebyService()
