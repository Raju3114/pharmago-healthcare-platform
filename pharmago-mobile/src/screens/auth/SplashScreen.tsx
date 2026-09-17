import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { colors, fontSizes, fontWeights, spacing, borderRadius } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, any>;

export const SplashScreen: React.FC<Props> = () => {
  const { mode } = useThemeStore();
  const themeColors = colors[mode];
  const { isAuthenticated, isLoading } = useAuthStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true
      })
    ]).start();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <Animated.View style={[styles.brandContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={[styles.logoBadge, { backgroundColor: themeColors.primaryLight }]}>
          <Text style={{ fontSize: 44 }}>💊</Text>
        </View>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>
          Pharma<Text style={{ color: themeColors.primary }}>Go</Text>
        </Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
          AI-Powered Medicine Delivery Platform
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandContainer: {
    alignItems: 'center'
  },
  logoBadge: {
    width: 90,
    height: 90,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg
  },
  title: {
    fontSize: 34,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.5
  },
  subtitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    marginTop: spacing.xs
  }
});
