# accounts/validators.py
import os
from django.core.exceptions import ValidationError
from django.utils.deconstruct import deconstructible


@deconstructible
class FileSizeValidator:
    """
    Validate that a file is not bigger than max_mb megabytes.
    This is safe for migrations because it's deconstructible.
    """
    def __init__(self, max_mb):
        self.max_mb = max_mb

    def __call__(self, file):
        limit = self.max_mb * 1024 * 1024
        if file.size > limit:
            raise ValidationError(f"File too large. Max size is {self.max_mb} MB.")

    def __eq__(self, other):
        return isinstance(other, FileSizeValidator) and self.max_mb == other.max_mb


@deconstructible
class FileExtensionValidator:
    """
    Validate that a file has one of the allowed extensions.
    """
    def __init__(self, allowed_extensions):
        self.allowed_extensions = [ext.lower() for ext in allowed_extensions]

    def __call__(self, file):
        ext = os.path.splitext(file.name)[1][1:].lower()
        if ext not in self.allowed_extensions:
            raise ValidationError(
                f"Invalid file extension '{ext}'. "
                f"Allowed: {', '.join(self.allowed_extensions)}."
            )

    def __eq__(self, other):
        return (
            isinstance(other, FileExtensionValidator)
            and self.allowed_extensions == other.allowed_extensions
        )
