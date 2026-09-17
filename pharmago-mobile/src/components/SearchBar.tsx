import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle
} from 'react-native';
import { useThemeStore } from '../store/useThemeStore';
import { colors, borderRadius, spacing, fontSizes } from '../theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search medicines, compositions...',
  style
}) => {
  const { mode } = useThemeStore();
  const themeColors = colors[mode];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.surface,
          borderColor: themeColors.border
        },
        style
      ]}
    >
      <Text style={[styles.searchIcon, { color: themeColors.textMuted }]}>🔍</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={themeColors.textMuted}
        style={[styles.input, { color: themeColors.textPrimary }]}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            if (onClear) onClear();
          }}
          style={styles.clearButton}
        >
          <Text style={{ color: themeColors.textMuted, fontSize: fontSizes.xs }}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 44
  },
  searchIcon: {
    marginRight: spacing.sm,
    fontSize: fontSizes.md
  },
  input: {
    flex: 1,
    fontSize: fontSizes.md,
    height: '100%'
  },
  clearButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs
  }
});
