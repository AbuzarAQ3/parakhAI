import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class SupervisorModel(models.Model):
    DUTY_STATUS_CHOICES = [
        ("ON_DUTY", "On Duty / Active"),
        ("OFF_DUTY", "Off Duty"),
        ("ON_FIELD", "On Field"),
        ("LEAVE", "On Leave"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="supervisor_profile")
    name = models.CharField(max_length=255, default="Supervisor Rajesh Kumar")
    designation = models.CharField(max_length=255, default="Senior Legal Metrology Supervisor")
    department = models.CharField(
        max_length=255,
        default="Department of Consumer Affairs, Legal Metrology Division",
    )
    supervisor_id = models.CharField(max_length=64, unique=True)
    badge_number = models.CharField(max_length=64, default="LM-9942")
    jurisdiction = models.CharField(max_length=255, default="Kanpur Nagar, Uttar Pradesh (Zone 4)")
    phone = models.CharField(max_length=32, default="+91 94150 12844")
    duty_status = models.CharField(max_length=32, choices=DUTY_STATUS_CHOICES, default="ON_DUTY")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "parakh_supervisor"
        verbose_name = "Supervisor"
        verbose_name_plural = "Supervisor"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.supervisor_id})"
