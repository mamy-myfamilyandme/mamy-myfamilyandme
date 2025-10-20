export type UserMode = 'caregiver' | 'familyMember' | 'professional';

export interface Credentials {
  email: string;
  password: string;
}

export interface SocialProvider {
  id: 'kakao' | 'naver' | 'google' | 'apple';
  label: string;
  icon: string; // 표시할 텍스트 아이콘 (K, N, G, 🍎)
}

// 회원가입 정보
export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  userMode: UserMode;
  // 보호자 모드 전용 필드
  childInfo?: ChildInfo;
}

// 아이 정보 (보호자 모드)
export interface ChildInfo {
  name: string;
  birthDate: string; // YYYY-MM-DD 형식
  gender: 'male' | 'female';
}
