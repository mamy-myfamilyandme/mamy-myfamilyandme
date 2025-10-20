from rest_framework import serializers
from django.contrib.auth import get_user_model
from children.models import Child

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """사용자 조회용 Serializer"""

    class Meta:
        model = User
        fields = ["id", "username", "email", "user_mode", "created_at"]
        read_only_fields = ["id", "created_at"]


class ChildInfoSerializer(serializers.ModelSerializer):
    """아이 정보 Serializer (회원가입용)"""

    class Meta:
        model = Child
        fields = ["name", "birth_date", "gender"]


class SignupSerializer(serializers.Serializer):
    """회원가입 Serializer"""

    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, min_length=6, required=True)
    confirm_password = serializers.CharField(write_only=True, required=True)
    name = serializers.CharField(max_length=150, required=True)
    user_mode = serializers.ChoiceField(
        choices=["caregiver", "familyMember", "professional"], required=True
    )

    # 보호자 모드 전용 필드
    child_info = ChildInfoSerializer(required=False, allow_null=True)

    def validate_email(self, value):
        """이메일 중복 검증"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("이미 사용 중인 이메일입니다.")
        return value

    def validate(self, data):
        """비밀번호 일치 검증"""
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError({"password": "비밀번호가 일치하지 않습니다."})

        # 보호자 모드인 경우 아이 정보 필수
        if data["user_mode"] == "caregiver" and not data.get("child_info"):
            raise serializers.ValidationError(
                {"child_info": "보호자 모드는 아이 정보가 필수입니다."}
            )

        return data

    def create(self, validated_data):
        """회원가입 처리"""
        validated_data.pop("confirm_password")
        child_info_data = validated_data.pop("child_info", None)

        # 사용자 생성
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["name"],
            user_mode=validated_data["user_mode"],
        )

        # 보호자 모드인 경우 아이 정보 생성 및 예방접종 일정 자동 생성
        if child_info_data and user.user_mode == "caregiver":
            child = Child.objects.create(user=user, **child_info_data)

            # 예방접종 일정 자동 생성
            from vaccinations.services import create_vaccination_schedules

            create_vaccination_schedules(child)

        return user


class LoginSerializer(serializers.Serializer):
    """로그인 Serializer"""

    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)
