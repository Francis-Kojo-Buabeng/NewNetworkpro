import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrentTheme } from '../contexts/ThemeContext';

interface SettingsButtonProps {
  onPress?: () => void;
  size?: number;
  style?: any;
  color?: string;
}

export default function SettingsButton({
  onPress,
  size = 24,
  style,
  color,
}: SettingsButtonProps) {
  const theme = useCurrentTheme();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Default behavior - could open a settings modal or navigate to settings
      console.log('Settings button pressed');
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name="cog"
        size={size}
        color={color || theme.textColor}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 