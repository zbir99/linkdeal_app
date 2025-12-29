from django.db import models


class PlatformSettings(models.Model):
    """
    Singleton model for platform-wide settings.
    Only one instance should exist.
    """
    platform_fee_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=10.00,
        help_text="Platform fee percentage charged per session (e.g., 10 = 10%)"
    )
    min_session_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=50.00,
        help_text="Minimum allowed session price for mentors (in EUR)"
    )
    currency = models.CharField(
        max_length=3,
        default="EUR",
        help_text="Default platform currency"
    )

    # Platform Bank Account (for receiving fees)
    bank_name = models.CharField(
        max_length=255,
        blank=True,
        help_text="Platform Bank Name"
    )
    iban = models.CharField(
        max_length=100,
        blank=True,
        help_text="Platform IBAN"
    )
    swift_bic = models.CharField(max_length=11, blank=True, help_text="Platform SWIFT/BIC")
    wallet_balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.00,
        help_text="Accumulated platform fees"
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Platform Settings"
        verbose_name_plural = "Platform Settings"

    def save(self, *args, **kwargs):
        # Ensure only one instance exists (singleton pattern)
        if not self.pk and PlatformSettings.objects.exists():
            # Update existing instance instead of creating new one
            existing = PlatformSettings.objects.first()
            self.pk = existing.pk
        super().save(*args, **kwargs)

    @classmethod
    def get_settings(cls):
        """Get or create the singleton settings instance."""
        settings, _ = cls.objects.get_or_create(pk=1)
        return settings

    def __str__(self):
        return f"Platform Settings (Fee: {self.platform_fee_percentage}%, Min Price: {self.currency}{self.min_session_price})"
