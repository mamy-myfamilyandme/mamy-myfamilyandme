"""
예방접종 일정 생성 서비스
"""

from datetime import datetime
from children.models import Child
from vaccinations.models import VaccinationSchedule, VaccinationNotification
from immunization_calculator import ImmunizationScheduleCalculator
import os
from pathlib import Path


def create_vaccination_schedules(child: Child) -> int:
    """
    아이의 출생일 기준으로 예방접종 일정 자동 생성

    Args:
        child: Child 모델 인스턴스

    Returns:
        생성된 일정 개수
    """
    # immunization_schedule_2025.json 경로
    base_dir = Path(__file__).resolve().parent.parent
    schedule_json_path = base_dir / "immunization_schedule_2025.json"

    # 계산기 초기화
    calculator = ImmunizationScheduleCalculator(str(schedule_json_path))

    # 출생일을 datetime 객체로 변환
    birth_datetime = datetime.combine(child.birth_date, datetime.min.time())

    # 전체 예방접종 일정 계산
    schedules = calculator.get_child_schedule(
        birth_date=birth_datetime, gender=child.gender, include_optional=False
    )

    created_count = 0

    for schedule_item in schedules:
        # VaccinationSchedule 생성
        vaccination_schedule = VaccinationSchedule.objects.create(
            child=child,
            vaccine_id=schedule_item["vaccine_id"],
            vaccine_name=schedule_item["vaccine_name"],
            disease=schedule_item["disease"],
            dose_number=schedule_item["dose_number"],
            age_description=schedule_item["age_description"],
            vaccination_date=datetime.strptime(
                schedule_item["vaccination_date"], "%Y-%m-%d"
            ).date(),
            notification_date=datetime.strptime(
                schedule_item["notification_date"], "%Y-%m-%d"
            ).date(),
            is_mandatory=schedule_item["is_mandatory"],
            is_annual=schedule_item["is_annual"],
            notes=schedule_item.get("notes", ""),
        )

        # 알림 생성 (1달 전)
        VaccinationNotification.objects.create(
            schedule=vaccination_schedule,
            notification_date=vaccination_schedule.notification_date,
            status="pending",
        )

        created_count += 1

    return created_count


def get_upcoming_schedules(child: Child, days_ahead: int = 60):
    """
    다가오는 예방접종 일정 조회

    Args:
        child: Child 모델 인스턴스
        days_ahead: 조회 기간 (기본 60일)

    Returns:
        다가오는 일정 QuerySet
    """
    return VaccinationSchedule.objects.filter(
        child=child, is_completed=False
    ).select_related("child")[:days_ahead]


def get_overdue_schedules(child: Child):
    """
    지연된 예방접종 조회

    Args:
        child: Child 모델 인스턴스

    Returns:
        지연된 일정 QuerySet
    """
    from datetime import date

    return VaccinationSchedule.objects.filter(
        child=child, is_completed=False, is_mandatory=True, vaccination_date__lt=date.today()
    ).select_related("child")
