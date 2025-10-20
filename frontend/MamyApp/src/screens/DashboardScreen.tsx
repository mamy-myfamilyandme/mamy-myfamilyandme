import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Logo } from '../components/Logo';
import { VaccinationCarousel } from '../components/VaccinationCarousel';
import { colors } from '../theme/colors';
import type { UserMode } from '../types/auth';
import type { VaccinationSchedule } from '../types/vaccination';
import { getVaccinationSchedules, getTokens } from '../services/api';

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
  const [vaccinations, setVaccinations] = useState<VaccinationSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVaccinationData();
  }, []);

  const loadVaccinationData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 토큰 가져오기
      const { accessToken } = await getTokens();
      if (!accessToken) {
        console.log('토큰이 없습니다. 로그인이 필요합니다.');
        setError('로그인 후 예방접종 정보를 확인할 수 있습니다');
        setLoading(false);
        return;
      }

      console.log('토큰으로 데이터 로드 중...');

      // TODO: 실제로는 현재 사용자의 자녀 ID를 가져와야 함
      // 지금은 테스트용으로 childId = 2 사용 (test@example.com의 자녀)
      const childId = 2;

      const response = await getVaccinationSchedules(childId, accessToken);

      console.log('API 응답:', response);

      if (response.error) {
        console.error('API 에러:', response.error);
        setError(response.error);
      } else if (response.data) {
        console.log(`${response.data.length}개의 예방접종 데이터를 로드했습니다`);
        setVaccinations(response.data);
      }
    } catch (err) {
      console.error('예방접종 데이터 로드 오류:', err);
      setError('데이터를 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  const handleVaccinationPress = (vaccination: VaccinationSchedule) => {
    console.log('접종 항목 선택:', vaccination);
    // TODO: 상세 화면으로 이동 또는 모달 표시
  };

  const completedCount = vaccinations.filter(v => v.is_completed).length;
  const totalCount = vaccinations.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const upcomingVaccinations = vaccinations
    .filter(v => !v.is_completed && v.is_upcoming)
    .slice(0, 3);

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
            <>
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary.main} />
                  <Text style={styles.loadingText}>예방접종 데이터 로딩중...</Text>
                </View>
              ) : error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                  <Pressable style={styles.retryButton} onPress={loadVaccinationData}>
                    <Text style={styles.retryButtonText}>다시 시도</Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  {/* 접종 통계 카드 */}
                  <View style={styles.vaccinationCard}>
                    <View style={styles.vaccinationHeader}>
                      <Text style={styles.vaccinationTitle}>🧒 우리 아이 접종 현황</Text>
                      <View style={styles.completionBadge}>
                        <Text style={styles.completionText}>{completionRate}%</Text>
                      </View>
                    </View>

                    {/* 진행바 */}
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${completionRate}%` }]} />
                      </View>
                      <Text style={styles.progressLabel}>
                        {completedCount}/{totalCount} 완료
                      </Text>
                    </View>

                    {/* 다가오는 접종 */}
                    {upcomingVaccinations.length > 0 && (
                      <View style={styles.upcomingVaccination}>
                        <Text style={styles.upcomingLabel}>다가오는 접종</Text>
                        <Text style={styles.upcomingName}>
                          {upcomingVaccinations[0].vaccine_name} {upcomingVaccinations[0].dose_number}차
                        </Text>
                        <Text style={styles.upcomingDate}>
                          {new Date(upcomingVaccinations[0].vaccination_date).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </Text>
                      </View>
                    )}

                    {/* 빠른 접종 기록 버튼 */}
                    <Pressable style={styles.quickRecordButton} onPress={loadVaccinationData}>
                      <Text style={styles.quickRecordText}>🔄 새로고침</Text>
                    </Pressable>
                  </View>

                  {/* 예방접종 회전형 리스트 */}
                  <View style={styles.carouselSection}>
                    <Text style={styles.carouselTitle}>📋 전체 예방접종 일정</Text>
                    <VaccinationCarousel
                      vaccinations={vaccinations}
                      onItemPress={handleVaccinationPress}
                    />
                  </View>
                </>
              )}
            </>
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
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.text.secondary,
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accent.main,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: colors.accent.main,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.accent.main,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  carouselSection: {
    marginTop: 8,
    marginHorizontal: -24,
  },
  carouselTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    paddingHorizontal: 24,
    marginBottom: 12,
  },
});
