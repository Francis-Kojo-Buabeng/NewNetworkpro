import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { AuthInput, AuthButton, BackButton } from '../../components/AuthUI';
import { useCurrentTheme } from '../../contexts/ThemeContext';
import Snackbar from '../../components/Snackbar';
import { AUTH_API_BASE_URL } from '../../constants/Config';

interface ForgotPasswordScreenProps {
  onBack: () => void;
  onResetPassword: (email: string) => Promise<void>;
}

const defaultOnResetPassword = async (email: string) => {
  const response = await fetch(
    `${AUTH_API_BASE_URL}/send-password-reset-token?email=${encodeURIComponent(email)}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to send reset email.');
  }
};

export default function ForgotPasswordScreen({ onBack, onResetPassword = defaultOnResetPassword }: ForgotPasswordScreenProps) {
  const theme = useCurrentTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleResetPassword = async () => {
    setError(null);
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      await onResetPassword(email.trim());
      setIsEmailSent(true);
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setError(null);
    setIsLoading(true);
    
    try {
      await onResetPassword(email.trim());
      setSnackbar({ visible: true, message: 'Reset email sent again!', type: 'success' });
    } catch (err) {
      // Use snackbar for network/API errors, not validation errors
      setSnackbar({ visible: true, message: 'Failed to send reset email. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <LinearGradient colors={[theme.backgroundColor, theme.surfaceColor]} style={styles.container}>
        <BackButton onPress={onBack} />
        
        <View style={styles.content}>
          <View style={[styles.successIconContainer, { backgroundColor: theme.cardColor }]}>
            <MaterialCommunityIcons name="email-check" size={80} color={theme.successColor} />
          </View>
          
          <Text style={[styles.title, { color: theme.textColor }]}>Check Your Email</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondaryColor }]}>
            We've sent a password reset link to:
          </Text>
          <Text style={[styles.emailText, { color: theme.primaryColor }]}>{email}</Text>
          
          <Text style={[styles.description, { color: theme.textSecondaryColor }]}>
            Click the link in the email to reset your password. The link will expire in 1 hour.
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.resendButton, { borderColor: theme.primaryColor }]}
              onPress={handleResendEmail}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.primaryColor} size="small" />
              ) : (
                <MaterialCommunityIcons name="email-send" size={20} color={theme.primaryColor} />
              )}
              <Text style={[styles.resendButtonText, { color: theme.primaryColor }]}>
                {isLoading ? 'Sending...' : 'Resend Email'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.backToSignInButton} onPress={onBack}>
              <Text style={[styles.backToSignInText, { color: theme.textSecondaryColor }]}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[theme.backgroundColor, theme.surfaceColor]} style={styles.container}>
      <BackButton onPress={onBack} />
      
      <KeyboardAvoidingView
        style={styles.flexGrow}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: theme.cardColor }]}>
              <MaterialCommunityIcons name="lock-reset" size={80} color={theme.dangerColor} />
            </View>
            
            <Text style={[styles.title, { color: theme.textColor }]}>Forgot Password?</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondaryColor }]}>
              No worries! Enter your email address and we'll send you a link to reset your password.
            </Text>
            
            <View style={styles.inputContainer}>
              <AuthInput
                placeholder="Email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={error ? styles.inputError : undefined}
              />
              {error && <Text style={[styles.errorText, { color: theme.dangerColor }]}>{error}</Text>}
            </View>
            
            <AuthButton
              onPress={handleResetPassword}
              style={styles.resetButton}
            >
              {isLoading ? (
                <ActivityIndicator color={theme.textColor} size="small" />
              ) : (
                <Text style={[styles.resetButtonText, { color: theme.textColor }]}>Send Reset Link</Text>
              )}
            </AuthButton>
            
            <TouchableOpacity style={styles.backToSignInButton} onPress={onBack}>
              <Text style={[styles.backToSignInText, { color: theme.textSecondaryColor }]}>Back to Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onHide={() => setSnackbar({ ...snackbar, visible: false })}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexGrow: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  successIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputError: {
    borderColor: '#ff4d4f',
  },
  errorText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  resetButton: {
    width: '100%',
    marginBottom: 24,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  resendButtonText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  backToSignInButton: {
    paddingVertical: 12,
  },
  backToSignInText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
}); 