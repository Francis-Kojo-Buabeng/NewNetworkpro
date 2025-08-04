// authAPI.ts

import { AUTH_API_BASE_URL } from '../constants/Config';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export async function loginUser(credentials: AuthRequest): Promise<AuthResponse> {
  console.log('authAPI - Attempting login with email:', credentials.email);
  
  const response = await fetch(`${AUTH_API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  console.log('authAPI - Response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('authAPI - Login failed:', errorData);
    throw new Error(errorData.message || 'Sign in failed. Please check your credentials.');
  }
  
  const data: AuthResponse = await response.json();
  console.log('authAPI - Login successful, token received');
  return data;
}

export async function registerUser(credentials: RegisterRequest): Promise<AuthResponse> {
  console.log('authAPI - Attempting registration with email:', credentials.email);
  
  const response = await fetch(`${AUTH_API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  
  console.log('authAPI - Registration response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.json();
    console.error('authAPI - Registration failed:', errorData);
    throw new Error(errorData.message || 'Registration failed. Please try again.');
  }
  
  const data: AuthResponse = await response.json();
  console.log('authAPI - Registration successful, token received');
  return data;
}

export async function sendPasswordResetToken(email: string): Promise<string> {
  console.log('authAPI - Sending password reset token to:', email);
  
  const response = await fetch(`${AUTH_API_BASE_URL}/send-password-reset-token?email=${encodeURIComponent(email)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  
  console.log('authAPI - Password reset response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.text();
    console.error('authAPI - Password reset failed:', errorData);
    throw new Error(errorData || 'Failed to send password reset token.');
  }
  
  const message = await response.text();
  console.log('authAPI - Password reset token sent successfully');
  return message;
}

export async function resetPassword(email: string, newPassword: string, token: string): Promise<string> {
  console.log('authAPI - Resetting password for:', email);
  
  const response = await fetch(`${AUTH_API_BASE_URL}/reset-password?email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(newPassword)}&token=${encodeURIComponent(token)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
  });
  
  console.log('authAPI - Password reset response status:', response.status);
  
  if (!response.ok) {
    const errorData = await response.text();
    console.error('authAPI - Password reset failed:', errorData);
    throw new Error(errorData || 'Failed to reset password.');
  }
  
  const message = await response.text();
  console.log('authAPI - Password reset successful');
  return message;
}

// JWT Token utilities
export function decodeJWTToken(token: string): { email: string; exp: number } | null {
  try {
    // JWT tokens are in format: header.payload.signature
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    const payload = JSON.parse(jsonPayload);
    console.log('authAPI - Decoded JWT payload:', payload);
    
    // The backend uses .subject(email) which puts email in 'sub' claim
    return {
      email: payload.sub || payload.email, // Try 'sub' first, then 'email'
      exp: payload.exp
    };
  } catch (error) {
    console.error('authAPI - Error decoding JWT token:', error);
    return null;
  }
}

export function getEmailFromToken(token: string): string | null {
  const decoded = decodeJWTToken(token);
  console.log('authAPI - Extracted email from token:', decoded?.email);
  return decoded ? decoded.email : null;
} 