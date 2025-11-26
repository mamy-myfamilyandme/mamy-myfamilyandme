import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  text?: string;
  style?: ViewStyle;
}

export function Divider({ text, style }: Props) {
  if (text) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.line} />
        <Text style={styles.text}>{text}</Text>
        <View style={styles.line} />
      </View>
    );
  }

  return <View style={[styles.simpleLine, style]} />;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border.light,
  },
  text: {
    marginHorizontal: 16,
    fontSize: 14,
    color: colors.text.secondary,
  },
  simpleLine: {
    height: 1,
    backgroundColor: colors.border.light,
    marginVertical: 16,
  },
});
