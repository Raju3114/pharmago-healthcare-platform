import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Note: In Expo environment, image picker and document picker can be dynamically imported
import * as ImagePicker from 'expo-image-picker';
import { CustomerStackParamList } from '../../navigation/types';
import { usePrescriptions } from '../../hooks/usePrescriptions';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { AppButton } from '../../components/AppButton';
import { Toast } from '../../components/Toast';

type RouteProps = RouteProp<CustomerStackParamList, 'UploadPrescription'>;
type NavigationProps = StackNavigationProp<CustomerStackParamList>;

export const UploadPrescriptionScreen = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const orderId = route.params?.orderId;

  const { uploadPrescription, isUploading } = usePrescriptions();
  const [selectedFile, setSelectedFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handlePickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Camera roll permission is required to select a prescription.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = asset.fileName || `prescription_${Date.now()}.jpg`;
        const fileType = asset.type || 'image/jpeg';
        setSelectedFile({
          uri: asset.uri,
          name: fileName,
          type: fileType
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Could not open image picker.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission Denied', 'Camera permission is required to capture prescription photo.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const fileName = `camera_prescription_${Date.now()}.jpg`;
        setSelectedFile({
          uri: asset.uri,
          name: fileName,
          type: 'image/jpeg'
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Could not access camera.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Alert.alert('Required', 'Please select or take a photo of your prescription.');
      return;
    }

    try {
      const formData = new FormData();
      // Attach file blob according to React Native FormData spec
      formData.append('file', {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.type
      } as any);

      if (orderId) {
        formData.append('orderId', orderId.toString());
      }

      await uploadPrescription(formData);
      setToastMessage('Prescription uploaded successfully!');

      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (err: any) {
      Alert.alert('Upload Failed', err?.response?.data?.message || 'Failed to upload prescription. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Upload Doctor's Prescription</Text>
        <Text style={styles.subtitle}>
          Please upload a legible photo or PDF of a valid doctor's prescription. Our certified pharmacists will verify it shortly.
        </Text>

        {orderId && (
          <View style={styles.orderBadge}>
            <Text style={styles.orderBadgeText}>Linking to Order #{orderId}</Text>
          </View>
        )}

        <View style={styles.pickerOptions}>
          <TouchableOpacity style={styles.pickerBtn} onPress={handlePickImage}>
            <Text style={styles.pickerIcon}>🖼️</Text>
            <Text style={styles.pickerText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pickerBtn} onPress={handleTakePhoto}>
            <Text style={styles.pickerIcon}>📷</Text>
            <Text style={styles.pickerText}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        {selectedFile ? (
          <View style={styles.previewContainer}>
            <Text style={styles.previewTitle}>Selected File:</Text>
            {selectedFile.type.startsWith('image') ? (
              <Image source={{ uri: selectedFile.uri }} style={styles.previewImage} resizeMode="cover" />
            ) : null}
            <Text style={styles.fileName}>{selectedFile.name}</Text>
          </View>
        ) : (
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderIcon}>📄</Text>
            <Text style={styles.placeholderText}>No prescription selected yet</Text>
          </View>
        )}

        <View style={styles.guidelines}>
          <Text style={styles.guidelinesTitle}>Prescription Guidelines:</Text>
          <Text style={styles.guidelineItem}>• Ensure patient name and doctor details are visible</Text>
          <Text style={styles.guidelineItem}>• Medicine names and dosage must be clearly legible</Text>
          <Text style={styles.guidelineItem}>• Upload date must not be expired</Text>
        </View>

        <AppButton
          title={isUploading ? 'Uploading...' : 'Submit Prescription'}
          onPress={handleUpload}
          loading={isUploading}
          disabled={!selectedFile || isUploading}
          style={styles.submitBtn}
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
    marginBottom: spacing.xs
  },
  subtitle: {
    ...typography.body2,
    color: colors.dark.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20
  },
  orderBadge: {
    backgroundColor: colors.emerald[900] + '40',
    padding: spacing.sm,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.emerald[700],
    marginBottom: spacing.md
  },
  orderBadgeText: {
    ...typography.body2,
    color: colors.emerald[400],
    fontWeight: '600'
  },
  pickerOptions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg
  },
  pickerBtn: {
    flex: 1,
    backgroundColor: colors.dark.bgSecondary,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center'
  },
  pickerIcon: {
    fontSize: 28,
    marginBottom: spacing.xs
  },
  pickerText: {
    ...typography.subtitle2,
    color: colors.dark.textPrimary,
    textAlign: 'center'
  },
  previewContainer: {
    backgroundColor: colors.dark.bgSecondary,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.emerald[500]
  },
  previewTitle: {
    ...typography.subtitle2,
    color: colors.dark.textPrimary,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start'
  },
  previewImage: {
    width: '100%',
    height: 220,
    borderRadius: spacing.borderRadius.sm,
    marginBottom: spacing.sm
  },
  fileName: {
    ...typography.caption,
    color: colors.emerald[400]
  },
  placeholderBox: {
    height: 180,
    backgroundColor: colors.dark.bgSecondary,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 2,
    borderColor: colors.dark.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg
  },
  placeholderIcon: {
    fontSize: 36,
    marginBottom: spacing.xs
  },
  placeholderText: {
    ...typography.body2,
    color: colors.dark.textMuted
  },
  guidelines: {
    backgroundColor: colors.slate[800],
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.xl
  },
  guidelinesTitle: {
    ...typography.subtitle2,
    color: colors.amber[400],
    marginBottom: spacing.xs
  },
  guidelineItem: {
    ...typography.caption,
    color: colors.dark.textSecondary,
    lineHeight: 18
  },
  submitBtn: {
    marginTop: spacing.md
  }
});
