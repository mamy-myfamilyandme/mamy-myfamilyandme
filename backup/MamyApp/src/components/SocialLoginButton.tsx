import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import type { SocialProvider } from '../types/auth';

interface Props {
  provider: SocialProvider;
  onPress: (provider: SocialProvider['id']) => void;
  style?: ViewStyle;
}

export function SocialLoginButton({ provider, onPress, style }: Props) {
  const providerStyle = providerStyles[provider.id];
  const iconStyle = iconStyles[provider.id];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${provider.label} 로그인`}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        style,
        providerStyle,
      ]}
      onPress={() => onPress(provider.id)}
    >
      <View style={[styles.iconContainer, iconStyle.container]}>
        <Text style={[styles.icon, iconStyle.text]}>{provider.icon}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    fontSize: 24,
    fontWeight: '700',
  },
});

const providerStyles: Record<SocialProvider['id'], ViewStyle> = {
  kakao: {},
  naver: {},
  google: {},
  apple: {},
};

const iconStyles: Record<
  SocialProvider['id'],
  { container: ViewStyle; text: { color: string } }
> = {
  kakao: {
    container: {
      backgroundColor: '#FEE500',
    },
    text: {
      color: '#000000',
    },
  },
  naver: {
    container: {
      backgroundColor: '#03C75A',
    },
    text: {
      color: '#FFFFFF',
    },
  },
  google: {
    container: {
      backgroundColor: '#FFFFFF',
      borderWidth: 1,
      borderColor: '#E2E8F0',
    },
    text: {
      color: '#4285F4',
    },
  },
  apple: {
    container: {
      backgroundColor: '#000000',
    },
    text: {
      color: '#FFFFFF',
    },
  },
};
