from django.db import models
from django.conf import settings
import uuid

User = settings.AUTH_USER_MODEL

class InspectorModel(models.Model):
    DUTY_STATUS_CHOICES = [
        ("ON_DUTY", "On Duty / Active"),
        ("OFF_DUTY", "Off Duty"),
        ("ON_FIELD", "On Field Inspection"),
        ("LEAVE", "On Leave"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="inspector_profile")
    name = models.CharField(max_length=255, default="Inspector Rajesh Kumar")
    designation = models.CharField(max_length=255, default="Senior Legal Metrology Officer")
    department = models.CharField(
        max_length=255,
        default="Department of Consumer Affairs, Legal Metrology Division",
    )
    inspector_id = models.CharField(max_length=64, unique=True, default="INSP-UP-KN-4421")
    badge_number = models.CharField(max_length=64, default="LM-9942")
    jurisdiction = models.CharField(max_length=255, default="Kanpur Nagar, Uttar Pradesh (Zone 4)")
    phone = models.CharField(max_length=32, default="+91 94150 12844")
    duty_status = models.CharField(max_length=32, choices=DUTY_STATUS_CHOICES, default="ON_DUTY")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "parakh_inspectors"
        verbose_name = "Inspector"
        verbose_name_plural = "Inspectors"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.inspector_id})"