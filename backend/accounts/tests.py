"""
Accounts 앱 테스트

실행 방법:
    pytest accounts/tests.py
    pytest accounts/tests.py::TestUserModel
    pytest accounts/tests.py::TestUserModel::test_create_user
"""
import pytest
from django.contrib.auth import get_user_model

User = get_user_model()


# ============================================
# 모델 테스트
# ============================================


@pytest.mark.django_db
class TestUserModel:
    """User 모델 기본 기능 테스트"""

    def test_create_user(self):
        """일반 사용자 생성 테스트"""
        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
        )

        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.is_active is True
        assert user.is_staff is False
        assert user.is_superuser is False
        assert user.check_password("testpass123")

    def test_create_superuser(self):
        """관리자 계정 생성 테스트"""
        admin = User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="adminpass123",
        )

        assert admin.is_staff is True
        assert admin.is_superuser is True
        assert admin.check_password("adminpass123")

    def test_user_username_unique(self, user):
        """username 중복 방지 테스트"""
        # Django 기본 User는 username이 unique함
        with pytest.raises(Exception):  # IntegrityError
            User.objects.create_user(
                username=user.username,  # 중복 username
                email="different@example.com",
                password="password123",
            )

    def test_user_string_representation(self, user):
        """User __str__ 메서드 테스트"""
        user_str = str(user)
        # username이나 email이 포함되어야 함
        assert user.username in user_str or user.email in user_str

    def test_password_hashing(self):
        """비밀번호 해싱 테스트"""
        password = "mysecretpassword"
        user = User.objects.create_user(
            username="hashtest",
            email="hash@example.com",
            password=password,
        )

        # 비밀번호가 평문으로 저장되지 않아야 함
        assert user.password != password
        # check_password로 확인 가능해야 함
        assert user.check_password(password)


# ============================================
# API 테스트 (예시 - 나중에 구현 시)
# ============================================


@pytest.mark.django_db
class TestUserAPI:
    """User API 엔드포인트 테스트"""

    def test_placeholder_api(self):
        """
        나중에 API 구현하면 작성할 테스트
        
        예시:
        def test_user_registration(self, api_client):
            url = reverse('register')
            response = api_client.post(url, {
                'username': 'newuser',
                'email': 'new@example.com',
                'password': 'newpass123',
            })
            assert response.status_code == 201
        """
        # 일단 통과하는 더미 테스트
        assert True


# ============================================
# 유틸리티 함수 테스트
# ============================================


@pytest.mark.django_db
class TestAuthenticationHelpers:
    """인증 관련 헬퍼 함수 테스트"""

    def test_user_count_increases(self, user):
        """사용자 수 증가 확인"""
        initial_count = User.objects.count()
        
        User.objects.create_user(
            username="another",
            email="another@example.com",
            password="pass123",
        )

        assert User.objects.count() == initial_count + 1

    def test_user_filter_by_email(self, user):
        """이메일로 사용자 검색 테스트"""
        found_user = User.objects.get(email=user.email)
        assert found_user == user

    def test_user_update(self, user):
        """사용자 정보 수정 테스트"""
        new_first_name = "변경된"
        user.first_name = new_first_name
        user.save()

        # DB에서 다시 조회
        updated_user = User.objects.get(pk=user.pk)
        assert updated_user.first_name == new_first_name

    def test_user_deletion(self, user):
        """사용자 삭제 테스트"""
        user_id = user.pk
        user.delete()

        # 삭제된 사용자는 조회되지 않아야 함
        with pytest.raises(User.DoesNotExist):
            User.objects.get(pk=user_id)