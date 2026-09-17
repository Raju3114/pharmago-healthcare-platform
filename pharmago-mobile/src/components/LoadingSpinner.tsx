import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { colors, spacing, fontSizes, fontWeights } from '../theme';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  fullScreen = false
}) => {
  const { mode } = useThemeStore();
  const themeColors = colors[mode];

  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        { backgroundColor: fullScreen ? themeColors.background : 'transparent' }
      ]}
    >
      <ActivityIndicator size="large" color={themeColors.primary} />
      {message && (
        <Text style={[styles.message, { color: themeColors.textSecondary }]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl
  },
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999
  },
  message: {
    marginTop: spacing.md,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium
  }
});
