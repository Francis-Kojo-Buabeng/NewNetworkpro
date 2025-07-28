import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface ConnectionCardProps {
  item: any;
  theme: any;
  onPress: () => void;
  onAccept?: () => void;
  onIgnore?: () => void;
  onConnect?: () => void;
  onMessage?: () => void;
}

export default function ConnectionCard({ item, theme, onPress, onAccept, onIgnore, onConnect, onMessage }: ConnectionCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.connectionCard,
        { backgroundColor: theme.cardColor, borderWidth: 1, borderColor: theme.borderColor, marginBottom: 12, shadowOpacity: 0.12, width: '48%' }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Dismiss X button */}
      <TouchableOpacity style={styles.dismissButton}>
        <MaterialCommunityIcons name="close" size={16} color={theme.textTertiaryColor} />
      </TouchableOpacity>

      {/* Profile Picture at Top Center */}
      <View style={styles.avatarContainer}>
        <Image source={item.avatar} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
        {/* Open to work badge */}
        {item.isOpenToWork && (
          <View style={styles.openToWorkBadge}>
            <Text style={styles.openToWorkText}>#OPENTOWORK</Text>
          </View>
        )}
      </View>

      {/* Name with checkmark */}
      <View style={styles.nameRow}>
        <Text style={[styles.connectionName, { color: theme.textColor }]} numberOfLines={1}> 
          {item.name}
        </Text>
        <MaterialCommunityIcons name="check-circle" size={14} color={theme.primaryColor} />
      </View>

      {/* Title/Description */}
      <Text style={[styles.connectionTitle, { color: theme.textSecondaryColor }]} numberOfLines={2}> 
        {item.title}
      </Text>

      {/* Mutual Connections with small avatar */}
      <View style={styles.mutualConnectionsRow}>
        <Image source={item.avatar} style={styles.smallAvatar} />
        <Text style={[styles.mutualConnections, { color: theme.textTertiaryColor }]} numberOfLines={1}> 
          {item.mutualConnections} mutual connections
        </Text>
      </View>

      {/* Connect Button at Bottom */}
      {!item.isPending ? (
        <TouchableOpacity
          style={[styles.connectButton, { borderColor: theme.primaryColor }]}
          onPress={(e) => { e.stopPropagation(); onConnect && onConnect(); }}
        >
          <Text style={[styles.connectButtonText, { color: theme.primaryColor }]}>Connect</Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.connectButton, { borderColor: theme.primaryColor, backgroundColor: theme.surfaceColor, opacity: 0.6 }]}> 
          <Text style={[styles.connectButtonText, { color: theme.primaryColor }]}>Pending</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  connectionCard: {
    padding: 15, // increased
    borderRadius: 10, // slightly larger
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6, // larger
    elevation: 4,
    backgroundColor: '#fff',
    alignItems: 'center',
    position: 'relative',
    width: '100%', // nearly full width for single column
    minHeight: 180, // taller card
  },
  dismissButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 72, // larger
    height: 72, // larger
    borderRadius: 36,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  openToWorkBadge: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 28,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  openToWorkText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: 'bold',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  connectionName: {
    fontSize: 18, // larger
    fontWeight: 'bold',
    textAlign: 'center',
  },
  connectionTitle: {
    fontSize: 14, // larger
    fontWeight: '400',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 18,
  },
  mutualConnectionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  smallAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  mutualConnections: {
    fontSize: 13, // larger
  },
  connectButton: {
    paddingHorizontal: 18, // larger
    paddingVertical: 10, // larger
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    width: '100%',
  },
  connectButtonText: {
    fontSize: 15, // larger
    fontWeight: '600',
    textAlign: 'center',
  },
}); 