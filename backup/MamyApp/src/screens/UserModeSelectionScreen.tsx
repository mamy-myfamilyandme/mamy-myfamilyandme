import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '../components/Logo';
import { UserModeSelector } from '../components/UserModeSelector';
import { colors } from '../theme/colors';
import type { UserMode } from '../types/auth';

interface Props {
  onModeSelected: (mode: UserMode) => void;
}

const DEFAULT_USER_MODE: UserMode = 'caregiver';

export function UserModeSelectionScreen({ onModeSelected }: Props) {
  const [selectedMode, setSelectedMode] = useState<UserMode>(DEFAULT_USER_MODE);

  const modeOptions = useMemo(
    () => [
      {
        id: 'caregiver' as const,
        title: '돌봄 제공자',
        description: '아이 또는 보호자를 직접 케어하는 주 사용자',
      },
      {
        id: 'familyMember' as const,
        title: '가족 구성원',
        description: '정보 공유와 스케줄 확인이 필요한 가족 구성원',
      },
      {
        id: 'professional' as const,
        title: '전문가',
        description: '의료진 및 상담사 등 전문 서비스 제공자',
      },
    ],
    [],
  );

  const handleContinue = () => {
    onModeSelected(selectedMode);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Logo size="medium" />
            <Text style={styles.brand}>MAMMY</Text>
          </View>
          <Text style={styles.heading}>사용자 모드를 선택하세요</Text>
          <Text style={styles.subheading}>
            선택하신 모드에 따라 맞춤형 기능과 화면이 제공됩니다.
          </Text>
        </View>

        <View style={styles.section}>
          <UserModeSelector
            options={modeOptions}
            value={selectedMode}
            onChange={setSelectedMode}
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.continueButtonPressed,
          ]}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>계속하기</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  container: {
    flexGrow: 1,
    padding: 24,
    gap: 32,
  },
  header: {
    gap: 16,
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
    flex: 1,
  },
  continueButton: {
    borderRadius: 10,
    backgroundColor: colors.primary.main,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonPressed: {
    opacity: 0.8,
  },
  continueButtonText: {
    color: colors.text.inverse,
    fontSize: 17,
    fontWeight: '600',
  },
});
