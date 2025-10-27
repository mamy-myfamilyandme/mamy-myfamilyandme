from django.urls import path
from .views import SignupAPIView, LoginAPIView, LogoutAPIView, \
    UpdateUserAPIView, PasswordChangeAPIView, DeleteUserAPIView
from rest_framework_simplejwt.views import TokenRefreshView

app_name = "accounts"

urlpatterns = [
    path("signup/", SignupAPIView.as_view(), name="signup"),
    path("login/", LoginAPIView.as_view(), name="login"),
    path("logout/", LogoutAPIView.as_view(), name="logout"),
    path("edit/", UpdateUserAPIView.as_view(), name="edit"),
    path("password/change/", PasswordChangeAPIView.as_view(), name="password_change"),
    path("delete/", DeleteUserAPIView.as_view(), name="delete_user"),
]