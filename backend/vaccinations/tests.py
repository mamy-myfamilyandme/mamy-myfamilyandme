"""
Vaccinations 앱 테스트

실행 방법:
    pytest vaccinations/tests.py
    pytest vaccinations/tests.py::TestVaccineModel
"""

import pytest
from datetime import date


# ============================================
# 기본 테스트 (모델 만들기 전)
# ============================================


@pytest.mark.django_db
class TestVaccinationsAppBasics:
    """Vaccinations 앱 기본 설정 테스트"""

    def test_app_ready(self):
        """앱이 제대로 로드되는지 확인"""
        from django.apps import apps

        app_config = apps.get_app_config("vaccinations")
        assert app_config.name == "vaccinations"

    def test_placeholder(self):
        """Vaccine/VaccinationRecord 모델 구현 전 더미 테스트"""
        assert True


# ============================================
# Vaccine 모델 테스트 (모델 만든 후 주석 해제)
# ============================================


# @pytest.fixture
# def vaccine(db):
#     """
#     테스트용 백신 픽스처
#
#     Vaccine 모델 예시:
#     class Vaccine(models.Model):
#         name = models.CharField(max_length=100)
#         full_name = models.CharField(max_length=200)
#         is_required = models.BooleanField(default=True)
#         description = models.TextField(blank=True)
#     """
#     from vaccinations.models import Vaccine
#
#     return Vaccine.objects.create(
#         name="BCG",
#         full_name="결핵 예방접종",
#         is_required=True,
#         description="생후 4주 이내 접종 권장",
#     )


# @pytest.mark.django_db
# class TestVaccineModel:
#     """Vaccine 모델 기능 테스트"""
#
#     def test_create_vaccine(self):
#         """백신 생성 테스트"""
#         from vaccinations.models import Vaccine
#
#         vaccine = Vaccine.objects.create(
#             name="DPT",
#             full_name="디프테리아·백일해·파상풍",
#             is_required=True,
#         )
#
#         assert vaccine.name == "DPT"
#         assert vaccine.is_required is True
#
#     def test_vaccine_string_representation(self, vaccine):
#         """Vaccine __str__ 메서드 테스트"""
#         # name 또는 full_name이 포함되어야 함
#         vaccine_str = str(vaccine)
#         assert vaccine.name in vaccine_str or vaccine.full_name in vaccine_str
#
#     def test_required_vs_optional_vaccines(self):
#         """필수/선택 백신 구분 테스트"""
#         from vaccinations.models import Vaccine
#
#         # 필수 백신
#         required = Vaccine.objects.create(
#             name="MMR",
#             full_name="홍역·유행성이하선염·풍진",
#             is_required=True,
#         )
#
#         # 선택 백신
#         optional = Vaccine.objects.create(
#             name="로타바이러스",
#             full_name="로타바이러스 감염증",
#             is_required=False,
#         )
#
#         assert required.is_required is True
#         assert optional.is_required is False


# ============================================
# VaccinationRecord 모델 테스트
# ============================================


# @pytest.fixture
# def vaccination_record(db, user, vaccine):
#     """
#     테스트용 접종 기록 픽스처
#
#     VaccinationRecord 모델 예시:
#     class VaccinationRecord(models.Model):
#         child = models.ForeignKey('children.Child', on_delete=models.CASCADE)
#         vaccine = models.ForeignKey(Vaccine, on_delete=models.CASCADE)
#         dose_number = models.IntegerField()
#         vaccination_date = models.DateField()
#         hospital_name = models.CharField(max_length=200)
#         notes = models.TextField(blank=True)
#
#         class Meta:
#             unique_together = ['child', 'vaccine', 'dose_number']
#     """
#     from children.models import Child
#     from vaccinations.models import VaccinationRecord
#
#     # 테스트용 아이 생성
#     child = Child.objects.create(
#         parent=user,
#         name="테스트아이",
#         birth_date=date(2023, 1, 1),
#         gender="M",
#     )
#
#     return VaccinationRecord.objects.create(
#         child=child,
#         vaccine=vaccine,
#         dose_number=1,
#         vaccination_date=date(2023, 2, 15),
#         hospital_name="서울아동병원",
#     )


# @pytest.mark.django_db
# class TestVaccinationRecordModel:
#     """VaccinationRecord 모델 기능 테스트"""
#
#     def test_create_vaccination_record(self, user, vaccine):
#         """접종 기록 생성 테스트"""
#         from children.models import Child
#         from vaccinations.models import VaccinationRecord
#
#         child = Child.objects.create(
#             parent=user,
#             name="홍길동",
#             birth_date=date(2023, 3, 15),
#             gender="M",
#         )
#
#         record = VaccinationRecord.objects.create(
#             child=child,
#             vaccine=vaccine,
#             dose_number=1,
#             vaccination_date=date(2023, 4, 20),
#             hospital_name="강남소아과",
#         )
#
#         assert record.child == child
#         assert record.vaccine == vaccine
#         assert record.dose_number == 1
#
#     def test_vaccination_record_string_representation(self, vaccination_record):
#         """VaccinationRecord __str__ 메서드 테스트"""
#         record_str = str(vaccination_record)
#         # 아이 이름, 백신명, 차수 등이 포함되어야 함
#         assert any(
#             x in record_str
#             for x in [
#                 vaccination_record.child.name,
#                 vaccination_record.vaccine.name,
#                 str(vaccination_record.dose_number),
#             ]
#         )
#
#     def test_multiple_doses(self, user, vaccine):
#         """여러 차수 접종 기록 테스트"""
#         from children.models import Child
#         from vaccinations.models import VaccinationRecord
#
#         child = Child.objects.create(
#             parent=user,
#             name="홍길동",
#             birth_date=date(2023, 1, 1),
#             gender="M",
#         )
#
#         # 1차 접종
#         dose1 = VaccinationRecord.objects.create(
#             child=child,
#             vaccine=vaccine,
#             dose_number=1,
#             vaccination_date=date(2023, 2, 1),
#             hospital_name="서울병원",
#         )
#
#         # 2차 접종
#         dose2 = VaccinationRecord.objects.create(
#             child=child,
#             vaccine=vaccine,
#             dose_number=2,
#             vaccination_date=date(2023, 3, 1),
#             hospital_name="서울병원",
#         )
#
#         assert dose1.dose_number == 1
#         assert dose2.dose_number == 2
#         assert VaccinationRecord.objects.filter(child=child).count() == 2
#
#     def test_duplicate_vaccination_prevention(self, user, vaccine):
#         """
#         중복 접종 기록 방지 테스트
#         (unique_together 제약 조건)
#         """
#         from children.models import Child
#         from vaccinations.models import VaccinationRecord
#
#         child = Child.objects.create(
#             parent=user,
#             name="홍길동",
#             birth_date=date(2023, 1, 1),
#             gender="M",
#         )
#
#         # 첫 번째 기록
#         VaccinationRecord.objects.create(
#             child=child,
#             vaccine=vaccine,
#             dose_number=1,
#             vaccination_date=date(2023, 2, 1),
#             hospital_name="서울병원",
#         )
#
#         # 같은 아이, 같은 백신, 같은 차수로 중복 생성 시도
#         with pytest.raises(Exception):  # IntegrityError
#             VaccinationRecord.objects.create(
#                 child=child,
#                 vaccine=vaccine,
#                 dose_number=1,  # 중복!
#                 vaccination_date=date(2023, 2, 2),
#                 hospital_name="다른병원",
#             )


# ============================================
# Vaccination API 테스트 (API 구현 후)
# ============================================


# @pytest.mark.django_db
# class TestVaccinationAPI:
#     """Vaccination CRUD API 테스트"""
#
#     def test_list_vaccines(self, api_client, vaccine):
#         """백신 목록 조회"""
#         from django.urls import reverse
#
#         url = reverse("vaccine-list")
#         response = api_client.get(url)
#
#         assert response.status_code == 200
#         assert len(response.data) >= 1
#
#     def test_list_vaccination_records(self, authenticated_client, vaccination_record):
#         """접종 기록 목록 조회"""
#         from django.urls import reverse
#
#         url = reverse("vaccination-record-list")
#         response = authenticated_client.get(url)
#
#         assert response.status_code == 200
#         assert len(response.data) >= 1
#
#     def test_create_vaccination_record(self, authenticated_client, vaccine):
#         """접종 기록 추가"""
#         from django.urls import reverse
#         from children.models import Child
#
#         # 아이 생성
#         child = Child.objects.create(
#             parent=authenticated_client.handler._force_user,
#             name="새아이",
#             birth_date=date(2023, 1, 1),
#             gender="F",
#         )
#
#         url = reverse("vaccination-record-list")
#         response = authenticated_client.post(
#             url,
#             {
#                 "child": child.id,
#                 "vaccine": vaccine.id,
#                 "dose_number": 1,
#                 "vaccination_date": "2023-02-15",
#                 "hospital_name": "테스트병원",
#             },
#             format="json",
#         )
#
#         assert response.status_code == 201
#         assert response.data["hospital_name"] == "테스트병원"


# ============================================
# 유틸리티 테스트
# ============================================


@pytest.mark.django_db
class TestVaccinationHelpers:
    """Vaccinations 앱 유틸리티 함수 테스트"""

    def test_calculate_next_vaccination_date(self):
        """
        다음 접종일 계산 헬퍼 함수 테스트

        예시 구현:
        def calculate_next_vaccination_date(birth_date, months):
            return birth_date + timedelta(days=months * 30)
        """
        # 함수 구현 후 주석 해제
        # from vaccinations.utils import calculate_next_vaccination_date
        #
        # birth_date = date(2023, 1, 1)
        # next_date = calculate_next_vaccination_date(birth_date, months=2)
        # assert next_date > birth_date
        pass

    def test_vaccination_schedule_generator(self):
        """
        접종 일정 생성 헬퍼 함수 테스트

        예시: 생년월일을 받아서 권장 접종 일정 리스트 반환
        """
        # 함수 구현 후 주석 해제
        pass

    def test_placeholder_for_future_helpers(self):
        """나중에 추가할 헬퍼 함수들을 위한 자리"""
        assert True
