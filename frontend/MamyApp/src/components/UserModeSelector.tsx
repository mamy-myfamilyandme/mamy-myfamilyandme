import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { UserMode } from '../types/auth';

type ModeOption = {
  id: UserMode;
  title: string;
  description: string;
};

interface Props {
  value: UserMode;
  options: ModeOption[];
  onChange: (mode: UserMode) => void;
}

export function UserModeSelector({ value, options, onChange }: Props) {
  return (
    <View style={styles.container}>
      {options.map(option => {
        const selected = option.id === value;
        return (
          <Pressable
            key={option.id}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[styles.option, selected && styles.optionSelected]}
            onPress={() => onChange(option.id)}
          >
            <Text style={[styles.title, selected && styles.titleSelected]}>
              {option.title}
            </Text>
            <Text style={styles.description}>{option.description}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  option: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  optionSelected: {
    borderColor: '#4C6FFF',
    backgroundColor: '#EEF2FF',
  },
  title: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  titleSelected: {
    color: '#1D4ED8',
  },
  description: {
    marginTop: 4,
    fontSize: 13,
    color: '#475569',
  },
});
