import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '../components/Logo';
import { colors } from '../theme/colors';
import type { SignupData, UserMode } from '../types/auth';
import * as api from '../services/api';

interface Props {
  onSignupSuccess: (signupData: SignupData) => void;
  onBackToLogin: () => void;
}

export function SignupScreen({ onSignupSuccess, onBackToLogin }: Props) {
  const [signupData, setSignupData] = useState<SignupData>({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    userMode: 'caregiver',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = <K extends keyof SignupData>(
    key: K,
    value: SignupData[K],
  ) => {
    setSignupData(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = (): boolean => {
    if (!signupData.email || !signupData.password || !signupData.name) {
      Alert.alert('입력 오류', '모든 필수 항목을 입력해주세요.');
      return false;
    }

    if (signupData.password !== signupData.confirmPassword) {
      Alert.alert('입력 오류', '비밀번호가 일치하지 않습니다.');
      return false;
    }

    if (signupData.password.length < 6) {
      Alert.alert('입력 오류', '비밀번호는 최소 6자 이상이어야 합니다.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      Alert.alert('입력 오류', '올바른 이메일 형식을 입력해주세요.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // 보호자 모드인 경우 다음 단계(아이 정보 입력)로 이동
    if (signupData.userMode === 'caregiver') {
      onSignupSuccess(signupData);
      return;
    }

    // 보호자가 아닌 경우 바로 회원가입 API 호출
    setIsLoading(true);
    const response = await api.signup(signupData);
    setIsLoading(false);

    if (response.error) {
      Alert.alert('회원가입 실패', response.error);
      return;
    }

    // 토큰 저장
    if (response.data?.tokens) {
      await api.saveTokens(
        response.data.tokens.access,
        response.data.tokens.refresh
      );
    }

    Alert.alert('회원가입 완료', response.data?.message || '회원가입이 완료되었습니다.', [
      {
        text: '확인',
        onPress: onBackToLogin,
      },
    ]);
  };

  const renderModeSelector = () => {
    const modes: Array<{ value: UserMode; label: string }> = [
      { value: 'caregiver', label: '돌봄 제공자' },
      { value: 'familyMember', label: '가족 구성원' },
      { value: 'professional', label: '전문가' },
    ];

    return (
      <View style={styles.modeSelector}>
        {modes.map(mode => (
          <Pressable
            key={mode.value}
            style={[
              styles.modeButton,
              signupData.userMode === mode.value &&
                styles.modeButtonSelected,
            ]}
            onPress={() => handleInputChange('userMode', mode.value)}
          >
            <Text
              style={[
                styles.modeButtonText,
                signupData.userMode === mode.value &&
                  styles.modeButtonTextSelected,
              ]}
            >
              {mode.label}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.logoContainer}>
            <Logo size="medium" />
            <Text style={styles.brand}>MAMMY</Text>
          </View>
          <Text style={styles.heading}>회원가입</Text>
          <Text style={styles.subheading}>
            맞춤형 케어 경험을 시작하세요.
          </Text>

          <View style={styles.section}>
            <Text style={styles.label}>사용자 모드 선택</Text>
            {renderModeSelector()}
            {signupData.userMode === 'caregiver' && (
              <Text style={styles.helperText}>
                보호자 모드: 다음 단계에서 아이 정보를 입력합니다.
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>이름</Text>
            <TextInput
              placeholder="이름"
              placeholderTextColor="#94A3B8"
              value={signupData.name}
              onChangeText={value => handleInputChange('name', value)}
              style={styles.input}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>이메일</Text>
            <TextInput
              placeholder="이메일"
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#94A3B8"
              value={signupData.email}
              onChangeText={value => handleInputChange('email', value)}
              style={styles.input}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              placeholder="비밀번호 (최소 6자)"
              secureTextEntry
              placeholderTextColor="#94A3B8"
              value={signupData.password}
              onChangeText={value => handleInputChange('password', value)}
              style={styles.input}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>비밀번호 확인</Text>
            <TextInput
              placeholder="비밀번호 확인"
              secureTextEntry
              placeholderTextColor="#94A3B8"
              value={signupData.confirmPassword}
              onChangeText={value =>
                handleInputChange('confirmPassword', value)
              }
              style={styles.input}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
              isLoading && styles.primaryButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.text.inverse} />
            ) : (
              <Text style={styles.primaryButtonText}>
                {signupData.userMode === 'caregiver'
                  ? '다음 (아이 정보 입력)'
                  : '회원가입'}
              </Text>
            )}
          </Pressable>

          <Pressable onPress={onBackToLogin}>
            <Text style={styles.link}>이미 계정이 있으신가요? 로그인</Text>
          </Pressable>
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
    gap: 20,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  brand: {
    fontSize: 28,
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
    gap: 8,
  },
  label: {
    fontSize: 14,
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
  modeSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
  },
  modeButtonSelected: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  modeButtonTextSelected: {
    color: colors.text.inverse,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    color: colors.primary.main,
    fontStyle: 'italic',
  },
  primaryButton: {
    marginTop: 8,
    borderRadius: 10,
    backgroundColor: colors.primary.main,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonPressed: {
    opacity: 0.8,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: colors.text.inverse,
    fontSize: 17,
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    color: colors.primary.main,
    fontSize: 14,
    fontWeight: '500',
  },
});
