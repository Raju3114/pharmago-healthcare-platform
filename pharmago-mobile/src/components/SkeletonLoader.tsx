import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet, ViewStyle } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { colors, borderRadius, spacing } from '../theme';

interface SkeletonLoaderProps {
  width?: number | `${number}%`;
  height?: number;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  style
}) => {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;
  const { mode } = useThemeStore();
  const themeColors = colors[mode];

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 800,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true
        })
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          backgroundColor: themeColors.surfaceVariant,
          opacity: opacityAnim
        },
        style
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    borderRadius: borderRadius.md,
    marginBottom: spacing.xs
  }
});
