import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface NetworkTabButtonProps {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
  theme: any;
}

export default function NetworkTabButton({ label, count, active, onPress, theme }: NetworkTabButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.tabButton,
        {
          backgroundColor: active ? theme.primaryColor : theme.surfaceColor,
          borderColor: theme.borderColor,
        },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.tabButtonText, { color: active ? '#fff' : theme.textColor }]}>{label}</Text>
      {count > 0 && (
        <View style={[styles.tabBadge, { backgroundColor: active ? '#fff' : theme.primaryColor }]}> 
          <Text style={[styles.tabBadgeText, { color: active ? theme.primaryColor : '#fff' }]}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabBadge: {
    marginLeft: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
}); 