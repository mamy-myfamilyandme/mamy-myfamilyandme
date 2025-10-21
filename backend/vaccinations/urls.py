"""
예방접종 URL 설정
"""

from django.urls import include, path
from rest_framework.routers import DefaultRouter

from vaccinations.views import (
    VaccinationNotificationViewSet,
    VaccinationScheduleViewSet,
)

router = DefaultRouter()
router.register(r"schedules", VaccinationScheduleViewSet, basename="schedule")
router.register(
    r"notifications", VaccinationNotificationViewSet, basename="notification"
)

urlpatterns = [
    path("", include(router.urls)),
]
