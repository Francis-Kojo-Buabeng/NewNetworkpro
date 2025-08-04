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
  isProcessing?: boolean;
}

export default function ConnectionCard({ item, theme, onPress, onAccept, onIgnore, onConnect, onMessage, isProcessing }: ConnectionCardProps) {
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
        <Text 
          style={[styles.connectionName, { color: theme.textColor }]} 
          numberOfLines={1}
          ellipsizeMode="tail"
        > 
          {item.name}
        </Text>
        <MaterialCommunityIcons name="check-circle" size={14} color={theme.primaryColor} />
      </View>

      {/* Title/Description */}
      <Text 
        style={[styles.connectionTitle, { color: theme.textSecondaryColor }]} 
        numberOfLines={2}
        ellipsizeMode="tail"
      > 
        {item.title}
      </Text>

      {/* Mutual Connections with small avatar */}
      <View style={styles.mutualConnectionsRow}>
        <Image source={item.avatar} style={styles.smallAvatar} />
        <Text 
          style={[styles.mutualConnections, { color: theme.textTertiaryColor }]} 
          numberOfLines={1}
          ellipsizeMode="tail"
        > 
          {item.mutualConnections} mutual connections
        </Text>
      </View>

      {/* Connect Button - LinkedIn Style Logic */}
      {item.isConnected ? (
        // Connected State
        <View style={[styles.connectButton, { borderColor: theme.successColor, backgroundColor: theme.successColor }]}>
          <Text style={[styles.connectButtonText, { color: 'white' }]}>Connected</Text>
        </View>
      ) : item.isPending && item.isPendingReceived ? (
        // Pending State - Show Accept/Ignore buttons (only for received requests)
        <View style={styles.pendingButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton, { backgroundColor: theme.primaryColor }]}
            onPress={(e) => { e.stopPropagation(); onAccept && onAccept(); }}
            disabled={isProcessing}
          >
            <Text style={[styles.actionButtonText, { color: 'white' }]}>
              {isProcessing ? 'Accepting...' : 'Accept'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.ignoreButton, { borderColor: theme.borderColor }]}
            onPress={(e) => { e.stopPropagation(); onIgnore && onIgnore(); }}
            disabled={isProcessing}
          >
            <Text style={[styles.actionButtonText, { color: theme.textSecondaryColor }]}>
              {isProcessing ? 'Ignoring...' : 'Ignore'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : item.isPending ? (
        // Pending State - Show "Pending" button (for sent requests)
        <View style={[styles.connectButton, { borderColor: theme.borderColor, backgroundColor: theme.surfaceColor, opacity: 0.6 }]}>
          <Text style={[styles.connectButtonText, { color: theme.textSecondaryColor }]}>Pending</Text>
        </View>
      ) : (
        // Initial State - Connect Button
        <TouchableOpacity
          style={[styles.connectButton, { borderColor: theme.primaryColor }]}
          onPress={(e) => { e.stopPropagation(); onConnect && onConnect(); }}
          disabled={isProcessing}
        >
          <Text style={[styles.connectButtonText, { color: theme.primaryColor }]}>
            {isProcessing ? 'Sending...' : 'Connect'}
          </Text>
        </TouchableOpacity>
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
    width: '100%',
    justifyContent: 'center',
  },
  connectionName: {
    fontSize: 16, // slightly smaller for better fit
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1, // take available space
    maxWidth: '85%', // leave space for checkmark
  },
  connectionTitle: {
    fontSize: 13, // slightly smaller for better fit
    fontWeight: '400',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 16,
    width: '100%',
  },
  mutualConnectionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
    width: '100%',
    justifyContent: 'center',
  },
  smallAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  mutualConnections: {
    fontSize: 12, // slightly smaller for better fit
    flex: 1,
    textAlign: 'center',
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
  pendingButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  acceptButton: {
    // Styles handled inline
  },
  ignoreButton: {
    // Styles handled inline
  },
  actionButtonText: {
    fontSize: 10,
    fontWeight: '600',
  },
}); 