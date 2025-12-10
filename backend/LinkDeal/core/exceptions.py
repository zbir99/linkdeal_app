# core/exception_handler.py
import uuid
import logging
from rest_framework.views import exception_handler as drf_exception_handler
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import APIException

logger = logging.getLogger(__name__)


class ExternalServiceError(APIException):
    """
    Used for Auth0, payment providers, S3, etc.
    """
    status_code = status.HTTP_502_BAD_GATEWAY
    default_detail = "Error while communicating with an external service."
    default_code = "external_service_error"


def custom_exception_handler(exc, context):
    """
    Enterprise-grade global exception handler.
    Ensures every API error has consistent format + correlation ID.
    """
    request = context.get("request")
    # Reuse incoming ID if frontend sends one, else generate
    correlation_id = request.headers.get("X-Request-ID") if request else None
    if not correlation_id:
        correlation_id = str(uuid.uuid4())

    # First let DRF build a normal Response for known exceptions
    response = drf_exception_handler(exc, context)

    if response is not None:
        status_code = response.status_code

        if isinstance(response.data, dict):
            if "detail" in response.data and len(response.data) == 1:
                message = str(response.data["detail"])
                details = None
            else:
                message = "Validation error" if status_code == 400 else "Request error"
                details = response.data
        else:
            message = str(response.data)
            details = None

        response.data = {
            "success": False,
            "code": status_code,
            "error": {
                "type": exc.__class__.__name__,
                "message": message,
                "details": details,
            },
            "correlation_id": correlation_id,
        }
        return response

    # Unhandled exception → log full traceback *with* correlation id
    if request:
        logger.exception(
            "Unhandled exception [%s] - %s %s",
            correlation_id,
            request.method,
            request.path,
            exc_info=exc,
        )
    else:
        logger.exception("Unhandled exception [%s]", correlation_id, exc_info=exc)

    return Response(
        {
            "success": False,
            "code": status.HTTP_500_INTERNAL_SERVER_ERROR,
            "error": {
                "type": "ServerError",
                "message": "An unexpected error occurred. Please try again later.",
                "details": None,
            },
            "correlation_id": correlation_id,
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
