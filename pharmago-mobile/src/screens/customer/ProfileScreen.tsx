import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CustomerStackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store/useAuthStore';
import { useThemeStore } from '../../store/useThemeStore';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

type NavigationProp = StackNavigationProp<CustomerStackParamList>;

export const ProfileScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to sign out of PharmaGo?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.fullName || 'User Name'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>{user?.role || 'CUSTOMER'}</Text>
            </View>
          </View>
        </View>

        {/* Account Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Account</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Orders')}
          >
            <Text style={styles.menuIcon}>📦</Text>
            <Text style={styles.menuTitle}>My Orders</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Prescriptions')}
          >
            <Text style={styles.menuIcon}>📋</Text>
            <Text style={styles.menuTitle}>My Prescriptions</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Wishlist')}
          >
            <Text style={styles.menuIcon}>❤️</Text>
            <Text style={styles.menuTitle}>Wishlist</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Text style={styles.menuIcon}>🔔</Text>
            <Text style={styles.menuTitle}>Notifications</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={styles.menuTitle}>Edit Profile & Settings</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.menuIcon}>🌙</Text>
              <Text style={styles.menuTitle}>Dark Theme</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.dark.border, true: colors.emerald[700] }}
              thumbColor={isDarkMode ? colors.emerald[400] : colors.neutral[400]}
            />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.appVersion}>PharmaGo v1.0.0 • AI Medicine Delivery</Text>
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.bgSecondary,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark.border
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.emerald[600],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md
  },
  avatarText: {
    ...typography.h2,
    color: colors.neutral[900]
  },
  userInfo: {
    flex: 1
  },
  userName: {
    ...typography.h3,
    color: colors.dark.textPrimary
  },
  userEmail: {
    ...typography.body2,
    color: colors.dark.textSecondary,
    marginBottom: 4
  },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.emerald[900] + '40',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: spacing.borderRadius.sm
  },
  roleBadgeText: {
    ...typography.caption,
    color: colors.emerald[400],
    fontWeight: '700'
  },
  section: {
    backgroundColor: colors.dark.bgSecondary,
    borderRadius: spacing.borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dark.border
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.dark.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: spacing.xs,
    marginBottom: spacing.xs
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark.border
  },
  menuIcon: {
    fontSize: 20,
    marginRight: spacing.md
  },
  menuTitle: {
    ...typography.subtitle1,
    color: colors.dark.textPrimary,
    flex: 1
  },
  menuChevron: {
    fontSize: 20,
    color: colors.dark.textMuted
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ruby[900] + '30',
    borderWidth: 1,
    borderColor: colors.ruby[600],
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: spacing.sm
  },
  logoutText: {
    ...typography.button,
    color: colors.ruby[400]
  },
  appVersion: {
    ...typography.caption,
    color: colors.dark.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg
  }
});
