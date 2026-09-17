import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { colors, spacing, fontSizes, fontWeights } from '../theme';

interface OfflineBannerProps {
  isConnected: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isConnected }) => {
  const { mode } = useThemeStore();
  const themeColors = colors[mode];

  if (isConnected) return null;

  return (
    <View style={[styles.banner, { backgroundColor: themeColors.warning }]}>
      <Text style={styles.text}>⚠️ You are currently offline. Retrying connectivity...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: '#0F172A',
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold
  }
});
