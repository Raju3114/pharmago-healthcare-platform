import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MainTabParamList, CustomerStackParamList } from './types';
import { HomeScreen } from '../screens/customer/HomeScreen';
import { MedicineListScreen } from '../screens/customer/MedicineListScreen';
import { MedicineDetailsScreen } from '../screens/customer/MedicineDetailsScreen';
import { SearchScreen } from '../screens/customer/SearchScreen';
import { CartScreen } from '../screens/customer/CartScreen';
import { WishlistScreen } from '../screens/customer/WishlistScreen';
import { PrescriptionScreen } from '../screens/customer/PrescriptionScreen';
import { UploadPrescriptionScreen } from '../screens/customer/UploadPrescriptionScreen';
import { CheckoutScreen } from '../screens/customer/CheckoutScreen';
import { OrdersScreen } from '../screens/customer/OrdersScreen';
import { OrderDetailsScreen } from '../screens/customer/OrderDetailsScreen';
import { NotificationsScreen } from '../screens/customer/NotificationsScreen';
import { ProfileScreen } from '../screens/customer/ProfileScreen';
import { EditProfileScreen } from '../screens/customer/EditProfileScreen';
import { HealthAssistantScreen } from '../screens/customer/HealthAssistantScreen';

import { useThemeStore } from '../store/useThemeStore';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<CustomerStackParamList>();

export const MainTabsNavigator: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.emerald[400],
        tabBarInactiveTintColor: colors.dark.textMuted,
        tabBarStyle: {
          backgroundColor: colors.dark.bgSecondary,
          borderTopColor: colors.dark.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6
        }
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen as any}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: () => <Text style={{ fontSize: 18 }}>🏠</Text>
        }}
      />
      <Tab.Screen
        name="MedicinesTab"
        component={MedicineListScreen as any}
        options={{
          tabBarLabel: 'Medicines',
          tabBarIcon: () => <Text style={{ fontSize: 18 }}>💊</Text>
        }}
      />
      <Tab.Screen
        name="HealthAssistantTab"
        component={HealthAssistantScreen as any}
        options={{
          tabBarLabel: 'AI Health',
          tabBarIcon: () => <Text style={{ fontSize: 18 }}>🤖</Text>
        }}
      />
      <Tab.Screen
        name="CartTab"
        component={CartScreen as any}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: () => <Text style={{ fontSize: 18 }}>🛒</Text>
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen as any}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: () => <Text style={{ fontSize: 18 }}>👤</Text>
        }}
      />
    </Tab.Navigator>
  );
};

export const MainNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.dark.bgSecondary },
        headerTintColor: colors.dark.textPrimary,
        headerTitleStyle: { fontWeight: '600' }
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MedicineDetail"
        component={MedicineDetailsScreen as any}
        options={{ title: 'Medicine Details' }}
      />
      <Stack.Screen
        name="CategoryMedicines"
        component={MedicineListScreen as any}
        options={({ route }) => ({ title: (route.params as any)?.categoryName || 'Category' })}
      />
      <Stack.Screen
        name="Search"
        component={SearchScreen as any}
        options={{ title: 'Search Medicines' }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen as any}
        options={{ title: 'Checkout' }}
      />
      <Stack.Screen
        name="Orders"
        component={OrdersScreen as any}
        options={{ title: 'My Orders' }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetailsScreen as any}
        options={{ title: 'Order Details' }}
      />
      <Stack.Screen
        name="Prescriptions"
        component={PrescriptionScreen as any}
        options={{ title: 'My Prescriptions' }}
      />
      <Stack.Screen
        name="UploadPrescription"
        component={UploadPrescriptionScreen as any}
        options={{ title: 'Upload Prescription' }}
      />
      <Stack.Screen
        name="Wishlist"
        component={WishlistScreen as any}
        options={{ title: 'My Wishlist' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen as any}
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen as any}
        options={{ title: 'Edit Profile' }}
      />
    </Stack.Navigator>
  );
};
