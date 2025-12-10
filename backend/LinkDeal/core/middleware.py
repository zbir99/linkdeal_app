# core/middleware.py
import uuid
import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)


class RequestIDMiddleware(MiddlewareMixin):
    """
    Ensures every request has X-Request-ID (generate if missing)
    and logs basic info for debugging.
    """

    def process_request(self, request):
        rid = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        request.request_id = rid
        # Make ID available to views & logging
        request.META["HTTP_X_REQUEST_ID"] = rid

    def process_response(self, request, response):
        rid = getattr(request, "request_id", None)
        if rid:
            response["X-Request-ID"] = rid
            logger.info(
                "[%s] %s %s -> %s",
                rid,
                request.method,
                request.get_full_path(),
                response.status_code,
            )
        return response
