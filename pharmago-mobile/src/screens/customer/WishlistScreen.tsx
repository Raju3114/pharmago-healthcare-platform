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
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';
import { useThemeStore } from '../../store/useThemeStore';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { colors, spacing, fontSizes, fontWeights, borderRadius } from '../../theme';

type Props = NativeStackScreenProps<CustomerStackParamList, any>;

export const WishlistScreen: React.FC<Props> = ({ navigation }) => {
  const { mode } = useThemeStore();
  const themeColors = colors[mode];
  const { wishlist, isLoading, refetch, isRefetching, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = async (medicineId: number, medicineName: string) => {
    try {
      await addToCart({ medicineId, quantity: 1 });
      await removeFromWishlist(medicineId);
      Alert.alert('Moved to Cart', `${medicineName} has been moved to your shopping cart.`);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to move medicine to cart');
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Fetching wishlist items..." />;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.backBtn, { backgroundColor: themeColors.surfaceVariant }]}>
          <Text style={{ fontSize: 18, color: themeColors.textPrimary }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>My Wishlist</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[themeColors.primary]} />
        }
        renderItem={({ item }) => {
          const med = item.medicine;
          return (
            <View style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
              <View style={styles.cardHeader}>
                <Text style={[styles.brand, { color: themeColors.textMuted }]}>{med.brand.toUpperCase()}</Text>
                <TouchableOpacity onPress={() => removeFromWishlist(med.id)}>
                  <Text style={{ fontSize: 16 }}>❤️</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.name, { color: themeColors.textPrimary }]}>{med.name}</Text>
              <Text style={[styles.comp, { color: themeColors.textSecondary }]}>{med.composition}</Text>
              <Text style={[styles.price, { color: themeColors.primary }]}>₹{med.discountedPrice}</Text>

              <View style={styles.cardFooter}>
                <TouchableOpacity
                  onPress={() => handleMoveToCart(med.id, med.name)}
                  style={[styles.moveBtn, { backgroundColor: themeColors.primaryLight }]}
                >
                  <Text style={[styles.moveBtnText, { color: themeColors.primaryDark }]}>Move to Cart 🛒</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="🤍"
            title="Wishlist is Empty"
            message="Save your favorite medicines for quick re-ordering."
            actionTitle="Browse Catalog"
            onAction={() => navigation.navigate('MainTabs', { screen: 'MedicinesTab' })}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, borderRadius: borderRadius.full, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: fontSizes.lg, fontWeight: fontWeights.bold },
  listContent: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: spacing.xxxl },
  card: { borderRadius: borderRadius.xl, borderWidth: 1, padding: spacing.lg, marginBottom: spacing.md },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  brand: { fontSize: fontSizes.xs, fontWeight: fontWeights.semibold },
  name: { fontSize: fontSizes.md, fontWeight: fontWeights.bold, marginTop: 4 },
  comp: { fontSize: fontSizes.xs, marginTop: 2 },
  price: { fontSize: fontSizes.lg, fontWeight: fontWeights.bold, marginTop: spacing.xs },
  cardFooter: { marginTop: spacing.md },
  moveBtn: { paddingVertical: spacing.xs + 2, borderRadius: borderRadius.md, alignItems: 'center' },
  moveBtnText: { fontSize: fontSizes.sm, fontWeight: fontWeights.bold }
});
