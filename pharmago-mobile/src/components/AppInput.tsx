import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  TouchableOpacity
} from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { colors, borderRadius, spacing, fontSizes, fontWeights } from '../theme';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
}

export const AppInput: React.FC<AppInputProps> = ({
  label,
  error,
  isPassword = false,
  style,
  ...props
}) => {
  const { mode } = useThemeStore();
  const themeColors = colors[mode];
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(isPassword);

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: themeColors.textSecondary }]}>
          {label}
        </Text>
      )}
      <View
        style={[
          styles.inputWrapper,
          {
            backgroundColor: themeColors.surface,
            borderColor: error
              ? themeColors.error
              : isFocused
              ? themeColors.primary
              : themeColors.border
          }
        ]}
      >
        <TextInput
          placeholderTextColor={themeColors.textMuted}
          secureTextEntry={hidePassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            { color: themeColors.textPrimary },
            style
          ]}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
            style={styles.eyeIcon}
          >
            <Text style={{ color: themeColors.textMuted, fontSize: fontSizes.xs, fontWeight: fontWeights.semibold }}>
              {hidePassword ? 'SHOW' : 'HIDE'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={[styles.errorText, { color: themeColors.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    marginBottom: spacing.xs
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    height: 48
  },
  input: {
    flex: 1,
    fontSize: fontSizes.md,
    height: '100%'
  },
  eyeIcon: {
    padding: spacing.xs
  },
  errorText: {
    fontSize: fontSizes.xs,
    marginTop: spacing.xs
  }
});
