import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useMemo, useEffect } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  RefreshControl,
  Modal,
} from 'react-native';
import ConnectionCard from '../../../components/ConnectionCard';
import MessageModal from '../../../components/MessageModal';
import NetworkTabButton from '../../../components/NetworkTabButton';
import ProfileModal from '../../../components/ProfileModal';
import NotificationModal from '../../../components/NotificationModal';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import { useProfileNavigation } from '../../../contexts/ProfileNavigationContext';
import { useProfile } from '../../../contexts/ProfileContext';
import {
  NetworkSearchHeader
} from './components';
import Sidebar from '../home/Sidebar';
import MyProfileScreen from '../profile/MyProfileScreen';
import { searchUsers, searchUsersBySkills, searchUsersByLocation, getAllPublicUsers } from '../../../services/userAPI';
import { API_BASE_URL } from '../../../services/userAPI';
import Snackbar from '../../../components/Snackbar';

const { width } = Dimensions.get('window');

interface Connection {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: any;
  mutualConnections: number;
  isOnline: boolean;
  isPending: boolean;
  isSuggested: boolean;
  isConnected: boolean;
  location: string;
  about: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  duration: string;
}

interface NetworkStats {
  totalConnections: number;
  pendingRequests: number;
  newConnections: number;
  profileViews: number;
}

interface GrowthInsight {
  id: string;
  title: string;
  description: string;
  icon: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
}

interface NetworkScreenProps {
  userAvatar?: string | null;
  createdProfile?: any;
}

export default function NetworkScreen({ userAvatar, createdProfile }: NetworkScreenProps) {
  const theme = useCurrentTheme();
  const { openProfile } = useProfileNavigation();
  const { avatarUrl, profileData } = useProfile();
  
  // Use ProfileContext data if available, otherwise fall back to createdProfile or mock data
  const userProfile = useMemo(() => {
    if (profileData) {
      return {
        id: profileData.id,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        avatarUri: avatarUrl || profileData.profilePictureUrl || null,
        title: profileData.headline,
        company: profileData.currentCompany,
        location: profileData.location,
        about: profileData.summary,
        headerImage: profileData.headerImage,
        experience: profileData.workExperience,
        education: profileData.education,
        skills: profileData.skills,
        mutualConnections: 0,
        isConnected: false,
        isOnline: false,
        isPending: false,
        isSuggested: false,
      };
    }
    
    return createdProfile ? {
      id: createdProfile.id?.toString() || '1',
      firstName: createdProfile.firstName || 'Your',
      lastName: createdProfile.lastName || 'Name',
      avatarUri: createdProfile.profilePictureUrl || userAvatar,
      title: createdProfile.headline || 'Your Title',
      company: createdProfile.currentCompany || 'Your Company',
      location: createdProfile.location || 'Your Location',
      about: createdProfile.summary || 'About you',
      headerImage: createdProfile.headerImage || null,
      experience: createdProfile.workExperience || [],
      education: createdProfile.education || [],
      skills: createdProfile.skills || [],
      mutualConnections: 0,
      isConnected: false,
      isOnline: false,
      isPending: false,
      isSuggested: false,
    } : {
      id: '1', // Mock user ID for MyProfileScreen
    firstName: 'Your',
    lastName: 'Name',
    avatarUri: userAvatar,
    title: 'Your Title',
    company: 'Your Company',
    location: 'Your Location',
    about: 'About you',
    headerImage: null,
    experience: [],
    education: [],
    skills: [],
    mutualConnections: 0,
    isConnected: false,
    isOnline: false,
    isPending: false,
    isSuggested: false,
  };
  }, [profileData, avatarUrl, createdProfile, userAvatar]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<Connection | null>(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showMyProfileModal, setShowMyProfileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });

  // Real data state
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([]);
  const [suggestions, setSuggestions] = useState<Connection[]>([]);
  const [networkStats, setNetworkStats] = useState<NetworkStats>({
    totalConnections: 0,
    pendingRequests: 0,
    newConnections: 0,
    profileViews: 0,
  });

  const [activeTab, setActiveTab] = useState<'connections' | 'pending' | 'suggestions'>('connections');

  const onRefresh = () => {
    setRefreshing(true);
    loadNetworkData();
    setTimeout(() => setRefreshing(false), 1200);
  };

  // Load network data from API
  const loadNetworkData = async () => {
    try {
      setIsLoading(true);
      console.log('NetworkScreen - Loading network data from API');
      console.log('NetworkScreen - API URL:', `${API_BASE_URL}`);
      
      // Load all public users as connections (in a real app, this would be actual connections)
      const publicUsers = await getAllPublicUsers();
      console.log('NetworkScreen - Received public users:', publicUsers.length);
      
      // Transform API data to Connection format
      const transformedConnections: Connection[] = publicUsers.map((user: any, index: number) => ({
        id: user.id?.toString() || index.toString(),
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
        title: user.headline || user.title || 'Professional',
        company: user.currentCompany || user.company || 'Company',
        avatar: user.profilePictureUrl && typeof user.profilePictureUrl === 'string' ? { uri: user.profilePictureUrl } : require('@/assets/images/Avator-Image.jpg'),
        mutualConnections: Math.floor(Math.random() * 20) + 1, // Mock for now
        isOnline: Math.random() > 0.7, // Mock for now
      isPending: false,
      isSuggested: false,
      isConnected: true,
        location: user.location || 'Location not specified',
        about: user.summary || user.about || 'No description available',
        experience: user.workExperience || [],
        education: user.education || [],
        skills: user.skills || [],
      }));
      
      setConnections(transformedConnections);
      setNetworkStats({
        totalConnections: transformedConnections.length,
        pendingRequests: 0,
        newConnections: Math.floor(Math.random() * 10) + 1,
        profileViews: Math.floor(Math.random() * 50) + 10,
      });
      
      console.log('NetworkScreen - Loaded connections:', transformedConnections.length);
    } catch (error) {
      console.error('NetworkScreen - Failed to load network data:', error);
      
      // Fallback to mock data if API fails
      console.log('NetworkScreen - Using fallback mock data');
      const mockConnections: Connection[] = [
    {
      id: '1',
      name: 'John Doe',
      title: 'Software Engineer',
      company: 'Tech Solutions Inc.',
          avatar: require('@/assets/images/profile-pictures/image-01.jpg'),
      mutualConnections: 15,
      isOnline: true,
      isPending: false,
      isSuggested: false,
      isConnected: true,
      location: 'San Francisco, CA',
          about: 'Experienced software engineer passionate about building scalable applications.',
          experience: [],
          education: [],
          skills: ['JavaScript', 'React', 'Node.js'],
    },
    {
      id: '2',
      name: 'Jane Smith',
      title: 'Product Manager',
          company: 'Innovation Corp',
          avatar: require('@/assets/images/profile-pictures/image-02.webp'),
      mutualConnections: 8,
      isOnline: false,
      isPending: false,
      isSuggested: false,
      isConnected: true,
      location: 'New York, NY',
          about: 'Product manager with expertise in user experience and market analysis.',
          experience: [],
          education: [],
          skills: ['Product Management', 'UX Design', 'Analytics'],
        },
      ];
      
      setConnections(mockConnections);
      setNetworkStats({
        totalConnections: mockConnections.length,
        pendingRequests: 0,
        newConnections: 2,
        profileViews: 25,
      });
      
      setSnackbar({ visible: true, message: 'Using offline data - network unavailable', type: 'info' });
    } finally {
      setIsLoading(false);
    }
  };

  // Search functionality
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadNetworkData(); // Load all users if search is empty
      return;
    }
    
    try {
      setIsLoading(true);
      console.log('NetworkScreen - Searching for:', query);
      
      // Try different search methods
      let searchResults: any[] = [];
      
      // First try general search
      try {
        searchResults = await searchUsers({ keyword: query });
      } catch (error) {
        console.log('NetworkScreen - General search failed, trying location search');
        try {
          searchResults = await searchUsersByLocation(query);
        } catch (locationError) {
          console.log('NetworkScreen - Location search failed, trying skills search');
          try {
            searchResults = await searchUsersBySkills([query]);
          } catch (skillsError) {
            console.log('NetworkScreen - All search methods failed');
            searchResults = [];
          }
        }
      }
      
      // Transform search results
      const transformedResults: Connection[] = searchResults.map((user: any, index: number) => ({
        id: user.id?.toString() || index.toString(),
        name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
        title: user.headline || user.title || 'Professional',
        company: user.currentCompany || user.company || 'Company',
        avatar: user.profilePictureUrl && typeof user.profilePictureUrl === 'string' ? { uri: user.profilePictureUrl } : require('@/assets/images/Avator-Image.jpg'),
        mutualConnections: Math.floor(Math.random() * 20) + 1,
        isOnline: Math.random() > 0.7,
      isPending: false,
        isSuggested: true, // Mark as suggested since they're search results
      isConnected: false,
        location: user.location || 'Location not specified',
        about: user.summary || user.about || 'No description available',
        experience: user.workExperience || [],
        education: user.education || [],
        skills: user.skills || [],
      }));
      
      setConnections(transformedResults);
      console.log('NetworkScreen - Search results:', transformedResults.length);
      
    } catch (error) {
      console.error('NetworkScreen - Search failed:', error);
      setSnackbar({ visible: true, message: 'Search failed', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadNetworkData();
  }, []);

  // Handle search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        handleSearch(searchQuery);
      }, 500); // Debounce search
      
      return () => clearTimeout(timeoutId);
    } else {
      loadNetworkData();
    }
  }, [searchQuery]);

  const getCurrentData = () => {
    const allData = [...connections, ...pendingRequests, ...suggestions];
    const filteredData = allData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.company.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeTab === 'connections') {
        return matchesSearch && !item.isPending && !item.isSuggested;
      } else if (activeTab === 'pending') {
        return matchesSearch && item.isPending;
      } else if (activeTab === 'suggestions') {
        return matchesSearch && item.isSuggested;
      }
      return matchesSearch;
    });
    
    return filteredData;
  };

  const handleMessage = (connection: Connection) => {
    // Create a conversation object from the connection
    const conversation = {
      id: connection.id,
      contactName: connection.name,
      contactAvatar: connection.avatar,
      contactTitle: connection.title,
      contactCompany: connection.company,
      isOnline: connection.isOnline,
      messages: [
        {
          id: '1',
          sender: connection.name,
          senderAvatar: connection.avatar,
          content: `Hi! I'm ${connection.name}, ${connection.title} at ${connection.company}. Nice to connect with you!`,
          timestamp: 'Just now',
          isFromMe: false,
        }
      ]
    };
    
    setSelectedConversation(conversation);
    setMessageModalVisible(true);
  };

  const handleAccept = (connectionId: string) => {
    // Move from pending to connections
    const acceptedConnection = pendingRequests.find(conn => conn.id === connectionId);
    if (acceptedConnection) {
      const updatedConnection = { ...acceptedConnection, isPending: false, isConnected: true };
      
      setPendingRequests(prev => prev.filter(conn => conn.id !== connectionId));
      setConnections(prev => [...prev, updatedConnection]);
      
      // Update network stats
      setNetworkStats(prev => ({
        ...prev,
        totalConnections: prev.totalConnections + 1,
        pendingRequests: prev.pendingRequests - 1,
      }));
    }
  };

  const handleIgnore = (connectionId: string) => {
    // Remove from pending requests
      setPendingRequests(prev => prev.filter(conn => conn.id !== connectionId));
      
      // Update network stats
      setNetworkStats(prev => ({
        ...prev,
        pendingRequests: prev.pendingRequests - 1,
      }));
  };

  const handleConnect = (connectionId: string) => {
    // Move from suggestions to pending
    const suggestedConnection = suggestions.find(conn => conn.id === connectionId);
    if (suggestedConnection) {
      const updatedConnection = { ...suggestedConnection, isSuggested: false, isPending: true };
      
      setSuggestions(prev => prev.filter(conn => conn.id !== connectionId));
      setPendingRequests(prev => [...prev, updatedConnection]);
      
      // Update network stats
      setNetworkStats(prev => ({
        ...prev,
        pendingRequests: prev.pendingRequests + 1,
      }));
    }
  };

  const handleProfileCardPress = (connection: Connection) => {
    // Convert Connection to ProfileData format
    const profileData = {
      id: connection.id,
      name: connection.name,
      title: connection.title,
      company: connection.company,
      location: connection.location,
      avatar: connection.avatar,
      headerImage: null,
      about: connection.about,
      experience: connection.experience,
      education: connection.education.map(edu => ({
        id: edu.id,
        degree: edu.degree,
        school: edu.institution,
        year: edu.duration,
      })),
      skills: connection.skills,
      mutualConnections: connection.mutualConnections,
      isConnected: connection.isConnected,
      isOnline: connection.isOnline,
      isPending: connection.isPending,
      isSuggested: connection.isSuggested,
    } as any; // Type assertion to bypass interface mismatch
    
    openProfile(profileData);
  };

  const renderGrowthInsight = ({ item }: { item: GrowthInsight }) => (
    <View style={[styles.growthInsightCard, { backgroundColor: theme.cardColor }]}>
      <View style={styles.growthInsightHeader}>
        <MaterialCommunityIcons 
          name={item.icon as any} 
          size={20} 
          color={theme.primaryColor} 
        />
        <View style={styles.growthInsightTrend}>
          <MaterialCommunityIcons 
            name={item.trend === 'up' ? 'trending-up' : item.trend === 'down' ? 'trending-down' : 'minus'} 
            size={16} 
            color={item.trend === 'up' ? '#4CAF50' : item.trend === 'down' ? '#F44336' : theme.textSecondaryColor} 
          />
        </View>
      </View>
      <Text style={[styles.growthInsightValue, { color: theme.textColor }]}>{item.value}</Text>
      <Text style={[styles.growthInsightTitle, { color: theme.textColor }]}>{item.title}</Text>
      <Text style={[styles.growthInsightDescription, { color: theme.textSecondaryColor }]}>{item.description}</Text>
    </View>
  );

  const renderConnection = ({ item }: { item: Connection }) => (
    <ConnectionCard
      item={item}
      theme={theme}
      onPress={() => handleProfileCardPress(item)}
      onAccept={() => handleAccept(item.id)}
      onIgnore={() => handleIgnore(item.id)}
      onConnect={() => handleConnect(item.id)}
      onMessage={() => handleMessage(item)}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <NetworkSearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onProfilePress={() => setShowMyProfileModal(true)}
        onNotificationPress={() => setNotificationModalVisible(true)}
        userAvatar={userAvatar}
      />

      {/* Sidebar */}
      {showDashboard && (
        <Sidebar
          userAvatar={userAvatar}
          onClose={() => setShowDashboard(false)}
        />
      )}

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Network Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Network insights</Text>
            <TouchableOpacity>
              <Text style={[styles.viewAllText, { color: theme.primaryColor }]}>View all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={[
              {
                id: '1',
                title: 'Profile views',
                description: 'Your profile was viewed 45 times this week',
                icon: 'eye',
                value: '45',
                trend: 'up',
              },
              {
                id: '2',
                title: 'Search appearances',
                description: 'You appeared in 12 searches this week',
                icon: 'magnify',
                value: '12',
                trend: 'up',
              },
              {
                id: '3',
                title: 'Connection growth',
                description: 'You grew your network by 8 connections this month',
                icon: 'account-plus',
                value: '8',
                trend: 'up',
              },
            ]}
            renderItem={renderGrowthInsight}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.growthInsightsList}
          />
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <NetworkTabButton label="Connections" count={connections.length} active={activeTab === 'connections'} onPress={() => setActiveTab('connections')} theme={theme} />
          <NetworkTabButton label="Pending" count={pendingRequests.length} active={activeTab === 'pending'} onPress={() => setActiveTab('pending')} theme={theme} />
          <NetworkTabButton label="Suggestions" count={suggestions.length} active={activeTab === 'suggestions'} onPress={() => setActiveTab('suggestions')} theme={theme} />
        </View>

        {/* Connections List */}
        <View style={styles.listSection}>
          <FlatList
            data={getCurrentData()}
            renderItem={renderConnection}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            numColumns={2}
            columnWrapperStyle={styles.row}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialCommunityIcons 
                  name="account-group-outline" 
                  size={48} 
                  color={theme.textSecondaryColor} 
                />
                <Text style={[styles.emptyStateText, { color: theme.textSecondaryColor }]}>
                  {searchQuery ? 'No results found' : `No ${activeTab} yet`}
                </Text>
              </View>
            }
          />
        </View>
      </ScrollView>

      {/* Profile Modal */}
      {selectedProfile && (
        <ProfileModal
          visible={profileModalVisible}
          onClose={() => {
            setProfileModalVisible(false);
            setSelectedProfile(null);
          }}
          profile={{
            id: selectedProfile.id,
            name: selectedProfile.name,
            title: selectedProfile.title,
            company: selectedProfile.company,
            avatar: selectedProfile.avatar,
            mutualConnections: selectedProfile.mutualConnections,
            isOnline: selectedProfile.isOnline,
            isConnected: selectedProfile.isConnected,
            isPending: selectedProfile.isPending,
            location: selectedProfile.location,
            about: selectedProfile.about,
            experience: selectedProfile.experience,
            education: selectedProfile.education.map(edu => ({
              id: edu.id,
              degree: edu.degree,
              school: edu.institution,
              year: edu.duration,
            })),
            skills: selectedProfile.skills,
          }}
        />
      )}

      {/* Message Modal */}
      {selectedConversation && (
        <MessageModal
          visible={messageModalVisible}
          onClose={() => {
            setMessageModalVisible(false);
            setSelectedConversation(null);
          }}
          conversation={selectedConversation}
        />
      )}

      {/* Notification Modal */}
      <NotificationModal
        visible={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
      />

      {/* My Profile Modal */}
      <Modal
        visible={showMyProfileModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <MyProfileScreen
          profile={userProfile}
          onBack={() => setShowMyProfileModal(false)}
        />
      </Modal>

      {/* Snackbar */}
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onHide={() => setSnackbar({ visible: false, message: '', type: 'info' })}
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
    paddingBottom: 20,
  },
  statsSection: {
    marginTop: 20,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  listSection: {
    paddingHorizontal: 20,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    gap: 4,
  },
  growthInsightsList: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  growthInsightCard: {
    width: (width - 52) / 2, // Adjust width for horizontal scroll
    marginRight: 12,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  growthInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },
  growthInsightTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  growthInsightValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  growthInsightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  growthInsightDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
}); 