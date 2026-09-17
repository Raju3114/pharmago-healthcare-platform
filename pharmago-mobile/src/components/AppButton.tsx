import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle
} from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { colors, borderRadius, spacing, fontSizes, fontWeights } from '../theme';

interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const AppButton: React.FC<AppButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  ...props
}) => {
  const { mode } = useThemeStore();
  const themeColors = colors[mode];

  const getBackgroundColor = () => {
    if (disabled) return mode === 'light' ? '#E2E8F0' : '#334155';
    switch (variant) {
      case 'primary':
        return themeColors.primary;
      case 'secondary':
        return themeColors.secondary;
      case 'danger':
        return themeColors.error;
      case 'outline':
        return 'transparent';
      default:
        return themeColors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return mode === 'light' ? '#94A3B8' : '#64748B';
    if (variant === 'outline') return themeColors.primary;
    return '#FFFFFF';
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: spacing.xs + 2, paddingHorizontal: spacing.md };
      case 'large':
        return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xxl };
      case 'medium':
      default:
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.xl };
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'small':
        return fontSizes.sm;
      case 'large':
        return fontSizes.lg;
      case 'medium':
      default:
        return fontSizes.md;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        getPadding(),
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outline' ? themeColors.primary : 'transparent',
          borderWidth: variant === 'outline' ? 1.5 : 0
        },
        style
      ]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: getFontSize()
            },
            textStyle
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  text: {
    fontWeight: fontWeights.semibold
  }
});
