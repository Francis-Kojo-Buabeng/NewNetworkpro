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
  Alert,
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
import Snackbar from '../../../components/Snackbar';

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
    description: 'Analyze user behavior and content preferences to improve Netflix\'s recommendation system...',
    requirements: ['Python', 'Machine Learning', 'SQL', 'Statistics', 'Big Data', 'A/B Testing'],
    isSaved: false,
  },
  {
    id: '6',
    title: 'Frontend Developer',
    company: 'Meta',
    location: 'Menlo Park, CA',
    salary: '$130k - $180k',
    type: 'Full-time',
    postedDate: '4 days ago',
    logo: getCompanyLogo('Meta'),
    description: 'Build engaging user interfaces for Meta\'s social media platforms...',
    requirements: ['React', 'JavaScript', 'CSS', 'Web development', 'Performance optimization', 'Accessibility'],
    isSaved: false,
  },
  {
    id: '7',
    title: 'DevOps Engineer',
    company: 'Google',
    location: 'Mountain View, CA',
    salary: '$140k - $190k',
    type: 'Full-time',
    postedDate: '6 days ago',
    logo: getCompanyLogo('Google'),
    description: 'Manage Google\'s cloud infrastructure and deployment pipelines...',
    requirements: ['Docker', 'Kubernetes', 'Google Cloud', 'CI/CD', 'Linux', 'Monitoring'],
    isSaved: false,
  },
  {
    id: '8',
    title: 'Mobile Developer',
    company: 'Apple',
    location: 'Cupertino, CA',
    salary: '$130k - $170k',
    type: 'Full-time',
    postedDate: '2 weeks ago',
    logo: getCompanyLogo('Apple'),
    description: 'Develop native iOS applications for Apple\'s ecosystem...',
    requirements: ['Swift', 'Objective-C', 'iOS development', 'Xcode', 'Core Data', 'App Store'],
    isSaved: false,
  },
];

interface JobsScreenProps {
  userAvatar?: string | null;
  createdProfile?: any;
}

export default function JobsScreen({ userAvatar, createdProfile }: JobsScreenProps) {
  const theme = useCurrentTheme();
  const { updateAvatar } = useProfile();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJobType, setSelectedJobType] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [showMyProfileModal, setShowMyProfileModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [companyModalVisible, setCompanyModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  
  // Job state management
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set(['2'])); // Job 2 is pre-saved
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });
  const [isProcessingJob, setIsProcessingJob] = useState<string | null>(null);

  // Job types and locations for filters
  const jobTypes = ['All', 'Full-time', 'Part-time', 'Contract', 'Internship'];
  const locations = ['All', 'Remote', 'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Los Angeles, CA'];

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCompanyPress = (companyName: string) => {
    const companyData: CompanyProfile = {
      id: companyName.toLowerCase(),
      name: companyName,
      logo: getCompanyLogo(companyName),
      description: `${companyName} is a leading technology company focused on innovation and growth.`,
      industry: 'Technology',
      size: '10,000+ employees',
      founded: '1990s',
      location: 'Various locations',
      website: `https://www.${companyName.toLowerCase()}.com`,
      activeJobs: Math.floor(Math.random() * 50) + 10,
      employeeCount: '10,000+',
      revenue: '$10B+',
      specialties: ['Software Development', 'Cloud Computing', 'AI/ML', 'Mobile Apps'],
      benefits: ['Health Insurance', '401k Matching', 'Flexible Work', 'Learning Budget'],
      recentJobs: mockJobs.filter(job => job.company === companyName),
    };
    
    setSelectedCompany(companyData);
    setCompanyModalVisible(true);
  };

  const handleProfilePress = (user: any) => {
    setSelectedProfile(user);
    setProfileModalVisible(true);
  };

  // Functional save job toggle
  const toggleSaveJob = async (jobId: string) => {
    if (isProcessingJob) return; // Prevent multiple simultaneous actions
    
    setIsProcessingJob(jobId);
    console.log('Toggling save for job:', jobId);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newSavedJobs = new Set(savedJobs);
      const job = jobs.find(j => j.id === jobId);
      
      if (newSavedJobs.has(jobId)) {
        newSavedJobs.delete(jobId);
        setSnackbar({ 
          visible: true, 
          message: `Removed "${job?.title}" from saved jobs`, 
          type: 'success' 
        });
      } else {
        newSavedJobs.add(jobId);
        setSnackbar({ 
          visible: true, 
          message: `Saved "${job?.title}" to your job list`, 
          type: 'success' 
        });
      }
      
      setSavedJobs(newSavedJobs);
      
      // Update jobs state to reflect saved status
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId 
            ? { ...job, isSaved: newSavedJobs.has(jobId) }
            : job
        )
      );
      
    } catch (error) {
      console.error('Error toggling save job:', error);
      setSnackbar({ 
        visible: true, 
        message: 'Failed to update saved jobs. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsProcessingJob(null);
    }
  };

  // Functional apply to job
  const handleApply = async (jobId: string) => {
    if (isProcessingJob) return; // Prevent multiple simultaneous actions
    
    setIsProcessingJob(jobId);
    console.log('Applying to job:', jobId);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const job = jobs.find(j => j.id === jobId);
      
      if (appliedJobs.has(jobId)) {
        Alert.alert(
          'Already Applied',
          `You have already applied to "${job?.title}" at ${job?.company}.`,
          [{ text: 'OK' }]
        );
      } else {
        // Add to applied jobs
        setAppliedJobs(prev => new Set([...prev, jobId]));
        
        // Show success message
        setSnackbar({ 
          visible: true, 
          message: `Application sent to ${job?.company}! You'll hear back within 5-7 business days.`, 
          type: 'success' 
        });
        
        // Show additional info alert
        Alert.alert(
          'Application Submitted!',
          `Your application for "${job?.title}" at ${job?.company} has been submitted successfully.\n\nYou'll receive a confirmation email shortly, and the hiring team will review your application within 5-7 business days.\n\nGood luck!`,
          [{ text: 'OK' }]
        );
      }
      
    } catch (error) {
      console.error('Error applying to job:', error);
      setSnackbar({ 
        visible: true, 
        message: 'Failed to submit application. Please check your connection and try again.', 
        type: 'error' 
      });
    } finally {
      setIsProcessingJob(null);
    }
  };

  const filteredJobs = jobs.filter(job => {
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

  const renderJobCard = ({ item }: { item: Job }) => {
    // Check if job is saved or applied
    const isSaved = savedJobs.has(item.id);
    const isApplied = appliedJobs.has(item.id);
    
    return (
      <JobCard
        job={{
          ...item,
          isSaved: isSaved
        }}
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
        isProcessing={isProcessingJob === item.id}
        isApplied={isApplied}
      />
    );
  };

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
                Add your name and details to improve job recommendations
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

      {/* My Profile Modal */}
      {showMyProfileModal && (
        <Modal
          visible={showMyProfileModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <MyProfileScreen
            profile={{
              id: '1',
              name: 'Your Name',
              title: 'Your Title',
              company: 'Your Company',
              location: 'Your Location',
              avatar: userAvatar,
              headerImage: null,
              about: 'About you',
              experience: [],
              education: [],
              skills: [],
              mutualConnections: 0,
              isConnected: false,
              isOnline: false,
              isPending: false,
              isSuggested: false,
            }}
            onBack={() => setShowMyProfileModal(false)}
          />
        </Modal>
      )}

      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onHide={() => setSnackbar(prev => ({ ...prev, visible: false }))}
      />
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
  profileCompletionPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
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
    fontWeight: 'bold',
  },
  profileCompletionSubtitle: {
    fontSize: 14,
  },
  completeProfileButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  completeProfileButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 