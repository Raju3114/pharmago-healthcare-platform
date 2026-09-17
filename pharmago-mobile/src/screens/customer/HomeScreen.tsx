import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  FlatList
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../navigation/types';
import { useCategories, useMedicines } from '../../hooks/useMedicines';
import { useThemeStore } from '../../store/useThemeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { SearchBar } from '../../components/SearchBar';
import { ProductCard } from '../../components/ProductCard';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';
import { colors, spacing, fontSizes, fontWeights, borderRadius } from '../../theme';

type Props = NativeStackScreenProps<CustomerStackParamList, 'MainTabs'>;

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { mode } = useThemeStore();
  const themeColors = colors[mode];
  const { user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>();

  const { data: categories, isLoading: isCategoriesLoading, refetch: refetchCategories } = useCategories();
  const { data: medicinesPage, isLoading: isMedicinesLoading, refetch: refetchMedicines, isRefetching } = useMedicines({
    categoryId: selectedCategoryId,
    searchQuery: searchQuery.trim().length > 0 ? searchQuery : undefined,
    pageSize: 10
  });

  const onRefresh = () => {
    refetchCategories();
    refetchMedicines();
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      navigation.navigate('CategoryMedicines', { categoryId: 0, categoryName: `Search: "${searchQuery}"` });
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} colors={[themeColors.primary]} />
        }
      >
        {/* Top Greeting Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greetingText, { color: themeColors.textMuted }]}>
              Hello, {user?.fullName || 'Health Seeker'} 👋
            </Text>
            <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>
              Find Your <Text style={{ color: themeColors.primary }}>Medicines</Text>
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.profileBadge, { backgroundColor: themeColors.primaryLight }]}
            onPress={() => navigation.navigate('MainTabs', { screen: 'ProfileTab' })}
          >
            <Text style={{ fontSize: 20 }}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search tablets, syrups, compositions..."
          style={styles.searchBar}
        />

        {/* Upload Prescription Banner */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('UploadPrescription', {})}
          style={[styles.bannerCard, { backgroundColor: themeColors.primary }]}
        >
          <View style={styles.bannerTextCol}>
            <Text style={styles.bannerTitle}>Have a Doctor's Prescription?</Text>
            <Text style={styles.bannerSubtitle}>
              Upload your prescription & let our verified pharmacists handle your order.
            </Text>
            <View style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Upload Now →</Text>
            </View>
          </View>
          <Text style={styles.bannerIcon}>📜</Text>
        </TouchableOpacity>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
            Categories
          </Text>
          {selectedCategoryId && (
            <TouchableOpacity onPress={() => setSelectedCategoryId(undefined)}>
              <Text style={[styles.clearFilterText, { color: themeColors.primary }]}>Clear Filter</Text>
            </TouchableOpacity>
          )}
        </View>

        {isCategoriesLoading ? (
          <LoadingSpinner />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            <TouchableOpacity
              onPress={() => setSelectedCategoryId(undefined)}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: !selectedCategoryId ? themeColors.primary : themeColors.surface,
                  borderColor: themeColors.border
                }
              ]}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  { color: !selectedCategoryId ? '#FFFFFF' : themeColors.textPrimary }
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            {categories?.map((cat) => {
              const isSelected = selectedCategoryId === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategoryId(cat.id)}
                  style={[
                    styles.categoryChip,
                    {
                      backgroundColor: isSelected ? themeColors.primary : themeColors.surface,
                      borderColor: themeColors.border
                    }
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      { color: isSelected ? '#FFFFFF' : themeColors.textPrimary }
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Featured Medicines Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
            Popular Medicines
          </Text>
        </View>

        {isMedicinesLoading ? (
          <LoadingSpinner message="Fetching catalog..." />
        ) : medicinesPage?.content && medicinesPage.content.length > 0 ? (
          medicinesPage.content.map((medicine) => (
            <ProductCard
              key={medicine.id}
              medicine={medicine}
              onPress={() => navigation.navigate('MedicineDetail', { medicineId: medicine.id })}
              onAddToCart={() => navigation.navigate('MainTabs', { screen: 'CartTab' })}
            />
          ))
        ) : (
          <EmptyState
            icon="💊"
            title="No Medicines Found"
            message="No products match your selected category or query."
            actionTitle="Reset Search"
            onAction={() => {
              setSearchQuery('');
              setSelectedCategoryId(undefined);
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg
  },
  greetingText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium
  },
  headerTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    marginTop: 2
  },
  profileBadge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center'
  },
  searchBar: {
    marginBottom: spacing.lg
  },
  bannerCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
    overflow: 'hidden'
  },
  bannerTextCol: {
    flex: 1,
    paddingRight: spacing.sm
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.xs
  },
  bannerSubtitle: {
    color: '#D1FAE5',
    fontSize: fontSizes.xs,
    lineHeight: 16,
    marginBottom: spacing.md
  },
  bannerButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start'
  },
  bannerButtonText: {
    color: '#059669',
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.bold
  },
  bannerIcon: {
    fontSize: 48
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold
  },
  clearFilterText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold
  },
  categoryScroll: {
    paddingBottom: spacing.lg
  },
  categoryChip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    marginRight: spacing.sm
  },
  categoryChipText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold
  }
});
