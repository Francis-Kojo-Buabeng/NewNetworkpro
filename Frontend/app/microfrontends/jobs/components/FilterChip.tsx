import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';
import { useCurrentTheme } from '../../../../contexts/ThemeContext';

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function FilterChip({ label, isSelected, onPress }: FilterChipProps) {
  const theme = useCurrentTheme();

  return (
    <TouchableOpacity
      style={[
        styles.filterChip,
        { backgroundColor: isSelected ? theme.primaryColor : theme.surfaceColor }
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.filterChipText,
        { color: isSelected ? '#fff' : theme.textSecondaryColor }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 