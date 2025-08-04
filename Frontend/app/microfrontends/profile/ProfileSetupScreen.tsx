import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator, ActionSheetIOS, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useSkills } from '../../../hooks/useSkills';
import { skillsUtils } from '../../../services/skillsAPI';
import { useCurrentTheme, getLogoAsset, useTheme } from '../../../contexts/ThemeContext';
import ThemedLogo from '../../../components/ThemedLogo';
import { createOrGetUserProfile, uploadProfilePicture, updateUserProfile } from '../../../services/userAPI';
import Snackbar from '../../../components/Snackbar';
import AvatarActionModal from '../../../components/AvatarActionModal';
import { useEffect } from 'react';
import { userSessionService } from '../../../services/userSession';

interface ProfileSetupScreenProps {
  onContinue: (avatarUri?: string | null, createdProfile?: any) => void;
}

export default function ProfileSetupScreen({ onContinue }: ProfileSetupScreenProps) {
  const theme = useCurrentTheme();
  const { currentTheme } = useTheme();
  const [fullName, setFullName] = useState('');
  const [profession, setProfession] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; } | null>(null);
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [filteredSkills, setFilteredSkills] = useState<string[]>([]);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });
  const [avatarActionModalVisible, setAvatarActionModalVisible] = useState(false);

  // Use the skills hook for API integration
  const {
    skills,
    isLoading: isLoadingSkills,
    isSyncing,
    error: skillsError,
    lastSyncTime,
    addSkill,
    removeSkill,
    clearError: clearSkillsError
  } = useSkills();

  // Log when avatarUri changes
  useEffect(() => {
    console.log('ProfileSetupScreen - avatarUri changed to:', avatarUri);
  }, [avatarUri]);

  // Predefined list of professional skills
  const predefinedSkills = [
    'JavaScript', 'React', 'React Native', 'TypeScript', 'Node.js', 'Python', 'Java', 'C++', 'C#', 'PHP',
    'HTML', 'CSS', 'Sass', 'Less', 'Angular', 'Vue.js', 'Express.js', 'Django', 'Flask', 'Spring Boot',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
    'Git', 'GitHub', 'GitLab', 'CI/CD', 'Jenkins', 'Agile', 'Scrum', 'Kanban', 'JIRA', 'Confluence',
    'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign', 'Premiere Pro', 'After Effects',
    'Leadership', 'Communication', 'Problem Solving', 'Critical Thinking', 'Teamwork', 'Time Management',
    'Project Management', 'Data Analysis', 'Machine Learning', 'AI', 'Deep Learning', 'TensorFlow', 'PyTorch',
    'Sales', 'Marketing', 'Customer Service', 'Business Development', 'Product Management', 'UX Design',
    'UI Design', 'Graphic Design', 'Content Writing', 'SEO', 'Digital Marketing', 'Social Media Marketing'
  ];

  const handleSkillInputChange = (text: string) => {
    setSkillInput(text);
    if (text.trim()) {
      const filtered = skillsUtils.getSuggestions(text, predefinedSkills, skills);
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills([]);
    }
  };

  const selectSkillFromList = async (skill: string) => {
    try {
      await addSkill(skill);
      setSkillInput('');
      setShowSkillInput(false);
      setFilteredSkills([]);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleSkillInputSubmit = async () => {
    const skill = skillInput.trim();
    if (skill) {
      try {
        await addSkill(skill);
        setSkillInput('');
        setShowSkillInput(false);
        setFilteredSkills([]);
      } catch (error) {
        // Error is handled by the hook
      }
    } else {
      // If no skill entered, just close the input
      setShowSkillInput(false);
      setFilteredSkills([]);
    }
  };

  const toggleSkillInput = () => {
    setShowSkillInput(!showSkillInput);
    if (!showSkillInput) {
      setSkillInput('');
      setFilteredSkills([]);
      clearSkillsError(); // Clear any previous errors
    }
  };

  const handleAvatarPress = async () => {
    console.log('ProfileSetupScreen - Avatar pressed, current avatarUri:', avatarUri);
    
    if (Platform.OS === 'ios') {
      // Use ActionSheet for iOS
      const options = ['Choose from Gallery', 'Take Photo'];
      if (avatarUri) {
        options.push('Remove Photo');
      }
      options.push('Cancel');
      
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
          destructiveButtonIndex: avatarUri ? options.length - 2 : undefined,
        },
        async (buttonIndex) => {
          if (buttonIndex === 0) {
            // Choose from Gallery
            await handleChooseFromGallery();
          } else if (buttonIndex === 1) {
            // Take Photo
            await handleTakePhoto();
          } else if (buttonIndex === 2 && avatarUri) {
            // Remove Photo
            console.log('ProfileSetupScreen - Removing avatar');
            setAvatarUri(null);
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
    setLoading(true);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setLoading(false);
      setErrors({ fullName: 'Permission to access gallery is required!' });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    setLoading(false);
    if (!result.canceled && result.assets && result.assets.length > 0) {
      console.log('ProfileSetupScreen - Selected image from gallery:', result.assets[0].uri);
      setAvatarUri(result.assets[0].uri);
    } else {
      console.log('ProfileSetupScreen - No image selected from gallery');
    }
  };

  // Handler for taking photo
  const handleTakePhoto = async () => {
    setLoading(true);
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setLoading(false);
      setErrors({ fullName: 'Permission to access camera is required!' });
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    setLoading(false);
    if (!result.canceled && result.assets && result.assets.length > 0) {
      console.log('ProfileSetupScreen - Selected image from camera:', result.assets[0].uri);
      setAvatarUri(result.assets[0].uri);
    } else {
      console.log('ProfileSetupScreen - No image selected from camera');
    }
  };

  const handleContinue = async () => {
    let hasError = false;
    const newErrors: { fullName?: string } = {};
    if (!fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
      hasError = true;
    }
    setErrors(hasError ? newErrors : null);
    if (hasError) return;

    // Split fullName into firstName and lastName (naive split)
    const [firstName, ...rest] = fullName.trim().split(' ');
    const lastName = rest.join(' ') || '-';

    setLoading(true);
    try {
      // Get user email from session
      const userEmail = userSessionService.getUserEmail();
      console.log('ProfileSetupScreen - User email from session:', userEmail);

      // First, create or get the user profile by email
      let createdProfile = await createOrGetUserProfile(userEmail || '');
      console.log('ProfileSetupScreen - Created/retrieved profile:', createdProfile);

      // Update the profile with the user's information
      const updatedProfile = await updateUserProfile(createdProfile.id, {
        firstName,
        lastName,
        headline: profession,
        summary: bio,
        location,
        skills,
        // Add more fields as needed
      });

      console.log('ProfileSetupScreen - Updated profile:', updatedProfile);

      // If avatar is selected, upload it
      let uploadedImageUrl = null;
      if (avatarUri) {
        try {
          console.log('ProfileSetupScreen - Uploading avatar:', avatarUri);
          console.log('ProfileSetupScreen - Profile ID:', updatedProfile.id);
          uploadedImageUrl = await uploadProfilePicture(updatedProfile.id, avatarUri);
          console.log('ProfileSetupScreen - Upload successful, URL:', uploadedImageUrl);
          // Update the profile with the uploaded image URL
          updatedProfile.profilePictureUrl = uploadedImageUrl;
          console.log('ProfileSetupScreen - Updated profile with avatar:', updatedProfile);
        } catch (uploadError) {
          console.error('Failed to upload profile picture:', uploadError);
          // Continue without profile picture if upload fails
        }
      } else {
        console.log('ProfileSetupScreen - No avatar selected, skipping upload');
      }

      console.log('ProfileSetupScreen - Final updated profile:', updatedProfile);
      console.log('ProfileSetupScreen - Final uploaded image URL:', uploadedImageUrl);
      
      // Update user session with the updated profile
      userSessionService.updateUserProfile(updatedProfile);
      console.log('ProfileSetupScreen - User session updated with profile');
      
      setLoading(false);
      console.log('ProfileSetupScreen - Calling onContinue with:', uploadedImageUrl, updatedProfile);
      onContinue(uploadedImageUrl, updatedProfile);
    } catch (error: any) {
      setLoading(false);
      setErrors({ fullName: error.message || 'Could not create profile.' });
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.backgroundColor }]} keyboardShouldPersistTaps="handled">
      {/* App Logo */}
      <View style={styles.headerRow}>
        <ThemedLogo
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      {/* Title and Subtitle */}
      <Text style={[styles.title, { color: theme.textColor }]}>Profile Setup</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondaryColor }]}>Tell us about yourself</Text>
      {/* Avatar Placeholder */}
      <TouchableOpacity
        style={styles.avatarCircle}
        onPress={handleAvatarPress}
        activeOpacity={0.7}
        disabled={loading}
        accessibilityLabel="Change profile photo"
        accessibilityRole="button"
      >
        <Image
          source={avatarUri ? { uri: avatarUri } : require('@/assets/images/Avator-Image.jpg')}
          style={styles.avatarIcon}
          resizeMode="cover"
        />
        {/* Overlay with camera icon */}
        <View style={styles.avatarOverlay} pointerEvents="none">
          {loading ? (
            <ActivityIndicator color={theme.textColor} size="small" />
          ) : (
            !avatarUri && (
              <View style={styles.cameraIconBg}>
                <MaterialCommunityIcons name="camera" size={38} color={theme.textColor} style={styles.cameraIcon} />
              </View>
            )
          )}
        </View>
      </TouchableOpacity>
      {/* Input Fields */}
      <View style={styles.inputGroup}>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackgroundColor, color: theme.textColor }, errors?.fullName && { borderColor: theme.dangerColor }]}
          placeholder="Full Name"
          placeholderTextColor={theme.placeholderColor}
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          accessibilityLabel="Full Name"
        />
        {errors?.fullName && <Text style={[styles.errorText, { color: theme.dangerColor }]}>{errors.fullName}</Text>}
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]}
          placeholder="Profession"
          placeholderTextColor={theme.placeholderColor}
          value={profession}
          onChangeText={setProfession}
          accessibilityLabel="Profession"
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]}
          placeholder="Bio"
          placeholderTextColor={theme.placeholderColor}
          value={bio}
          onChangeText={setBio}
          accessibilityLabel="Bio"
        />
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]}
          placeholder="Location"
          placeholderTextColor={theme.placeholderColor}
          value={location}
          onChangeText={setLocation}
          accessibilityLabel="Location"
        />
      </View>
      {/* Skills Section */}
      <Text style={[styles.skillsLabel, { color: theme.textColor }]}>Skills</Text>
      <View style={styles.skillsContainer}>
        {/* Skill Tags */}
        <View style={styles.skillsTagsContainer}>
          {isLoadingSkills ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={theme.primaryColor} />
              <Text style={[styles.loadingText, { color: theme.textSecondaryColor }]}>Loading skills...</Text>
            </View>
          ) : (
            skills.map(skill => (
              <View key={skill} style={[styles.skillChip, { backgroundColor: theme.primaryColor }]}>
                <Text style={[styles.skillText, { color: theme.textColor }]}>{skill}</Text>
                <TouchableOpacity 
                  onPress={() => removeSkill(skill)} 
                  accessibilityLabel={`Remove ${skill}`}
                  disabled={isSyncing}
                >
                  <MaterialCommunityIcons 
                    name="close-circle" 
                    size={16} 
                    color={isSyncing ? theme.textTertiaryColor : theme.textColor} 
                  />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
        
        {/* Add Skill Button or Input */}
        {!showSkillInput ? (
          <TouchableOpacity 
            style={[styles.addSkillButton, { backgroundColor: theme.cardColor }, skills.length >= 15 && styles.addSkillButtonDisabled]} 
            onPress={toggleSkillInput} 
            disabled={skills.length >= 15 || isSyncing}
            accessibilityLabel="Add skill"
            activeOpacity={0.7}
          >
            {isSyncing ? (
              <ActivityIndicator size="small" color={theme.textColor} style={styles.plusIcon} />
            ) : (
              <MaterialCommunityIcons name="plus" size={16} color={theme.textColor} style={styles.plusIcon} />
            )}
            <Text style={[styles.addSkillText, { color: theme.textColor }]}>
              {isSyncing ? 'Syncing...' : '+ Add Skill'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.skillInputContainer}>
            <TextInput
              style={[styles.skillInput, { backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]}
              placeholder="Type a skill..."
              placeholderTextColor={theme.placeholderColor}
              value={skillInput}
              onChangeText={handleSkillInputChange}
              onSubmitEditing={handleSkillInputSubmit}
              autoFocus={true}
              returnKeyType="done"
            />
            {filteredSkills.length > 0 && (
              <ScrollView 
                style={styles.suggestionsContainer}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
              >
                {filteredSkills.map(skill => (
                  <TouchableOpacity
                    key={skill}
                    style={[styles.suggestionItem, { backgroundColor: theme.cardColor }]}
                    onPress={() => selectSkillFromList(skill)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.suggestionText, { color: theme.textColor }]}>{skill}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            <TouchableOpacity style={styles.cancelButton} onPress={toggleSkillInput} activeOpacity={0.7}>
              <Text style={[styles.cancelButtonText, { color: theme.primaryColor }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {skillsError && (
          <Text style={[styles.errorText, { color: theme.dangerColor }]}>{skillsError}</Text>
        )}
        
        {skills.length >= 15 && (
          <Text style={[styles.skillLimitText, { color: theme.warningColor }]}>Maximum 15 skills reached</Text>
        )}
        
        {lastSyncTime && (
          <Text style={[styles.syncStatusText, { color: theme.textTertiaryColor }]}>
            Last synced: {lastSyncTime.toLocaleTimeString()}
          </Text>
        )}
      </View>
      {/* Next Button */}
      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: theme.primaryColor }, !fullName.trim() && { opacity: 0.5 }]}
        onPress={handleContinue}
        disabled={!fullName.trim()}
        accessibilityLabel="Continue"
        accessibilityRole="button"
      >
        <Text style={[styles.nextButtonText, { color: theme.textColor }]}>Next</Text>
      </TouchableOpacity>
      
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
        onRemovePhoto={() => {
          console.log('ProfileSetupScreen - Removing avatar');
          setAvatarUri(null);
        }}
        hasProfilePicture={!!avatarUri}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 32,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 32,
    alignSelf: 'center',
  },
  avatarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1a2233',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    overflow: 'hidden',
  },
  avatarIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  inputGroup: {
    width: '100%',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#181f2b',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#232b3b',
  },
  skillsLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  skillsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  skillsTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  addSkillButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addSkillButtonDisabled: {
    backgroundColor: '#F2F2F2',
    opacity: 0.6,
  },
  addSkillText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  plusIcon: {
    marginRight: 8,
  },
  skillInputContainer: {
    width: '100%',
    marginBottom: 12,
  },
  skillInput: {
    width: '100%',
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    maxHeight: 200,
    marginBottom: 8,
    elevation: 3,
  },
  suggestionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    minHeight: 48,
    justifyContent: 'center',
  },
  suggestionText: {
    color: '#1A1A1A',
    fontSize: 16,
  },
  cancelButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
  skillLimitText: {
    color: '#FF6B6B',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    color: '#90a4ae',
    fontSize: 16,
    marginLeft: 12,
  },
  syncStatusText: {
    color: '#90a4ae',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  nextButton: {
    width: '100%',
    backgroundColor: '#1877F2',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  avatarOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
  },
  cameraIcon: {
    opacity: 0.8,
  },
  inputError: {
    borderColor: '#ff5252',
  },
  errorText: {
    color: '#ff5252',
    fontSize: 14,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1877F2',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    elevation: 2,
  },
  skillText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 6,
  },
  cameraIconBg: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
  },
}); 