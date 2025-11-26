import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

export function HospitalScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>병원 일정</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>예정된 진료</Text>
          <View style={styles.appointmentItem}>
            <View style={styles.dateBox}>
              <Text style={styles.dateMonth}>10월</Text>
              <Text style={styles.dateDay}>25</Text>
            </View>
            <View style={styles.appointmentContent}>
              <Text style={styles.hospitalName}>서울아동병원</Text>
              <Text style={styles.department}>소아청소년과</Text>
              <Text style={styles.time}>오후 2:00</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>지난 진료 기록</Text>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>진료 기록이 없습니다</Text>
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
  appointmentItem: {
    flexDirection: 'row',
    gap: 16,
  },
  dateBox: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: colors.background.accent,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary.light,
  },
  dateMonth: {
    fontSize: 12,
    color: colors.primary.dark,
  },
  dateDay: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary.main,
  },
  appointmentContent: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  hospitalName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  department: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  time: {
    fontSize: 14,
    color: colors.primary.dark,
    fontWeight: '500',
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
