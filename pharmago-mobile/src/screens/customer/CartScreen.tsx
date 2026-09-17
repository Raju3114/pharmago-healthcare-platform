import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Alert
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../navigation/types';
import { useCart } from '../../hooks/useCart';
import { useThemeStore } from '../../store/useThemeStore';
import { AppButton } from '../../components/AppButton';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { colors, spacing, fontSizes, fontWeights, borderRadius } from '../../theme';

type Props = NativeStackScreenProps<CustomerStackParamList, any>;

export const CartScreen: React.FC<Props> = ({ navigation }) => {
  const { mode } = useThemeStore();
  const themeColors = colors[mode];
  const { cart, isLoading, refetch, isRefetching, updateCartItem, removeCartItem, clearCart } = useCart();

  const handleUpdateQty = async (itemId: number, newQty: number) => {
    if (newQty < 1) {
      handleRemoveItem(itemId);
      return;
    }
    try {
      await updateCartItem({ itemId, payload: { quantity: newQty } });
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to update quantity');
    }
  };

  const handleRemoveItem = (itemId: number) => {
    Alert.alert('Remove Item', 'Remove this medicine from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeCartItem(itemId) }
    ]);
  };

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Empty all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: () => clearCart() }
    ]);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Fetching cart items..." />;
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>
          My Shopping Cart
        </Text>
        {!isEmpty && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={[styles.clearText, { color: themeColors.error }]}>Clear Cart</Text>
          </TouchableOpacity>
        )}
      </View>

      {!isEmpty ? (
        <View style={{ flex: 1 }}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[themeColors.primary]} />
            }
            renderItem={({ item }) => (
              <View style={[styles.cartCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                <View style={styles.cardMain}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.brand, { color: themeColors.textMuted }]}>
                      {item.brand.toUpperCase()}
                    </Text>
                    <Text style={[styles.name, { color: themeColors.textPrimary }]}>
                      {item.medicineName}
                    </Text>
                    <Text style={[styles.pack, { color: themeColors.textSecondary }]}>
                      {item.dosageForm} • {item.packSize}
                    </Text>
                    <Text style={[styles.price, { color: themeColors.primary }]}>
                      ₹{item.unitPrice} / unit
                    </Text>
                  </View>

                  <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.deleteButton}>
                    <Text style={{ fontSize: 16 }}>🗑️</Text>
                  </TouchableOpacity>
                </View>

                {/* Subtotal & Qty Control Footer */}
                <View style={[styles.cardFooter, { borderTopColor: themeColors.border }]}>
                  <Text style={[styles.subtotal, { color: themeColors.textPrimary }]}>
                    Subtotal: ₹{item.subtotal}
                  </Text>

                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      onPress={() => handleUpdateQty(item.id, item.quantity - 1)}
                      style={[styles.qtyBtn, { backgroundColor: themeColors.surfaceVariant }]}
                    >
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: themeColors.textPrimary }}>-</Text>
                    </TouchableOpacity>

                    <Text style={[styles.qtyText, { color: themeColors.textPrimary }]}>{item.quantity}</Text>

                    <TouchableOpacity
                      onPress={() => handleUpdateQty(item.id, item.quantity + 1)}
                      style={[styles.qtyBtn, { backgroundColor: themeColors.surfaceVariant }]}
                    >
                      <Text style={{ fontSize: 16, fontWeight: 'bold', color: themeColors.textPrimary }}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          />

          {/* Cart Summary Bottom Bar */}
          <View style={[styles.summaryFooter, { backgroundColor: themeColors.surface, borderTopColor: themeColors.border }]}>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: themeColors.textSecondary }]}>Total Items:</Text>
              <Text style={[styles.summaryVal, { color: themeColors.textPrimary }]}>{cart?.totalItems}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: themeColors.textSecondary }]}>Total Payable:</Text>
              <Text style={[styles.totalAmount, { color: themeColors.primary }]}>₹{cart?.totalAmount}</Text>
            </View>

            {cart?.requiresPrescription && (
              <Text style={[styles.rxNotice, { color: themeColors.warning }]}>
                ⚠️ Contains Prescription Medicines (Rx)
              </Text>
            )}

            <AppButton
              title="Proceed to Checkout →"
              onPress={() => navigation.navigate('Checkout')}
              style={styles.checkoutBtn}
            />
          </View>
        </View>
      ) : (
        <EmptyState
          icon="🛒"
          title="Your Cart is Empty"
          message="Browse our medicine catalog to add items to your cart."
          actionTitle="Explore Medicines"
          onAction={() => navigation.navigate('MainTabs', { screen: 'MedicinesTab' })}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderBottomWidth: 1 },
  headerTitle: { fontSize: fontSizes.xl, fontWeight: fontWeights.bold },
  clearText: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold },
  listContent: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: 160 },
  cartCard: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.md, marginBottom: spacing.md },
  cardMain: { flexDirection: 'row', justifyContent: 'space-between' },
  brand: { fontSize: fontSizes.xs, fontWeight: fontWeights.semibold },
  name: { fontSize: fontSizes.md, fontWeight: fontWeights.bold, marginTop: 2 },
  pack: { fontSize: fontSizes.xs, marginTop: 2 },
  price: { fontSize: fontSizes.sm, fontWeight: fontWeights.bold, marginTop: spacing.xs },
  deleteButton: { padding: spacing.xs },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md, paddingTop: spacing.xs, borderTopWidth: 1 },
  subtotal: { fontSize: fontSizes.sm, fontWeight: fontWeights.bold },
  qtyRow: { flexDirection: 'row', alignItems: 'center' },
  qtyBtn: { width: 32, height: 32, borderRadius: borderRadius.md, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: fontSizes.md, fontWeight: fontWeights.bold, marginHorizontal: spacing.sm },
  summaryFooter: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderTopWidth: 1 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  summaryLabel: { fontSize: fontSizes.sm },
  summaryVal: { fontSize: fontSizes.sm, fontWeight: fontWeights.bold },
  totalAmount: { fontSize: fontSizes.xl, fontWeight: fontWeights.bold },
  rxNotice: { fontSize: fontSizes.xs, fontWeight: fontWeights.bold, marginVertical: spacing.xs },
  checkoutBtn: { marginTop: spacing.sm }
});
