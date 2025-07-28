import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCurrentTheme } from '../contexts/ThemeContext';

interface SuggestionCardProps {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: any;
  mutualConnections: number;
  onConnect: (id: string) => void;
  onProfilePress: (id: string) => void;
}

export default function SuggestionCard({ 
  id, 
  name, 
  title, 
  company, 
  avatar, 
  mutualConnections, 
  onConnect, 
  onProfilePress 
}: SuggestionCardProps) {
  const theme = useCurrentTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.cardColor }]}
      onPress={() => onProfilePress(id)}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image source={avatar} style={styles.avatar} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.name, { color: theme.textColor }]} numberOfLines={1}>
          {name}
        </Text>
        <Text style={[styles.title, { color: theme.textSecondaryColor }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.company, { color: theme.textSecondaryColor }]} numberOfLines={1}>
          {company}
        </Text>
        
        {/* Mutual Connections */}
        <View style={styles.mutualConnections}>
          <MaterialCommunityIcons name="account-multiple" size={12} color={theme.textTertiaryColor} />
          <Text style={[styles.mutualText, { color: theme.textTertiaryColor }]}>
            {mutualConnections} mutual connections
          </Text>
        </View>
      </View>

      {/* Connect Button */}
      <TouchableOpacity 
        style={[styles.connectButton, { backgroundColor: theme.primaryColor }]}
        onPress={() => onConnect(id)}
        activeOpacity={0.8}
      >
        <Text style={[styles.connectText, { color: theme.textColor }]}>
          Connect
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  content: {
    alignItems: 'center',
    marginBottom: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 2,
  },
  company: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  mutualConnections: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mutualText: {
    fontSize: 11,
  },
  connectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  connectText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 