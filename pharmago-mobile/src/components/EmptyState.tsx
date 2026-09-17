import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { colors, spacing, fontSizes, fontWeights } from '../theme';
import { AppButton } from './AppButton';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  actionTitle?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📦',
  title,
  message,
  actionTitle,
  onAction
}) => {
  const { mode } = useThemeStore();
  const themeColors = colors[mode];

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.title, { color: themeColors.textPrimary }]}>
        {title}
      </Text>
      <Text style={[styles.message, { color: themeColors.textSecondary }]}>
        {message}
      </Text>
      {actionTitle && onAction && (
        <AppButton
          title={actionTitle}
          onPress={onAction}
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxxl
  },
  icon: {
    fontSize: 54,
    marginBottom: spacing.md
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.xs,
    textAlign: 'center'
  },
  message: {
    fontSize: fontSizes.md,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl
  },
  actionButton: {
    minWidth: 160
  }
});
