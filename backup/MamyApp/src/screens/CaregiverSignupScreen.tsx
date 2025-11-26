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
import type { ChildInfo, SignupData } from '../types/auth';
import * as api from '../services/api';

interface Props {
  signupData: SignupData;
  onComplete: () => void;
  onBack: () => void;
}

export function CaregiverSignupScreen({
  signupData,
  onComplete,
  onBack,
}: Props) {
  const [childInfo, setChildInfo] = useState<ChildInfo>({
    name: '',
    birthDate: '',
    gender: 'male',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = <K extends keyof ChildInfo>(
    key: K,
    value: ChildInfo[K],
  ) => {
    setChildInfo(prev => ({ ...prev, [key]: value }));
  };

  const handleBirthDateChange = (text: string) => {
    // 자동으로 YYYY-MM-DD 형식으로 포맷팅
    let formatted = text.replace(/[^0-9]/g, '');

    if (formatted.length >= 4) {
      formatted = formatted.slice(0, 4) + '-' + formatted.slice(4);
    }
    if (formatted.length >= 7) {
      formatted = formatted.slice(0, 7) + '-' + formatted.slice(7);
    }
    if (formatted.length > 10) {
      formatted = formatted.slice(0, 10);
    }

    handleInputChange('birthDate', formatted);
  };

  const validateForm = (): boolean => {
    if (!childInfo.name.trim()) {
      Alert.alert('입력 오류', '아이 이름을 입력해주세요.');
      return false;
    }

    // YYYY-MM-DD 형식 검증
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(childInfo.birthDate)) {
      Alert.alert('입력 오류', '출생일을 올바른 형식(YYYY-MM-DD)으로 입력해주세요.');
      return false;
    }

    // 날짜 유효성 검증
    const [year, month, day] = childInfo.birthDate.split('-').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    if (
      birthDate.getFullYear() !== year ||
      birthDate.getMonth() !== month - 1 ||
      birthDate.getDate() !== day
    ) {
      Alert.alert('입력 오류', '유효하지 않은 날짜입니다.');
      return false;
    }

    if (birthDate > today) {
      Alert.alert('입력 오류', '출생일은 오늘보다 이후일 수 없습니다.');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // 아이 정보를 포함한 회원가입 API 호출
    const completeSignupData: SignupData = {
      ...signupData,
      childInfo,
    };

    setIsLoading(true);
    const response = await api.signup(completeSignupData);
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

    Alert.alert(
      '회원가입 완료',
      `${childInfo.name}님의 정보가 등록되었습니다.\n예방접종 알림이 자동으로 설정됩니다.`,
      [
        {
          text: '확인',
          onPress: onComplete,
        },
      ],
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
          <Text style={styles.heading}>아이 정보 입력</Text>
          <Text style={styles.subheading}>
            아이의 출생일 기준으로 예방접종 일정을 자동 계산하고,
            {'\n'}접종 1달 전에 알림을 보내드립니다.
          </Text>

          <View style={styles.section}>
            <Text style={styles.label}>아이 이름</Text>
            <TextInput
              placeholder="예: 홍길동"
              placeholderTextColor="#94A3B8"
              value={childInfo.name}
              onChangeText={value => handleInputChange('name', value)}
              style={styles.input}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>출생일</Text>
            <TextInput
              placeholder="YYYY-MM-DD (예: 2024-01-15)"
              placeholderTextColor="#94A3B8"
              value={childInfo.birthDate}
              onChangeText={handleBirthDateChange}
              keyboardType="number-pad"
              maxLength={10}
              style={styles.input}
            />
            <Text style={styles.helperText}>
              숫자만 입력하면 자동으로 형식이 맞춰집니다.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>성별</Text>
            <View style={styles.genderSelector}>
              <Pressable
                style={[
                  styles.genderButton,
                  childInfo.gender === 'male' && styles.genderButtonSelected,
                ]}
                onPress={() => handleInputChange('gender', 'male')}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    childInfo.gender === 'male' &&
                      styles.genderButtonTextSelected,
                  ]}
                >
                  남아
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.genderButton,
                  childInfo.gender === 'female' &&
                    styles.genderButtonSelected,
                ]}
                onPress={() => handleInputChange('gender', 'female')}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    childInfo.gender === 'female' &&
                      styles.genderButtonTextSelected,
                  ]}
                >
                  여아
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>알림 설정</Text>
            <Text style={styles.infoText}>
              출생일 기준으로 예방접종 일정이 자동 계산됩니다.
              {'\n'}각 접종일 1달 전에 알림을 받으실 수 있습니다.
            </Text>
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
              <Text style={styles.primaryButtonText}>회원가입 완료</Text>
            )}
          </Pressable>

          <Pressable onPress={onBack}>
            <Text style={styles.link}>이전으로</Text>
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
    lineHeight: 20,
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
  helperText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  genderSelector: {
    flexDirection: 'row',
    gap: 12,
  },
  genderButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border.default,
    backgroundColor: colors.background.secondary,
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  genderButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  genderButtonTextSelected: {
    color: colors.text.inverse,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: colors.primary.light,
    padding: 16,
    borderRadius: 10,
    gap: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary.main,
  },
  infoText: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
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
