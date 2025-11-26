import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

export function HealthScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>건강상태 기록</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>최근 체온</Text>
          <View style={styles.healthItem}>
            <Text style={styles.healthValue}>36.5°C</Text>
            <Text style={styles.healthDate}>2025년 10월 11일 오전 8:00</Text>
            <View style={styles.healthStatus}>
              <Text style={styles.healthStatusText}>정상</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>성장 기록</Text>
          <View style={styles.growthContainer}>
            <View style={styles.growthItem}>
              <Text style={styles.growthLabel}>키</Text>
              <Text style={styles.growthValue}>95 cm</Text>
            </View>
            <View style={styles.growthItem}>
              <Text style={styles.growthLabel}>몸무게</Text>
              <Text style={styles.growthValue}>14.5 kg</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>증상 기록</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>최근 기록된 증상이 없습니다</Text>
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
  healthItem: {
    alignItems: 'center',
    gap: 8,
  },
  healthValue: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary.main,
  },
  healthDate: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  healthStatus: {
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: colors.background.accent,
    borderRadius: 16,
  },
  healthStatusText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary.dark,
  },
  growthContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  growthItem: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background.accent,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  growthLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  growthValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary.main,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
});
