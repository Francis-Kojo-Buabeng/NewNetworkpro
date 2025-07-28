import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCurrentTheme } from '../contexts/ThemeContext';

interface ConnectionsSummaryProps {
  totalConnections: number;
  newConnections: number;
  onViewAll: () => void;
}

export default function ConnectionsSummary({ totalConnections, newConnections, onViewAll }: ConnectionsSummaryProps) {
  const theme = useCurrentTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.cardColor }]}
      onPress={onViewAll}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="account-group" size={24} color={theme.primaryColor} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.connectionCount, { color: theme.textColor }]}>
            {totalConnections.toLocaleString()} connections
          </Text>
          {newConnections > 0 && (
            <Text style={[styles.newConnections, { color: theme.primaryColor }]}>
              +{newConnections} new this week
            </Text>
          )}
        </View>

        <MaterialCommunityIcons name="chevron-right" size={24} color={theme.textSecondaryColor} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  connectionCount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  newConnections: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 