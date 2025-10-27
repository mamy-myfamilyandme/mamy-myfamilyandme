from rest_framework import status, generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .serializers import (
    UserCreationSerializer, LoginSerializer,
    UserChangeSerializer, PasswordChangeSerializer
)


class SignupAPIView(generics.CreateAPIView):
    serializer_class = UserCreationSerializer
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_summary="회원가입",
        operation_description="사용자를 생성하고 토큰을 발급합니다.",
        responses={
            201: openapi.Response('회원가입 완료'),
            400: openapi.Response('입력 오류'),
            500: openapi.Response('서버 내부 오류')
        }
    )
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()  # DB에 저장된 user 반환
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'message': f'{user.username}님, 회원가입이 완료되었습니다.',
            'token': token.key,
            'user_id': user.id
        }, status=201)



class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer  # 입력 body 안보이던거 해결 완료!
    
    @swagger_auto_schema(
        request_body=LoginSerializer,  # 이렇게 직접 Serializer를 지정
        operation_summary="로그인",
        operation_description="아이디와 비밀번호로 로그인 후 토큰 발급",
        responses={
            200: openapi.Response('로그인 성공'),
            400: openapi.Response('입력 오류')
        }
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'message': '로그인 성공',
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
        })
        
class LogoutAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="로그아웃",
        operation_description="로그인한 사용자의 토큰을 삭제하고 로그아웃합니다.",
        responses={200: openapi.Response('로그아웃 성공')}
    )
    def post(self, request):
        if request.auth:
            request.auth.delete()
        logout(request)
        return Response({'message': '로그아웃 성공'})


class DeleteUserAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_summary="회원 탈퇴",
        operation_description="현재 로그인된 사용자를 삭제합니다.",
        responses={204: openapi.Response('회원 탈퇴 완료')}
    )
    def post(self, request):
        user = request.user
        if request.auth:
            request.auth.delete()
        user.delete()
        logout(request)
        return Response({'message': '회원 탈퇴가 완료되었습니다.'}, status=status.HTTP_204_NO_CONTENT)


class UpdateUserAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserCreationSerializer
    
    @swagger_auto_schema(
        request_body=UserChangeSerializer,
        operation_summary="회원 정보 수정",
        operation_description="사용자 정보를 수정합니다.",
        responses={200: UserChangeSerializer}
    )
    def put(self, request):
        return self.update_user(request)

    @swagger_auto_schema(
        request_body=UserChangeSerializer,
        operation_summary="회원 정보 부분 수정",
        operation_description="PATCH로 사용자 정보를 부분 수정합니다.",
        responses={200: UserChangeSerializer}  # 이 부분 수정
    )
    def patch(self, request):
        return self.update_user(request, partial=True)

    def update_user(self, request, partial=False):
        serializer = UserChangeSerializer(instance=request.user, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': '회원정보가 성공적으로 수정되었습니다.', 'user': serializer.data})

class PasswordChangeAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PasswordChangeSerializer

    @swagger_auto_schema(
        request_body=PasswordChangeSerializer,
        operation_summary="비밀번호 변경",
        operation_description="현재 비밀번호를 확인하고 새 비밀번호로 변경합니다.",
        responses={200: openapi.Response('비밀번호 변경 성공')}
    )
    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': '비밀번호가 변경되었습니다.'})
