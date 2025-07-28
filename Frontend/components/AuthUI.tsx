import React from 'react';
import { TextInput, TouchableOpacity, Text, StyleSheet, View, TextInputProps, GestureResponderEvent, StyleProp, ViewStyle, TextStyle, Platform, ActivityIndicator } from 'react-native';

interface AuthInputProps extends TextInputProps {
  style?: StyleProp<TextStyle>;
}

export function AuthInput(props: AuthInputProps) {
  return (
    <TextInput
      {...props}
      style={[styles.input, props.style]}
      placeholderTextColor={props.placeholderTextColor || '#222'}
    />
  );
}

interface AuthButtonProps {
  children: React.ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
}

export function AuthButton({ children, onPress, style, loading = false }: AuthButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, style, loading && { opacity: 0.5 }]} onPress={onPress} disabled={loading}>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

interface BackButtonProps {
  onPress: () => void;
  label?: string;
}

export function BackButton({ onPress, label = '← Back' }: BackButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={backButtonStyles.button} hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}>
      <Text style={backButtonStyles.text}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 54,
    backgroundColor: '#e5e5e5',
    borderRadius: 10,
    paddingHorizontal: 18,
    fontSize: 20,
    marginBottom: 18,
    color: '#222',
  },
  button: {
    width: '100%',
    height: 54,
    backgroundColor: '#1877F2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

const backButtonStyles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    left: 24,
    padding: 16,
    zIndex: 100,
    backgroundColor: 'rgba(7,14,28,0.8)',
    borderRadius: 8,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 