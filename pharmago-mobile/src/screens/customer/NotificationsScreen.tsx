import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationItem, NotificationType } from '../../types/notification.types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { EmptyState } from '../../components/EmptyState';

export const NotificationsScreen = () => {
  const { notificationsPage, unreadCount, isLoading, refetch, isRefetching, markAsRead, markAllAsRead } = useNotifications(0, 20);

  const notifications = notificationsPage?.content || [];

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'ORDER_UPDATE':
        return '📦';
      case 'PRESCRIPTION_UPDATE':
        return '📋';
      case 'PROMOTION':
        return '🎉';
      default:
        return '🔔';
    }
  };

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => {
    const icon = getTypeIcon(item.type);
    const dateStr = new Date(item.createdAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return (
      <TouchableOpacity
        style={[styles.card, !item.isRead && styles.unreadCard]}
        onPress={() => {
          if (!item.isRead) {
            markAsRead(item.id);
          }
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.icon}>{icon}</Text>
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {item.title}
            </Text>
            {!item.isRead && <View style={styles.unreadDot} />}
          </View>

          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.date}>{dateStr}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && !isRefetching) {
    return <LoadingSpinner fullScreen message="Loading notifications..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.unreadBadgeText}>{unreadCount} unread</Text>
          )}
        </View>

        {unreadCount > 0 && (
          <TouchableOpacity onPress={() => markAllAsRead()} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNotificationItem}
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
            title="No Notifications"
            message="You're all caught up! Updates regarding your orders and prescriptions will appear here."
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
  headerTitle: {
    ...typography.h2,
    color: colors.dark.textPrimary
  },
  unreadBadgeText: {
    ...typography.caption,
    color: colors.emerald[400],
    fontWeight: '600'
  },
  markAllBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  markAllText: {
    ...typography.button,
    color: colors.emerald[400],
    fontSize: 13
  },
  listPadding: {
    padding: spacing.lg
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.dark.bgSecondary,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.dark.border
  },
  unreadCard: {
    borderColor: colors.emerald[500] + '80',
    backgroundColor: colors.emerald[900] + '15'
  },
  icon: {
    fontSize: 24,
    marginRight: spacing.md,
    marginTop: 2
  },
  content: {
    flex: 1
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2
  },
  title: {
    ...typography.subtitle1,
    color: colors.dark.textPrimary,
    flex: 1,
    marginRight: spacing.xs
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.emerald[400]
  },
  message: {
    ...typography.body2,
    color: colors.dark.textSecondary,
    marginBottom: spacing.xs
  },
  date: {
    ...typography.caption,
    color: colors.dark.textMuted
  }
});
