"""
예방접종 시리얼라이저
"""

from rest_framework import serializers
from vaccinations.models import VaccinationSchedule, VaccinationNotification


class VaccinationScheduleSerializer(serializers.ModelSerializer):
    """예방접종 일정 시리얼라이저"""

    is_overdue = serializers.ReadOnlyField()
    is_upcoming = serializers.ReadOnlyField()

    class Meta:
        model = VaccinationSchedule
        fields = [
            "id",
            "child",
            "vaccine_id",
            "vaccine_name",
            "disease",
            "dose_number",
            "age_description",
            "vaccination_date",
            "notification_date",
            "is_completed",
            "completed_date",
            "is_mandatory",
            "is_annual",
            "notes",
            "is_overdue",
            "is_upcoming",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class VaccinationNotificationSerializer(serializers.ModelSerializer):
    """예방접종 알림 시리얼라이저"""

    schedule = VaccinationScheduleSerializer(read_only=True)

    class Meta:
        model = VaccinationNotification
        fields = [
            "id",
            "schedule",
            "notification_date",
            "status",
            "sent_at",
            "read_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["created_at", "updated_at"]


class VaccinationStatsSerializer(serializers.Serializer):
    """예방접종 통계 시리얼라이저"""

    total = serializers.IntegerField()
    completed = serializers.IntegerField()
    upcoming = serializers.IntegerField()
    overdue = serializers.IntegerField()
    completion_rate = serializers.FloatField()
