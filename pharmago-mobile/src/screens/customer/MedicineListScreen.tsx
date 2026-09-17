import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../navigation/types';
import { useMedicines } from '../../hooks/useMedicines';
import { useThemeStore } from '../../store/useThemeStore';
import { ProductCard } from '../../components/ProductCard';
import { SearchBar } from '../../components/SearchBar';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { colors, spacing, fontSizes, fontWeights, borderRadius } from '../../theme';

type Props = NativeStackScreenProps<CustomerStackParamList, 'CategoryMedicines'>;

export const MedicineListScreen: React.FC<Props> = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params || {};
  const { mode } = useThemeStore();
  const themeColors = colors[mode];

  const [searchQuery, setSearchQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [prescriptionRequired, setPrescriptionRequired] = useState<boolean | undefined>();

  const { data: medicinesPage, isLoading, refetch, isRefetching } = useMedicines({
    categoryId: categoryId && categoryId > 0 ? categoryId : undefined,
    searchQuery: searchQuery.trim().length > 0 ? searchQuery : undefined,
    inStockOnly: inStockOnly ? true : undefined,
    prescriptionRequired,
    pageSize: 20
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: themeColors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: themeColors.surfaceVariant }]}
        >
          <Text style={{ fontSize: 18, color: themeColors.textPrimary }}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>
          {categoryName || 'Medicines Catalog'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.container}>
        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search within this catalog..."
          style={styles.searchBar}
        />

        {/* Filter Badges Row */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            onPress={() => setInStockOnly(!inStockOnly)}
            style={[
              styles.filterChip,
              {
                backgroundColor: inStockOnly ? themeColors.primary : themeColors.surface,
                borderColor: themeColors.border
              }
            ]}
          >
            <Text style={[styles.filterChipText, { color: inStockOnly ? '#FFFFFF' : themeColors.textPrimary }]}>
              In Stock Only
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              setPrescriptionRequired(
                prescriptionRequired === true ? undefined : true
              )
            }
            style={[
              styles.filterChip,
              {
                backgroundColor: prescriptionRequired === true ? themeColors.primary : themeColors.surface,
                borderColor: themeColors.border
              }
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                { color: prescriptionRequired === true ? '#FFFFFF' : themeColors.textPrimary }
              ]}
            >
              Rx Required
            </Text>
          </TouchableOpacity>
        </View>

        {/* Medicines FlatList */}
        {isLoading ? (
          <LoadingSpinner message="Loading catalog medicines..." />
        ) : (
          <FlatList
            data={medicinesPage?.content || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ProductCard
                medicine={item}
                onPress={() => navigation.navigate('MedicineDetail', { medicineId: item.id })}
                onAddToCart={() => navigation.navigate('MainTabs', { screen: 'CartTab' })}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[themeColors.primary]} />
            }
            ListEmptyComponent={
              <EmptyState
                icon="🔍"
                title="No Medicines Found"
                message="Try clearing your search queries or filter toggles."
                actionTitle="Reset Filters"
                onAction={() => {
                  setSearchQuery('');
                  setInStockOnly(false);
                  setPrescriptionRequired(undefined);
                }}
              />
            }
          />
        )}
      </View>
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
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md
  },
  searchBar: {
    marginBottom: spacing.md
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: spacing.md
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginRight: spacing.sm
  },
  filterChipText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold
  },
  listContent: {
    paddingBottom: spacing.xxxl
  }
});
