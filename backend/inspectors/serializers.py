from rest_framework import serializers
from .models import Inspector


class InspectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inspector
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
