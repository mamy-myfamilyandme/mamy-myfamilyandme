from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    # username은 닉네임으로 사용 (변경 가능)
    email = models.EmailField(unique=True)  # 로그인 ID로 사용
    
    USERNAME_FIELD = 'email'  # 이메일로 로그인
    REQUIRED_FIELDS = ['username']  # 회원가입시 필요한 필드
    
    class Meta:
        db_table = 'users'
