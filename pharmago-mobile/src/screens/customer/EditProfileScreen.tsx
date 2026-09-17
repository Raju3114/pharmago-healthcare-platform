import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../store/useAuthStore';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { AppInput } from '../../components/AppInput';
import { AppButton } from '../../components/AppButton';
import { Toast } from '../../components/Toast';

export const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, setUser } = useAuthStore();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email] = useState(user?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [address, setAddress] = useState(user?.address || '');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Required', 'Full Name cannot be empty.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate profile update or integrate user update API
      if (user) {
        const updatedUser = {
          ...user,
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          address: address.trim()
        };
        setUser(updatedUser);
      }

      setToastMessage('Profile updated successfully!');
      setTimeout(() => {
        setIsLoading(false);
        navigation.goBack();
      }, 1200);
    } catch (err: any) {
      setIsLoading(false);
      Alert.alert('Error', 'Could not update profile details.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Edit Profile</Text>

        <AppInput
          label="Full Name"
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />

        <AppInput
          label="Email Address"
          value={email}
          editable={false}
          style={styles.readOnlyInput}
        />

        <AppInput
          label="Phone Number"
          placeholder="Enter 10-digit phone number"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />

        <AppInput
          label="Default Delivery Address"
          placeholder="Enter street, apartment, city, pincode"
          value={address}
          onChangeText={setAddress}
          multiline
          numberOfLines={3}
        />

        <AppButton
          title={isLoading ? 'Saving...' : 'Save Profile Changes'}
          onPress={handleSave}
          loading={isLoading}
          style={styles.saveBtn}
        />
      </ScrollView>

      {toastMessage && (
        <Toast message={toastMessage} type="success" onDismiss={() => setToastMessage(null)} />
      )}
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
  title: {
    ...typography.h2,
    color: colors.dark.textPrimary,
    marginBottom: spacing.lg
  },
  readOnlyInput: {
    opacity: 0.6
  },
  saveBtn: {
    marginTop: spacing.xl
  }
});
