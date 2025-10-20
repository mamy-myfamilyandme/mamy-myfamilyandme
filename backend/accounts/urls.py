# accounts/urls.py

from django.urls import path
from . import views
from .views import SignupAPIView, LoginAPIView

app_name = 'accounts'

urlpatterns = [
    # 1. 로그인 API
    # path('login/', views.api_login, name='api_login'), 
    path('login/', LoginAPIView.as_view(), name='login'),
    
    # 2. 회원가입 API
    # path('signup/', views.api_signup, name='api_signup'),
    path('signup/', SignupAPIView.as_view(), name='signup'),

    # 3. 로그아웃 API
    # 주의: 토큰 기반 API에서는 로그아웃이 토큰 삭제를 의미합니다.
    path('logout/', views.api_logout, name='api_logout'),
    
    # 4. 회원탈퇴 API
    path('delete/', views.api_delete, name='api_delete'),
    
    # 5. 회원정보 수정 API
    path('update/', views.api_update, name='api_update'),
    
    # 6. 비밀번호 변경 API
    path('password/', views.api_password, name='api_password'),
    
    # 참고: 만약 웹사이트용 뷰도 있다면 아래처럼 추가합니다.
    # path('login/', views.login, name='login'), 
    # path('update/', views.update, name='update'),
]