"""
Children 앱 테스트

실행 방법:
    pytest children/tests.py
    pytest children/tests.py::TestChildModel
"""

import pytest
from django.utils import timezone
from datetime import date, timedelta


# ============================================
# 기본 테스트 (Child 모델 만들기 전)
# ============================================


@pytest.mark.django_db
class TestChildrenAppBasics:
    """Children 앱 기본 설정 테스트"""

    def test_app_ready(self):
        """앱이 제대로 로드되는지 확인"""
        from django.apps import apps

        app_config = apps.get_app_config("children")
        assert app_config.name == "children"

    def test_placeholder(self):
        """Child 모델 구현 전 더미 테스트"""
        # Child 모델을 만들 때까지 통과하는 테스트
        assert True


# ============================================
# Child 모델 테스트 (모델 만든 후 주석 해제)
# ============================================


# @pytest.fixture
# def child(db, user):
#     """
#     테스트용 아이 픽스처
#
#     Child 모델 예시:
#     class Child(models.Model):
#         parent = models.ForeignKey(User, on_delete=models.CASCADE)
#         name = models.CharField(max_length=100)
#         birth_date = models.DateField()
#         gender = models.CharField(max_length=1, choices=[('M', '남'), ('F', '여')])
#     """
#     from children.models import Child
#
#     return Child.objects.create(
#         parent=user,
#         name="홍길동",
#         birth_date=date(2023, 3, 15),
#         gender="M",
#     )


# @pytest.mark.django_db
# class TestChildModel:
#     """Child 모델 기능 테스트"""
#
#     def test_create_child(self, user):
#         """아이 생성 테스트"""
#         from children.models import Child
#
#         child = Child.objects.create(
#             parent=user,
#             name="홍길동",
#             birth_date=date(2023, 3, 15),
#             gender="M",
#         )
#
#         assert child.name == "홍길동"
#         assert child.parent == user
#         assert child.gender == "M"
#         assert isinstance(child.birth_date, date)
#
#     def test_child_string_representation(self, child):
#         """Child __str__ 메서드 테스트"""
#         assert "홍길동" in str(child)
#
#     def test_child_age_calculation(self, child):
#         """
#         나이 계산 메서드 테스트
#
#         예시 구현:
#         @property
#         def age_in_months(self):
#             today = date.today()
#             months = (today.year - self.birth_date.year) * 12
#             months += today.month - self.birth_date.month
#             return months
#         """
#         # child.age_in_months가 구현되면 주석 해제
#         # age = child.age_in_months
#         # assert isinstance(age, int)
#         # assert age >= 0
#         pass
#
#     def test_child_belongs_to_parent(self, user, child):
#         """아이가 부모에게 올바르게 연결되는지 확인"""
#         assert child.parent == user
#         assert child in user.child_set.all()  # 역참조
#
#     def test_child_deletion_when_parent_deleted(self, user, child):
#         """부모 삭제 시 아이도 삭제되는지 확인 (CASCADE)"""
#         child_id = child.pk
#         user.delete()
#
#         from children.models import Child
#         # CASCADE로 인해 아이도 삭제되어야 함
#         with pytest.raises(Child.DoesNotExist):
#             Child.objects.get(pk=child_id)


# ============================================
# Child API 테스트 (API 구현 후)
# ============================================


# @pytest.mark.django_db
# class TestChildAPI:
#     """Child CRUD API 테스트"""
#
#     def test_list_children(self, authenticated_client, child):
#         """아이 목록 조회"""
#         from django.urls import reverse
#
#         url = reverse("child-list")
#         response = authenticated_client.get(url)
#
#         assert response.status_code == 200
#         assert len(response.data) >= 1
#
#     def test_create_child(self, authenticated_client):
#         """아이 생성 API"""
#         from django.urls import reverse
#
#         url = reverse("child-list")
#         response = authenticated_client.post(
#             url,
#             {
#                 "name": "새아이",
#                 "birth_date": "2024-01-15",
#                 "gender": "F",
#             },
#             format="json",
#         )
#
#         assert response.status_code == 201
#         assert response.data["name"] == "새아이"
#
#     def test_retrieve_child(self, authenticated_client, child):
#         """아이 상세 조회"""
#         from django.urls import reverse
#
#         url = reverse("child-detail", kwargs={"pk": child.pk})
#         response = authenticated_client.get(url)
#
#         assert response.status_code == 200
#         assert response.data["name"] == child.name
#
#     def test_update_child(self, authenticated_client, child):
#         """아이 정보 수정"""
#         from django.urls import reverse
#
#         url = reverse("child-detail", kwargs={"pk": child.pk})
#         response = authenticated_client.patch(
#             url,
#             {"name": "변경된이름"},
#             format="json",
#         )
#
#         assert response.status_code == 200
#         assert response.data["name"] == "변경된이름"
#
#     def test_delete_child(self, authenticated_client, child):
#         """아이 삭제"""
#         from django.urls import reverse
#         from children.models import Child
#
#         url = reverse("child-detail", kwargs={"pk": child.pk})
#         response = authenticated_client.delete(url)
#
#         assert response.status_code == 204
#         assert not Child.objects.filter(pk=child.pk).exists()


# ============================================
# 유틸리티 테스트
# ============================================


@pytest.mark.django_db
class TestChildHelpers:
    """Children 앱 유틸리티 함수 테스트"""

    def test_calculate_age_in_months(self):
        """
        월령 계산 헬퍼 함수 테스트

        예시 구현:
        def calculate_age_in_months(birth_date):
            today = date.today()
            months = (today.year - birth_date.year) * 12
            months += today.month - birth_date.month
            return max(0, months)
        """
        # 함수 구현 후 주석 해제
        # from children.utils import calculate_age_in_months
        #
        # birth_date = date(2023, 1, 1)
        # age = calculate_age_in_months(birth_date)
        # assert age > 0
        pass

    def test_placeholder_for_future_helpers(self):
        """나중에 추가할 헬퍼 함수들을 위한 자리"""
        assert True
