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
import { ImageService } from '../../../services/imageService';
import { 
  sendConnectionRequest, 
  acceptConnectionRequest, 
  rejectConnectionRequest, 
  getUserConnections, 
  getConnectionStatus,
  removeConnection 
} from '../../../services/connectionAPI';

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
  isPendingReceived?: boolean; // True if current user received the request
  location: string;
  about: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  connectionId?: number; // For API calls
  bannerImage?: any; // Added for banner image
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
  const [connectionStatuses, setConnectionStatuses] = useState<{[key: string]: string}>({});
  const [isProcessingConnection, setIsProcessingConnection] = useState<string | null>(null);

  const onRefresh = () => {
    setRefreshing(true);
    loadNetworkData();
    setTimeout(() => setRefreshing(false), 1200);
  };

  // Load mock network data (LinkedIn-style)
  const loadNetworkData = async () => {
    try {
      setIsLoading(true);
      console.log('NetworkScreen - Loading mock network data');
      
      // Mock data - LinkedIn-style network
      const mockUsers: Connection[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          title: 'Senior Software Engineer',
          company: 'TechCorp Inc.',
          avatar: require('@/assets/images/profile-pictures/image-01.jpg'),
          bannerImage: require('@/assets/images/banner-images/banner-01.jpg'),
          mutualConnections: 15,
          isOnline: true,
          isPending: false,
          isSuggested: false,
          isConnected: true,
          isPendingReceived: false,
          location: 'San Francisco, CA',
          about: 'Experienced software engineer passionate about building scalable applications.',
          experience: [
            { id: '1', title: 'Senior Software Engineer', company: 'TechCorp Inc.', duration: '2020-Present', description: 'Leading development of cloud-based solutions.' },
            { id: '2', title: 'Software Engineer', company: 'StartupXYZ', duration: '2018-2020', description: 'Full-stack development with React and Node.js.' }
          ],
          education: [
            { id: '1', institution: 'Stanford University', degree: 'Master of Science', fieldOfStudy: 'Computer Science', duration: '2016-2018' },
            { id: '2', institution: 'UC Berkeley', degree: 'Bachelor of Science', fieldOfStudy: 'Computer Science', duration: '2012-2016' }
          ],
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
        },
        {
          id: '2',
          name: 'Michael Chen',
          title: 'Product Manager',
          company: 'Innovation Labs',
          avatar: require('@/assets/images/profile-pictures/image-02.webp'),
          bannerImage: require('@/assets/images/banner-images/banner-02.jpg'),
          mutualConnections: 8,
          isOnline: false,
          isPending: false,
          isSuggested: false,
          isConnected: true,
          isPendingReceived: false,
          location: 'New York, NY',
          about: 'Product manager with expertise in user experience and market analysis.',
          experience: [
            { id: '1', title: 'Product Manager', company: 'Innovation Labs', duration: '2021-Present', description: 'Leading product strategy and development.' },
            { id: '2', title: 'Associate PM', company: 'TechStartup', duration: '2019-2021', description: 'Managed feature development and user research.' }
          ],
          education: [
            { id: '1', institution: 'Harvard Business School', degree: 'MBA', fieldOfStudy: 'Business Administration', duration: '2017-2019' },
            { id: '2', institution: 'MIT', degree: 'Bachelor of Science', fieldOfStudy: 'Engineering', duration: '2013-2017' }
          ],
          skills: ['Product Management', 'UX Design', 'Analytics', 'Strategy'],
        },
        {
          id: '3',
          name: 'Emily Rodriguez',
          title: 'UX Designer',
          company: 'Design Studio',
          avatar: require('@/assets/images/profile-pictures/image-03.jpg'),
          bannerImage: require('@/assets/images/banner-images/banner-03.jpg'),
          mutualConnections: 12,
          isOnline: true,
          isPending: true,
          isSuggested: false,
          isConnected: false,
          isPendingReceived: true, // Current user received this request
          location: 'Los Angeles, CA',
          about: 'Creative UX designer focused on user-centered design solutions.',
          experience: [
            { id: '1', title: 'UX Designer', company: 'Design Studio', duration: '2022-Present', description: 'Creating user-centered design solutions.' },
            { id: '2', title: 'UI Designer', company: 'Creative Agency', duration: '2020-2022', description: 'Designed interfaces for web and mobile apps.' }
          ],
          education: [
            { id: '1', institution: 'ArtCenter College of Design', degree: 'Bachelor of Fine Arts', fieldOfStudy: 'Graphic Design', duration: '2016-2020' }
          ],
          skills: ['UX Design', 'UI Design', 'Figma', 'Adobe Creative Suite', 'Prototyping'],
        },
        {
          id: '4',
          name: 'David Kim',
          title: 'Data Scientist',
          company: 'Analytics Corp',
          avatar: require('@/assets/images/profile-pictures/image-04.jpeg'),
          bannerImage: require('@/assets/images/banner-images/banner-04.jpg'),
          mutualConnections: 6,
          isOnline: false,
          isPending: true,
          isSuggested: false,
          isConnected: false,
          isPendingReceived: false, // Current user sent this request
          location: 'Seattle, WA',
          about: 'Data scientist specializing in machine learning and predictive analytics.',
          experience: [
            { id: '1', title: 'Data Scientist', company: 'Analytics Corp', duration: '2021-Present', description: 'Developing ML models for business insights.' },
            { id: '2', title: 'Data Analyst', company: 'Tech Company', duration: '2019-2021', description: 'Analyzed user behavior and business metrics.' }
          ],
          education: [
            { id: '1', institution: 'University of Washington', degree: 'Master of Science', fieldOfStudy: 'Data Science', duration: '2017-2019' },
            { id: '2', institution: 'University of California', degree: 'Bachelor of Science', fieldOfStudy: 'Statistics', duration: '2013-2017' }
          ],
          skills: ['Python', 'Machine Learning', 'SQL', 'R', 'Statistics'],
        },
        {
          id: '5',
          name: 'Lisa Wang',
          title: 'Marketing Director',
          company: 'Global Marketing',
          avatar: require('@/assets/images/profile-pictures/image-05.avif'),
          bannerImage: require('@/assets/images/banner-images/banner-05.jpg'),
          mutualConnections: 3,
          isOnline: true,
          isPending: false,
          isSuggested: true,
          isConnected: false,
          isPendingReceived: false,
          location: 'Chicago, IL',
          about: 'Strategic marketing professional with 10+ years of experience.',
          experience: [
            { id: '1', title: 'Marketing Director', company: 'Global Marketing', duration: '2020-Present', description: 'Leading marketing strategy and campaigns.' },
            { id: '2', title: 'Senior Marketing Manager', company: 'Brand Agency', duration: '2018-2020', description: 'Managed brand campaigns and digital marketing.' }
          ],
          education: [
            { id: '1', institution: 'Northwestern University', degree: 'Master of Science', fieldOfStudy: 'Integrated Marketing Communications', duration: '2016-2018' },
            { id: '2', institution: 'University of Illinois', degree: 'Bachelor of Science', fieldOfStudy: 'Marketing', duration: '2012-2016' }
          ],
          skills: ['Digital Marketing', 'Brand Strategy', 'Social Media', 'Analytics'],
        },
        {
          id: '6',
          name: 'Alex Thompson',
          title: 'DevOps Engineer',
          company: 'Cloud Solutions',
          avatar: require('@/assets/images/profile-pictures/image-06.webp'),
          bannerImage: require('@/assets/images/banner-images/banner-06.jpg'),
          mutualConnections: 9,
          isOnline: false,
          isPending: false,
          isSuggested: true,
          isConnected: false,
          isPendingReceived: false,
          location: 'Austin, TX',
          about: 'DevOps engineer passionate about automation and cloud infrastructure.',
          experience: [
            { id: '1', title: 'DevOps Engineer', company: 'Cloud Solutions', duration: '2021-Present', description: 'Managing cloud infrastructure and CI/CD pipelines.' },
            { id: '2', title: 'System Administrator', company: 'Tech Startup', duration: '2019-2021', description: 'Maintained server infrastructure and deployments.' }
          ],
          education: [
            { id: '1', institution: 'University of Texas', degree: 'Bachelor of Science', fieldOfStudy: 'Computer Science', duration: '2015-2019' }
          ],
          skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Linux'],
        },
        {
          id: '7',
          name: 'Rachel Green',
          title: 'Content Strategist',
          company: 'Content Studio',
          avatar: require('@/assets/images/profile-pictures/image-07.jpg'),
          bannerImage: require('@/assets/images/banner-images/banner-07.jpg'),
          mutualConnections: 4,
          isOnline: true,
          isPending: false,
          isSuggested: true,
          isConnected: false,
          isPendingReceived: false,
          location: 'Portland, OR',
          about: 'Content strategist helping brands tell compelling stories.',
          experience: [
            { id: '1', title: 'Content Strategist', company: 'Content Studio', duration: '2022-Present', description: 'Developing content strategies for brands.' },
            { id: '2', title: 'Content Writer', company: 'Digital Agency', duration: '2020-2022', description: 'Created engaging content for various clients.' }
          ],
          education: [
            { id: '1', institution: 'University of Oregon', degree: 'Bachelor of Arts', fieldOfStudy: 'English', duration: '2016-2020' }
          ],
          skills: ['Content Strategy', 'Copywriting', 'SEO', 'Social Media', 'Branding'],
        },
        {
          id: '8',
          name: 'James Wilson',
          title: 'Sales Manager',
          company: 'Enterprise Sales',
          avatar: require('@/assets/images/profile-pictures/image-01.jpg'),
          bannerImage: require('@/assets/images/banner-images/banner-01.jpg'),
          mutualConnections: 7,
          isOnline: false,
          isPending: false,
          isSuggested: true,
          isConnected: false,
          isPendingReceived: false,
          location: 'Denver, CO',
          about: 'Experienced sales professional with a track record of exceeding targets.',
          experience: [
            { id: '1', title: 'Sales Manager', company: 'Enterprise Sales', duration: '2021-Present', description: 'Leading sales team and managing key accounts.' },
            { id: '2', title: 'Senior Sales Representative', company: 'Tech Company', duration: '2019-2021', description: 'Exceeded sales targets and built client relationships.' }
          ],
          education: [
            { id: '1', institution: 'University of Colorado', degree: 'Bachelor of Science', fieldOfStudy: 'Business Administration', duration: '2015-2019' }
          ],
          skills: ['Sales Management', 'Account Management', 'CRM', 'Negotiation', 'Client Relations'],
        }
      ];
      
      // Separate connections by status
      const connectedUsers = mockUsers.filter(conn => conn.isConnected);
      const pendingUsers = mockUsers.filter(conn => conn.isPending);
      const suggestedUsers = mockUsers.filter(conn => conn.isSuggested);
      
      setConnections(connectedUsers);
      setPendingRequests(pendingUsers);
      setSuggestions(suggestedUsers);
      
      // Update network stats with realistic LinkedIn-style data
      setNetworkStats({
        totalConnections: connectedUsers.length,
        pendingRequests: pendingUsers.length,
        newConnections: Math.floor(Math.random() * 5) + 1, // 1-5 new connections this week
        profileViews: Math.floor(Math.random() * 20) + 5, // 5-25 profile views this week
      });
      
      console.log('NetworkScreen - Mock network data loaded successfully');
      console.log('NetworkScreen - Connected:', connectedUsers.length);
      console.log('NetworkScreen - Pending:', pendingUsers.length);
      console.log('NetworkScreen - Suggested:', suggestedUsers.length);
      
    } catch (error) {
      console.error('NetworkScreen - Failed to load mock network data:', error);
      setSnackbar({ visible: true, message: 'Failed to load network data', type: 'error' });
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
      
      // Mock search data - filter from our mock users
      const mockUsers: Connection[] = [
        {
          id: '1',
          name: 'Sarah Johnson',
          title: 'Senior Software Engineer',
          company: 'TechCorp Inc.',
          avatar: require('@/assets/images/profile-pictures/image-01.jpg'),
          bannerImage: require('@/assets/images/banner-images/banner-01.jpg'),
          mutualConnections: 15,
          isOnline: true,
          isPending: false,
          isSuggested: true,
          isConnected: false,
          isPendingReceived: false,
          location: 'San Francisco, CA',
          about: 'Experienced software engineer passionate about building scalable applications.',
          experience: [
            { id: '1', title: 'Senior Software Engineer', company: 'TechCorp Inc.', duration: '2020-Present', description: 'Leading development of cloud-based solutions.' },
            { id: '2', title: 'Software Engineer', company: 'StartupXYZ', duration: '2018-2020', description: 'Full-stack development with React and Node.js.' }
          ],
          education: [
            { id: '1', institution: 'Stanford University', degree: 'Master of Science', fieldOfStudy: 'Computer Science', duration: '2016-2018' },
            { id: '2', institution: 'UC Berkeley', degree: 'Bachelor of Science', fieldOfStudy: 'Computer Science', duration: '2012-2016' }
          ],
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
        },
        {
          id: '2',
          name: 'Michael Chen',
          title: 'Product Manager',
          company: 'Innovation Labs',
          avatar: require('@/assets/images/profile-pictures/image-02.webp'),
          bannerImage: require('@/assets/images/banner-images/banner-02.jpg'),
          mutualConnections: 8,
          isOnline: false,
          isPending: false,
          isSuggested: true,
          isConnected: false,
          isPendingReceived: false,
          location: 'New York, NY',
          about: 'Product manager with expertise in user experience and market analysis.',
          experience: [
            { id: '1', title: 'Product Manager', company: 'Innovation Labs', duration: '2021-Present', description: 'Leading product strategy and development.' },
            { id: '2', title: 'Associate PM', company: 'TechStartup', duration: '2019-2021', description: 'Managed feature development and user research.' }
          ],
          education: [
            { id: '1', institution: 'Harvard Business School', degree: 'MBA', fieldOfStudy: 'Business Administration', duration: '2017-2019' },
            { id: '2', institution: 'MIT', degree: 'Bachelor of Science', fieldOfStudy: 'Engineering', duration: '2013-2017' }
          ],
          skills: ['Product Management', 'UX Design', 'Analytics', 'Strategy'],
        },
        {
          id: '5',
          name: 'Lisa Wang',
          title: 'Marketing Director',
          company: 'Global Marketing',
          avatar: require('@/assets/images/profile-pictures/image-05.avif'),
          bannerImage: require('@/assets/images/banner-images/banner-05.jpg'),
          mutualConnections: 3,
          isOnline: true,
          isPending: false,
          isSuggested: true,
          isConnected: false,
          isPendingReceived: false,
          location: 'Chicago, IL',
          about: 'Strategic marketing professional with 10+ years of experience.',
          experience: [
            { id: '1', title: 'Marketing Director', company: 'Global Marketing', duration: '2020-Present', description: 'Leading marketing strategy and campaigns.' },
            { id: '2', title: 'Senior Marketing Manager', company: 'Brand Agency', duration: '2018-2020', description: 'Managed brand campaigns and digital marketing.' }
          ],
          education: [
            { id: '1', institution: 'Northwestern University', degree: 'Master of Science', fieldOfStudy: 'Integrated Marketing Communications', duration: '2016-2018' },
            { id: '2', institution: 'University of Illinois', degree: 'Bachelor of Science', fieldOfStudy: 'Marketing', duration: '2012-2016' }
          ],
          skills: ['Digital Marketing', 'Brand Strategy', 'Social Media', 'Analytics'],
        },
        {
          id: '6',
          name: 'Alex Thompson',
          title: 'DevOps Engineer',
          company: 'Cloud Solutions',
          avatar: require('@/assets/images/profile-pictures/image-06.webp'),
          bannerImage: require('@/assets/images/banner-images/banner-06.jpg'),
          mutualConnections: 9,
          isOnline: false,
          isPending: false,
          isSuggested: true,
          isConnected: false,
          isPendingReceived: false,
          location: 'Austin, TX',
          about: 'DevOps engineer passionate about automation and cloud infrastructure.',
          experience: [
            { id: '1', title: 'DevOps Engineer', company: 'Cloud Solutions', duration: '2021-Present', description: 'Managing cloud infrastructure and CI/CD pipelines.' },
            { id: '2', title: 'System Administrator', company: 'Tech Startup', duration: '2019-2021', description: 'Maintained server infrastructure and deployments.' }
          ],
          education: [
            { id: '1', institution: 'University of Texas', degree: 'Bachelor of Science', fieldOfStudy: 'Computer Science', duration: '2015-2019' }
          ],
          skills: ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Linux'],
        },
        {
          id: '7',
          name: 'Rachel Green',
          title: 'Content Strategist',
          company: 'Content Studio',
          avatar: require('@/assets/images/profile-pictures/image-07.jpg'),
          bannerImage: require('@/assets/images/banner-images/banner-07.jpg'),
          mutualConnections: 4,
          isOnline: true,
          isPending: false,
          isSuggested: true,
          isConnected: false,
          isPendingReceived: false,
          location: 'Portland, OR',
          about: 'Content strategist helping brands tell compelling stories.',
          experience: [
            { id: '1', title: 'Content Strategist', company: 'Content Studio', duration: '2022-Present', description: 'Developing content strategies for brands.' },
            { id: '2', title: 'Content Writer', company: 'Digital Agency', duration: '2020-2022', description: 'Created engaging content for various clients.' }
          ],
          education: [
            { id: '1', institution: 'University of Oregon', degree: 'Bachelor of Arts', fieldOfStudy: 'English', duration: '2016-2020' }
          ],
          skills: ['Content Strategy', 'Copywriting', 'SEO', 'Social Media', 'Branding'],
        },
        {
          id: '8',
          name: 'James Wilson',
          title: 'Sales Manager',
          company: 'Enterprise Sales',
          avatar: require('@/assets/images/profile-pictures/image-01.jpg'),
          bannerImage: require('@/assets/images/banner-images/banner-01.jpg'),
          mutualConnections: 7,
          isOnline: false,
          isPending: false,
          isSuggested: true,
          isConnected: false,
          isPendingReceived: false,
          location: 'Denver, CO',
          about: 'Experienced sales professional with a track record of exceeding targets.',
          experience: [
            { id: '1', title: 'Sales Manager', company: 'Enterprise Sales', duration: '2021-Present', description: 'Leading sales team and managing key accounts.' },
            { id: '2', title: 'Senior Sales Representative', company: 'Tech Company', duration: '2019-2021', description: 'Exceeded sales targets and built client relationships.' }
          ],
          education: [
            { id: '1', institution: 'University of Colorado', degree: 'Bachelor of Science', fieldOfStudy: 'Business Administration', duration: '2015-2019' }
          ],
          skills: ['Sales Management', 'Account Management', 'CRM', 'Negotiation', 'Client Relations'],
        }
      ];
      
      // Filter mock users based on search query
      const searchResults = mockUsers.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.title.toLowerCase().includes(query.toLowerCase()) ||
        user.company.toLowerCase().includes(query.toLowerCase()) ||
        user.location.toLowerCase().includes(query.toLowerCase()) ||
        user.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
      );
      
      // Filter out current user from search results
      const filteredResults = searchResults.filter(user => {
        const currentUserId = userProfile.id?.toString();
        const userId = user.id?.toString();
        const isCurrentUser = currentUserId && userId && currentUserId === userId;
        
        if (isCurrentUser) {
          console.log(`NetworkScreen - Filtering out current user from search: ${user.name} (ID: ${userId})`);
        }
        
        return !isCurrentUser;
      });
      
      setSuggestions(filteredResults);
      console.log('NetworkScreen - Search results:', filteredResults.length);
      console.log('NetworkScreen - Current user ID:', userProfile.id);
      console.log('NetworkScreen - Filtered out current user from search results');
      
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

  const handleAccept = async (connectionId: string) => {
    if (!userProfile.id || isProcessingConnection) return;
    
    setIsProcessingConnection(connectionId);
    try {
      const pendingConnection = pendingRequests.find(conn => conn.id === connectionId);
      if (pendingConnection && pendingConnection.isPendingReceived) {
        console.log('NetworkScreen - Accepting connection request from:', connectionId);
        
        // Mock API call - simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update local state - move to connected
        const updatedConnection = { 
          ...pendingConnection, 
          isPending: false, 
          isConnected: true,
          isPendingReceived: false,
        };
        
        // Remove from pending and add to connections
        setPendingRequests(prev => prev.filter(conn => conn.id !== connectionId));
        setConnections(prev => [...prev, updatedConnection]);
        
        // Update network stats
        setNetworkStats(prev => ({
          ...prev,
          totalConnections: prev.totalConnections + 1,
          pendingRequests: prev.pendingRequests - 1,
          newConnections: prev.newConnections + 1,
        }));
        
        setSnackbar({ visible: true, message: 'Connection accepted!', type: 'success' });
        console.log('NetworkScreen - Connection accepted successfully');
      }
    } catch (error) {
      console.error('NetworkScreen - Failed to accept connection:', error);
      setSnackbar({ visible: true, message: 'Failed to accept connection', type: 'error' });
    } finally {
      setIsProcessingConnection(null);
    }
  };

  const handleIgnore = async (connectionId: string) => {
    if (!userProfile.id || isProcessingConnection) return;
    
    setIsProcessingConnection(connectionId);
    try {
      const pendingConnection = pendingRequests.find(conn => conn.id === connectionId);
      if (pendingConnection && pendingConnection.isPendingReceived) {
        console.log('NetworkScreen - Rejecting connection:', connectionId);
        
        // Mock API call - simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove from pending requests
        setPendingRequests(prev => prev.filter(conn => conn.id !== connectionId));
        
        // Update network stats
        setNetworkStats(prev => ({
          ...prev,
          pendingRequests: prev.pendingRequests - 1,
        }));
        
        setSnackbar({ visible: true, message: 'Connection ignored', type: 'info' });
        console.log('NetworkScreen - Connection rejected successfully');
      }
    } catch (error) {
      console.error('NetworkScreen - Failed to reject connection:', error);
      setSnackbar({ visible: true, message: 'Failed to reject connection', type: 'error' });
    } finally {
      setIsProcessingConnection(null);
    }
  };

  const handleConnect = async (connectionId: string) => {
    if (!userProfile.id || isProcessingConnection) return;
    
    setIsProcessingConnection(connectionId);
    try {
      const suggestedConnection = suggestions.find(conn => conn.id === connectionId);
      if (suggestedConnection) {
        console.log('NetworkScreen - Sending connection request to:', connectionId);
        console.log('NetworkScreen - Current user ID:', userProfile.id);
        console.log('NetworkScreen - Target user ID:', connectionId);
        
        // Validate that we're not trying to connect to ourselves
        if (userProfile.id.toString() === connectionId) {
          console.log('NetworkScreen - Cannot connect to yourself');
          setSnackbar({ visible: true, message: 'You cannot connect to yourself', type: 'error' });
          return;
        }
        
        // Mock API call - simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update local state - move to pending
        const updatedConnection = { 
          ...suggestedConnection, 
          isSuggested: false, 
          isPending: true,
          isPendingReceived: false, // Current user sent the request
          connectionId: Math.floor(Math.random() * 1000) + 1, // Mock connection ID
        };
        
        // Remove from suggestions and add to pending
        setSuggestions(prev => prev.filter(conn => conn.id !== connectionId));
        setPendingRequests(prev => [...prev, updatedConnection]);
        
        // Update network stats
        setNetworkStats(prev => ({
          ...prev,
          pendingRequests: prev.pendingRequests + 1,
        }));
        
        setSnackbar({ visible: true, message: 'Connection request sent!', type: 'success' });
        console.log('NetworkScreen - Connection request sent successfully');
      }
    } catch (error) {
      console.error('NetworkScreen - Failed to send connection request:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to send connection request';
      if (error instanceof Error) {
        if (error.message.includes('Network request failed')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('already exists')) {
          errorMessage = 'Connection request already sent to this user.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setSnackbar({ visible: true, message: errorMessage, type: 'error' });
    } finally {
      setIsProcessingConnection(null);
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
      avatar: connection.avatar, // Keep the require() statement as is
      profilePictureUrl: connection.avatar, // Add this for ProfileScreen compatibility
      headerImage: connection.bannerImage, // Use the banner image from connection
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
    
    console.log('NetworkScreen - Opening profile for:', connection.name);
    console.log('NetworkScreen - Profile data:', profileData);
    console.log('NetworkScreen - Avatar:', connection.avatar);
    console.log('NetworkScreen - Banner image:', connection.bannerImage);
    
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
      isProcessing={isProcessingConnection === item.id}
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

      {/* Profile Completion Prompt for Incomplete Profiles */}
      {createdProfile && (!createdProfile.firstName || createdProfile.firstName.trim() === '') && (
        <View style={[styles.profileCompletionPrompt, { backgroundColor: theme.primaryColor + '15', borderColor: theme.primaryColor }]}>
          <View style={styles.profileCompletionContent}>
            <MaterialCommunityIcons name="account-edit" size={24} color={theme.primaryColor} />
            <View style={styles.profileCompletionText}>
              <Text style={[styles.profileCompletionTitle, { color: theme.primaryColor }]}>
                Complete your profile
              </Text>
              <Text style={[styles.profileCompletionSubtitle, { color: theme.textSecondaryColor }]}>
                Add your name and details to grow your network
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={[styles.completeProfileButton, { backgroundColor: theme.primaryColor }]}
            onPress={() => setShowMyProfileModal(true)}
          >
            <Text style={[styles.completeProfileButtonText, { color: 'white' }]}>
              Complete Profile
            </Text>
          </TouchableOpacity>
        </View>
      )}

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
  profileCompletionPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  profileCompletionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileCompletionText: {
    marginLeft: 12,
  },
  profileCompletionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  profileCompletionSubtitle: {
    fontSize: 12,
  },
  completeProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  completeProfileButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 