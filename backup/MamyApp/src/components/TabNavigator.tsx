import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../theme/colors';
import type { TabScreen } from '../types/navigation';

interface TabItem {
  id: TabScreen;
  label: string;
  icon: string;
}

interface Props {
  activeTab: TabScreen;
  onTabChange: (tab: TabScreen) => void;
}

const TABS: TabItem[] = [
  { id: 'home', label: '홈', icon: 'home' },
  { id: 'medication', label: '복약', icon: 'medical' },
  { id: 'vaccination', label: '접종', icon: 'shield-checkmark' },
  { id: 'hospital', label: '병원', icon: 'business' },
  { id: 'health', label: '건강', icon: 'heart' },
  { id: 'community', label: '커뮤니티', icon: 'people' },
];

export function TabNavigator({ activeTab, onTabChange }: Props) {
  return (
    <View style={styles.container}>
      {TABS.map(tab => {
        const isActive = tab.id === activeTab;
        return (
          <Pressable
            key={tab.id}
            style={({ pressed }) => [
              styles.tab,
              isActive && styles.tabActive,
              pressed && styles.tabPressed,
            ]}
            onPress={() => onTabChange(tab.id)}
          >
            <Icon
              name={isActive ? tab.icon : `${tab.icon}-outline`}
              size={24}
              color={isActive ? colors.primary.main : colors.text.secondary}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    paddingBottom: 8,
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  tabActive: {
    // Active tab styling handled by label
  },
  tabPressed: {
    opacity: 0.7,
  },
  label: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.primary.main,
    fontWeight: '600',
  },
});
