import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '../components/Logo';
import { Divider } from '../components/Divider';
import { SocialLoginButton } from '../components/SocialLoginButton';
import { colors } from '../theme/colors';
import type { Credentials, SocialProvider } from '../types/auth';

const SOCIAL_PROVIDERS: SocialProvider[] = [
  { id: 'kakao', label: '카카오', icon: 'K' },
  { id: 'naver', label: '네이버', icon: 'N' },
  { id: 'google', label: 'Google', icon: 'G' },
  { id: 'apple', label: 'Apple', icon: '🍎' },
];

interface Props {
  onLoginSuccess: () => void;
}

export function LoginScreen({ onLoginSuccess }: Props) {
  const [credentials, setCredentials] = useState<Credentials>({
    email: '',
    password: '',
  });

  const handleCredentialChange = (key: keyof Credentials, value: string) => {
    setCredentials(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    // 실제로는 여기서 서버에 로그인 요청을 보냅니다
    if (credentials.email && credentials.password) {
      Alert.alert('로그인 성공', '사용자 모드를 선택해주세요.');
      onLoginSuccess();
    } else {
      Alert.alert('로그인 실패', '이메일과 비밀번호를 입력해주세요.');
    }
  };

  const handleSocialAuth = async (providerId: SocialProvider['id']) => {
    try {
      // 실제 소셜 로그인 SDK 연동은 각 플랫폼별 설정이 필요합니다
      // 현재는 개발 환경이므로 시뮬레이션으로 처리
      Alert.alert(
        '소셜 로그인',
        `${providerId} 로그인이 시작됩니다.\n\n실제 사용을 위해서는:\n1. ${providerId} 개발자 콘솔에서 앱 등록\n2. API 키 및 시크릿 설정\n3. iOS/Android 네이티브 설정 완료\n\n현재는 개발 모드로 진행합니다.`,
        [
          { text: '취소', style: 'cancel' },
          {
            text: '계속',
            onPress: () => {
              // TODO: 실제 소셜 로그인 구현
              // import { socialLogin } from '../services/socialAuth';
              // const result = await socialLogin(providerId);
              // 서버에 result.accessToken 전송하여 인증
              onLoginSuccess();
            },
          },
        ],
      );
    } catch (error: any) {
      Alert.alert('로그인 실패', error.message || '알 수 없는 오류가 발생했습니다');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.logoContainer}>
            <Logo size="large" />
            <Text style={styles.brand}>MAMMY</Text>
          </View>
          <Text style={styles.heading}>계정에 로그인하세요</Text>
          <Text style={styles.subheading}>
            다양한 사용자 모드로 맞춤형 케어 경험을 시작하세요.
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>이메일 로그인</Text>
            <TextInput
              placeholder="이메일"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#94A3B8"
              value={credentials.email}
              onChangeText={value => handleCredentialChange('email', value)}
              style={styles.input}
            />
            <TextInput
              placeholder="비밀번호"
              secureTextEntry
              placeholderTextColor="#94A3B8"
              value={credentials.password}
              onChangeText={value => handleCredentialChange('password', value)}
              style={styles.input}
            />
            <Text style={styles.primaryButton} onPress={handleSubmit}>
              로그인
            </Text>
          </View>

          <Divider text="또는" />

          <View style={styles.section}>
            <View style={styles.socialRow}>
              {SOCIAL_PROVIDERS.map(provider => (
                <SocialLoginButton
                  key={provider.id}
                  provider={provider}
                  onPress={handleSocialAuth}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 24,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 12,
  },
  brand: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary.main,
    letterSpacing: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  subheading: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border.default,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background.secondary,
    fontSize: 16,
    color: colors.text.primary,
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: colors.primary.main,
    color: colors.text.inverse,
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 14,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
});
