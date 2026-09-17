import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  MedicinesTab: undefined;
  HealthAssistantTab: undefined;
  CartTab: undefined;
  ProfileTab: undefined;
};

export type CustomerStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  MedicineDetail: { medicineId: number };
  CategoryMedicines: { categoryId: number; categoryName: string };
  Search: undefined;
  Checkout: undefined;
  OrderConfirmation: { orderId: number; orderNumber: string };
  Orders: undefined;
  OrderDetail: { orderId: number };
  UploadPrescription: { orderId?: number };
  Prescriptions: undefined;
  Wishlist: undefined;
  Notifications: undefined;
  EditProfile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  CustomerApp: NavigatorScreenParams<CustomerStackParamList>;
};
