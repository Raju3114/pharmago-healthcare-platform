import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../navigation/types';
import { useMedicines, useCategories } from '../../hooks/useMedicines';
import { useThemeStore } from '../../store/useThemeStore';
import { SearchBar } from '../../components/SearchBar';
import { ProductCard } from '../../components/ProductCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { colors, spacing, fontSizes, fontWeights, borderRadius } from '../../theme';

type Props = NativeStackScreenProps<CustomerStackParamList, any>;

export const SearchScreen: React.FC<Props> = ({ navigation }) => {
  const { mode } = useThemeStore();
  const themeColors = colors[mode];

  const [query, setQuery] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [prescriptionRequired, setPrescriptionRequired] = useState<boolean | undefined>();
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();

  const { data: categories } = useCategories();
  const { data: medicinesPage, isLoading } = useMedicines({
    searchQuery: query.trim().length > 0 ? query : undefined,
    categoryId: selectedCategoryId,
    inStockOnly: inStockOnly ? true : undefined,
    prescriptionRequired,
    pageSize: 20
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <View style={styles.container}>
        {/* Search Bar */}
        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search by name, composition or brand..."
          style={styles.searchBar}
        />

        {/* Categories Chips */}
        <View style={styles.filterSection}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              const isSelected = selectedCategoryId === item.id;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedCategoryId(isSelected ? undefined : item.id)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: isSelected ? themeColors.primary : themeColors.surface,
                      borderColor: themeColors.border
                    }
                  ]}
                >
                  <Text style={[styles.chipText, { color: isSelected ? '#FFFFFF' : themeColors.textPrimary }]}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Filter Toggles */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            onPress={() => setInStockOnly(!inStockOnly)}
            style={[
              styles.toggleChip,
              {
                backgroundColor: inStockOnly ? themeColors.primary : themeColors.surface,
                borderColor: themeColors.border
              }
            ]}
          >
            <Text style={[styles.toggleText, { color: inStockOnly ? '#FFFFFF' : themeColors.textPrimary }]}>
              In Stock
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setPrescriptionRequired(prescriptionRequired === true ? undefined : true)}
            style={[
              styles.toggleChip,
              {
                backgroundColor: prescriptionRequired === true ? themeColors.primary : themeColors.surface,
                borderColor: themeColors.border
              }
            ]}
          >
            <Text style={[styles.toggleText, { color: prescriptionRequired === true ? '#FFFFFF' : themeColors.textPrimary }]}>
              Rx Only
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results List */}
        {isLoading ? (
          <LoadingSpinner message="Searching catalog..." />
        ) : (
          <FlatList
            data={medicinesPage?.content || []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <ProductCard
                medicine={item}
                onPress={() => navigation.navigate('MedicineDetail', { medicineId: item.id })}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <EmptyState
                icon="🔎"
                title="No Matching Medicines"
                message="Try adjusting your query or filter parameters."
                actionTitle="Reset Search"
                onAction={() => {
                  setQuery('');
                  setSelectedCategoryId(undefined);
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
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.md },
  searchBar: { marginBottom: spacing.md },
  filterSection: { marginBottom: spacing.sm },
  chip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2, borderRadius: borderRadius.full, borderWidth: 1, marginRight: spacing.xs },
  chipText: { fontSize: fontSizes.xs, fontWeight: fontWeights.semibold },
  toggleRow: { flexDirection: 'row', marginBottom: spacing.md },
  toggleChip: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full, borderWidth: 1, marginRight: spacing.xs },
  toggleText: { fontSize: fontSizes.xs, fontWeight: fontWeights.medium },
  listContent: { paddingBottom: spacing.xxxl }
});
