import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle
} from 'react-native';
import { Medicine } from '../types/medicine.types';
import { useThemeStore } from '../store/useThemeStore';
import { colors, borderRadius, spacing, fontSizes, fontWeights } from '../theme';

interface ProductCardProps {
  medicine: Medicine;
  onPress: () => void;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  isWishlisted?: boolean;
  style?: ViewStyle;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  medicine,
  onPress,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  style
}) => {
  const { mode } = useThemeStore();
  const themeColors = colors[mode];

  const hasDiscount = medicine.discountPercentage > 0;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: themeColors.card,
          borderColor: themeColors.border,
          shadowColor: themeColors.shadow
        },
        style
      ]}
    >
      {/* Badges Container */}
      <View style={styles.badgeRow}>
        {medicine.prescriptionRequired ? (
          <View style={[styles.badge, { backgroundColor: themeColors.badgePrescription }]}>
            <Text style={styles.badgeText}>Rx Required</Text>
          </View>
        ) : <View />}

        {onToggleWishlist && (
          <TouchableOpacity
            onPress={onToggleWishlist}
            style={[styles.wishlistButton, { backgroundColor: themeColors.surfaceVariant }]}
          >
            <Text style={{ fontSize: 14 }}>{isWishlisted ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Text style={[styles.brand, { color: themeColors.textMuted }]}>
          {medicine.brand.toUpperCase()}
        </Text>
        <Text
          numberOfLines={2}
          style={[styles.name, { color: themeColors.textPrimary }]}
        >
          {medicine.name}
        </Text>
        <Text
          numberOfLines={1}
          style={[styles.composition, { color: themeColors.textSecondary }]}
        >
          {medicine.composition}
        </Text>
        <Text style={[styles.packSize, { color: themeColors.textMuted }]}>
          {medicine.dosageForm} • {medicine.packSize}
        </Text>

        {/* Pricing & Cart Action */}
        <View style={styles.footer}>
          <View>
            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: themeColors.textPrimary }]}>
                ₹{medicine.discountedPrice}
              </Text>
              {hasDiscount && (
                <Text style={[styles.originalPrice, { color: themeColors.textMuted }]}>
                  ₹{medicine.price}
                </Text>
              )}
            </View>
            {hasDiscount && (
              <Text style={[styles.discountTag, { color: themeColors.success }]}>
                {medicine.discountPercentage}% OFF
              </Text>
            )}
          </View>

          {onAddToCart && medicine.inStock && (
            <TouchableOpacity
              onPress={onAddToCart}
              style={[styles.addButton, { backgroundColor: themeColors.primaryLight }]}
            >
              <Text style={[styles.addButtonText, { color: themeColors.primaryDark }]}>
                ADD
              </Text>
            </TouchableOpacity>
          )}

          {!medicine.inStock && (
            <Text style={[styles.outOfStockText, { color: themeColors.error }]}>
              Out of Stock
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold
  },
  wishlistButton: {
    padding: spacing.xs,
    borderRadius: borderRadius.full
  },
  content: {
    marginTop: spacing.xs
  },
  brand: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.5
  },
  name: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    marginTop: 2
  },
  composition: {
    fontSize: fontSizes.xs,
    marginTop: 2
  },
  packSize: {
    fontSize: fontSizes.xs,
    marginTop: spacing.xs
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.md,
    paddingTop: spacing.xs
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline'
  },
  price: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold
  },
  originalPrice: {
    fontSize: fontSizes.xs,
    textDecorationLine: 'line-through',
    marginLeft: spacing.xs
  },
  discountTag: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    marginTop: 2
  },
  addButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md
  },
  addButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold
  },
  outOfStockText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold
  }
});
