"""
예방접종 URL 설정
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from vaccinations.views import (
    VaccinationScheduleViewSet,
    VaccinationNotificationViewSet,
)

router = DefaultRouter()
router.register(r"schedules", VaccinationScheduleViewSet, basename="schedule")
router.register(
    r"notifications", VaccinationNotificationViewSet, basename="notification"
)

urlpatterns = [
    path("", include(router.urls)),
]
