import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useThemeStore } from '../../store/useThemeStore';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { colors, spacing, fontSizes, fontWeights, borderRadius } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { mode } = useThemeStore();
  const themeColors = colors[mode];

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = () => {
    if (!email.trim()) {
      setError('Please enter your registered email address');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Enter a valid email address');
      return;
    }

    setError(undefined);
    setIsLoading(true);

    // Simulated password reset trigger
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backButton, { backgroundColor: themeColors.surfaceVariant }]}
        >
          <Text style={{ fontSize: 18, color: themeColors.textPrimary }}>←</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={[styles.iconBadge, { backgroundColor: themeColors.primaryLight }]}>
            <Text style={{ fontSize: 32 }}>🔐</Text>
          </View>

          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            Reset Password
          </Text>

          {!isSubmitted ? (
            <>
              <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
                Enter your registered email address below to receive password reset instructions.
              </Text>

              <View style={styles.form}>
                <AppInput
                  label="Registered Email"
                  placeholder="name@example.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  error={error}
                />

                <AppButton
                  title="Send Reset Instructions"
                  onPress={handleResetPassword}
                  isLoading={isLoading}
                  style={styles.button}
                />
              </View>
            </>
          ) : (
            <View style={styles.successCard}>
              <Text style={[styles.successTitle, { color: themeColors.success }]}>
                Instructions Sent!
              </Text>
              <Text style={[styles.successText, { color: themeColors.textSecondary }]}>
                If an account exists for <Text style={{ fontWeight: 'bold' }}>{email}</Text>, password reset steps have been dispatched to your inbox.
              </Text>

              <AppButton
                title="Back to Sign In"
                onPress={() => navigation.navigate('Login')}
                style={styles.button}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.xxxl
  },
  iconBadge: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.xs
  },
  subtitle: {
    fontSize: fontSizes.sm,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xl
  },
  form: {
    width: '100%'
  },
  button: {
    marginTop: spacing.md
  },
  successCard: {
    alignItems: 'center',
    width: '100%',
    marginTop: spacing.md
  },
  successTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    marginBottom: spacing.xs
  },
  successText: {
    fontSize: fontSizes.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl
  }
});
