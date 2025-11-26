import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import type { CommunityPost } from '../../types/navigation';

// 더미 데이터
const MOCK_POSTS: CommunityPost[] = [
  {
    id: '1',
    type: 'news',
    title: '2025년 영유아 예방접종 일정 변경 안내',
    author: '보건복지부',
    date: '2025년 10월 10일',
    excerpt: '2025년부터 영유아 예방접종 일정이 일부 변경됩니다. 새로운 백신 추가 및 접종 시기 조정...',
    content: '',
    category: '예방접종',
    likes: 245,
    comments: 32,
  },
  {
    id: '2',
    type: 'column',
    title: '우리 아이 건강한 성장을 위한 영양 관리 팁',
    author: '김소아 소아과 전문의',
    date: '2025년 10월 9일',
    excerpt: '성장기 아이들에게 필요한 영양소와 균형잡힌 식단 구성 방법을 소개합니다...',
    content: '',
    category: '육아정보',
    likes: 512,
    comments: 87,
  },
  {
    id: '3',
    type: 'news',
    title: '독감 예방접종 시즌 도래, 지금이 적기',
    author: '질병관리청',
    date: '2025년 10월 8일',
    excerpt: '올해 독감 유행 시기를 앞두고 예방접종이 본격화되고 있습니다...',
    content: '',
    category: '예방접종',
    likes: 189,
    comments: 21,
  },
  {
    id: '4',
    type: 'column',
    title: '아이와 함께하는 실내 놀이 아이디어 10가지',
    author: '박유아 유아교육 전문가',
    date: '2025년 10월 7일',
    excerpt: '날씨가 좋지 않은 날에도 아이와 즐겁게 보낼 수 있는 실내 놀이를 소개합니다...',
    content: '',
    category: '육아정보',
    likes: 723,
    comments: 154,
  },
];

export function CommunityScreen() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'news' | 'column'>('all');

  const filteredPosts = selectedCategory === 'all'
    ? MOCK_POSTS
    : MOCK_POSTS.filter(post => post.type === selectedCategory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>커뮤니티</Text>
        <Text style={styles.subtitle}>건강 뉴스와 전문가 칼럼</Text>
      </View>

      {/* 카테고리 필터 */}
      <View style={styles.filterContainer}>
        <Pressable
          style={[
            styles.filterButton,
            selectedCategory === 'all' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text
            style={[
              styles.filterText,
              selectedCategory === 'all' && styles.filterTextActive,
            ]}
          >
            전체
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filterButton,
            selectedCategory === 'news' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedCategory('news')}
        >
          <Text
            style={[
              styles.filterText,
              selectedCategory === 'news' && styles.filterTextActive,
            ]}
          >
            뉴스
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filterButton,
            selectedCategory === 'column' && styles.filterButtonActive,
          ]}
          onPress={() => setSelectedCategory('column')}
        >
          <Text
            style={[
              styles.filterText,
              selectedCategory === 'column' && styles.filterTextActive,
            ]}
          >
            칼럼
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredPosts.map(post => (
          <Pressable key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View
                style={[
                  styles.typeBadge,
                  post.type === 'news'
                    ? styles.typeBadgeNews
                    : styles.typeBadgeColumn,
                ]}
              >
                <Text style={styles.typeBadgeText}>
                  {post.type === 'news' ? '뉴스' : '칼럼'}
                </Text>
              </View>
              <Text style={styles.categoryText}>{post.category}</Text>
            </View>

            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postExcerpt} numberOfLines={2}>
              {post.excerpt}
            </Text>

            <View style={styles.postFooter}>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{post.author}</Text>
                <Text style={styles.postDate}>{post.date}</Text>
              </View>
              <View style={styles.postStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>♥</Text>
                  <Text style={styles.statText}>{post.likes}</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statIcon}>💬</Text>
                  <Text style={styles.statText}>{post.comments}</Text>
                </View>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  filterButtonActive: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.main,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  filterTextActive: {
    color: colors.text.inverse,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  postCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: 12,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeNews: {
    backgroundColor: colors.accent.light,
  },
  typeBadgeColumn: {
    backgroundColor: colors.primary.light,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.inverse,
  },
  categoryText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    lineHeight: 24,
  },
  postExcerpt: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  authorInfo: {
    flex: 1,
    gap: 2,
  },
  authorName: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.primary.dark,
  },
  postDate: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  postStats: {
    flexDirection: 'row',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 14,
  },
  statText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
});
