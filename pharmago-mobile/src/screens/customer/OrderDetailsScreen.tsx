import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomerStackParamList } from '../../navigation/types';
import { useOrderDetail } from '../../hooks/useOrders';
import { OrderStatus } from '../../types/order.types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { LoadingSpinner } from '../../components/LoadingSpinner';

type RouteProps = RouteProp<CustomerStackParamList, 'OrderDetail'>;
type NavigationProps = StackNavigationProp<CustomerStackParamList>;

const STATUS_STEPS: OrderStatus[] = ['ORDERED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED'];

export const OrderDetailsScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const { orderId } = route.params;

  const { data: order, isLoading } = useOrderDetail(orderId);

  if (isLoading || !order) {
    return <LoadingSpinner fullScreen message="Fetching order details..." />;
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header Summary */}
        <View style={styles.card}>
          <Text style={styles.orderTitle}>Order #{order.orderNumber}</Text>
          <Text style={styles.orderDate}>
            Placed on {new Date(order.createdAt).toLocaleString()}
          </Text>

          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Current Status:</Text>
            <Text style={styles.statusValue}>{order.orderStatus}</Text>
          </View>
        </View>

        {/* Status Timeline */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Timeline</Text>
          <View style={styles.timeline}>
            {STATUS_STEPS.map((step, idx) => {
              const isPassed = idx <= currentStepIndex && order.orderStatus !== 'CANCELLED';
              const isCurrent = idx === currentStepIndex;

              return (
                <View key={step} style={styles.timelineStep}>
                  <View style={styles.nodeContainer}>
                    <View
                      style={[
                        styles.nodeCircle,
                        isPassed && styles.nodeCirclePassed,
                        isCurrent && styles.nodeCircleCurrent
                      ]}
                    >
                      <Text style={styles.nodeIcon}>{isPassed ? '✓' : '•'}</Text>
                    </View>
                    {idx < STATUS_STEPS.length - 1 && (
                      <View style={[styles.nodeLine, isPassed && styles.nodeLinePassed]} />
                    )}
                  </View>

                  <View style={styles.stepTextContainer}>
                    <Text
                      style={[
                        styles.stepTitle,
                        isPassed && styles.stepTitlePassed,
                        isCurrent && styles.stepTitleCurrent
                      ]}
                    >
                      {step}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Items List */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ordered Items ({order.items.length})</Text>
          {order.items.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.itemRow}
              onPress={() => navigation.navigate('MedicineDetail', { medicineId: item.medicineId })}
            >
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.medicineName}</Text>
                <Text style={styles.itemSubtext}>
                  {item.brand} • {item.packSize}
                </Text>
                <Text style={styles.itemQty}>
                  Qty: {item.quantity} × ₹{item.unitPrice.toFixed(2)}
                </Text>
              </View>
              <Text style={styles.itemPrice}>₹{item.subtotal.toFixed(2)}</Text>
            </TouchableOpacity>
          ))}

          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.totalValue}>₹{order.totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Shipping & Payment Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Delivery & Payment</Text>
          <Text style={styles.infoLabel}>Delivery Address:</Text>
          <Text style={styles.infoValue}>{order.deliveryAddress}</Text>

          <Text style={styles.infoLabel}>Contact Number:</Text>
          <Text style={styles.infoValue}>{order.contactNumber}</Text>

          <Text style={styles.infoLabel}>Payment Method:</Text>
          <Text style={styles.infoValue}>{order.paymentMethod} ({order.paymentStatus})</Text>

          {order.notes ? (
            <>
              <Text style={styles.infoLabel}>Notes:</Text>
              <Text style={styles.infoValue}>{order.notes}</Text>
            </>
          ) : null}
        </View>

        {/* Prescription Upload Action */}
        <TouchableOpacity
          style={styles.prescriptionActionBtn}
          onPress={() => navigation.navigate('UploadPrescription', { orderId: order.id })}
        >
          <Text style={styles.prescriptionActionText}>📷 Upload Prescription for this Order</Text>
        </TouchableOpacity>
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
  card: {
    backgroundColor: colors.dark.bgSecondary,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark.border
  },
  orderTitle: {
    ...typography.h2,
    color: colors.dark.textPrimary
  },
  orderDate: {
    ...typography.body2,
    color: colors.dark.textSecondary,
    marginTop: 2
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    backgroundColor: colors.emerald[900] + '33',
    padding: spacing.sm,
    borderRadius: spacing.borderRadius.md
  },
  statusLabel: {
    ...typography.body2,
    color: colors.dark.textSecondary,
    marginRight: spacing.xs
  },
  statusValue: {
    ...typography.subtitle1,
    color: colors.emerald[400],
    fontWeight: '700'
  },
  sectionTitle: {
    ...typography.subtitle1,
    color: colors.dark.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.md
  },
  timeline: {
    marginLeft: spacing.xs
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm
  },
  nodeContainer: {
    alignItems: 'center',
    marginRight: spacing.md
  },
  nodeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  nodeCirclePassed: {
    backgroundColor: colors.emerald[600]
  },
  nodeCircleCurrent: {
    backgroundColor: colors.emerald[500],
    borderWidth: 2,
    borderColor: colors.emerald[300]
  },
  nodeIcon: {
    color: colors.neutral[900],
    fontSize: 12,
    fontWeight: '700'
  },
  nodeLine: {
    width: 2,
    height: 24,
    backgroundColor: colors.dark.border
  },
  nodeLinePassed: {
    backgroundColor: colors.emerald[600]
  },
  stepTextContainer: {
    justifyContent: 'center',
    paddingTop: 2
  },
  stepTitle: {
    ...typography.body2,
    color: colors.dark.textMuted
  },
  stepTitlePassed: {
    color: colors.dark.textSecondary
  },
  stepTitleCurrent: {
    ...typography.subtitle2,
    color: colors.emerald[400],
    fontWeight: '700'
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs
  },
  itemInfo: {
    flex: 1,
    marginRight: spacing.sm
  },
  itemName: {
    ...typography.subtitle2,
    color: colors.dark.textPrimary
  },
  itemSubtext: {
    ...typography.caption,
    color: colors.dark.textMuted
  },
  itemQty: {
    ...typography.caption,
    color: colors.dark.textSecondary,
    marginTop: 2
  },
  itemPrice: {
    ...typography.subtitle2,
    color: colors.dark.textPrimary
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginVertical: spacing.md
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    ...typography.subtitle1,
    color: colors.dark.textPrimary
  },
  totalValue: {
    ...typography.h3,
    color: colors.emerald[400],
    fontWeight: '700'
  },
  infoLabel: {
    ...typography.caption,
    color: colors.dark.textMuted,
    marginTop: spacing.xs
  },
  infoValue: {
    ...typography.body2,
    color: colors.dark.textPrimary,
    marginBottom: spacing.xs
  },
  prescriptionActionBtn: {
    backgroundColor: colors.emerald[900] + '40',
    borderWidth: 1,
    borderColor: colors.emerald[500],
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.xl
  },
  prescriptionActionText: {
    ...typography.button,
    color: colors.emerald[400]
  }
});
