import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomerStackParamList } from '../../navigation/types';
import { useOrders } from '../../hooks/useOrders';
import { Order, OrderStatus } from '../../types/order.types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';

type NavigationProp = StackNavigationProp<CustomerStackParamList>;

export const OrdersScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { ordersPage, isLoading, refetch, isRefetching } = useOrders(0, 20);

  const orders = ordersPage?.content || [];

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return { bg: colors.emerald[900] + '33', text: colors.emerald[400], label: 'DELIVERED' };
      case 'CANCELLED':
        return { bg: colors.ruby[900] + '33', text: colors.ruby[400], label: 'CANCELLED' };
      case 'SHIPPED':
        return { bg: colors.sky[900] + '33', text: colors.sky[400], label: 'IN TRANSIT' };
      case 'PACKED':
        return { bg: colors.amber[900] + '33', text: colors.amber[400], label: 'PACKED' };
      case 'CONFIRMED':
        return { bg: colors.emerald[900] + '33', text: colors.emerald[300], label: 'CONFIRMED' };
      default:
        return { bg: colors.amber[900] + '33', text: colors.amber[300], label: 'ORDERED' };
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const badge = getStatusBadge(item.orderStatus);
    const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
            <Text style={styles.orderDate}>{dateStr}</Text>
          </View>

          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardBody}>
          <Text style={styles.itemCountText}>
            {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
          </Text>
          <Text style={styles.totalAmount}>₹{item.totalAmount.toFixed(2)}</Text>
        </View>

        <Text style={styles.viewDetailText}>View Details & Tracking →</Text>
      </TouchableOpacity>
    );
  };

  if (isLoading && !isRefetching) {
    return <LoadingSpinner fullScreen message="Loading your orders..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listPadding}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.emerald[500]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Orders Found"
            message="You haven't placed any medicine orders yet."
            actionLabel="Start Shopping"
            onAction={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark.bgPrimary
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border
  },
  title: {
    ...typography.h2,
    color: colors.dark.textPrimary
  },
  listPadding: {
    padding: spacing.lg
  },
  card: {
    backgroundColor: colors.dark.bgSecondary,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.dark.border
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  orderNumber: {
    ...typography.subtitle1,
    color: colors.dark.textPrimary,
    fontWeight: '700'
  },
  orderDate: {
    ...typography.caption,
    color: colors.dark.textSecondary,
    marginTop: 2
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.borderRadius.sm
  },
  badgeText: {
    ...typography.caption,
    fontWeight: '700'
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark.border,
    marginVertical: spacing.md
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs
  },
  itemCountText: {
    ...typography.body2,
    color: colors.dark.textSecondary
  },
  totalAmount: {
    ...typography.h3,
    color: colors.emerald[400],
    fontWeight: '700'
  },
  viewDetailText: {
    ...typography.caption,
    color: colors.emerald[400],
    fontWeight: '600',
    marginTop: spacing.xs
  }
});
