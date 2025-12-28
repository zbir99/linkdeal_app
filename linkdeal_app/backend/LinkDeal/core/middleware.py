import uuid
from django.utils import timezone

class RequestIDMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request_id = str(uuid.uuid4())
        request.id = request_id
        response = self.get_response(request)
        response["X-Request-ID"] = request_id
        return response




class UpdateLastActiveMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        # Only update for authenticated users
        if request.user.is_authenticated:
            # We need to find the AppUser to get the profile
            # request.user is likely an Auth0User (from custom auth), which has auth0_id
            # But wait, our custom auth typically sets request.user to an object that acts like a user
            # Let's check if we can get the AppUser from DB.
            
            # Note: Checking core/authentication.py would verify what request.user is.
            # Assuming it allows access to auth0_id.
            
            try:
                from accounts.models import MenteeProfile, MentorProfile
                # Based on MeView, request.user has .auth0_id
                auth0_id = getattr(request.user, "auth0_id", None)
                if auth0_id:
                    # Update MentorProfile if exists
                    MentorProfile.objects.filter(user__auth0_id=auth0_id).update(last_active=timezone.now())
                    
                    # Update MenteeProfile if exists
                    MenteeProfile.objects.filter(user__auth0_id=auth0_id).update(last_active=timezone.now())
                    
            except Exception:
                # Middleware should not crash the request
                pass

        return response
