import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useCurrentTheme } from '../contexts/ThemeContext';
import { useProfileNavigation } from '../contexts/ProfileNavigationContext';
import HeaderBar from '../components/HeaderBar';
import SuggestionsList from '../components/SuggestionsList';
import ConnectionsSummary from '../components/ConnectionsSummary';
import PendingInvitations from '../components/PendingInvitations';
import Snackbar from '../components/Snackbar';

// Mock data
const mockSuggestions = [
  {
    id: '1',
    name: 'Sarah Wilson',
    title: 'Marketing Director',
    company: 'Global Marketing',
    avatar: require('../assets/images/Avator-Image.jpg'),
    mutualConnections: 6,
  },
  {
    id: '2',
    name: 'Alex Brown',
    title: 'Data Scientist',
    company: 'Analytics Corp',
    avatar: require('../assets/images/Avator-Image.jpg'),
    mutualConnections: 9,
  },
  {
    id: '3',
    name: 'Emma Davis',
    title: 'Business Analyst',
    company: 'Strategy Partners',
    avatar: require('../assets/images/Avator-Image.jpg'),
    mutualConnections: 7,
  },
  {
    id: '4',
    name: 'Tom Wilson',
    title: 'UX Designer',
    company: 'Creative Studio',
    avatar: require('../assets/images/Avator-Image.jpg'),
    mutualConnections: 12,
  },
  {
    id: '5',
    name: 'Lisa Rodriguez',
    title: 'Content Creator',
    company: 'Creative Studios',
    avatar: require('../assets/images/Avator-Image.jpg'),
    mutualConnections: 4,
  },
];

const mockInvitations = [
  {
    id: 'inv1',
    name: 'John Doe',
    title: 'Software Engineer',
    company: 'Tech Solutions Inc.',
    avatar: require('../assets/images/Avator-Image.jpg'),
    mutualConnections: 15,
  },
  {
    id: 'inv2',
    name: 'Jane Smith',
    title: 'Product Manager',
    company: 'Digital Marketing Pro',
    avatar: require('../assets/images/Avator-Image.jpg'),
    mutualConnections: 8,
  },
  {
    id: 'inv3',
    name: 'Mike Johnson',
    title: 'UX Designer',
    company: 'Creative Studio',
    avatar: require('../assets/images/Avator-Image.jpg'),
    mutualConnections: 12,
  },
];

interface MyNetworkScreenProps {
  userAvatar?: string | null;
}

export default function MyNetworkScreen({ userAvatar }: MyNetworkScreenProps) {
  const theme = useCurrentTheme();
  const { openProfile } = useProfileNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState(mockSuggestions);
  const [invitations, setInvitations] = useState(mockInvitations);
  const [totalConnections] = useState(1247);
  const [newConnections] = useState(5);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });

  const handleSearch = (query: string) => {
    console.log('Searching for:', query);
    // Implement search functionality
  };

  const handleProfilePress = () => {
    console.log('Profile pressed');
    // Navigate to user profile
  };

  const handleNotificationPress = () => {
    console.log('Notification pressed');
    // Navigate to notifications
  };

  const handleConnect = (id: string) => {
    setSnackbar({ visible: true, message: 'Connection request sent!', type: 'success' });
    // Remove from suggestions and add to pending
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const handleAccept = (id: string) => {
    setSnackbar({ visible: true, message: 'You are now connected!', type: 'success' });
    // Remove from invitations and add to connections
    setInvitations(prev => prev.filter(inv => inv.id !== id));
  };

  const handleIgnore = (id: string) => {
    setSnackbar({ visible: true, message: 'Invitation has been ignored.', type: 'info' });
    // Remove from invitations
    setInvitations(prev => prev.filter(inv => inv.id !== id));
  };

  const handleViewAllConnections = () => {
    console.log('View all connections');
    // Navigate to full connections list
  };

  const handleSuggestionProfilePress = (id: string) => {
    const suggestion = suggestions.find(s => s.id === id);
    if (suggestion) {
      const profileData = {
        id: suggestion.id,
        name: suggestion.name,
        title: suggestion.title,
        company: suggestion.company,
        location: 'San Francisco, CA',
        avatar: suggestion.avatar,
        about: 'Experienced professional passionate about networking and growth.',
        experience: [
          { id: '1', title: suggestion.title, company: suggestion.company, duration: '2 yrs', description: 'Led various initiatives and projects.' }
        ],
        education: [
          { id: '1', degree: 'Bachelor\'s Degree', school: 'University', year: '2020' }
        ],
        skills: ['Leadership', 'Communication', 'Project Management'],
        mutualConnections: suggestion.mutualConnections,
        isConnected: false,
        isOnline: true,
        isPending: false,
        isSuggested: true,
      };
      openProfile(profileData);
    }
  };

  const handleInvitationProfilePress = (id: string) => {
    const invitation = invitations.find(inv => inv.id === id);
    if (invitation) {
      const profileData = {
        id: invitation.id,
        name: invitation.name,
        title: invitation.title,
        company: invitation.company,
        location: 'New York, NY',
        avatar: invitation.avatar,
        about: 'Experienced professional with strong communication skills.',
        experience: [
          { id: '1', title: invitation.title, company: invitation.company, duration: '3 yrs', description: 'Led various initiatives and projects.' }
        ],
        education: [
          { id: '1', degree: 'Master\'s Degree', school: 'University', year: '2019' }
        ],
        skills: ['Communication', 'Leadership', 'Project Management', 'Networking'],
        mutualConnections: invitation.mutualConnections,
        isConnected: false,
        isOnline: false,
        isPending: true,
        isSuggested: false,
      };
      openProfile(profileData);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <HeaderBar
        onSearch={handleSearch}
        onProfilePress={handleProfilePress}
        onNotificationPress={handleNotificationPress}
        userAvatar={userAvatar}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ConnectionsSummary
          totalConnections={totalConnections}
          newConnections={newConnections}
          onViewAll={handleViewAllConnections}
        />

        <SuggestionsList
          suggestions={suggestions}
          onConnect={handleConnect}
          onProfilePress={handleSuggestionProfilePress}
        />

        <PendingInvitations
          invitations={invitations}
          onAccept={handleAccept}
          onIgnore={handleIgnore}
          onProfilePress={handleInvitationProfilePress}
        />
      </ScrollView>
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onHide={() => setSnackbar({ ...snackbar, visible: false })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
}); 