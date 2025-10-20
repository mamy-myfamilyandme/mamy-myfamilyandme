from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.authtoken.models import Token 
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib.auth import update_session_auth_hash, get_user_model
from django.contrib.auth.forms import PasswordChangeForm
from .serializers import UserCreationSerializer, UserChangeSerializer, LoginSerializer
from drf_spectacular.utils import extend_schema



## 회원가입
class SignupAPIView(CreateAPIView):
    serializer_class = UserCreationSerializer
    permission_classes = [AllowAny]
    
# @api_view(['POST'])
# @permission_classes([AllowAny])
# def api_signup(request):
#     # Serializer는 forms 대신 API 데이터 검증과 생성을 담당합니다.
#     serializer = UserCreationSerializer(data=request.data)
    
#     if serializer.is_valid(raise_exception=True):
#         user = serializer.save()
        
#         # 가입 후 자동 로그인과 토큰 발급
#         token, _ = Token.objects.get_or_create(user=user)

#         return Response({
#             'message': f'{user.username}님, 회원가입이 완료되었습니다.',
#             'token': token.key,
#             'user_id': user.id,
#         }, status=status.HTTP_201_CREATED)
    
    # 실패 시 DRF가 400 Bad Request와 에러 메시지를 반환합니다
    

## 로그인
class LoginAPIView(APIView):
    permission_classes = [AllowAny]
    
    @extend_schema(request=LoginSerializer)
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username']
        password = serializer.validated_data['password']

        user = authenticate(username=username, password=password)
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'message': '로그인 성공',
                'token': token.key,
                'user_id': user.id,
                'username': user.username,
            })
        return Response({'error': '아이디 또는 비밀번호가 틀렸습니다.'}, status=400)
    
    
## 로그아웃
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # 로그인한 사용자만 접근 가능
def api_logout(request):
    # 토큰 삭제
    if request.auth:
        request.auth.delete()
    # 세션 기반 로그아웃 (API에서는 선택 사항)
    auth_logout(request)
    return Response({'message': '로그아웃 성공'}, status=status.HTTP_200_OK)
    
## 회원탈퇴
@api_view(['POST'])  # 일반적으로 POST로 처리
@permission_classes([IsAuthenticated])
def api_delete(request):
    user = request.user
    if request.auth:
        request.auth.delete()
    user.delete()
    auth_logout(request)
    return Response({'message': '회원 탈퇴가 완료되었습니다.'}, status=status.HTTP_204_NO_CONTENT)


## 회원정보 수정
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def api_update(request):
    user = request.user
    serializer = UserChangeSerializer(
        instance=user,
        data=request.data,
        partial=request.method == 'PATCH'  # PATCH 요청 시 부분 업데이트 허용
    )
    if serializer.is_valid(raise_exception=True):
        serializer.save()
        return Response({
            'message': '회원정보가 성공적으로 수정되었습니다.',
            'user': serializer.data
        }, status=status.HTTP_200_OK)
        
## 비밀번호 변경
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def api_password(request):
    form = PasswordChangeForm(request.user, request.data)  # request.data 사용
    if form.is_valid():
        user = form.save()
        update_session_auth_hash(request, user)  # 세션 기반 인증 유지
        # 기존 토큰 삭제 후 새로 발급
        if request.auth:
            request.auth.delete()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'message': '비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요.',
            'token': token.key
        }, status=status.HTTP_200_OK)

    return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)