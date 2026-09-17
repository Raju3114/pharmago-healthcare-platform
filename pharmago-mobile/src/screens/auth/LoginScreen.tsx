import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { useAuth } from '../../hooks/useAuth';
import { useThemeStore } from '../../store/useThemeStore';
import { AppButton } from '../../components/AppButton';
import { AppInput } from '../../components/AppInput';
import { colors, spacing, fontSizes, fontWeights, borderRadius } from '../../theme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { mode } = useThemeStore();
  const themeColors = colors[mode];
  const { login, isLoggingIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
      setErrors({});
      await login({ email: email.trim(), password });
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message || 'Invalid email or password. Please try again.';
      setErrors({ general: serverMessage });
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Brand Section */}
          <View style={styles.brandSection}>
            <View style={[styles.logoBadge, { backgroundColor: themeColors.primaryLight }]}>
              <Text style={styles.logoIcon}>💊</Text>
            </View>
            <Text style={[styles.title, { color: themeColors.textPrimary }]}>
              Welcome Back to <Text style={{ color: themeColors.primary }}>PharmaGo</Text>
            </Text>
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>
              Sign in to order medicines & manage health prescriptions
            </Text>
          </View>

          {/* General Error Banner */}
          {errors.general && (
            <View style={[styles.errorBanner, { backgroundColor: themeColors.errorLight, borderColor: themeColors.error }]}>
              <Text style={[styles.errorBannerText, { color: themeColors.error }]}>
                {errors.general}
              </Text>
            </View>
          )}

          {/* Login Form */}
          <View style={styles.formSection}>
            <AppInput
              label="Email Address"
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
            />

            <AppInput
              label="Password"
              placeholder="Enter your password"
              isPassword
              value={password}
              onChangeText={setPassword}
              error={errors.password}
            />

            {/* Remember Me & Forgot Password Row */}
            <View style={styles.rowBetween}>
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                style={styles.rememberRow}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: rememberMe ? themeColors.primary : themeColors.border,
                      backgroundColor: rememberMe ? themeColors.primary : 'transparent'
                    }
                  ]}
                >
                  {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={[styles.rememberText, { color: themeColors.textSecondary }]}>
                  Remember Login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                activeOpacity={0.7}
              >
                <Text style={[styles.forgotText, { color: themeColors.primary }]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            <AppButton
              title="Sign In"
              onPress={handleLogin}
              isLoading={isLoggingIn}
              style={styles.loginButton}
            />
          </View>

          {/* Footer Navigation */}
          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: themeColors.textSecondary }]}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.7}>
              <Text style={[styles.signUpText, { color: themeColors.primary }]}>
                Register Now
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  keyboardView: {
    flex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxxl,
    justifyContent: 'center'
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: spacing.xxl
  },
  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md
  },
  logoIcon: {
    fontSize: 34
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    textAlign: 'center',
    marginBottom: spacing.xs
  },
  subtitle: {
    fontSize: fontSizes.sm,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.md
  },
  errorBanner: {
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginBottom: spacing.lg
  },
  errorBannerText: {
    fontSize: fontSizes.sm,
    textAlign: 'center',
    fontWeight: fontWeights.medium
  },
  formSection: {
    width: '100%'
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.xs,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold'
  },
  rememberText: {
    fontSize: fontSizes.sm
  },
  forgotText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold
  },
  loginButton: {
    marginTop: spacing.xs
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xxl
  },
  footerText: {
    fontSize: fontSizes.sm
  },
  signUpText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold
  }
});
