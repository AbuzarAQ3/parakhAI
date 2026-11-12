from django.contrib import admin
from .models import InspectorModel

@admin.register(InspectorModel)
class InspectorAdmin(admin.ModelAdmin):
    list_display = ("name", "inspector_id", "badge_number", "jurisdiction", "duty_status", "created_at")
    search_fields = ("name", "inspector_id", "badge_number", "jurisdiction")
    list_filter = ("duty_status",)
