import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.fixture
def api_client():
    """
    API 테스트용 클라이언트
    """
    return APIClient()


@pytest.fixture
def user(db):
    """
    테스트용 일반 사용자
    
    Usage:
        def test_something(user):
            assert user.email == "testuser@example.com"
    """
    return User.objects.create_user(
        username="testuser",
        email="testuser@example.com",
        password="testpass123",
        first_name="테스트",
        last_name="유저",
    )


@pytest.fixture
def authenticated_client(api_client, user):
    """
    인증된 API 클라이언트
    
    Usage:
        def test_protected_endpoint(authenticated_client):
            response = authenticated_client.get('/api/protected/')
            assert response.status_code == 200
    """
    api_client.force_authenticate(user=user)
    return api_client


@pytest.fixture
def user_data():
    """
    사용자 생성용 테스트 데이터
    
    Usage:
        def test_user_creation(user_data):
            user = User.objects.create_user(**user_data)
            assert user.email == user_data['email']
    """
    return {
        "username": "newuser",
        "email": "newuser@example.com",
        "password": "newpass123",
        "first_name": "새로운",
        "last_name": "사용자",
    }