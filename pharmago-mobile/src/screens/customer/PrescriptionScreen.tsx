import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomerStackParamList } from '../../navigation/types';
import { usePrescriptions } from '../../hooks/usePrescriptions';
import { PrescriptionResponse, PrescriptionStatus } from '../../types/prescription.types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';

type NavigationProp = StackNavigationProp<CustomerStackParamList>;

export const PrescriptionScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { prescriptions, isLoading, refetch, isRefetching } = usePrescriptions();

  const getBadgeStyle = (status: PrescriptionStatus) => {
    switch (status) {
      case 'APPROVED':
        return { bg: colors.emerald[900] + '33', text: colors.emerald[400], label: 'APPROVED' };
      case 'REJECTED':
        return { bg: colors.ruby[900] + '33', text: colors.ruby[400], label: 'REJECTED' };
      default:
        return { bg: colors.amber[900] + '33', text: colors.amber[400], label: 'PENDING' };
    }
  };

  const renderPrescriptionItem = ({ item }: { item: PrescriptionResponse }) => {
    const badge = getBadgeStyle(item.status);
    const dateStr = new Date(item.uploadedAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.fileName} numberOfLines={1}>
            {item.originalFileName}
          </Text>
          <View style={[styles.badge, { backgroundColor: badge.bg }]}>
            <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
          </View>
        </View>

        <Text style={styles.dateText}>Uploaded on {dateStr}</Text>
        
        {item.fileSize > 0 && (
          <Text style={styles.sizeText}>
            Size: {(item.fileSize / 1024).toFixed(1)} KB
          </Text>
        )}

        {item.adminNotes ? (
          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>Pharmacist Notes:</Text>
            <Text style={styles.notesText}>{item.adminNotes}</Text>
          </View>
        ) : null}

        {item.orderId && (
          <Text style={styles.linkedOrder}>Linked Order #{item.orderId}</Text>
        )}
      </View>
    );
  };

  if (isLoading && !isRefetching) {
    return <LoadingSpinner fullScreen message="Loading prescriptions..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Prescriptions</Text>
        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={() => navigation.navigate('UploadPrescription', {})}
        >
          <Text style={styles.uploadBtnText}>+ Upload New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={prescriptions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPrescriptionItem}
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
            title="No Prescriptions Uploaded"
            message="Upload a doctor's prescription to order prescription-required medicines safely."
            actionLabel="Upload Prescription"
            onAction={() => navigation.navigate('UploadPrescription', {})}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border
  },
  title: {
    ...typography.h2,
    color: colors.dark.textPrimary
  },
  uploadBtn: {
    backgroundColor: colors.emerald[600],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.borderRadius.md
  },
  uploadBtnText: {
    ...typography.button,
    color: colors.neutral[900],
    fontSize: 14
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
    alignItems: 'center',
    marginBottom: spacing.xs
  },
  fileName: {
    ...typography.subtitle1,
    color: colors.dark.textPrimary,
    flex: 1,
    marginRight: spacing.sm
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
  dateText: {
    ...typography.body2,
    color: colors.dark.textSecondary
  },
  sizeText: {
    ...typography.caption,
    color: colors.dark.textMuted,
    marginTop: 2
  },
  notesBox: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.slate[800],
    borderRadius: spacing.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.amber[500]
  },
  notesLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.amber[400],
    marginBottom: 2
  },
  notesText: {
    ...typography.body2,
    color: colors.dark.textPrimary
  },
  linkedOrder: {
    ...typography.caption,
    color: colors.emerald[400],
    marginTop: spacing.xs
  }
});
