import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../navigation/types';
import { useMedicineDetail } from '../../hooks/useMedicines';
import { useThemeStore } from '../../store/useThemeStore';
import { AppButton } from '../../components/AppButton';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { colors, spacing, fontSizes, fontWeights, borderRadius } from '../../theme';

type Props = NativeStackScreenProps<CustomerStackParamList, 'MedicineDetail'>;

export const MedicineDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { medicineId } = route.params;
  const { mode } = useThemeStore();
  const themeColors = colors[mode];

  const [quantity, setQuantity] = useState(1);
  const { data: medicine, isLoading, error } = useMedicineDetail(medicineId);

  const incrementQty = () => {
    if (medicine && quantity < medicine.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    Alert.alert(
      'Added to Cart',
      `${quantity} unit(s) of ${medicine?.name} added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        {
          text: 'View Cart',
          onPress: () => navigation.navigate('MainTabs', { screen: 'CartTab' })
        }
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading medicine specifications..." />;
  }

  if (error || !medicine) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
        <EmptyState
          icon="⚠️"
          title="Medicine Not Found"
          message="The requested product specification could not be retrieved."
          actionTitle="Back to Catalog"
          onAction={() => navigation.goBack()}
        />
      </SafeAreaView>
    );
  }

  const hasDiscount = medicine.discountPercentage > 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: themeColors.surfaceVariant }]}
        >
          <Text style={{ fontSize: 18, color: themeColors.textPrimary }}>←</Text>
        </TouchableOpacity>
        <Text numberOfLines={1} style={[styles.headerTitle, { color: themeColors.textPrimary }]}>
          {medicine.name}
        </Text>
        <TouchableOpacity
          onPress={() => Alert.alert('Saved', 'Medicine saved to wishlist.')}
          style={[styles.backButton, { backgroundColor: themeColors.surfaceVariant }]}
        >
          <Text style={{ fontSize: 18 }}>❤️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Prescription Requirement Warning */}
        {medicine.prescriptionRequired && (
          <View style={[styles.rxBanner, { backgroundColor: themeColors.warningLight, borderColor: themeColors.warning }]}>
            <Text style={{ fontSize: 20, marginRight: spacing.sm }}>📋</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rxBannerTitle, { color: themeColors.warning }]}>
                Prescription Required (Rx)
              </Text>
              <Text style={[styles.rxBannerText, { color: themeColors.textSecondary }]}>
                A valid doctor's prescription must be uploaded during checkout for fulfillment.
              </Text>
            </View>
          </View>
        )}

        {/* Brand & Name Card */}
        <View style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
          <Text style={[styles.brand, { color: themeColors.textMuted }]}>
            {medicine.brand.toUpperCase()}
          </Text>
          <Text style={[styles.name, { color: themeColors.textPrimary }]}>
            {medicine.name}
          </Text>
          <Text style={[styles.composition, { color: themeColors.textSecondary }]}>
            Composition: {medicine.composition}
          </Text>

          <View style={styles.specRow}>
            <View style={[styles.specChip, { backgroundColor: themeColors.surfaceVariant }]}>
              <Text style={[styles.specText, { color: themeColors.textPrimary }]}>
                {medicine.dosageForm}
              </Text>
            </View>
            <View style={[styles.specChip, { backgroundColor: themeColors.surfaceVariant }]}>
              <Text style={[styles.specText, { color: themeColors.textPrimary }]}>
                {medicine.packSize}
              </Text>
            </View>
            <View
              style={[
                styles.specChip,
                { backgroundColor: medicine.inStock ? themeColors.successLight : themeColors.errorLight }
              ]}
            >
              <Text
                style={[
                  styles.specText,
                  { color: medicine.inStock ? themeColors.success : themeColors.error }
                ]}
              >
                {medicine.inStock ? `In Stock (${medicine.stockQuantity})` : 'Out of Stock'}
              </Text>
            </View>
          </View>

          {/* Pricing */}
          <View style={styles.priceContainer}>
            <Text style={[styles.priceLabel, { color: themeColors.textMuted }]}>Price:</Text>
            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: themeColors.textPrimary }]}>
                ₹{medicine.discountedPrice}
              </Text>
              {hasDiscount && (
                <Text style={[styles.originalPrice, { color: themeColors.textMuted }]}>
                  ₹{medicine.price}
                </Text>
              )}
              {hasDiscount && (
                <Text style={[styles.discountBadge, { color: themeColors.success }]}>
                  {medicine.discountPercentage}% OFF
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Product Description */}
        <View style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
            Description & Usage
          </Text>
          <Text style={[styles.descriptionText, { color: themeColors.textSecondary }]}>
            {medicine.description}
          </Text>
        </View>
      </ScrollView>

      {/* Floating Bottom Add-to-Cart Bar */}
      {medicine.inStock && (
        <View style={[styles.footer, { backgroundColor: themeColors.surface, borderTopColor: themeColors.border }]}>
          <View style={styles.qtyContainer}>
            <TouchableOpacity
              onPress={decrementQty}
              style={[styles.qtyButton, { backgroundColor: themeColors.surfaceVariant }]}
            >
              <Text style={{ fontSize: 18, color: themeColors.textPrimary, fontWeight: 'bold' }}>-</Text>
            </TouchableOpacity>
            <Text style={[styles.qtyText, { color: themeColors.textPrimary }]}>{quantity}</Text>
            <TouchableOpacity
              onPress={incrementQty}
              style={[styles.qtyButton, { backgroundColor: themeColors.surfaceVariant }]}
            >
              <Text style={{ fontSize: 18, color: themeColors.textPrimary, fontWeight: 'bold' }}>+</Text>
            </TouchableOpacity>
          </View>

          <AppButton
            title={`Add to Cart • ₹${(medicine.discountedPrice * quantity).toFixed(2)}`}
            onPress={handleAddToCart}
            style={styles.cartButton}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: 100
  },
  rxBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md
  },
  rxBannerTitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold,
    marginBottom: 2
  },
  rxBannerText: {
    fontSize: fontSizes.xs,
    lineHeight: 16
  },
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md
  },
  brand: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.5
  },
  name: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    marginTop: spacing.xs
  },
  composition: {
    fontSize: fontSizes.sm,
    marginTop: spacing.xs
  },
  specRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.md
  },
  specChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginRight: spacing.xs,
    marginBottom: spacing.xs
  },
  specText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold
  },
  priceContainer: {
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0'
  },
  priceLabel: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2
  },
  price: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold
  },
  originalPrice: {
    fontSize: fontSizes.sm,
    textDecorationLine: 'line-through',
    marginLeft: spacing.sm
  },
  discountBadge: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold,
    marginLeft: spacing.sm
  },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.sm
  },
  descriptionText: {
    fontSize: fontSizes.sm,
    lineHeight: 22
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderTopWidth: 1
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md
  },
  qtyButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  qtyText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    marginHorizontal: spacing.md
  },
  cartButton: {
    flex: 1
  }
});
