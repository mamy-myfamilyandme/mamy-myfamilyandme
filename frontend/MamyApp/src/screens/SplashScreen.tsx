import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Logo } from '../components/Logo';
import { colors } from '../theme/colors';

interface Props {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: Props) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // 로고 애니메이션
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // 2초 후 다음 화면으로
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, onFinish]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Logo size="xlarge" variant="white" />
        <Text style={styles.brandText}>MAMMY</Text>
        <Text style={styles.tagline}>우리 가족의 모든 순간</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  brandText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text.inverse,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: colors.text.inverse,
    opacity: 0.9,
    letterSpacing: 1,
  },
});
