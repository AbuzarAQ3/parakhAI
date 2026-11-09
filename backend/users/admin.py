from django.contrib import admin
from .models import User


@admin.register(User)
class InspectorAdmin(admin.ModelAdmin):
    list_display = ("username", "first_name", "last_name", "is_active")
    search_fields = ("username",)
