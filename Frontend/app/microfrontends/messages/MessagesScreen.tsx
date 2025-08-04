import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  RefreshControl,
  Modal
} from 'react-native';
import MessageModal from '../../../components/MessageModal';
import ProfileModal from '../../../components/ProfileModal';
import NotificationModal from '../../../components/NotificationModal';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import { useProfileNavigation } from '../../../contexts/ProfileNavigationContext';
import { useProfile } from '../../../contexts/ProfileContext';
import {
  MessageSearchHeader
} from './components';
import Sidebar from '../home/Sidebar';
import MyProfileScreen from '../profile/MyProfileScreen';

const { width } = Dimensions.get('window');

interface Message {
  id: string;
  sender: string;
  senderAvatar: any;
  content: string;
  timestamp: string;
  isFromMe: boolean;
}

interface Conversation {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: any;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  isPinned: boolean;
  messages: Message[];
}

interface MessagesScreenProps {
  userAvatar?: string | null;
  createdProfile?: any;
}

export default function MessagesScreen({ userAvatar, createdProfile }: MessagesScreenProps) {
  const theme = useCurrentTheme();
  const { openProfile } = useProfileNavigation();
  const { avatarUrl, profileData } = useProfile();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'pinned'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'John Doe',
      title: 'Software Engineer',
      company: 'Tech Solutions Inc.',
      avatar: require('@/assets/images/profile-pictures/image-01.jpg'),
      lastMessage: 'Thanks for the referral! I\'ll definitely check it out.',
      timestamp: '2m ago',
      unreadCount: 2,
      isOnline: true,
      isPinned: true,
      messages: [
        {
          id: 'msg1',
          sender: 'John Doe',
          senderAvatar: require('@/assets/images/Avator-Image.jpg'),
          content: 'Hey! I saw your post about the job opening. I\'m really interested in the position.',
          timestamp: '10:30 AM',
          isFromMe: false,
        },
        {
          id: 'msg2',
          sender: 'You',
          senderAvatar: require('@/assets/images/Avator-Image.jpg'),
          content: 'Hi John! Thanks for reaching out. I\'d be happy to refer you for the position.',
          timestamp: '10:32 AM',
          isFromMe: true,
        },
        {
          id: 'msg3',
          sender: 'John Doe',
          senderAvatar: require('@/assets/images/Avator-Image.jpg'),
          content: 'Thanks for the referral! I\'ll definitely check it out.',
          timestamp: '2m ago',
          isFromMe: false,
        },
      ],
    },
    {
      id: '2',
      name: 'Jane Smith',
      title: 'Product Manager',
      company: 'Digital Marketing Pro',
      avatar: require('@/assets/images/profile-pictures/image-02.webp'),
      lastMessage: 'The project timeline looks great. Let\'s discuss this tomorrow.',
      timestamp: '1h ago',
      unreadCount: 0,
      isOnline: false,
      isPinned: false,
      messages: [
        {
          id: 'msg4',
          sender: 'Jane Smith',
          senderAvatar: require('@/assets/images/Avator-Image.jpg'),
          content: 'Hi! I wanted to discuss the new project timeline we discussed.',
          timestamp: '2:15 PM',
          isFromMe: false,
        },
        {
          id: 'msg5',
          sender: 'You',
          senderAvatar: require('@/assets/images/Avator-Image.jpg'),
          content: 'Sure! I\'ve been working on the updated timeline.',
          timestamp: '2:20 PM',
          isFromMe: true,
        },
        {
          id: 'msg6',
          sender: 'Jane Smith',
          senderAvatar: require('@/assets/images/Avator-Image.jpg'),
          content: 'The project timeline looks great. Let\'s discuss this tomorrow.',
          timestamp: '1h ago',
          isFromMe: false,
        },
      ],
    },
    {
      id: '3',
      name: 'Mike Johnson',
      title: 'UX Designer',
      company: 'Creative Studio',
      avatar: require('@/assets/images/profile-pictures/image-03.jpg'),
      lastMessage: 'Can you share the design files? I need them for the presentation.',
      timestamp: '3h ago',
      unreadCount: 1,
      isOnline: true,
      isPinned: false,
      messages: [
        {
          id: 'msg7',
          sender: 'Mike Johnson',
          senderAvatar: require('@/assets/images/Avator-Image.jpg'),
          content: 'Hey! I\'m working on the presentation for tomorrow\'s meeting.',
          timestamp: '11:00 AM',
          isFromMe: false,
        },
        {
          id: 'msg8',
          sender: 'You',
          senderAvatar: require('@/assets/images/Avator-Image.jpg'),
          content: 'No problem! I\'ll send them over right away.',
          timestamp: '11:05 AM',
          isFromMe: true,
        },
        {
          id: 'msg9',
          sender: 'Mike Johnson',
          senderAvatar: require('@/assets/images/Avator-Image.jpg'),
          content: 'Can you share the design files? I need them for the presentation.',
          timestamp: '3h ago',
          isFromMe: false,
        },
      ],
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      title: 'Marketing Director',
      company: 'Global Marketing',
      avatar: require('@/assets/images/profile-pictures/image-04.jpeg'),
      lastMessage: 'The campaign results are in. We exceeded our targets!',
      timestamp: '1d ago',
      unreadCount: 0,
      isOnline: false,
      isPinned: true,
      messages: [
        {
          id: 'msg10',
          sender: 'Sarah Wilson',
          senderAvatar: require('@/assets/images/Avator-Image.jpg'),
          content: 'Great news! The Q4 campaign results are in.',
          timestamp: 'Yesterday',
          isFromMe: false,
        },
        {
          id: 'msg11',
          sender: 'You',
          senderAvatar: require('@/assets/images/Avator-Image.jpg'),
          content: 'That\'s fantastic! How did we perform?',
          timestamp: 'Yesterday',
          isFromMe: true,
        },
        {
          id: 'msg12',
          sender: 'Sarah Wilson',
          senderAvatar: require('@/assets/images/Avator-Image.jpg'),
          content: 'The campaign results are in. We exceeded our targets!',
          timestamp: '1d ago',
          isFromMe: false,
        },
      ],
    },
    {
      id: '5',
      name: 'Alex Brown',
      title: 'Data Scientist',
      company: 'Analytics Corp',
      avatar: require('@/assets/images/profile-pictures/image-05.avif'),
      lastMessage: 'I\'ve sent you the updated analytics report.',
      timestamp: '2d ago',
      unreadCount: 0,
      isOnline: true,
      isPinned: false,
      messages: [
        {
          id: 'msg13',
          sender: 'Alex Brown',
          senderAvatar: require('@/assets/images/Avator-Image.jpg'),
          content: 'Hi! I\'ve been working on the quarterly analytics report.',
          timestamp: '2 days ago',
          isFromMe: false,
        },
        {
          id: 'msg14',
          sender: 'You',
          senderAvatar: require('@/assets/images/Avator-Image.jpg'),
          content: 'Perfect! I\'m looking forward to seeing the insights.',
          timestamp: '2 days ago',
          isFromMe: true,
        },
        {
          id: 'msg15',
          sender: 'Alex Brown',
          senderAvatar: require('@/assets/images/Avator-Image.jpg'),
          content: 'I\'ve sent you the updated analytics report.',
          timestamp: '2d ago',
          isFromMe: false,
        },
      ],
    },
  ]);

  const [showDashboard, setShowDashboard] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showMyProfileModal, setShowMyProfileModal] = useState(false);

  // Use createdProfile if available, otherwise fall back to mock data
  const userProfile = useMemo(() => {
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
  }, [createdProfile, userAvatar]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  // Helper to build a mock profile object from user data
  const buildProfile = (user: any) => {
    // Use ProfileContext data if this is the current user
    if (profileData && user.id === profileData.id) {
      return {
        id: profileData.id,
        name: `${profileData.firstName} ${profileData.lastName}`,
        title: profileData.headline,
        company: profileData.currentCompany,
        avatar: avatarUrl && typeof avatarUrl === 'string' ? { uri: avatarUrl } : require('@/assets/images/Avator-Image.jpg'),
        mutualConnections: 8,
        isOnline: false,
        isConnected: true,
        isPending: false,
        isSuggested: false,
        location: profileData.location,
        about: profileData.summary,
        experience: profileData.workExperience,
        education: profileData.education,
        skills: profileData.skills,
      };
    }
    
    return {
    id: user.id?.toString() || '',
    name: user.name || '',
    title: user.title || 'Professional',
    company: user.company || '',
    avatar: user.avatar,
    mutualConnections: 8,
    isOnline: user.isOnline || false,
    isConnected: true,
    isPending: false,
    isSuggested: false,
    location: 'San Francisco, CA',
    about: 'Experienced professional with strong communication skills.',
    experience: [
      { id: '1', title: 'Senior Professional', company: user.company || 'Company', duration: '3 yrs', description: 'Led various initiatives and projects.' }
    ],
    education: [
      { id: '1', degree: 'Master\'s Degree', school: 'University', year: '2019' }
    ],
    skills: ['Communication', 'Leadership', 'Project Management', 'Networking'],
    };
  };

  const handleProfilePress = (user: any) => {
    const profileData = buildProfile(user);
    openProfile(profileData);
  };

  const handleConversationPress = (conversation: Conversation) => {
    // Mark conversation as read by setting unreadCount to 0
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.id === conversation.id
          ? { ...conv, unreadCount: 0 }
          : conv
      )
    );
    
    // If we're on the unread filter and this was the last unread message,
    // switch back to 'all' filter to show the conversation
    if (selectedFilter === 'unread' && conversation.unreadCount > 0) {
      const remainingUnread = conversations.filter(conv => 
        conv.id !== conversation.id && conv.unreadCount > 0
      ).length;
      if (remainingUnread === 0) {
        setSelectedFilter('all');
      }
    }
    
    setSelectedConversation(conversation);
    setMessageModalVisible(true);
  };

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conversation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conversation.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'unread') {
      return matchesSearch && conversation.unreadCount > 0;
    } else if (selectedFilter === 'pinned') {
      return matchesSearch && conversation.isPinned;
    }
    
    return matchesSearch;
  });

  const renderConversation = ({ item }: { item: Conversation }) => (
    <View style={[
      styles.conversationItem,
      { 
        backgroundColor: item.unreadCount > 0 ? theme.primaryColor + '10' : theme.cardColor,
        borderBottomColor: theme.borderColor 
      }
    ]}>
      <TouchableOpacity
        style={styles.conversationContent}
        onPress={() => handleConversationPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={() => handleProfilePress(item)}>
            <Image source={item.avatar} style={styles.avatar} />
          </TouchableOpacity>
          {item.isOnline && <View style={styles.onlineIndicator} />}
          {item.isPinned && (
            <View style={[styles.pinIndicator, { backgroundColor: theme.primaryColor }]}>
              <MaterialCommunityIcons name="pin" size={8} color="#fff" />
            </View>
          )}
        </View>
        
        <View style={styles.conversationDetails}>
          <View style={styles.conversationHeader}>
            <Text style={[styles.conversationName, { color: theme.textColor }]}>
              {item.name}
            </Text>
            <Text style={[styles.timestamp, { color: theme.textSecondaryColor }]}>
              {item.timestamp}
            </Text>
          </View>
          
          <Text style={[styles.conversationTitle, { color: theme.textSecondaryColor }]}>
            {item.title} at {item.company}
          </Text>
          
          <View style={styles.messageContainer}>
            <Text 
              style={[
                styles.lastMessage, 
                { 
                  color: item.unreadCount > 0 ? theme.textColor : theme.textSecondaryColor,
                  fontWeight: item.unreadCount > 0 ? '600' : '400'
                }
              ]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>
            
            {item.unreadCount > 0 && (
              <View 
                style={[
                  styles.unreadBadge, 
                  { 
                    backgroundColor: theme.primaryColor,
                    opacity: item.unreadCount > 0 ? 1 : 0,
                  }
                ]}
              >
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  const renderFilterButton = (filter: 'all' | 'unread' | 'pinned', label: string, icon: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        { 
          backgroundColor: selectedFilter === filter ? theme.primaryColor : theme.surfaceColor,
          borderColor: theme.borderColor
        }
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <MaterialCommunityIcons 
        name={icon as any} 
        size={16} 
        color={selectedFilter === filter ? '#fff' : theme.textSecondaryColor} 
      />
      <Text style={[
        styles.filterButtonText,
        { color: selectedFilter === filter ? '#fff' : theme.textSecondaryColor }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <MessageSearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterToggle={() => setShowFilters(!showFilters)}
        onProfilePress={() => setShowMyProfileModal(true)}
        onNotificationPress={() => setNotificationModalVisible(true)}
        userAvatar={userAvatar}
        showFilters={showFilters}
      />

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          {renderFilterButton('all', 'All', 'message-text')}
          {renderFilterButton('unread', 'Unread', 'email-outline')}
          {renderFilterButton('pinned', 'Pinned', 'pin')}
        </View>
      )}

      {/* Conversations List */}
      <FlatList
        data={filteredConversations || []}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        style={styles.conversationsList}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons 
              name="message-text-outline" 
              size={48} 
              color={theme.textSecondaryColor} 
            />
            <Text style={[styles.emptyStateText, { color: theme.textSecondaryColor }]}>
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </Text>
            {!searchQuery && (
              <Text style={[styles.emptyStateSubtext, { color: theme.textTertiaryColor }]}>
                Start a conversation with your connections
              </Text>
            )}
          </View>
        }
      />

      {/* Message Modal */}
      {selectedConversation && (
        <MessageModal
          visible={messageModalVisible}
          onClose={() => {
            setMessageModalVisible(false);
            setSelectedConversation(null);
          }}
          conversation={{
            id: selectedConversation.id,
            contactName: selectedConversation.name,
            contactAvatar: selectedConversation.avatar,
            contactTitle: selectedConversation.title,
            contactCompany: selectedConversation.company,
            isOnline: selectedConversation.isOnline,
            messages: selectedConversation.messages,
          }}
        />
      )}
      {/* Profile Modal */}
      {selectedProfile && (
        <ProfileModal
          visible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
          profile={selectedProfile}
        />
      )}
      <NotificationModal
        visible={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
      />
      {showDashboard && (
        <Sidebar
          userAvatar={userAvatar}
          onClose={() => setShowDashboard(false)}
          onMePress={() => {}}
        />
      )}

      {/* MyProfileScreen Modal */}
      {showMyProfileModal && (
        <Modal visible={showMyProfileModal} animationType="slide" onRequestClose={() => setShowMyProfileModal(false)}>
          <MyProfileScreen profile={userProfile} onBack={() => setShowMyProfileModal(false)} />
          <TouchableOpacity style={{ position: 'absolute', top: 40, right: 24, zIndex: 100 }} onPress={() => setShowMyProfileModal(false)}>
            <MaterialCommunityIcons name="close" size={32} color="#222" />
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  conversationsList: {
    flex: 1,
  },
  conversationItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  conversationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  pinIndicator: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  conversationDetails: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
  },
  conversationTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    marginRight: 8,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerSearchWrapper: {
    flex: 1,
    marginHorizontal: 8,
  },
  headerSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    height: 36,
  },
  headerSearchInput: {
    flex: 1,
    marginLeft: 6,
    fontSize: 15,
    paddingVertical: 0,
  },
}); 