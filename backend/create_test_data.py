"""
테스트 데이터 생성 스크립트
"""

import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from datetime import date
from accounts.models import User
from children.models import Child
from vaccinations.services import create_vaccination_schedules

def create_test_data():
    """테스트 사용자, 자녀, 예방접종 일정 생성"""

    # 테스트 사용자 생성 또는 가져오기
    user, created = User.objects.get_or_create(
        email="test@example.com",
        defaults={
            "username": "testuser",
            "user_mode": "caregiver",
        }
    )

    if created:
        user.set_password("test1234")
        user.save()
        print(f"✅ 사용자 생성: {user.email}")
    else:
        print(f"ℹ️  기존 사용자 사용: {user.email}")

    # 테스트 자녀 생성 또는 가져오기
    child, created = Child.objects.get_or_create(
        user=user,
        name="테스트 아이",
        defaults={
            "birth_date": date(2024, 1, 15),  # 2024년 1월 15일 출생
            "gender": "male",
        }
    )

    if created:
        print(f"✅ 자녀 생성: {child.name} (ID: {child.id})")
    else:
        print(f"ℹ️  기존 자녀 사용: {child.name} (ID: {child.id})")

    # 기존 예방접종 일정 확인
    from vaccinations.models import VaccinationSchedule
    existing_schedules = VaccinationSchedule.objects.filter(child=child).count()

    if existing_schedules > 0:
        print(f"ℹ️  이미 {existing_schedules}개의 예방접종 일정이 존재합니다.")

        response = input("기존 일정을 삭제하고 새로 생성하시겠습니까? (y/n): ")
        if response.lower() == 'y':
            VaccinationSchedule.objects.filter(child=child).delete()
            print("✅ 기존 일정 삭제 완료")
        else:
            print("❌ 생성 취소")
            return

    # 예방접종 일정 생성
    print(f"\n📅 예방접종 일정 생성 중...")
    created_count = create_vaccination_schedules(child)
    print(f"✅ {created_count}개의 예방접종 일정이 생성되었습니다!")

    print(f"\n" + "=" * 60)
    print(f"테스트 계정 정보:")
    print(f"  이메일: {user.email}")
    print(f"  비밀번호: test1234")
    print(f"  자녀 ID: {child.id}")
    print(f"  자녀 이름: {child.name}")
    print(f"  출생일: {child.birth_date}")
    print(f"=" * 60)

if __name__ == "__main__":
    create_test_data()
