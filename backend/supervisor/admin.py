from django.contrib import admin
from .models import SupervisorModel

@admin.register(SupervisorModel)
class SupervisorAdmin(admin.ModelAdmin):
    list_display = ("name", "supervisor_id", "badge_number", "jurisdiction", "duty_status", "created_at")
    search_fields = ("name", "supervisor_id", "badge_number", "jurisdiction")
    list_filter = ("duty_status",)
