import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomerStackParamList } from '../../navigation/types';
import { useCart } from '../../hooks/useCart';
import { useOrders } from '../../hooks/useOrders';
import { PaymentMethod } from '../../types/order.types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { LoadingSpinner } from '../../components/LoadingSpinner';

type NavigationProp = StackNavigationProp<CustomerStackParamList>;

export const CheckoutScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { cart, isLoading: isCartLoading } = useCart();
  const { checkout, isPlacingOrder } = useOrders();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<{ address?: string; contact?: string }>({});

  const validate = () => {
    const errs: { address?: string; contact?: string } = {};
    if (!deliveryAddress.trim()) {
      errs.address = 'Delivery address is required';
    }
    if (!contactNumber.trim()) {
      errs.contact = 'Contact number is required';
    } else if (contactNumber.trim().length < 10) {
      errs.contact = 'Enter a valid 10-digit phone number';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;

    try {
      const result = await checkout({
        deliveryAddress: deliveryAddress.trim(),
        contactNumber: contactNumber.trim(),
        paymentMethod,
        notes: notes.trim() ? notes.trim() : undefined
      });

      Alert.alert(
        'Order Placed Successfully!',
        `Your order #${result.orderNumber} has been placed.`,
        [
          {
            text: 'View Orders',
            onPress: () => navigation.navigate('Orders')
          }
        ]
      );
    } catch (err: any) {
      Alert.alert('Checkout Failed', err?.response?.data?.message || 'Could not place order. Please try again.');
    }
  };

  if (isCartLoading) {
    return <LoadingSpinner fullScreen message="Preparing checkout..." />;
  }

  const items = cart?.items || [];
  const totalAmount = cart?.totalAmount || 0;
  const deliveryFee = totalAmount > 500 || totalAmount === 0 ? 0 : 40;
  const grandTotal = totalAmount + deliveryFee;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Checkout</Text>

        {/* Shipping Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <AppInput
            label="Delivery Address"
            placeholder="Enter full street address, apartment, zip code"
            value={deliveryAddress}
            onChangeText={(text) => {
              setDeliveryAddress(text);
              if (errors.address) setErrors((prev) => ({ ...prev, address: undefined }));
            }}
            error={errors.address}
            multiline
            numberOfLines={3}
          />

          <AppInput
            label="Contact Phone Number"
            placeholder="e.g. 9876543210"
            keyboardType="phone-pad"
            value={contactNumber}
            onChangeText={(text) => {
              setContactNumber(text);
              if (errors.contact) setErrors((prev) => ({ ...prev, contact: undefined }));
            }}
            error={errors.contact}
          />

          <AppInput
            label="Delivery Notes (Optional)"
            placeholder="Gate code, landmark, delivery instructions..."
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'COD' && styles.paymentOptionSelected]}
            onPress={() => setPaymentMethod('COD')}
          >
            <View style={styles.radioOuter}>
              {paymentMethod === 'COD' && <View style={styles.radioInner} />}
            </View>
            <View style={styles.paymentTextContainer}>
              <Text style={styles.paymentMethodTitle}>Cash on Delivery (COD)</Text>
              <Text style={styles.paymentMethodSubtitle}>Pay cash upon receiving your order</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'UPI' && styles.paymentOptionSelected]}
            onPress={() => setPaymentMethod('UPI')}
          >
            <View style={styles.radioOuter}>
              {paymentMethod === 'UPI' && <View style={styles.radioInner} />}
            </View>
            <View style={styles.paymentTextContainer}>
              <Text style={styles.paymentMethodTitle}>UPI / Google Pay / PhonePe</Text>
              <Text style={styles.paymentMethodSubtitle}>Instant payment via UPI App</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentOption, paymentMethod === 'CREDIT_CARD' && styles.paymentOptionSelected]}
            onPress={() => setPaymentMethod('CREDIT_CARD')}
          >
            <View style={styles.radioOuter}>
              {paymentMethod === 'CREDIT_CARD' && <View style={styles.radioInner} />}
            </View>
            <View style={styles.paymentTextContainer}>
              <Text style={styles.paymentMethodTitle}>Credit / Debit Card</Text>
              <Text style={styles.paymentMethodSubtitle}>Visa, Mastercard, RuPay</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary ({items.length} items)</Text>

          {items.map((item) => (
            <View key={item.id} style={styles.summaryItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.medicineName}
                </Text>
                <Text style={styles.itemMeta}>
                  Qty: {item.quantity} × ₹{item.unitPrice.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.itemSubtotal}>₹{item.subtotal.toFixed(2)}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Items Total</Text>
            <Text style={styles.rowValue}>₹{totalAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Delivery Fee</Text>
            <Text style={styles.rowValue}>
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>₹{grandTotal.toFixed(2)}</Text>
          </View>
        </View>

        <AppButton
          title={isPlacingOrder ? 'Placing Order...' : `Pay ₹${grandTotal.toFixed(2)} & Place Order`}
          onPress={handlePlaceOrder}
          loading={isPlacingOrder}
          disabled={items.length === 0 || isPlacingOrder}
          style={styles.placeOrderBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.bgPrimary
  },
  content: {
    padding: spacing.lg
  },
  title: {
    ...typography.h2,
    color: colors.dark.textPrimary,
    marginBottom: spacing.lg
  },
  section: {
    backgroundColor: colors.dark.bgSecondary,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark.border
  },
  sectionTitle: {
    ...typography.subtitle1,
    color: colors.dark.textPrimary,
    marginBottom: spacing.md
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.dark.border,
    marginBottom: spacing.sm,
    backgroundColor: colors.dark.bgTertiary
  },
  paymentOptionSelected: {
    borderColor: colors.emerald[500],
    backgroundColor: colors.emerald[900] + '20'
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.emerald[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.emerald[500]
  },
  paymentTextContainer: {
    flex: 1
  },
  paymentMethodTitle: {
    ...typography.subtitle2,
    color: colors.dark.textPrimary
  },
  paymentMethodSubtitle: {
    ...typography.caption,
    color: colors.dark.textSecondary
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs
  },
  itemInfo: {
    flex: 1,
    marginRight: spacing.sm
  },
  itemName: {
    ...typography.body2,
    color: colors.dark.textPrimary
  },
  itemMeta: {
    ...typography.caption,
    color: colors.dark.textMuted
  },
  itemSubtotal: {
    ...typography.subtitle2,
    color: colors.dark.textPrimary
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginVertical: spacing.sm
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2
  },
  rowLabel: {
    ...typography.body2,
    color: colors.dark.textSecondary
  },
  rowValue: {
    ...typography.subtitle2,
    color: colors.dark.textPrimary
  },
  grandTotalLabel: {
    ...typography.subtitle1,
    color: colors.dark.textPrimary,
    fontWeight: '700'
  },
  grandTotalValue: {
    ...typography.h3,
    color: colors.emerald[400],
    fontWeight: '700'
  },
  placeOrderBtn: {
    marginTop: spacing.md,
    marginBottom: spacing.xl
  }
});
