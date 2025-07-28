import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useCurrentTheme } from '../contexts/ThemeContext';
import InvitationCard from './InvitationCard';

interface Invitation {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: any;
  mutualConnections: number;
}

interface PendingInvitationsProps {
  invitations: Invitation[];
  onAccept: (id: string) => void;
  onIgnore: (id: string) => void;
  onProfilePress: (id: string) => void;
}

export default function PendingInvitations({ invitations, onAccept, onIgnore, onProfilePress }: PendingInvitationsProps) {
  const theme = useCurrentTheme();

  const renderInvitation = ({ item }: { item: Invitation }) => (
    <InvitationCard
      id={item.id}
      name={item.name}
      title={item.title}
      company={item.company}
      avatar={item.avatar}
      mutualConnections={item.mutualConnections}
      onAccept={onAccept}
      onIgnore={onIgnore}
      onProfilePress={onProfilePress}
    />
  );

  if (invitations.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.textColor }]}>Pending Invitations</Text>
        </View>
        <View style={[styles.emptyContainer, { backgroundColor: theme.cardColor }]}>
          <Text style={[styles.emptyText, { color: theme.textSecondaryColor }]}>
            No pending invitations
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textColor }]}>Pending Invitations</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondaryColor }]}>
          {invitations.length} invitation{invitations.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={invitations}
        renderItem={renderInvitation}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    marginHorizontal: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 