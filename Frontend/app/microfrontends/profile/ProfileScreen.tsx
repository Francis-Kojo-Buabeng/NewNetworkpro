import React, { ReactNode, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, TextInput, Alert, ActionSheetIOS, Platform } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import { ImageService } from '../../../services/imageService';
import Snackbar from '../../../components/Snackbar';
import AvatarActionModal from '../../../components/AvatarActionModal';
import ImageWithFallback from '../../../components/ImageWithFallback';

const { width } = Dimensions.get('window');

export interface ProfileScreenProps {
  profile: any;
  onBack: () => void;
  onConnect?: () => void;
  onMessage?: () => void;
  children?: ReactNode;
  bannerImage?: string | null;
  onBannerChange?: (uri: string) => void;
  avatarImage?: string | null;
  onAvatarChange?: (uri: string) => void;
}

export function ProfileLayout({ profile, children, onBack, theme, bannerImage, onBannerChange, avatarImage, onAvatarChange }: { profile: any; children?: ReactNode; onBack: () => void; theme: any; bannerImage?: string | null; onBannerChange?: (uri: string) => void; avatarImage?: string | null; onAvatarChange?: (uri: string) => void; }) {
  const [activeTab, setActiveTab] = useState('about');
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });
  const [avatarActionModalVisible, setAvatarActionModalVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderTabButton = (tab: string, label: string) => (
    <TouchableOpacity
      key={tab}
      style={[
        styles.tabButton,
        activeTab === tab && { borderBottomColor: theme.primaryColor, borderBottomWidth: 2 }
      ]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[
        styles.tabButtonText,
        { color: activeTab === tab ? theme.primaryColor : theme.textSecondaryColor }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        const aboutText = profile.about || 'No information available.';
        const filteredAbout = aboutText.toLowerCase().includes(searchQuery.toLowerCase()) ? aboutText : 'No results found.';
        return (
          <View style={styles.contentSection}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>About</Text>
            <Text style={[styles.aboutText, { color: theme.textColor }]}>{filteredAbout}</Text>
          </View>
        );
      case 'experience':
        const filteredExperience = profile.experience ? profile.experience.filter((exp: any) => 
          exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          exp.company.toLowerCase().includes(searchQuery.toLowerCase())
        ) : [];
        return (
          <View style={styles.contentSection}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Experience</Text>
            {filteredExperience.length > 0 ? (
              filteredExperience.map((exp: any, index: number) => (
                <View key={index} style={[styles.experienceItem, { borderBottomColor: theme.borderColor }]}>
                      <Text style={[styles.experienceTitle, { color: theme.textColor }]}>{exp.title}</Text>
                      <Text style={[styles.experienceCompany, { color: theme.primaryColor }]}>{exp.company}</Text>
                      <Text style={[styles.experienceDuration, { color: theme.textSecondaryColor }]}>{exp.duration}</Text>
                  {exp.description && (
                  <Text style={[styles.experienceDescription, { color: theme.textColor }]}>{exp.description}</Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={[styles.noResultsText, { color: theme.textSecondaryColor }]}>
                {searchQuery ? 'No experience found matching your search.' : 'No experience added yet.'}
              </Text>
            )}
          </View>
        );
      case 'education':
        const filteredEducation = profile.education ? profile.education.filter((edu: any) => 
          edu.degree.toLowerCase().includes(searchQuery.toLowerCase()) ||
          edu.school.toLowerCase().includes(searchQuery.toLowerCase())
        ) : [];
        return (
          <View style={styles.contentSection}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Education</Text>
            {filteredEducation.length > 0 ? (
              filteredEducation.map((edu: any, index: number) => (
                <View key={index} style={[styles.educationItem, { borderBottomColor: theme.borderColor }]}>
                      <Text style={[styles.educationDegree, { color: theme.textColor }]}>{edu.degree}</Text>
                      <Text style={[styles.educationSchool, { color: theme.primaryColor }]}>{edu.school}</Text>
                  <Text style={[styles.educationDuration, { color: theme.textSecondaryColor }]}>{edu.year}</Text>
                </View>
              ))
            ) : (
              <Text style={[styles.noResultsText, { color: theme.textSecondaryColor }]}>
                {searchQuery ? 'No education found matching your search.' : 'No education added yet.'}
              </Text>
            )}
          </View>
        );
      case 'skills':
        const filteredSkills = profile.skills ? profile.skills.filter((skill: string) => 
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        ) : [];
        return (
          <View style={styles.contentSection}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Skills</Text>
            {filteredSkills.length > 0 ? (
              <View style={styles.skillsContainer}>
                {filteredSkills.map((skill: string, index: number) => (
                  <View key={index} style={[styles.skillChip, { backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }]}>
                    <Text style={[styles.skillText, { color: theme.textColor }]}>{skill}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={[styles.noResultsText, { color: theme.textSecondaryColor }]}>
                {searchQuery ? 'No skills found matching your search.' : 'No skills added yet.'}
              </Text>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  // Banner image logic
  const handleBannerPress = async () => {
    console.log('ProfileScreen - handleBannerPress called');
    console.log('ProfileScreen - onBannerChange available:', !!onBannerChange);
    console.log('ProfileScreen - Profile ID:', profile.id);
    console.log('ProfileScreen - Current bannerImage prop:', bannerImage);
    if (!onBannerChange) {
      console.log('ProfileScreen - No onBannerChange callback, returning early');
      return;
    }
    setError(null);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Permission to access gallery is required!');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 1],
      quality: 1,
    });
    console.log('ProfileScreen - Image picker result:', result);
    if (!result.canceled && result.assets && result.assets.length > 0) {
      console.log('ProfileScreen - Starting banner upload for profile ID:', profile.id);
      try {
        const uploadResult = await ImageService.uploadBanner(profile.id, result.assets[0].uri);
        console.log('ProfileScreen - Upload result:', uploadResult);
        if (uploadResult.success && uploadResult.url) {
          console.log('ProfileScreen - Calling onBannerChange with URL:', uploadResult.url);
          onBannerChange(uploadResult.url);
          setSnackbar({ visible: true, message: 'Banner image uploaded successfully!', type: 'success' });
        } else {
          setError(uploadResult.error || 'Failed to upload banner');
        }
      } catch (error: any) {
        console.error('ProfileScreen - Banner upload error:', error);
        setError(error.message || 'Failed to upload banner image');
      }
    }
  };

  const handleDeleteBannerImage = async () => {
    setError(null);
    if (!profile.id) {
      setError('Profile ID not found');
      return;
    }

    try {
      const deleteResult = await ImageService.deleteBanner(profile.id);
      if (deleteResult.success) {
        if (onBannerChange) {
          onBannerChange('');
        }
        setSnackbar({ visible: true, message: 'Banner image removed successfully!', type: 'success' });
      } else {
        setError(deleteResult.error || 'Failed to remove banner');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to remove banner image');
    }
  };

  // Handler for editing avatar
  const handleEditAvatar = () => {
    if (Platform.OS === 'ios') {
      // Use ActionSheet for iOS
      const options = ['Choose from Gallery', 'Take Photo'];
      if (profile.profilePictureUrl) {
        options.push('Remove Photo');
      }
      options.push('Cancel');
      
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
          destructiveButtonIndex: profile.profilePictureUrl ? options.length - 2 : undefined,
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            // Choose from Gallery
            await handleChooseFromGallery();
          } else if (buttonIndex === 1) {
            // Take Photo
            await handleTakePhoto();
          } else if (buttonIndex === 2 && profile.profilePictureUrl) {
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
    setError(null);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Permission to access gallery is required!');
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
    setError(null);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setError('Permission to access camera is required!');
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

  // Handler for uploading profile picture
  const handleUploadProfilePicture = async (imageUri: string) => {
    setError(null);
    if (!profile.id) {
      setError('Profile ID not found');
      return;
    }

    try {
      const uploadResult = await ImageService.uploadAvatar(profile.id, imageUri);
      if (uploadResult.success && uploadResult.url) {
        if (onAvatarChange) {
          onAvatarChange(uploadResult.url);
        }
        setSnackbar({ visible: true, message: 'Profile picture uploaded successfully!', type: 'success' });
      } else {
        setError(uploadResult.error || 'Failed to upload avatar');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to upload profile picture');
    }
  };

  // Handler for removing profile picture
  const handleRemoveProfilePicture = async () => {
    setError(null);
    if (!profile.id) {
      setError('Profile ID not found');
      return;
    }

    try {
      const deleteResult = await ImageService.deleteAvatar(profile.id);
      if (deleteResult.success) {
        if (onAvatarChange) {
          onAvatarChange('');
        }
        setSnackbar({ visible: true, message: 'Profile picture removed successfully!', type: 'success' });
      } else {
        setError(deleteResult.error || 'Failed to remove avatar');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to remove profile picture');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.cardColor }]} onPress={onBack}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.textColor} />
        </TouchableOpacity>
        {/* Search Field between icons */}
        <View style={[styles.searchContainer, {
          backgroundColor: theme.inputBackgroundColor,
          borderColor: theme.borderColor,
        }]}>
          <MaterialCommunityIcons name="magnify" size={20} color={theme.textSecondaryColor} style={styles.searchIcon} />
          <TextInput
            style={[styles.headerSearchInput, {
              color: theme.textColor,
            }]}
            value={searchQuery}
            onChangeText={handleSearch}
            placeholder={profile.name || "Search profile..."}
            placeholderTextColor={theme.placeholderColor}
            editable={true}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <MaterialCommunityIcons name="close-circle" size={20} color={theme.textSecondaryColor} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={[styles.moreButton, { backgroundColor: theme.cardColor }]}>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <TouchableOpacity 
          disabled={!onBannerChange} 
          onPress={() => {
            console.log('ProfileScreen - Banner TouchableOpacity pressed');
            console.log('ProfileScreen - onBannerChange available:', !!onBannerChange);
            handleBannerPress();
          }} 
          onLongPress={onBannerChange && (bannerImage || profile.headerImage) ? handleDeleteBannerImage : undefined}
          activeOpacity={onBannerChange ? 0.7 : 1}
        >
          {(() => {
            const bannerUri = bannerImage || profile.headerImage;
            
            // Debug logging for banner image
            console.log('ProfileScreen - Banner image debug:', {
              bannerImage,
              profileHeaderImage: profile.headerImage,
              bannerUri,
              processedSource: ImageService.getImageSource(bannerUri, require('@/assets/images/banner-images/banner-01.jpg'))
            });
            
            return (
          <View style={styles.headerImageContainer}>
                {bannerUri ? (
                  <View style={{ position: 'relative' }}>
                    <ImageWithFallback
                      source={ImageService.getImageSource(bannerUri, require('@/assets/images/banner-images/banner-01.jpg'))}
                      fallbackSource={require('@/assets/images/banner-images/banner-01.jpg')}
                style={styles.headerImage}
                resizeMode="cover"
                      showLoadingIndicator={true}
                      onLoad={() => console.log('Banner image loaded successfully')}
                      onError={() => console.warn('Banner image failed to load')}
                    />
                    {onBannerChange && (
                      <View style={[styles.bannerEditOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.3)' }]}>
                        <MaterialCommunityIcons name="pencil" size={24} color="white" />
                      </View>
                    )}
                  </View>
            ) : (
              <View style={[styles.headerImage, { backgroundColor: theme.surfaceColor }]}>
                <MaterialCommunityIcons name="image" size={48} color={theme.textTertiaryColor} style={styles.headerPlaceholder} />
                <Text style={{ color: theme.textTertiaryColor, marginTop: 8 }}>Tap to Add Banner Image</Text>
                    {onBannerChange && (
                      <View style={[styles.bannerAddOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.1)' }]}>
                        <MaterialCommunityIcons name="plus" size={24} color={theme.textSecondaryColor} />
                      </View>
                    )}
              </View>
            )}
          </View>
            );
          })()}
        </TouchableOpacity>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            {(() => {
              // Handle both require() statements and URL strings
              let avatarSource;
              if (avatarImage || profile.profilePictureUrl) {
                // If it's a require() statement (number), use it directly
                if (typeof (avatarImage || profile.profilePictureUrl) === 'number') {
                  avatarSource = avatarImage || profile.profilePictureUrl;
                } else {
                  // If it's a string URL, process it through ImageService
                  avatarSource = ImageService.getImageSource(avatarImage || profile.profilePictureUrl);
                }
              } else {
                // Fallback to default avatar
                avatarSource = require('@/assets/images/Avator-Image.jpg');
              }
              
              console.log('ProfileLayout - Avatar source:', avatarSource);
              
              return (
                <ImageWithFallback
                  source={avatarSource}
                  fallbackSource={require('@/assets/images/Avator-Image.jpg')}
                  style={styles.avatar}
                  containerStyle={{ borderColor: theme.cardColor, shadowColor: theme.shadowColor }}
                  resizeMode="cover"
                  showLoadingIndicator={true}
                  onLoad={() => console.log('Avatar image loaded successfully')}
                  onError={() => console.warn('Avatar image failed to load')}
                />
              );
            })()}
            {onAvatarChange && (
              <TouchableOpacity onPress={handleEditAvatar} style={{ position: 'absolute', bottom: 8, right: 8, backgroundColor: theme.cardColor, borderRadius: 16, padding: 6, borderWidth: 1, borderColor: theme.primaryColor, zIndex: 10 }}>
                <MaterialCommunityIcons name="pencil" size={18} color={theme.primaryColor} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.profileDetails}>
            <Text style={[styles.profileName, { color: theme.textColor }]}>{profile.name}</Text>
            <Text style={[styles.profileTitle, { color: theme.textColor }]}>{profile.title}</Text>
            <Text style={[styles.profileCompany, { color: theme.primaryColor }]}>{profile.company}</Text>
            <Text style={[styles.profileLocation, { color: theme.textSecondaryColor }]}>{profile.location}</Text>
          </View>

          {/* Error Display */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={[styles.errorText, { color: theme.dangerColor }]}>{error}</Text>
            </View>
          )}

          {/* Action Buttons before tabs */}
          {children}
        </View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { backgroundColor: theme.cardColor, shadowColor: theme.shadowColor }]}>
          {renderTabButton('about', 'About')}
          {renderTabButton('experience', 'Experience')}
          {renderTabButton('education', 'Education')}
          {renderTabButton('skills', 'Skills')}
        </View>

        {/* Content */}
        {renderContent()}

        {/* Restore Action Buttons, but only render if !isOwnProfile */}
        {/* This block is now redundant as buttons are moved */}
      </ScrollView>
      
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
        hasProfilePicture={!!profile.profilePictureUrl}
      />
    </View>
  );
}

// ProfileScreen is now just a shell
export default function ProfileScreen(props: ProfileScreenProps) {
  const theme = useCurrentTheme();
  return (
    <ProfileLayout profile={props.profile} onBack={props.onBack} theme={theme} bannerImage={props.bannerImage} onBannerChange={props.onBannerChange} avatarImage={props.avatarImage} onAvatarChange={props.onAvatarChange}>
      {props.children}
    </ProfileLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  moreButton: {
    padding: 8,
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 4,
  },
  headerImageContainer: {
    height: 130, // Reduced from 200
    width: '100%',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerPlaceholder: {
    opacity: 0.5,
  },
  profileInfo: {
    paddingHorizontal: 20,
    marginTop: -60,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  profileDetails: {
    marginBottom: 20,
  },
  profileName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 2,
  },
  profileCompany: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  profileLocation: {
    fontSize: 16,
    marginBottom: 8,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    height: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  connectButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  messageButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
  },
  experienceItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  experienceHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  experienceInfo: {
    flex: 1,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  experienceCompany: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  experienceDuration: {
    fontSize: 14,
    marginBottom: 8,
  },
  experienceDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  educationItem: {
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  educationHeader: {
    flexDirection: 'row',
  },
  schoolLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  educationInfo: {
    flex: 1,
  },
  educationDegree: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  educationSchool: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  educationDuration: {
    fontSize: 14,
  },
  educationDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  skillChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  skillText: {
    fontSize: 14,
    fontWeight: '500',
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    minWidth: 180,
    maxWidth: 250,
  },
  searchIcon: {
    marginRight: 8,
  },
  clearButton: {
    padding: 4,
  },
  bannerEditOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  bannerAddOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  errorContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
}); 