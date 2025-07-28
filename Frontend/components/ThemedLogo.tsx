import React from 'react';
import { Image, ImageStyle } from 'react-native';
import { useCurrentTheme } from '../contexts/ThemeContext';

interface ThemedLogoProps {
  style?: ImageStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

export default function ThemedLogo({ style, resizeMode = 'contain' }: ThemedLogoProps) {
  const theme = useCurrentTheme();
  
  return (
    <Image
      source={require('../assets/images/networkpro-logo.png')}
      style={[
        style,
        {
          tintColor: theme.textColor, // This will tint the logo to match text color
        }
      ]}
      resizeMode={resizeMode}
    />
  );
} 