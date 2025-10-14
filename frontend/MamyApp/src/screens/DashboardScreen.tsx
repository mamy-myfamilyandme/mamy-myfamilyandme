import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '../components/Logo';
import { colors } from '../theme/colors';
import type { UserMode } from '../types/auth';

interface Props {
  userMode: UserMode;
  onLogout?: () => void;
}

const MODE_LABELS: Record<UserMode, string> = {
  caregiver: '돌봄 제공자',
  familyMember: '가족 구성원',
  professional: '전문가',
};

export function DashboardScreen({ userMode, onLogout }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Logo size="small" />
            <Text style={styles.brand}>MAMMY</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{MODE_LABELS[userMode]}</Text>
          </View>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>환영합니다!</Text>
          <Text style={styles.welcomeSubtitle}>
            {MODE_LABELS[userMode]} 모드로 로그인되었습니다.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>대시보드</Text>

          {/* 보호자 모드일 때만 접종 카드 표시 */}
          {userMode === 'caregiver' && (
            <View style={styles.vaccinationCard}>
              <View style={styles.vaccinationHeader}>
                <Text style={styles.vaccinationTitle}>🧒 우리 아이 접종 현황</Text>
                <View style={styles.completionBadge}>
                  <Text style={styles.completionText}>75%</Text>
                </View>
              </View>

              {/* 진행바 */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '75%' }]} />
                </View>
                <Text style={styles.progressLabel}>15/20 완료</Text>
              </View>

              {/* 다가오는 접종 */}
              <View style={styles.upcomingVaccination}>
                <Text style={styles.upcomingLabel}>다가오는 접종</Text>
                <Text style={styles.upcomingName}>MMR 2차</Text>
                <Text style={styles.upcomingDate}>2025년 10월 20일</Text>
              </View>

              {/* 빠른 접종 기록 버튼 */}
              <Pressable style={styles.quickRecordButton}>
                <Text style={styles.quickRecordText}>+ 접종 기록하기</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.cardTitle}>오늘의 일정</Text>
            <Text style={styles.cardContent}>예정된 일정이 없습니다.</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>최근 활동</Text>
            <Text style={styles.cardContent}>활동 내역이 없습니다.</Text>
          </View>
        </View>

        {onLogout && (
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
            ]}
            onPress={onLogout}
          >
            <Text style={styles.logoutButtonText}>로그아웃</Text>
          </Pressable>
        )}
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
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brand: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary.main,
    letterSpacing: 1,
  },
  badge: {
    backgroundColor: colors.background.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.primary.light,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary.dark,
  },
  welcomeSection: {
    gap: 8,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: colors.text.secondary,
  },
  section: {
    flex: 1,
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  cardContent: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  logoutButton: {
    borderRadius: 10,
    backgroundColor: colors.accent.main,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButtonPressed: {
    opacity: 0.8,
  },
  logoutButtonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  vaccinationCard: {
    backgroundColor: colors.background.accent,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.primary.light,
    marginBottom: 16,
  },
  vaccinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  vaccinationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  completionBadge: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  completionText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  upcomingVaccination: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  upcomingLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  upcomingName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  upcomingDate: {
    fontSize: 14,
    color: colors.primary.dark,
  },
  quickRecordButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickRecordText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.inverse,
  },
});
