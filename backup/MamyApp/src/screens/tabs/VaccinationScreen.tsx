import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

export function VaccinationScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>예방접종 현황</Text>

        {/* 다가오는 접종 일정 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>다가오는 접종 일정</Text>
          <View style={styles.upcomingItem}>
            <View style={styles.upcomingDot} />
            <View style={styles.upcomingContent}>
              <Text style={styles.upcomingDate}>2025년 10월 20일</Text>
              <Text style={styles.upcomingVaccine}>MMR 2차 접종</Text>
            </View>
          </View>
        </View>

        {/* 접종 완료율 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>접종 완료율</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '75%' }]} />
            </View>
            <Text style={styles.progressText}>15/20 완료 (75%)</Text>
          </View>
        </View>

        {/* 빠른 접종 기록 */}
        <Pressable style={styles.recordButton}>
          <Text style={styles.recordButtonText}>+ 접종 기록 추가</Text>
        </Pressable>

        {/* 접종 기록 목록 */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>최근 접종 기록</Text>
          <View style={styles.recordItem}>
            <View style={styles.recordCheck}>✓</View>
            <View style={styles.recordContent}>
              <Text style={styles.recordName}>MMR 1차</Text>
              <Text style={styles.recordDate}>2024년 10월 15일</Text>
            </View>
          </View>
          <View style={styles.recordItem}>
            <View style={styles.recordCheck}>✓</View>
            <View style={styles.recordContent}>
              <Text style={styles.recordName}>수두</Text>
              <Text style={styles.recordDate}>2024년 9월 10일</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 12,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  upcomingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent.main,
    marginTop: 6,
  },
  upcomingContent: {
    flex: 1,
  },
  upcomingDate: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary.dark,
    marginBottom: 4,
  },
  upcomingVaccine: {
    fontSize: 16,
    color: colors.text.primary,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border.light,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.main,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  recordButton: {
    backgroundColor: colors.primary.main,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  recordButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  recordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  recordCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.light,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    color: colors.text.inverse,
  },
  recordContent: {
    flex: 1,
  },
  recordName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  recordDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});
