"""
예방접종 일정 계산 및 알림 생성 유틸리티

아이의 출생일을 기준으로 예방접종 일정을 자동 계산하고,
접종 1달 전 알림을 생성하는 로직을 제공합니다.
"""

import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional

from dateutil.relativedelta import relativedelta


class ImmunizationScheduleCalculator:
    """예방접종 일정 계산기"""

    def __init__(self, schedule_json_path: str = "immunization_schedule_2025.json"):
        """
        Args:
            schedule_json_path: 예방접종 일정 JSON 파일 경로
        """
        with open(schedule_json_path, "r", encoding="utf-8") as f:
            self.schedule_data = json.load(f)

        self.notification_advance_days = self.schedule_data["notification_settings"][
            "default_advance_days"
        ]

    def calculate_vaccination_date(
        self,
        birth_date: datetime,
        age_in_months: int,
        max_age_in_weeks: Optional[int] = None,
    ) -> datetime:
        """
        출생일 기준으로 예방접종 예정일 계산

        Args:
            birth_date: 아이의 출생일
            age_in_months: 접종 권장 개월 수
            max_age_in_weeks: 최대 주차 제한 (BCG 등)

        Returns:
            계산된 접종 예정일
        """
        if max_age_in_weeks:
            # 주 단위 계산 (BCG 등)
            return birth_date + timedelta(weeks=max_age_in_weeks)
        else:
            # 월 단위 계산
            return birth_date + relativedelta(months=age_in_months)

    def calculate_notification_date(self, vaccination_date: datetime) -> datetime:
        """
        접종일 기준 알림 날짜 계산 (기본 1달 전)

        Args:
            vaccination_date: 접종 예정일

        Returns:
            알림 날짜
        """
        return vaccination_date - timedelta(days=self.notification_advance_days)

    def get_child_schedule(
        self,
        birth_date: datetime,
        gender: Optional[str] = None,
        include_optional: bool = False,
    ) -> List[Dict]:
        """
        아이의 전체 예방접종 일정 생성

        Args:
            birth_date: 아이의 출생일
            gender: 성별 ('male', 'female', None)
            include_optional: 기타(선택) 접종 포함 여부

        Returns:
            접종 일정 리스트 (알림일 포함)
        """
        schedule = []
        today = datetime.now()

        for vaccine in self.schedule_data["vaccinations"]:
            # 국가필수만 또는 모든 접종
            if vaccine["vaccine_type"] == "기타" and not include_optional:
                continue

            for dose in vaccine["schedules"]:
                # 성별 필터링 (HPV 등)
                if "gender" in dose and gender and dose["gender"] != gender:
                    continue

                # 접종일 계산
                max_weeks = dose.get("max_age_in_weeks")
                vaccination_date = self.calculate_vaccination_date(
                    birth_date, dose["age_in_months"], max_weeks
                )

                # 과거 접종은 제외하고 미래 일정만 포함 (옵션)
                # if vaccination_date < today:
                #     continue

                # 알림일 계산
                notification_date = self.calculate_notification_date(vaccination_date)

                schedule_item = {
                    "vaccine_id": vaccine["id"],
                    "vaccine_name": vaccine["vaccine_name"],
                    "disease": vaccine["disease"],
                    "dose_number": dose["dose_number"],
                    "age_description": dose["age_description"],
                    "vaccination_date": vaccination_date.strftime("%Y-%m-%d"),
                    "notification_date": notification_date.strftime("%Y-%m-%d"),
                    "is_mandatory": dose.get("is_mandatory", False),
                    "is_annual": dose.get("is_annual", False),
                    "notes": dose.get("notes", ""),
                    "age_range_end": dose.get("age_range_end"),
                    "is_overdue": vaccination_date < today,
                }

                schedule.append(schedule_item)

        # 접종일 기준 정렬
        schedule.sort(key=lambda x: x["vaccination_date"])

        return schedule

    def get_upcoming_vaccinations(
        self, birth_date: datetime, gender: Optional[str] = None, days_ahead: int = 60
    ) -> List[Dict]:
        """
        다가오는 예방접종 일정 조회 (앞으로 N일 이내)

        Args:
            birth_date: 아이의 출생일
            gender: 성별
            days_ahead: 조회 기간 (기본 60일)

        Returns:
            다가오는 접종 일정 리스트
        """
        all_schedule = self.get_child_schedule(birth_date, gender)
        today = datetime.now()
        cutoff_date = today + timedelta(days=days_ahead)

        upcoming = [
            item
            for item in all_schedule
            if today
            <= datetime.strptime(item["vaccination_date"], "%Y-%m-%d")
            <= cutoff_date
        ]

        return upcoming

    def get_overdue_vaccinations(
        self, birth_date: datetime, gender: Optional[str] = None
    ) -> List[Dict]:
        """
        지연된 예방접종 조회

        Args:
            birth_date: 아이의 출생일
            gender: 성별

        Returns:
            지연된 접종 리스트
        """
        all_schedule = self.get_child_schedule(birth_date, gender)

        overdue = [
            item for item in all_schedule if item["is_overdue"] and item["is_mandatory"]
        ]

        return overdue


# ============== 사용 예시 ==============

if __name__ == "__main__":
    # 예방접종 계산기 초기화
    calculator = ImmunizationScheduleCalculator()

    # 예시: 2024년 1월 15일 출생 아이
    child_birth_date = datetime(2024, 1, 15)

    print("=" * 80)
    print(f"출생일: {child_birth_date.strftime('%Y년 %m월 %d일')}")
    print("=" * 80)

    # 1. 전체 예방접종 일정 조회
    print("\n[전체 예방접종 일정]")
    full_schedule = calculator.get_child_schedule(child_birth_date)

    for idx, item in enumerate(full_schedule[:10], 1):  # 첫 10개만 출력
        print(f"\n{idx}. {item['vaccine_name']} - {item['dose_number']}차")
        print(f"   질병: {item['disease']}")
        print(f"   접종 권장시기: {item['age_description']}")
        print(f"   접종 예정일: {item['vaccination_date']}")
        print(f"   알림 날짜: {item['notification_date']} (1달 전)")
        if item["is_overdue"]:
            print("   ⚠️  접종 지연")

    # 2. 다가오는 접종 (앞으로 60일 이내)
    print("\n" + "=" * 80)
    print("[다가오는 예방접종 (60일 이내)]")
    print("=" * 80)

    upcoming = calculator.get_upcoming_vaccinations(child_birth_date, days_ahead=60)

    if upcoming:
        for item in upcoming:
            print(f"\n- {item['vaccine_name']} ({item['dose_number']}차)")
            print(f"  접종 예정일: {item['vaccination_date']}")
            print(f"  알림 날짜: {item['notification_date']}")
    else:
        print("다가오는 접종이 없습니다.")

    # 3. 지연된 접종 확인
    print("\n" + "=" * 80)
    print("[지연된 예방접종]")
    print("=" * 80)

    overdue = calculator.get_overdue_vaccinations(child_birth_date)

    if overdue:
        for item in overdue:
            print(f"\n⚠️  {item['vaccine_name']} ({item['dose_number']}차)")
            print(f"   접종 예정일: {item['vaccination_date']}")
            print(f"   권장시기: {item['age_description']}")
    else:
        print("지연된 접종이 없습니다.")

    # 4. 특정 날짜 계산 예시
    print("\n" + "=" * 80)
    print("[날짜 계산 예시]")
    print("=" * 80)

    # BCG: 생후 4주 이내
    bcg_date = calculator.calculate_vaccination_date(
        child_birth_date, 0, max_age_in_weeks=4
    )
    print(f"\nBCG 접종일: {bcg_date.strftime('%Y-%m-%d')} (생후 4주 이내)")

    # B형간염 1차: 출생 직후
    hep_b_1 = calculator.calculate_vaccination_date(child_birth_date, 0)
    print(f"B형간염 1차: {hep_b_1.strftime('%Y-%m-%d')} (출생 직후)")

    # DTaP 1차: 생후 2개월
    dtap_1 = calculator.calculate_vaccination_date(child_birth_date, 2)
    dtap_1_notify = calculator.calculate_notification_date(dtap_1)
    print(f"DTaP 1차: {dtap_1.strftime('%Y-%m-%d')} (생후 2개월)")
    print(f"  → 알림일: {dtap_1_notify.strftime('%Y-%m-%d')} (1달 전)")

    print("\n" + "=" * 80)
