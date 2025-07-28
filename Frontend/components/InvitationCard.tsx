import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCurrentTheme } from '../contexts/ThemeContext';

interface InvitationCardProps {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: any;
  mutualConnections: number;
  onAccept: (id: string) => void;
  onIgnore: (id: string) => void;
  onProfilePress: (id: string) => void;
}

export default function InvitationCard({ 
  id, 
  name, 
  title, 
  company, 
  avatar, 
  mutualConnections, 
  onAccept, 
  onIgnore, 
  onProfilePress 
}: InvitationCardProps) {
  const theme = useCurrentTheme();

  return (
    <TouchableOpacity 
      style={[styles.container, { backgroundColor: theme.cardColor }]}
      onPress={() => onProfilePress(id)}
      activeOpacity={0.7}
    >
      {/* Avatar and Info */}
      <View style={styles.mainContent}>
        <Image source={avatar} style={styles.avatar} />
        
        <View style={styles.infoContainer}>
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
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.acceptButton, { backgroundColor: theme.primaryColor }]}
          onPress={() => onAccept(id)}
          activeOpacity={0.8}
        >
          <Text style={[styles.acceptText, { color: theme.textColor }]}>
            Accept
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.ignoreButton, { borderColor: theme.borderColor, backgroundColor: theme.surfaceColor }]}
          onPress={() => onIgnore(id)}
          activeOpacity={0.8}
        >
          <Text style={[styles.ignoreText, { color: theme.textColor }]}>
            Ignore
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainContent: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    marginBottom: 2,
  },
  company: {
    fontSize: 12,
    marginBottom: 6,
  },
  mutualConnections: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mutualText: {
    fontSize: 11,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  acceptText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ignoreButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  ignoreText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 