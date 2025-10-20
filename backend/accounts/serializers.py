from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserCreationSerializer(serializers.ModelSerializer):
    # 비밀번호 확인 필드를 모델에는 없지만, 검증을 위해 Serializer에 추가합니다.
    # write_only=True: 이 필드는 응답(JSON)에 포함되지 않고 쓰기(입력)에만 사용됩니다.
    password_check = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    
    class Meta:
        model = User
        # 앱에서 받아야 할 필드 목록을 정의합니다.
        fields = ('username', 'password', 'password_check', 'email', 'first_name', 'last_name') 
        # password 필드가 JSON 응답에 포함되는 것을 막습니다. (보안)
        extra_kwargs = {
            'password': {'write_only': True}
        }

    # 비밀번호와 비밀번호 확인이 일치하는지 검증하는 로직
    def validate(self, data):
        if data['password'] != data.pop('password_check'):
            # 비밀번호가 다르면 ValidationError 발생
            raise serializers.ValidationError({"password_check": "비밀번호가 일치하지 않습니다."})
        return data

    # 새 사용자 객체를 생성하고 저장하는 로직
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''), 
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        return user
    
class UserChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # 사용자가 API를 통해 수정 가능한 필드 목록을 지정합니다.
        fields = ('username', 'email', 'first_name', 'last_name')
        # 주의: username은 변경이 불가능하도록 설정하는 것이 일반적입니다.
        read_only_fields = ('username',)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
