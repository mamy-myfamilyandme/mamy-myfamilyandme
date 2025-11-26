import React from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';

interface Props {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'default' | 'white';
  style?: ViewStyle;
}

const SIZES = {
  small: 32,
  medium: 48,
  large: 64,
  xlarge: 120,
};

export function Logo({ size = 'medium', variant = 'default', style }: Props) {
  const logoSize = SIZES[size];

  return (
    <View style={[styles.container, style]}>
      <Image
        source={require('../assets/images/logo.png')}
        style={[
          styles.logo,
          { width: logoSize, height: logoSize },
          variant === 'white' && { tintColor: '#FFFFFF' },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    // 이미지 크기는 props로 동적 설정
  },
});
