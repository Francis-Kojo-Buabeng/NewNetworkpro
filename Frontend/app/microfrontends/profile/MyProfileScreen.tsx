import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Alert, Platform, ActionSheetIOS } from 'react-native';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import { useProfile } from '../../../contexts/ProfileContext';
import ProfileScreen, { ProfileScreenProps } from './ProfileScreen';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ImageService } from '../../../services/imageService';
import AvatarActionModal from '../../../components/AvatarActionModal';
import { ProfileDataService, OptimizedProfileData } from '../../../services/profileDataService';
import PrivacySettingsScreen from './PrivacySettingsScreen';
import ProfileCompletionScreen from './ProfileCompletionScreen';
import { userSessionService } from '../../../services/userSession';
import { updateUserProfile } from '../../../services/userAPI';
import Snackbar from '../../../components/Snackbar';

interface MyProfileScreenProps extends ProfileScreenProps {
  onProfileChange?: (profile: any) => void;
}

export default function MyProfileScreen(props: MyProfileScreenProps) {
  console.log('MyProfileScreen - Component rendered with props:', props);
  console.log('MyProfileScreen - Profile ID:', props.profile?.id);
  
  const theme = useCurrentTheme();
  const { updateAvatar, updateHeaderImage, refreshProfile } = useProfile();
  const [profileData, setProfileData] = useState<OptimizedProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [avatarActionModalVisible, setAvatarActionModalVisible] = useState(false);
  const [privacySettingsVisible, setPrivacySettingsVisible] = useState(false);
  const [profileCompletionVisible, setProfileCompletionVisible] = useState(false);
  const [editProfile, setEditProfile] = useState({
    firstName: '',
    lastName: '',
    title: '',
    company: '',
    location: '',
    about: '',
    skills: [] as string[],
  });
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });

  // Fetch optimized profile data on mount or when profile.id changes
  useEffect(() => {
    async function loadProfileData() {
      // First check if we have user session data
      const userSession = userSessionService.getUserSession();
      const userProfile = userSessionService.getUserProfile();
      
      console.log('MyProfileScreen - User session found:', !!userSession);
      console.log('MyProfileScreen - User profile in session:', !!userProfile);
      
      if (userProfile) {
        // Use raw URLs from session data - ImageService will handle processing
        const optimizedData: OptimizedProfileData = {
          id: userProfile.id,
          name: `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim(),
          title: userProfile.headline || userProfile.currentPosition || '',
          company: userProfile.currentCompany || '',
          location: userProfile.location || '',
          about: userProfile.summary || userProfile.bio || '',
          skills: userProfile.skills || [],
          experience: userProfile.workExperience || userProfile.workExperiences || [],
          education: userProfile.education || [],
          avatarUrl: userProfile.profilePictureUrl, // Use raw URL
          bannerUrl: userProfile.headerImage, // Use raw URL
          rawProfile: userProfile,
          mutualConnections: 0,
          isConnected: false,
          profileViews: 0,
          followers: 0
        };
        
        setProfileData(optimizedData);
        
        // Initialize edit profile with current data
        setEditProfile({
          firstName: userProfile.firstName || '',
          lastName: userProfile.lastName || '',
          title: userProfile.headline || userProfile.currentPosition || '',
          company: userProfile.currentCompany || '',
          location: userProfile.location || '',
          about: userProfile.summary || userProfile.bio || '',
          skills: userProfile.skills || [],
        });
        
        console.log('MyProfileScreen - Profile data loaded from session');
        console.log('MyProfileScreen - Raw profilePictureUrl:', userProfile.profilePictureUrl);
        console.log('MyProfileScreen - Processed avatarUrl:', optimizedData.avatarUrl);
        console.log('MyProfileScreen - Raw headerImage:', userProfile.headerImage);
        console.log('MyProfileScreen - Processed bannerUrl:', optimizedData.bannerUrl);
        
        if (props.onProfileChange) {
          props.onProfileChange(userProfile);
        }
        
        setIsLoading(false);
        return;
      }
      
      // Fallback to loading from API if no session data
      if (!props.profile?.id) return;
      
      try {
        setIsLoading(true);
        console.log('MyProfileScreen - Loading optimized profile data from API');
        
        // Clear cache to force fresh fetch
        ProfileDataService.clearProfileCache(props.profile.id);
        console.log('MyProfileScreen - Cleared cache for user:', props.profile.id);
        
        const optimizedData = await ProfileDataService.getProfileData(props.profile.id);
        setProfileData(optimizedData);
        
        // Initialize edit profile with current data
        setEditProfile({
          firstName: optimizedData.rawProfile.firstName || '',
          lastName: optimizedData.rawProfile.lastName || '',
          title: optimizedData.title,
          company: optimizedData.company,
          location: optimizedData.location,
          about: optimizedData.about,
          skills: optimizedData.skills,
        });
        
        console.log('MyProfileScreen - Profile data loaded successfully from API');
        console.log('MyProfileScreen - Avatar URL:', optimizedData.avatarUrl);
        console.log('MyProfileScreen - Banner URL:', optimizedData.bannerUrl);
        
        if (props.onProfileChange) {
          props.onProfileChange(optimizedData.rawProfile);
        }
      } catch (error) {
        console.error('MyProfileScreen - Failed to load profile data:', error);
        setSnackbar({ visible: true, message: 'Failed to load profile data', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProfileData();
  }, [props.profile?.id]);

  // Handler for editing avatar
  const handleEditAvatar = () => {
    if (Platform.OS === 'ios') {
      // Use ActionSheet for iOS
      const options = ['Choose from Gallery', 'Take Photo'];
      if (profileData?.avatarUrl) {
        options.push('Remove Photo');
      }
      options.push('Cancel');
      
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
          destructiveButtonIndex: profileData?.avatarUrl ? options.length - 2 : undefined,
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            // Choose from Gallery
            await handleChooseFromGallery();
          } else if (buttonIndex === 1) {
            // Take Photo
            await handleTakePhoto();
          } else if (buttonIndex === 2 && profileData?.avatarUrl) {
            // Remove Photo
            await handleRemoveProfilePicture();
          }
          // Cancel is handled automatically by ActionSheet
        }
      );
    } else {
      // Use custom modal for Android
      setAvatarActionModalVisible(true);
    }
  };

  // Handler for choosing from gallery
  const handleChooseFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setSnackbar({ visible: true, message: 'Permission to access gallery is required!', type: 'error' });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      await handleUploadProfilePicture(result.assets[0].uri);
    }
  };

  // Handler for taking photo
  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setSnackbar({ visible: true, message: 'Permission to access camera is required!', type: 'error' });
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      await handleUploadProfilePicture(result.assets[0].uri);
    }
  };

  const handleUploadProfilePicture = async (imageUri: string) => {
    if (!profileData?.id) {
      setSnackbar({ visible: true, message: 'Profile ID not found', type: 'error' });
      return;
    }

    try {
      const uploadResult = await ImageService.uploadAvatar(profileData.id, imageUri);
      if (uploadResult.success && uploadResult.url) {
        // Update cache immediately
        await ProfileDataService.updateProfileAfterImageUpload(profileData.id, 'avatar', uploadResult.url);
        
        // Notify ProfileContext about the avatar change
        updateAvatar(uploadResult.url);
        
        // Refresh profile data
        const updatedData = await ProfileDataService.refreshProfileData(profileData.id);
        setProfileData(updatedData);
        
        if (props.onProfileChange) {
          props.onProfileChange(updatedData.rawProfile);
        }
        
        setSnackbar({ visible: true, message: 'Profile picture uploaded successfully!', type: 'success' });
      } else {
        setSnackbar({ visible: true, message: uploadResult.error || 'Failed to upload avatar', type: 'error' });
      }
    } catch (error: any) {
      setSnackbar({ visible: true, message: error.message || 'Failed to upload profile picture', type: 'error' });
    }
  };

  const handleRemoveProfilePicture = async () => {
    if (!profileData?.id) {
      setSnackbar({ visible: true, message: 'Profile ID not found', type: 'error' });
      return;
    }

    try {
      const deleteResult = await ImageService.deleteAvatar(profileData.id);
      if (deleteResult.success) {
        // Notify ProfileContext about the avatar removal
        updateAvatar('');
        
        // Clear cache and refresh
        ProfileDataService.clearProfileCache(profileData.id);
        const updatedData = await ProfileDataService.refreshProfileData(profileData.id);
        setProfileData(updatedData);
        
        if (props.onProfileChange) {
          props.onProfileChange(updatedData.rawProfile);
        }
        
        setSnackbar({ visible: true, message: 'Profile picture removed successfully!', type: 'success' });
      } else {
        setSnackbar({ visible: true, message: deleteResult.error || 'Failed to remove avatar', type: 'error' });
      }
    } catch (error: any) {
      setSnackbar({ visible: true, message: error.message || 'Failed to remove profile picture', type: 'error' });
    }
  };

  // Handler for saving profile edits
  const handleSaveEdit = async () => {
    if (!editProfile.firstName.trim()) {
      setSnackbar({ visible: true, message: 'First name is required.', type: 'error' });
      return;
    }
    
    if (!profileData?.id) {
      setSnackbar({ visible: true, message: 'Profile ID not found', type: 'error' });
      return;
    }
    
    try {
      // Update profile via API - using correct backend field names
      // Preserve existing image URLs to prevent them from being lost
      const updatePayload = {
        fullName: `${editProfile.firstName} ${editProfile.lastName}`.trim(),
        headline: editProfile.title,
        bio: editProfile.about,
        location: editProfile.location,
        currentCompany: editProfile.company,
        skills: editProfile.skills,
        // Preserve existing image URLs
        profilePictureUrl: profileData.rawProfile?.profilePictureUrl || null,
        headerImage: profileData.rawProfile?.headerImage || null,
      };

      console.log('MyProfileScreen - Update payload:', updatePayload);
      console.log('MyProfileScreen - Current profile data:', profileData.rawProfile);

      await updateUserProfile(profileData.id, updatePayload);

      // Small delay to ensure backend has processed the update
      await new Promise(resolve => setTimeout(resolve, 500));

      // Refresh profile data with error handling
      try {
        // Clear cache first to ensure fresh data
        ProfileDataService.clearProfileCache(profileData.id);
        const updatedData = await ProfileDataService.refreshProfileData(profileData.id);
        console.log('MyProfileScreen - Updated profile data after refresh:', updatedData);
        console.log('MyProfileScreen - Updated avatar URL:', updatedData.avatarUrl);
        console.log('MyProfileScreen - Updated banner URL:', updatedData.bannerUrl);
        
        // Force re-render by creating a new object
        setProfileData({ ...updatedData });
        
        if (props.onProfileChange) {
          props.onProfileChange(updatedData.rawProfile);
        }
      } catch (refreshError) {
        console.error('MyProfileScreen - Failed to refresh profile data after update:', refreshError);
        // Don't show error to user since the update was successful
        // Just log it for debugging
      }
      
      setEditModalVisible(false);
      setSnackbar({ visible: true, message: 'Profile updated successfully!', type: 'success' });
    } catch (error: any) {
      setSnackbar({ visible: true, message: error.message || 'Failed to update profile', type: 'error' });
    }
  };

  const handleBannerChange = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setSnackbar({ visible: true, message: 'Permission to access gallery is required!', type: 'error' });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      try {
        const uploadResult = await ImageService.uploadBanner(profileData!.id, result.assets[0].uri);
        if (uploadResult.success && uploadResult.url) {
          console.log('MyProfileScreen - Banner upload successful, URL returned:', uploadResult.url);
          
          // Update cache immediately with the new banner URL
          await ProfileDataService.updateProfileAfterImageUpload(profileData!.id, 'banner', uploadResult.url);
          
          // Notify ProfileContext about the header image change
          updateHeaderImage(uploadResult.url);
          
          // Update local state immediately with the new banner URL
          if (profileData) {
            const updatedProfileData: OptimizedProfileData = {
              ...profileData,
              bannerUrl: uploadResult.url,
              rawProfile: {
                ...profileData.rawProfile,
                headerImage: uploadResult.url
              }
            };
            setProfileData(updatedProfileData);
          }
          
          // Also refresh from API to ensure consistency
          try {
            const refreshedData = await ProfileDataService.refreshProfileData(profileData!.id);
            setProfileData(refreshedData);
            
            if (props.onProfileChange) {
              props.onProfileChange(refreshedData.rawProfile);
            }
          } catch (refreshError) {
            console.error('MyProfileScreen - Failed to refresh profile data after banner upload:', refreshError);
            // Keep the local update even if refresh fails
          }
          
          setSnackbar({ visible: true, message: 'Banner image uploaded successfully!', type: 'success' });
        } else {
          setSnackbar({ visible: true, message: uploadResult.error || 'Failed to upload banner', type: 'error' });
        }
      } catch (error: any) {
        setSnackbar({ visible: true, message: error.message || 'Failed to upload banner image', type: 'error' });
      }
    }
  };

  const handleDeleteBannerImage = async () => {
    if (!profileData?.id) {
      setSnackbar({ visible: true, message: 'Profile ID not found', type: 'error' });
      return;
    }

    try {
      const deleteResult = await ImageService.deleteBanner(profileData.id);
      if (deleteResult.success) {
        // Notify ProfileContext about the header image removal
        updateHeaderImage('');
        
        // Clear cache and refresh with error handling
        ProfileDataService.clearProfileCache(profileData.id);
        try {
          const updatedData = await ProfileDataService.refreshProfileData(profileData.id);
          setProfileData(updatedData);
          
          if (props.onProfileChange) {
            props.onProfileChange(updatedData.rawProfile);
          }
        } catch (refreshError) {
          console.error('MyProfileScreen - Failed to refresh profile data after banner delete:', refreshError);
          // Don't show error to user since the delete was successful
          // Just log it for debugging
        }
        
        setSnackbar({ visible: true, message: 'Banner image removed successfully!', type: 'success' });
      } else {
        setSnackbar({ visible: true, message: deleteResult.error || 'Failed to remove banner', type: 'error' });
      }
    } catch (error: any) {
      setSnackbar({ visible: true, message: error.message || 'Failed to remove banner image', type: 'error' });
    }
  };

  // Show loading state
  if (isLoading || !profileData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.backgroundColor }}>
        <Text style={{ color: theme.textColor }}>Loading profile...</Text>
      </View>
    );
  }

  // Map optimized data to ProfileScreen props
  const profileProps = {
    ...props,
    profile: {
      id: profileData.id,
      name: profileData.name,
      title: profileData.title,
      company: profileData.company,
      location: profileData.location,
      about: profileData.about,
      experience: profileData.experience,
      education: profileData.education,
      skills: profileData.skills,
      mutualConnections: profileData.mutualConnections,
      isConnected: profileData.isConnected,
      profileViews: profileData.profileViews,
      followers: profileData.followers,
      // Use raw URLs directly - ImageService will handle processing
      profilePictureUrl: profileData.rawProfile.profilePictureUrl,
      headerImage: profileData.rawProfile.headerImage,
    },
    // Pass raw URLs - ImageService will handle processing
    bannerImage: profileData.rawProfile.headerImage,
    avatarImage: profileData.rawProfile.profilePictureUrl,
  };

  return (
    <>
      <ProfileScreen
        key={profileData.bannerUrl || profileData.rawProfile.headerImage || 'default-banner'}
        {...profileProps}
        onBannerChange={handleBannerChange}
        onAvatarChange={handleEditAvatar}
      >
        {/* Owner-specific buttons */}
        <View style={{ flexDirection: 'row', alignSelf: 'flex-end', marginBottom: 12, marginRight: 12, gap: 8 }}>
          <TouchableOpacity
            style={{ backgroundColor: theme.cardColor, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 4 }}
            onPress={() => setProfileCompletionVisible(true)}
          >
            <MaterialCommunityIcons name="chart-line" size={16} color={theme.primaryColor} />
            <Text style={{ color: theme.primaryColor, fontWeight: '600', fontSize: 12 }}>Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: theme.cardColor, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 4 }}
            onPress={() => setPrivacySettingsVisible(true)}
          >
            <MaterialCommunityIcons name="shield-account" size={16} color={theme.primaryColor} />
            <Text style={{ color: theme.primaryColor, fontWeight: '600', fontSize: 12 }}>Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ backgroundColor: theme.primaryColor, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 18 }}
            onPress={() => setEditModalVisible(true)}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </ProfileScreen>
      {/* Edit Profile Modal */}
      <Modal visible={editModalVisible} animationType="slide" onRequestClose={() => setEditModalVisible(false)}>
        <View style={[styles.editModalContainer, { backgroundColor: theme.backgroundColor }]}> 
          <Text style={[styles.editTitle, { color: theme.textColor }]}>Edit Profile</Text>
          <TextInput
            style={[styles.editInput, { color: theme.textColor, borderColor: theme.borderColor }]}
            value={editProfile.firstName}
            onChangeText={firstName => setEditProfile({ ...editProfile, firstName })}
            placeholder="First Name"
            placeholderTextColor={theme.placeholderColor}
          />
          <TextInput
            style={[styles.editInput, { color: theme.textColor, borderColor: theme.borderColor }]}
            value={editProfile.lastName}
            onChangeText={lastName => setEditProfile({ ...editProfile, lastName })}
            placeholder="Last Name (optional)"
            placeholderTextColor={theme.placeholderColor}
          />
          <TextInput
            style={[styles.editInput, { color: theme.textColor, borderColor: theme.borderColor }]}
            value={editProfile.title}
            onChangeText={title => setEditProfile({ ...editProfile, title })}
            placeholder="Headline/Title"
            placeholderTextColor={theme.placeholderColor}
          />
          <TextInput
            style={[styles.editInput, { color: theme.textColor, borderColor: theme.borderColor }]}
            value={editProfile.company}
            onChangeText={company => setEditProfile({ ...editProfile, company })}
            placeholder="Company"
            placeholderTextColor={theme.placeholderColor}
          />
          <TextInput
            style={[styles.editInput, { color: theme.textColor, borderColor: theme.borderColor }]}
            value={editProfile.location}
            onChangeText={location => setEditProfile({ ...editProfile, location })}
            placeholder="Location"
            placeholderTextColor={theme.placeholderColor}
          />
          <TextInput
            style={[styles.editInput, { color: theme.textColor, borderColor: theme.borderColor, height: 100 }]}
            value={editProfile.about}
            onChangeText={about => setEditProfile({ ...editProfile, about })}
            placeholder="About"
            placeholderTextColor={theme.placeholderColor}
            multiline
            textAlignVertical="top"
          />
          
          {/* Skills Section */}
          <Text style={[styles.skillsLabel, { color: theme.textColor }]}>Skills</Text>
          <View style={styles.skillsContainer}>
            {editProfile.skills.map((skill: string, index: number) => (
              <View key={index} style={[styles.skillChip, { backgroundColor: theme.primaryColor }]}>
                <Text style={[styles.skillText, { color: theme.textColor }]}>{skill}</Text>
          <TouchableOpacity
                  onPress={() => {
                    const newSkills = editProfile.skills.filter((_: string, i: number) => i !== index);
                    setEditProfile({ ...editProfile, skills: newSkills });
                  }}
          >
                  <Text style={[styles.removeSkillText, { color: theme.textColor }]}>×</Text>
          </TouchableOpacity>
              </View>
            ))}
          </View>
          
          <View style={styles.editModalButtons}>
          <TouchableOpacity
              style={[styles.editModalButton, { backgroundColor: theme.cardColor }]}
            onPress={() => setEditModalVisible(false)}
          >
              <Text style={[styles.editModalButtonText, { color: theme.textColor }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.editModalButton, { backgroundColor: theme.primaryColor }]}
              onPress={handleSaveEdit}
            >
              <Text style={[styles.editModalButtonText, { color: '#fff' }]}>Save</Text>
          </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onHide={() => setSnackbar({ visible: false, message: '', type: 'info' })}
      />
      
      {/* Avatar Action Modal */}
      <AvatarActionModal
        visible={avatarActionModalVisible}
        onClose={() => setAvatarActionModalVisible(false)}
        onChooseFromGallery={handleChooseFromGallery}
        onTakePhoto={handleTakePhoto}
        onRemovePhoto={handleRemoveProfilePicture}
        hasProfilePicture={!!profileData?.avatarUrl}
      />

      {/* Privacy Settings Modal */}
      <Modal
        visible={privacySettingsVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <PrivacySettingsScreen
          userId={profileData?.id || '1'}
          onBack={() => setPrivacySettingsVisible(false)}
        />
      </Modal>

      {/* Profile Completion Modal */}
      <Modal
        visible={profileCompletionVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <ProfileCompletionScreen
          userId={profileData?.id || '1'}
          onBack={() => setProfileCompletionVisible(false)}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  editModalContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  editTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  editInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
  },
  skillsLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  skillText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  removeSkillText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editModalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  editModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 