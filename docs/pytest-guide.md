# Pytest 사용 가이드

> Django 프로젝트를 위한 pytest 사용법 정리

## 📚 목차

- [기본 사용법](#기본-사용법)
- [자주 사용하는 명령어](#자주-사용하는-명령어)
- [Fixture 사용법](#fixture-사용법)
- [테스트 작성 패턴](#테스트-작성-패턴)
- [커버리지 측정](#커버리지-측정)
- [CI 통과하기](#ci-통과하기)
- [문제 해결](#문제-해결)

---

## 기본 사용법

### 설치

```bash
cd backend
uv add --dev pytest pytest-django pytest-cov
uv sync
```

### 테스트 실행

```bash
# 모든 테스트 실행
uv run pytest

# 특정 앱만 테스트
uv run pytest accounts/
uv run pytest children/

# 특정 파일만 테스트
uv run pytest accounts/tests.py

# 특정 클래스만 테스트
uv run pytest accounts/tests.py::TestUserModel

# 특정 함수만 테스트
uv run pytest accounts/tests.py::TestUserModel::test_create_user
```

---

## 자주 사용하는 명령어

### 출력 옵션

```bash
# 상세 출력
uv run pytest -v

# 더 상세한 출력
uv run pytest -vv

# print 문 출력 보기
uv run pytest -s

# 짧은 traceback
uv run pytest --tb=short
```

### 필터링

```bash
# 키워드로 필터링 (이름에 'user' 포함)
uv run pytest -k "user"

# 특정 키워드 제외
uv run pytest -k "not api"

# 실패한 테스트만 재실행
uv run pytest --lf

# 실패한 테스트 먼저 실행
uv run pytest --ff
```

### 속도 개선

```bash
# 병렬 실행 (pytest-xdist 필요)
uv run pytest -n auto

# DB 재사용 (이미 기본 설정됨)
uv run pytest --reuse-db

# 첫 실패에서 중단
uv run pytest -x
```

---

## Fixture 사용법

### 기본 Fixture

프로젝트의 `conftest.py`에 정의된 공통 fixture:

```python
def test_with_user(user):
    """테스트용 사용자 사용"""
    assert user.email == "testuser@example.com"

def test_with_api_client(api_client):
    """API 클라이언트 사용"""
    response = api_client.get('/api/endpoint/')
    assert response.status_code == 200

def test_with_auth(authenticated_client):
    """인증된 클라이언트 사용"""
    response = authenticated_client.get('/api/protected/')
    assert response.status_code == 200
```

### Custom Fixture 만들기

```python
# accounts/tests.py
import pytest

@pytest.fixture
def superuser(db):
    """관리자 계정 생성"""
    from django.contrib.auth import get_user_model
    User = get_user_model()
    return User.objects.create_superuser(
        username="admin",
        email="admin@example.com",
        password="adminpass123"
    )

def test_with_superuser(superuser):
    """커스텀 fixture 사용"""
    assert superuser.is_superuser
```

### Fixture 스코프

```python
@pytest.fixture(scope="function")  # 기본값, 테스트마다 새로 생성
def user_function():
    ...

@pytest.fixture(scope="class")     # 클래스당 한 번만 생성
def user_class():
    ...

@pytest.fixture(scope="module")    # 모듈당 한 번만 생성
def user_module():
    ...

@pytest.fixture(scope="session")   # 전체 세션에서 한 번만
def user_session():
    ...
```

---

## 테스트 작성 패턴

### 기본 테스트 구조

```python
import pytest
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.mark.django_db  # Django DB 사용
class TestUserModel:
    """User 모델 테스트"""
    
    def test_create_user(self):
        """사용자 생성 테스트"""
        # Given (준비)
        username = "testuser"
        email = "test@example.com"
        password = "testpass123"
        
        # When (실행)
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )
        
        # Then (검증)
        assert user.username == username
        assert user.email == email
        assert user.check_password(password)
```

### API 테스트

```python
@pytest.mark.django_db
class TestUserAPI:
    """User API 테스트"""
    
    def test_user_list(self, authenticated_client):
        """사용자 목록 조회"""
        from django.urls import reverse
        
        url = reverse('user-list')
        response = authenticated_client.get(url)
        
        assert response.status_code == 200
        assert isinstance(response.data, list)
    
    def test_user_create(self, api_client):
        """사용자 생성"""
        from django.urls import reverse
        
        url = reverse('user-list')
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpass123',
        }
        response = api_client.post(url, data, format='json')
        
        assert response.status_code == 201
        assert response.data['email'] == data['email']
```

### 예외 테스트

```python
def test_duplicate_username(self, user):
    """중복 username 에러 테스트"""
    with pytest.raises(Exception):  # 예외 발생 예상
        User.objects.create_user(
            username=user.username,  # 중복!
            email="another@example.com",
            password="pass123"
        )
```

### 파라미터화 테스트

```python
@pytest.mark.parametrize("username,email,expected", [
    ("user1", "user1@example.com", True),
    ("user2", "user2@example.com", True),
    ("", "invalid@example.com", False),  # 빈 username
    ("user3", "", False),  # 빈 email
])
def test_user_creation(username, email, expected):
    """여러 케이스를 한 번에 테스트"""
    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password="pass123"
        )
        result = user.pk is not None
    except:
        result = False
    
    assert result == expected
```

---

## 커버리지 측정

### 기본 커버리지

```bash
# 커버리지 측정
uv run pytest --cov

# 특정 앱만
uv run pytest --cov=accounts accounts/

# 누락된 라인 표시
uv run pytest --cov --cov-report=term-missing
```

### HTML 리포트

```bash
# HTML 리포트 생성
uv run pytest --cov --cov-report=html

# 브라우저에서 열기 (Windows)
start htmlcov/index.html

# 브라우저에서 열기 (Mac)
open htmlcov/index.html

# 브라우저에서 열기 (Linux)
xdg-open htmlcov/index.html
```

### 커버리지 목표 설정

`pyproject.toml`:
```toml
[tool.coverage.report]
fail_under = 80  # 80% 미만이면 실패
```

---

## CI 통과하기

### 커밋 전 체크리스트

```bash
cd backend

# 1. 린팅 자동 수정
uv run ruff check . --fix

# 2. 포맷팅 적용
uv run ruff format .

# 3. 확인
uv run ruff check .
uv run ruff format --check .

# 4. Django 검사
uv run python manage.py check

# 5. 마이그레이션 확인
uv run python manage.py makemigrations --check --dry-run

# 6. 테스트 실행
uv run pytest

# 모두 ✅면 커밋!
git add .
git commit -m "..."
git push
```

### 자동화 스크립트

`backend/check.sh`:
```bash
#!/bin/bash
set -e

echo "🔍 Ruff 린팅..."
uv run ruff check . --fix

echo "🎨 포맷팅..."
uv run ruff format .

echo "✅ 검사..."
uv run ruff check .
uv run ruff format --check .

echo "🏗️ Django 체크..."
uv run python manage.py check

echo "🧪 테스트..."
uv run pytest

echo "🎉 모든 검사 통과!"
```

실행:
```bash
chmod +x check.sh
./check.sh
```

---

## 문제 해결

### "No module named 'pytest_django'"

```bash
uv add --dev pytest-django
uv sync
```

### "Database is locked"

```bash
# 테스트 DB 재생성
uv run pytest --create-db

# 또는 기존 DB 삭제
rm test_*.db
```

### "ImproperlyConfigured"

`pyproject.toml` 확인:
```toml
[tool.pytest.ini_options]
DJANGO_SETTINGS_MODULE = "config.settings"
```

### 테스트가 너무 느림

```bash
# DB 재사용 (이미 설정됨)
uv run pytest --reuse-db

# 실패한 것만 재실행
uv run pytest --lf
```

### import 에러

```bash
# Python 경로 확인
cd backend
uv run python -c "import django; print(django.__file__)"

# pytest가 올바른 환경에서 실행되는지 확인
uv run pytest --version
```

---

## 유용한 팁

### 특정 테스트만 건너뛰기

```python
@pytest.mark.skip(reason="아직 구현 중")
def test_not_ready():
    pass

@pytest.mark.skipif(condition, reason="조건부 스킵")
def test_conditional():
    pass
```

### 테스트 마커

```python
# 느린 테스트 표시
@pytest.mark.slow
def test_slow_operation():
    pass

# 실행: 느린 테스트 제외
uv run pytest -m "not slow"
```

### 디버깅

```python
def test_debug():
    user = User.objects.create_user(...)
    
    # 여기서 멈춤
    import pdb; pdb.set_trace()
    
    assert user.is_active
```

실행:
```bash
uv run pytest -s  # -s 옵션으로 pdb 사용 가능
```

### 테스트 시간 측정

```bash
# 가장 느린 10개 테스트 표시
uv run pytest --durations=10
```

---

## 참고 자료

- [Pytest 공식 문서](https://docs.pytest.org/)
- [pytest-django 문서](https://pytest-django.readthedocs.io/)
- [Django Testing 가이드](https://docs.djangoproject.com/en/stable/topics/testing/)
- [Coverage.py 문서](https://coverage.readthedocs.io/)

---

## 빠른 참조

```bash
# 자주 사용하는 명령어
uv run pytest                    # 전체 테스트
uv run pytest -v                 # 상세 출력
uv run pytest -s                 # print 출력
uv run pytest -k "user"          # 키워드 필터
uv run pytest --lf               # 실패한 것만
uv run pytest --cov              # 커버리지
uv run pytest accounts/          # 특정 앱만
uv run pytest --durations=10     # 느린 테스트 표시

# CI 통과 체크
uv run ruff check . --fix && \
uv run ruff format . && \
uv run pytest
```

---

**작성일:** 2025-10-18  
**버전:** 1.0.0  
**프로젝트:** Mamy Backend