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
