import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface NetworkStatsCardProps {
  value: number;
  title: string;
  icon: string;
  color: string;
  theme: any;
}

export default function NetworkStatsCard({ value, title, icon, color, theme }: NetworkStatsCardProps) {
  return (
    <View style={[styles.statsCard, { backgroundColor: theme.cardColor }]}> 
      <View style={[styles.statsIcon, { backgroundColor: color }]}> 
        <MaterialCommunityIcons name={icon as any} size={20} color="#fff" />
      </View>
      <View style={styles.statsContent}>
        <Text style={[styles.statsValue, { color: theme.textColor }]}>{value}</Text>
        <Text style={[styles.statsTitle, { color: theme.textSecondaryColor }]}>{title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statsCard: {
    flex: 1,
    minWidth: 120,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginRight: 12,
  },
  statsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statsContent: {
    flex: 1,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  statsTitle: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 