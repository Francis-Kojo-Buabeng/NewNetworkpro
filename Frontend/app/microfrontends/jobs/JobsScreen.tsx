import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState, useMemo } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Modal,
  TouchableOpacity,
} from 'react-native';
import ProfileModal from '../../../components/ProfileModal';
import NotificationModal from '../../../components/NotificationModal';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import { useProfile } from '../../../contexts/ProfileContext';
import {
  CompanyModal,
  CompanyProfile,
  Job,
  JobCard,
  JobFilters,
  JobSearchHeader
} from './components';
import Sidebar from '../home/Sidebar';
import MyProfileScreen from '../profile/MyProfileScreen';
// Removed invalid import of useProfileContext due to lint error

const { width } = Dimensions.get('window');

// Company logo mapping
const getCompanyLogo = (companyName: string) => {
  const logoMap: { [key: string]: any } = {
    'Google': require('@/assets/images/company-logos/Google-logo.webp'),
    'Apple': require('@/assets/images/company-logos/Apple-logo.png'),
    'Microsoft': require('@/assets/images/company-logos/Microsoft-logo.png'),
    'Amazon': require('@/assets/images/company-logos/amazon-logo.webp'),
    'Netflix': require('@/assets/images/company-logos/Netflix-logo.png'),
    'Meta': require('@/assets/images/company-logos/Meta-logo.png'),
  };
  
  return logoMap[companyName] || require('@/assets/images/default-avator.jpg');
};

// Mock data
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior React Native Developer',
    company: 'Google',
    location: 'San Francisco, CA',
    salary: '$150k - $200k',
    type: 'Full-time',
    postedDate: '2 days ago',
    logo: getCompanyLogo('Google'),
    description: 'Join Google\'s mobile team to build innovative apps used by billions of users worldwide...',
    requirements: ['React Native', 'TypeScript', '5+ years experience', 'Mobile development', 'Google Cloud', 'Performance optimization'],
    isSaved: false,
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'Apple',
    location: 'Cupertino, CA',
    salary: '$140k - $180k',
    type: 'Full-time',
    postedDate: '1 week ago',
    logo: getCompanyLogo('Apple'),
    description: 'Lead product strategy for Apple\'s next-generation mobile applications...',
    requirements: ['Product management', 'iOS development', '5+ years experience', 'User experience', 'Analytics'],
    isSaved: true,
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    company: 'Microsoft',
    location: 'Seattle, WA',
    salary: '$120k - $160k',
    type: 'Full-time',
    postedDate: '3 days ago',
    logo: getCompanyLogo('Microsoft'),
    description: 'Design beautiful interfaces for Microsoft\'s suite of productivity applications...',
    requirements: ['Figma', 'Adobe Creative Suite', 'Design systems', 'User research', 'Accessibility'],
    isSaved: false,
  },
  {
    id: '4',
    title: 'Backend Developer',
    company: 'Amazon',
    location: 'Seattle, WA',
    salary: '$130k - $170k',
    type: 'Full-time',
    postedDate: '5 days ago',
    logo: getCompanyLogo('Amazon'),
    description: 'Build scalable AWS services that power Amazon\'s global infrastructure...',
    requirements: ['Java', 'Python', 'AWS', 'Microservices', 'Database design', 'Cloud architecture'],
    isSaved: false,
  },
  {
    id: '5',
    title: 'Data Scientist',
    company: 'Netflix',
    location: 'Los Gatos, CA',
    salary: '$140k - $190k',
    type: 'Full-time',
    postedDate: '1 day ago',
    logo: getCompanyLogo('Netflix'),
    description: 'Develop machine learning algorithms to personalize Netflix recommendations...',
    requirements: ['Python', 'Machine Learning', 'TensorFlow', 'Big Data', 'Statistics', 'A/B Testing'],
    isSaved: false,
  },
  {
    id: '6',
    title: 'Frontend Engineer',
    company: 'Meta',
    location: 'Menlo Park, CA',
    salary: '$130k - $180k',
    type: 'Full-time',
    postedDate: '4 days ago',
    logo: getCompanyLogo('Meta'),
    description: 'Build the next generation of social media experiences for billions of users...',
    requirements: ['React', 'JavaScript', 'TypeScript', 'Performance optimization', 'Web technologies'],
    isSaved: true,
  },
];

const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];
const locations = ['All', 'Remote', 'San Francisco', 'New York', 'Austin', 'Los Angeles'];

interface JobsScreenProps {
  userAvatar?: string | null;
  createdProfile?: any;
}

export default function JobsScreen({ userAvatar, createdProfile }: JobsScreenProps) {
  const theme = useCurrentTheme();
  const { avatarUrl, profileData } = useProfile();
  const [selectedJobType, setSelectedJobType] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [companyModalVisible, setCompanyModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showMyProfileModal, setShowMyProfileModal] = useState(false);

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

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  // Company profile data
  const companyProfiles: { [key: string]: CompanyProfile } = {
    'Google': {
      id: '1',
      name: 'Google',
      logo: require('@/assets/images/company-logos/Google-logo.webp'),
      industry: 'Technology',
      size: '100,000+ employees',
      location: 'Mountain View, CA',
      founded: '1998',
      description: 'Google is a multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, search engine, cloud computing, software, and hardware.',
      website: 'google.com',
      activeJobs: 15,
      employeeCount: '156,500+',
      revenue: '$307.4B',
      specialties: ['Search Engine', 'Cloud Computing', 'AI/ML', 'Mobile Technology'],
      benefits: ['Health Insurance', '401k Matching', 'Free Meals', 'Flexible Work'],
      recentJobs: mockJobs.filter(job => job.company === 'Google')
    },
    'Apple': {
      id: '2',
      name: 'Apple',
      logo: require('@/assets/images/company-logos/Apple-logo.png'),
      industry: 'Technology',
      size: '164,000+ employees',
      location: 'Cupertino, CA',
      founded: '1976',
      description: 'Apple Inc. is an American multinational technology company that specializes in consumer electronics, computer software, and online services.',
      website: 'apple.com',
      activeJobs: 8,
      employeeCount: '164,000+',
      revenue: '$394.3B',
      specialties: ['Consumer Electronics', 'Software Development', 'Design', 'Retail'],
      benefits: ['Health Insurance', '401k Matching', 'Employee Discount', 'Stock Options'],
      recentJobs: mockJobs.filter(job => job.company === 'Apple')
    },
    'Microsoft': {
      id: '3',
      name: 'Microsoft',
      logo: require('@/assets/images/company-logos/Microsoft-logo.png'),
      industry: 'Technology',
      size: '221,000+ employees',
      location: 'Redmond, WA',
      founded: '1975',
      description: 'Microsoft Corporation is an American multinational technology company which produces computer software, consumer electronics, personal computers, and related services.',
      website: 'microsoft.com',
      activeJobs: 12,
      employeeCount: '221,000+',
      revenue: '$198.3B',
      specialties: ['Software Development', 'Cloud Computing', 'Gaming', 'AI/ML'],
      benefits: ['Health Insurance', '401k Matching', 'Flexible Work', 'Learning Budget'],
      recentJobs: mockJobs.filter(job => job.company === 'Microsoft')
    },
    'Amazon': {
      id: '4',
      name: 'Amazon',
      logo: require('@/assets/images/company-logos/amazon-logo.webp'),
      industry: 'E-commerce & Technology',
      size: '1,608,000+ employees',
      location: 'Seattle, WA',
      founded: '1994',
      description: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
      website: 'amazon.com',
      activeJobs: 20,
      employeeCount: '1,608,000+',
      revenue: '$514.0B',
      specialties: ['E-commerce', 'Cloud Computing', 'Logistics', 'AI/ML'],
      benefits: ['Health Insurance', '401k Matching', 'Stock Options', 'Career Growth'],
      recentJobs: mockJobs.filter(job => job.company === 'Amazon')
    },
    'Netflix': {
      id: '5',
      name: 'Netflix',
      logo: require('@/assets/images/company-logos/Netflix-logo.png'),
      industry: 'Entertainment & Technology',
      size: '12,000+ employees',
      location: 'Los Gatos, CA',
      founded: '1997',
      description: 'Netflix, Inc. is an American subscription streaming service and production company. It offers a library of films and television series.',
      website: 'netflix.com',
      activeJobs: 6,
      employeeCount: '12,000+',
      revenue: '$31.6B',
      specialties: ['Streaming', 'Content Production', 'Recommendation Systems', 'Data Science'],
      benefits: ['Health Insurance', 'Unlimited PTO', 'Flexible Work', 'Content Budget'],
      recentJobs: mockJobs.filter(job => job.company === 'Netflix')
    },
    'Meta': {
      id: '6',
      name: 'Meta',
      logo: require('@/assets/images/company-logos/Meta-logo.png'),
      industry: 'Technology & Social Media',
      size: '86,482+ employees',
      location: 'Menlo Park, CA',
      founded: '2004',
      description: 'Meta Platforms, Inc. is an American multinational technology conglomerate. It owns Facebook, Instagram, WhatsApp, and other products.',
      website: 'meta.com',
      activeJobs: 10,
      employeeCount: '86,482+',
      revenue: '$116.6B',
      specialties: ['Social Media', 'Virtual Reality', 'AI/ML', 'Mobile Apps'],
      benefits: ['Health Insurance', '401k Matching', 'Free Food', 'VR Equipment'],
      recentJobs: mockJobs.filter(job => job.company === 'Meta')
    },
  };

  const handleCompanyPress = (companyName: string) => {
    const company = companyProfiles[companyName];
    if (company) {
      setSelectedCompany(company);
      setCompanyModalVisible(true);
    }
  };

  const handleProfilePress = (user: any) => {
    setSelectedProfile(user);
    setProfileModalVisible(true);
  };

  const toggleSaveJob = (jobId: string) => {
    // This function is not used in the current mock data, so it will not modify the state.
    // If you were to integrate with a real backend, you would update the job's isSaved status.
  };

  const handleApply = (jobId: string) => {
    console.log('Applying to job:', jobId);
  };

  const filteredJobs = mockJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedJobType === 'All' || job.type === selectedJobType;
    const matchesLocation =
      selectedLocation === 'All'
        ? true
        : selectedLocation === 'Remote'
          ? job.location.includes('Remote')
          : job.location.includes(selectedLocation);
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const renderJobCard = ({ item }: { item: Job }) => (
    <JobCard
      job={item}
      onCompanyPress={handleCompanyPress}
      onSaveToggle={toggleSaveJob}
      onApply={handleApply}
      onAvatarPress={() => handleProfilePress({
        id: item.id,
        name: item.company,
        title: item.title,
        company: item.company,
        avatar: item.logo,
        mutualConnections: 0,
        isOnline: false,
        isConnected: false,
        isPending: false,
        location: item.location,
        about: item.description,
        experience: [],
        education: [],
        skills: item.requirements || [],
      })}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <JobSearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFilterToggle={() => setShowFilters(!showFilters)}
        onProfilePress={() => setShowMyProfileModal(true)}
        userAvatar={userAvatar}
        showFilters={showFilters}
        onNotificationPress={() => setNotificationModalVisible(true)}
      />

      {/* Filters */}
      {showFilters && (
        <JobFilters
          jobTypes={jobTypes}
          locations={locations}
          selectedJobType={selectedJobType}
          selectedLocation={selectedLocation}
          onJobTypeChange={setSelectedJobType}
          onLocationChange={setSelectedLocation}
        />
      )}

      {/* Job Listings */}
      <FlatList
        data={filteredJobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.jobsList}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <Text style={[styles.resultsCount, { color: theme.textSecondaryColor }]}>
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="briefcase-outline" size={64} color={theme.textTertiaryColor} />
            <Text style={[styles.emptyStateTitle, { color: theme.textColor }]}>No jobs found</Text>
            <Text style={[styles.emptyStateSubtitle, { color: theme.textSecondaryColor }]}>
              Try adjusting your search criteria or filters
            </Text>
          </View>
        }
      />

      {/* Profile Modal */}
      {selectedProfile && (
        <ProfileModal
          visible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
          profile={selectedProfile}
        />
      )}

      {/* Company Modal */}
      <CompanyModal
        visible={companyModalVisible}
        onClose={() => setCompanyModalVisible(false)}
        company={selectedCompany}
      />

      {/* Notification Modal */}
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
  jobsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultsCount: {
    fontSize: 14,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
}); 