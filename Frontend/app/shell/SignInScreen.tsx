import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native';
import { AuthInput, AuthButton, BackButton } from '../../components/AuthUI';
import { useCurrentTheme, getLogoAsset, useTheme } from '../../contexts/ThemeContext';
import ThemedLogo from '../../components/ThemedLogo';
import { Ionicons } from '@expo/vector-icons';
import { loginUser, AuthRequest, getEmailFromToken } from '../../services/authAPI';
import { findUserProfileByEmail } from '../../services/userAPI';
import { userSessionService } from '../../services/userSession';

const { width, height } = Dimensions.get('window');

interface SignInScreenProps {
  onSignIn: (profileComplete?: boolean) => void;
  onJoin: () => void;
  onForgotPassword: () => void;
  onBack: () => void;
}

export default function SignInScreen({ onSignIn, onJoin, onForgotPassword, onBack }: SignInScreenProps) {
  const theme = useCurrentTheme();
  const { currentTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignIn = async () => {
    setError(null);
    
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    
    try {
      const response = await loginUser({ email: email.trim(), password });
      console.log('SignInScreen - Login successful');
      
      // Store the user session
      userSessionService.setUserSession(response.token, email.trim());
      
      // Get user email from token
      const userEmail = getEmailFromToken(response.token);
      if (userEmail) {
        console.log('SignInScreen - User email from token:', userEmail);
        onSignIn(false); // Pass profileComplete status
      } else {
        console.error('SignInScreen - Could not extract email from token');
        setError('Login successful but could not retrieve user information.');
      }
    } catch (err: any) {
      console.error('SignInScreen - Login failed:', err);
      // Use on-screen error for validation and auth errors
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.background, { backgroundColor: theme.backgroundColor }]}>
      <KeyboardAvoidingView
        style={styles.flexGrow}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={40}
      >
        <ScrollView
          contentContainerStyle={styles.centeredContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ThemedLogo style={styles.logo} resizeMode="contain" />
          <Text style={[styles.title, { color: theme.textColor }]}>Sign in to{`\n`}Networkpro</Text>
          <TextInput
            style={[styles.input, { backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]}
            placeholder="Email address"
            placeholderTextColor={theme.placeholderColor}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0, backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]}
              placeholder="Password"
              placeholderTextColor={theme.placeholderColor}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0, backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]}
              placeholder="Confirm password"
              placeholderTextColor={theme.placeholderColor}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
              <Ionicons
                name={showConfirmPassword ? 'eye' : 'eye-off'}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkbox, { borderColor: theme.textColor }, rememberMe && { backgroundColor: theme.primaryColor, borderColor: theme.primaryColor }]} />
              <Text style={[styles.rememberMeText, { color: theme.textColor }]}>Remember me</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onForgotPassword}>
              <Text style={[styles.forgotText, { color: theme.primaryColor }]}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
          {/* Error Message */}
          {error && (
            <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>
          )}
          <AuthButton onPress={handleSignIn} loading={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </AuthButton>
          <View style={styles.bottomRow}>
            <Text style={[styles.bottomText, { color: theme.textColor }]}>Don't have an account? </Text>
            <TouchableOpacity onPress={onJoin}>
              <Text style={[styles.joinText, { color: theme.primaryColor }]}>Join <Text style={{ fontWeight: 'bold' }}>Networkpro</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  flexGrow: {
    flex: 1,
  },
  centeredContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 60, // Add bottom padding so content never overlaps bottom row
  },
  logo: {
    width: 170,
    height: 170,
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 36,
    textAlign: 'center',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: width * 0.85,
    marginBottom: 18,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#1877F2',
    borderColor: '#1877F2',
  },
  rememberMeText: {
    fontSize: 16,
  },
  forgotText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    paddingHorizontal: 24,
  },
  bottomText: {
    fontSize: 18,
  },
  joinText: {
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  input: {
    width: width * 0.85,
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 18,
    fontSize: 18,
    marginBottom: 18,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.85,
    marginBottom: 18,
  },
  eyeButton: {
    padding: 8,
    marginLeft: -40,
    zIndex: 2,
  },
  eyeText: {
    fontSize: 20,
  },
}); 