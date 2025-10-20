import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Pressable,
} from 'react-native';
import { colors } from '../theme/colors';
import type { VaccinationSchedule } from '../types/vaccination';

interface Props {
  vaccinations: VaccinationSchedule[];
  onItemPress?: (vaccination: VaccinationSchedule) => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 80;
const CARD_SPACING = 16;

export function VaccinationCarousel({ vaccinations, onItemPress }: Props) {
  const flatListRef = useRef<FlatList>(null);

  const renderItem = ({ item }: { item: VaccinationSchedule }) => {
    const isPastDue = item.is_overdue && !item.is_completed;
    const isCompleted = item.is_completed;

    return (
      <Pressable
        style={styles.cardContainer}
        onPress={() => onItemPress?.(item)}
      >
        <View
          style={[
            styles.card,
            isPastDue && styles.cardOverdue,
            isCompleted && styles.cardCompleted,
          ]}
        >
          {/* 상태 뱃지 */}
          <View style={styles.badgeContainer}>
            {isCompleted ? (
              <View style={styles.completedBadge}>
                <Text style={styles.badgeText}>✓ 완료</Text>
              </View>
            ) : isPastDue ? (
              <View style={styles.overdueBadge}>
                <Text style={styles.badgeText}>⚠️ 지연</Text>
              </View>
            ) : (
              <View style={styles.upcomingBadge}>
                <Text style={styles.badgeText}>예정</Text>
              </View>
            )}
            {item.is_mandatory && (
              <View style={styles.mandatoryBadge}>
                <Text style={styles.mandatoryText}>필수</Text>
              </View>
            )}
          </View>

          {/* 백신 정보 */}
          <View style={styles.contentContainer}>
            <Text style={styles.vaccineName}>{item.vaccine_name}</Text>
            <Text style={styles.doseNumber}>{item.dose_number}차 접종</Text>
            <Text style={styles.disease}>{item.disease}</Text>

            <View style={styles.divider} />

            {/* 날짜 정보 */}
            <View style={styles.dateContainer}>
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>권장시기</Text>
                <Text style={styles.dateValue}>{item.age_description}</Text>
              </View>
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>접종예정일</Text>
                <Text style={[styles.dateValue, isPastDue && styles.overdueDate]}>
                  {new Date(item.vaccination_date).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </View>
              {isCompleted && item.completed_date && (
                <View style={styles.dateRow}>
                  <Text style={styles.dateLabel}>접종완료일</Text>
                  <Text style={styles.completedDate}>
                    {new Date(item.completed_date).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </View>
              )}
            </View>

            {/* 알림 정보 */}
            {!isCompleted && (
              <View style={styles.notificationInfo}>
                <Text style={styles.notificationText}>
                  📅 알림: {new Date(item.notification_date).toLocaleDateString('ko-KR')}
                </Text>
              </View>
            )}

            {/* 메모 */}
            {item.notes && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesText}>{item.notes}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  if (vaccinations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>예방접종 일정이 없습니다</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={vaccinations}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        pagingEnabled={false}
      />

      {/* 인디케이터 */}
      <View style={styles.indicatorContainer}>
        <Text style={styles.indicatorText}>
          좌우로 스와이프하여 더 보기 ({vaccinations.length}개)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  listContent: {
    paddingHorizontal: 24,
  },
  cardContainer: {
    width: CARD_WIDTH,
    marginRight: CARD_SPACING,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.border.light,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardOverdue: {
    borderColor: colors.accent.main,
    backgroundColor: '#FFF5F5',
  },
  cardCompleted: {
    borderColor: colors.primary.light,
    backgroundColor: '#F0F9FF',
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  completedBadge: {
    backgroundColor: colors.primary.main,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  overdueBadge: {
    backgroundColor: colors.accent.main,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingBadge: {
    backgroundColor: colors.primary.light,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  mandatoryBadge: {
    backgroundColor: colors.background.accent,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary.light,
  },
  mandatoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary.dark,
  },
  contentContainer: {
    gap: 8,
  },
  vaccineName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text.primary,
  },
  doseNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary.dark,
  },
  disease: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: 8,
  },
  dateContainer: {
    gap: 6,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  dateValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  overdueDate: {
    color: colors.accent.main,
  },
  completedDate: {
    color: colors.primary.main,
  },
  notificationInfo: {
    backgroundColor: colors.background.accent,
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  notificationText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  notesContainer: {
    backgroundColor: '#FFF9E6',
    padding: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  notesText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  indicatorContainer: {
    alignItems: 'center',
    paddingTop: 12,
  },
  indicatorText: {
    fontSize: 12,
    color: colors.text.secondary,
  },
});
