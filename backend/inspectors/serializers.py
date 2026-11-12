from rest_framework import serializers
from .models import InspectorModel


class InspectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = InspectorModel
        fields = [
            "id",
            "name",
            "designation",
            "department",
            "inspector_id",
            "badge_number",
            "jurisdiction",
            "phone",
            "duty_status",
            "created_at",
            "updated_at",
        ]
