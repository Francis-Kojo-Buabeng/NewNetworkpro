import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import ProfileModal from '../../../components/ProfileModal';
import { useNavigation } from '@react-navigation/native';
import { pickVideo, recordVideo } from '../../../services/videoPicker';
import { pickDocument } from '../../../services/documentPicker';
import { pickLocation } from '../../../services/locationPicker';
import EventModal from './EventModal';
import CelebrationModal from './CelebrationModal';
import Snackbar from '../../../components/Snackbar';
import { usePosts } from '../../contexts/PostsContext';
import VideoPlayer from '../../../components/VideoPlayer';
import * as VideoThumbnails from 'expo-video-thumbnails';
import MyProfileScreen from '../profile/MyProfileScreen';

interface PostScreenProps {
  userAvatar?: string | null;
  userProfile?: any;
}

export default function PostScreen({ userAvatar, userProfile }: PostScreenProps) {
  const navigation = useNavigation();
  const { addPost } = usePosts();
  const [postText, setPostText] = useState('');
  const [selectedPrivacy, setSelectedPrivacy] = useState('Anyone');
  const [selectedMedia, setSelectedMedia] = useState<string[]>([]);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
  const theme = useCurrentTheme();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedVideoThumbnail, setSelectedVideoThumbnail] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; uri: string } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{ title: string; date: string; description: string } | null>(null);
  const [celebrationModalVisible, setCelebrationModalVisible] = useState(false);
  const [selectedCelebration, setSelectedCelebration] = useState<{ key: string; label: string } | null>(null);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });
  const showSnackbar = (message: string, type: 'success' | 'error' | 'info' = 'info') => setSnackbar({ visible: true, message, type });
  const [showMyProfileModal, setShowMyProfileModal] = useState(false);

  const handleClose = () => {
    navigation.goBack();
  };

  const handlePost = () => {
    const hasText = postText.trim().length > 0;
    const hasImage = selectedMedia.length > 0;
    const hasVideo = !!selectedVideo;
    const hasDocument = !!selectedDocument;
    const hasLocation = !!selectedLocation;
    const hasEvent = !!selectedEvent;
    const hasCelebration = !!selectedCelebration;

    if (hasText || hasImage || hasVideo || hasDocument || hasLocation || hasEvent || hasCelebration) {
      // Build new post object (add support for these media types as needed)
      const newPost = {
        id: Date.now(),
        author: userProfile ? (userProfile.firstName + (userProfile.lastName ? ' ' + userProfile.lastName : '')) : 'You',
        avatar: userProfile?.avatarUri ? { uri: userProfile.avatarUri } : (userAvatar ? { uri: userAvatar } : require('@/assets/images/Avator-Image.jpg')),
        company: userProfile?.currentCompany || '',
        time: 'Just now',
        content: postText,
        images: hasImage ? selectedMedia.map(uri => ({ uri })) : undefined,
        video: hasVideo ? { uri: selectedVideo, thumbnail: selectedVideoThumbnail, duration: '' } : undefined,
        document: hasDocument ? selectedDocument : undefined,
        location: hasLocation ? selectedLocation : undefined,
        event: hasEvent ? selectedEvent : undefined,
        celebration: hasCelebration ? selectedCelebration : undefined,
        likes: 0,
        comments: 0,
        shares: 0,
      };
      addPost(newPost);
      showSnackbar('Your post has been shared!', 'success');
      setPostText('');
      setSelectedMedia([]);
      setSelectedVideo(null);
      setSelectedVideoThumbnail(null);
      setSelectedDocument(null);
      setSelectedLocation(null);
      setSelectedEvent(null);
      setSelectedCelebration(null);
      navigation.goBack();
    } else {
      showSnackbar('Please write something or add media to post', 'error');
    }
  };

  const requestMediaPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showSnackbar('Please grant permission to access your photo library.', 'error');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestMediaPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImages = result.assets.map(asset => asset.uri);
        setSelectedMedia(prev => [...prev, ...newImages]);
      }
    } catch (error) {
      showSnackbar('Failed to pick image. Please try again.', 'error');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      showSnackbar('Please grant permission to access your camera.', 'error');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImage = result.assets[0].uri;
        setSelectedMedia(prev => [...prev, newImage]);
      }
    } catch (error) {
      showSnackbar('Failed to take photo. Please try again.', 'error');
    }
  };

  const removeImage = (index: number) => {
    setSelectedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllMedia = () => {
    setSelectedMedia([]);
  };

  const pickVideoWithThumbnail = async () => {
    const uri = await pickVideo();
    if (uri) {
      setSelectedVideo(uri);
      try {
        const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(uri, { time: 1000 });
        setSelectedVideoThumbnail(thumbUri);
      } catch (e) {
        setSelectedVideoThumbnail(null);
      }
    }
  };

  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showVideoOptions, setShowVideoOptions] = useState(false);

  const addMedia = async (type: 'photo' | 'video' | 'document' | 'event' | 'location' | 'celebration') => {
    if (type === 'photo') {
      setShowPhotoOptions(true);
    } else if (type === 'video') {
      setShowVideoOptions(true);
    } else if (type === 'document') {
      const doc = await pickDocument();
      if (doc && 'name' in doc && 'uri' in doc) setSelectedDocument({ name: String(doc.name), uri: String(doc.uri) });
    } else if (type === 'location') {
      const loc = await pickLocation();
      if (loc) setSelectedLocation(loc);
    } else if (type === 'event') {
      setEventModalVisible(true);
    } else if (type === 'celebration') {
      setCelebrationModalVisible(true);
    }
  };

  const handleTakePhoto = async () => {
    setShowPhotoOptions(false);
    await takePhoto();
  };

  const handleChoosePhoto = async () => {
    setShowPhotoOptions(false);
    await pickImage();
  };

  const handleRecordVideo = async () => {
    setShowVideoOptions(false);
    const uri = await recordVideo();
    if (uri) {
      setSelectedVideo(uri);
      try {
        const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(uri, { time: 1000 });
        setSelectedVideoThumbnail(thumbUri);
      } catch (e) {
        setSelectedVideoThumbnail(null);
      }
    }
  };

  const handleChooseVideo = async () => {
    setShowVideoOptions(false);
    await pickVideoWithThumbnail();
  };

  const handleEventSave = (event: { title: string; date: string; description: string }) => {
    setSelectedEvent(event);
  };

  const handleCelebrationSelect = (celebration: { key: string; label: string }) => {
    setSelectedCelebration(celebration);
  };

  const renderPrivacyOption = (option: string) => (
    <TouchableOpacity
      key={option}
      style={[
        styles.privacyOption,
        selectedPrivacy === option && { backgroundColor: theme.primaryColor }
      ]}
      onPress={() => setSelectedPrivacy(option)}
    >
      <Text style={[
        styles.privacyOptionText,
        { color: selectedPrivacy === option ? '#fff' : theme.textColor }
      ]}>
        {option}
      </Text>
    </TouchableOpacity>
  );

  const renderMediaOption = (icon: string, label: string, type: 'photo' | 'video' | 'document' | 'event' | 'location' | 'celebration') => (
    <TouchableOpacity
      key={label}
      style={styles.mediaOption}
      onPress={() => addMedia(type)}
    >
      <MaterialCommunityIcons name={icon as any} size={20} color={theme.textSecondaryColor} />
      <Text style={[styles.mediaOptionText, { color: theme.textColor }]}>{label}</Text>
    </TouchableOpacity>
  );

  const renderSelectedMedia = () => {
    if (
      selectedMedia.length === 0 &&
      !selectedVideo &&
      !selectedVideoThumbnail &&
      !selectedDocument &&
      !selectedLocation &&
      !selectedEvent &&
      !selectedCelebration
    ) return null;

    return (
      <View style={styles.selectedMediaContainer}>
        {/* Images */}
        {selectedMedia.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.mediaScrollView}>
            {selectedMedia.map((mediaUri, index) => (
              <View key={index} style={styles.mediaItem}>
                <Image source={{ uri: mediaUri }} style={styles.mediaPreview} />
                <TouchableOpacity
                  style={styles.removeMediaButton}
                  onPress={() => removeImage(index)}
                >
                  <MaterialCommunityIcons name="close-circle" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
        {/* Video */}
        {selectedVideo && (
          <View style={styles.selectedVideoContainer}>
            <Text style={[styles.selectedMediaTitle, { color: theme.textColor }]}>Selected Video:</Text>
            {selectedVideoThumbnail ? (
              <Image source={{ uri: selectedVideoThumbnail }} style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 8 }} resizeMode="cover" />
            ) : (
              <View style={{ width: '100%', height: 200, borderRadius: 12, backgroundColor: '#000', marginBottom: 8, justifyContent: 'center', alignItems: 'center' }}>
                <MaterialCommunityIcons name="play" size={48} color="#fff" />
              </View>
            )}
            <TouchableOpacity onPress={() => { setSelectedVideo(null); setSelectedVideoThumbnail(null); }}>
              <Text style={[styles.clearAllText, { color: theme.primaryColor }]}>Remove Video</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Document */}
        {selectedDocument && (
          <View style={styles.selectedDocumentContainer}>
            <Text style={[styles.selectedMediaTitle, { color: theme.textColor }]}>Selected Document:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <MaterialCommunityIcons name="file-document" size={32} color={theme.primaryColor} />
              <Text style={{ color: theme.textColor, marginLeft: 8 }}>{selectedDocument.name}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedDocument(null)}>
              <Text style={[styles.clearAllText, { color: theme.primaryColor }]}>Remove Document</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Location */}
        {selectedLocation && (
          <View style={styles.selectedLocationContainer}>
            <Text style={[styles.selectedMediaTitle, { color: theme.textColor }]}>Selected Location:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <MaterialCommunityIcons name="map-marker" size={32} color={theme.primaryColor} />
              <Text style={{ color: theme.textColor, marginLeft: 8 }}>Lat: {selectedLocation.coords.latitude}, Lon: {selectedLocation.coords.longitude}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedLocation(null)}>
              <Text style={[styles.clearAllText, { color: theme.primaryColor }]}>Remove Location</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Event */}
        {selectedEvent && (
          <View style={styles.selectedEventContainer}>
            <Text style={[styles.selectedMediaTitle, { color: theme.textColor }]}>Event:</Text>
            <View style={{ backgroundColor: theme.surfaceColor, borderRadius: 8, padding: 12, marginBottom: 8 }}>
              <Text style={{ color: theme.textColor, fontWeight: 'bold', fontSize: 16 }}>{selectedEvent.title}</Text>
              <Text style={{ color: theme.textSecondaryColor }}>{selectedEvent.date}</Text>
              <Text style={{ color: theme.textColor }}>{selectedEvent.description}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedEvent(null)}>
              <Text style={[styles.clearAllText, { color: theme.primaryColor }]}>Remove Event</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Celebration */}
        {selectedCelebration && (
          <View style={styles.selectedCelebrationContainer}>
            <Text style={[styles.selectedMediaTitle, { color: theme.textColor }]}>Celebration:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 32 }}>{selectedCelebration.key}</Text>
              <Text style={{ color: theme.textColor, fontSize: 18, marginLeft: 8 }}>{selectedCelebration.label}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedCelebration(null)}>
              <Text style={[styles.clearAllText, { color: theme.primaryColor }]}>Remove Celebration</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* Clear all button for images */}
        {selectedMedia.length > 0 && (
          <TouchableOpacity onPress={clearAllMedia}>
            <Text style={[styles.clearAllText, { color: theme.primaryColor }]}>Clear all images</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Helper to build a mock profile object from user data
  const buildProfile = (user: any) => ({
    id: user.id?.toString() || '',
    name: user.name || 'John Doe',
    title: user.title || 'Professional',
    company: user.company || '',
    avatar: user.avatar,
    mutualConnections: 12,
    isOnline: true,
    isConnected: false,
    isPending: false,
    location: 'San Francisco, CA',
    about: 'Experienced professional passionate about networking and growth.',
    experience: [
      { id: '1', title: 'Senior Developer', company: user.company || 'Company', duration: '2 yrs', description: 'Worked on various projects.' }
    ],
    education: [
      { id: '1', degree: 'B.Sc. Computer Science', school: 'University', year: '2018' }
    ],
    skills: ['Networking', 'React Native', 'Leadership'],
  });

  const handleProfilePress = (user: any) => {
    setSelectedProfile(buildProfile(user));
    setProfileModalVisible(true);
  };

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <MaterialCommunityIcons name="close" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>Create a post</Text>
          <TouchableOpacity 
            style={[
              styles.postButton,
              { backgroundColor: postText.trim() || selectedMedia.length > 0 ? theme.primaryColor : '#ccc' }
            ]}
            onPress={handlePost}
            disabled={!postText.trim() && selectedMedia.length === 0}
          >
            <Text style={[styles.postButtonText, { color: postText.trim() || selectedMedia.length > 0 ? '#fff' : theme.textSecondaryColor }]}>
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Section */}
        <View style={styles.userSection}>
          <TouchableOpacity onPress={() => setShowMyProfileModal(true)}>
            <Image
              source={userProfile?.avatarUri ? { uri: userProfile.avatarUri } : (userAvatar ? { uri: userAvatar } : require('@/assets/images/Avator-Image.jpg'))}
              style={styles.userAvatar}
            />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.textColor }]}>{userProfile ? (userProfile.firstName + (userProfile.lastName ? ' ' + userProfile.lastName : '')) : 'Your Name'}</Text>
            <TouchableOpacity style={styles.privacySelector}>
              <MaterialCommunityIcons name="earth" size={16} color={theme.textSecondaryColor} />
              <Text style={[styles.privacyText, { color: theme.textColor }]}>{selectedPrivacy}</Text>
              <MaterialCommunityIcons name="chevron-down" size={16} color={theme.textSecondaryColor} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Post Input */}
        <View style={styles.postInputContainer}>
          <TextInput
            style={[styles.postInput, { color: theme.textColor }]}
            placeholder="What do you want to talk about?"
            placeholderTextColor={theme.placeholderColor}
            value={postText}
            onChangeText={setPostText}
            multiline
            textAlignVertical="top"
            autoFocus
          />
          {renderSelectedMedia()}
        </View>

        {/* Privacy Options */}
        <View style={styles.privacySection}>
          <Text style={[styles.privacyTitle, { color: theme.textColor }]}>Who can see your post?</Text>
          <View style={styles.privacyOptions}>
            {renderPrivacyOption('Anyone')}
            {renderPrivacyOption('Connections')}
            {renderPrivacyOption('Connections only')}
          </View>
        </View>

        {/* Media Options */}
        <View style={[styles.mediaSection, { borderTopColor: theme.borderColor }]}>
          <Text style={[styles.mediaTitle, { color: theme.textColor }]}>Add to your post</Text>
          <View style={styles.mediaOptions}>
            {renderMediaOption('image', 'Photo', 'photo')}
            {renderMediaOption('video', 'Video', 'video')}
            {renderMediaOption('file-document', 'Document', 'document')}
            {renderMediaOption('calendar', 'Event', 'event')}
            {renderMediaOption('map-marker', 'Location', 'location')}
            {renderMediaOption('emoticon', 'Celebration', 'celebration')}
          </View>
        </View>

        {/* Recent Posts Preview */}
        <View style={styles.recentPostsSection}>
          <View style={styles.feedHeader}>
            <Text style={[styles.feedTitle, { color: theme.textColor }]}>Recent posts</Text>
            <TouchableOpacity style={[styles.sortButton, { borderColor: theme.borderColor }]}>
              <MaterialCommunityIcons name="sort" size={16} color={theme.textColor} />
              <Text style={[styles.sortText, { color: theme.textColor }]}>Top</Text>
            </TouchableOpacity>
          </View>

          {/* Sample Post */}
          <View style={[styles.postCard, { backgroundColor: theme.cardColor, borderColor: theme.borderColor }]}>
            <View style={styles.postHeader}>
              <TouchableOpacity onPress={() => handleProfilePress({ name: 'Jane Smith', avatar: require('@/assets/images/Avator-Image.jpg') })}>
                <Image
                  source={require('@/assets/images/Avator-Image.jpg')} 
                  style={styles.postAvatar} 
                />
              </TouchableOpacity>
              <View style={styles.postInfo}>
                <Text style={[styles.postName, { color: theme.textColor }]}>Jane Smith</Text>
                <Text style={[styles.postTime, { color: theme.textSecondaryColor }]}>1 day ago • <MaterialCommunityIcons name="earth" size={12} color={theme.textSecondaryColor} /></Text>
              </View>
              <TouchableOpacity style={styles.moreButton}>
                <MaterialCommunityIcons name="dots-horizontal" size={20} color={theme.textSecondaryColor} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.postText, { color: theme.textColor }]}>
              Just completed an amazing networking event! The connections I made today will be invaluable for my career growth. Remember, your network is your net worth! 💼✨
            </Text>
            <View style={[styles.postActions, { borderTopColor: theme.borderColor }]}>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="thumb-up-outline" size={16} color={theme.textSecondaryColor} />
                <Text style={[styles.actionText, { color: theme.textSecondaryColor }]}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="comment-outline" size={16} color={theme.textSecondaryColor} />
                <Text style={[styles.actionText, { color: theme.textSecondaryColor }]}>Comment</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="share-variant-outline" size={16} color={theme.textSecondaryColor} />
                <Text style={[styles.actionText, { color: theme.textSecondaryColor }]}>Share</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="send" size={16} color={theme.textSecondaryColor} />
                <Text style={[styles.actionText, { color: theme.textSecondaryColor }]}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
    </View>
      </ScrollView>

      {/* Profile Modal */}
      {selectedProfile && (
        <ProfileModal
          visible={profileModalVisible}
          onClose={() => setProfileModalVisible(false)}
          profile={selectedProfile}
        />
      )}
      {/* Modals for Event and Celebration */}
      <EventModal visible={eventModalVisible} onClose={() => setEventModalVisible(false)} onSave={handleEventSave} />
      <CelebrationModal visible={celebrationModalVisible} onClose={() => setCelebrationModalVisible(false)} onSelect={handleCelebrationSelect} />

      {/* Photo Options Modal */}
      <Modal
        visible={showPhotoOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPhotoOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardColor }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Add Photo</Text>
            <Text style={[styles.modalMessage, { color: theme.textSecondaryColor }]}>
              Choose how you want to add a photo
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={handleTakePhoto}
              >
                <MaterialCommunityIcons name="camera" size={20} color="#fff" />
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={handleChoosePhoto}
              >
                <MaterialCommunityIcons name="image" size={20} color={theme.primaryColor} />
                <Text style={[styles.modalButtonText, { color: theme.primaryColor }]}>Choose from Library</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowPhotoOptions(false)}
            >
              <Text style={[styles.cancelButtonText, { color: theme.textSecondaryColor }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Video Options Modal */}
      <Modal
        visible={showVideoOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowVideoOptions(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardColor }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Add Video</Text>
            <Text style={[styles.modalMessage, { color: theme.textSecondaryColor }]}>
              Choose how you want to add a video
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={handleRecordVideo}
              >
                <MaterialCommunityIcons name="video" size={20} color="#fff" />
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Record Video</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={handleChooseVideo}
              >
                <MaterialCommunityIcons name="video" size={20} color={theme.primaryColor} />
                <Text style={[styles.modalButtonText, { color: theme.primaryColor }]}>Choose from Library</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowVideoOptions(false)}
            >
              <Text style={[styles.cancelButtonText, { color: theme.textSecondaryColor }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* MyProfileScreen Modal */}
      {showMyProfileModal && (
        <Modal visible={showMyProfileModal} animationType="slide" onRequestClose={() => setShowMyProfileModal(false)}>
          <MyProfileScreen
            profile={userProfile}
            onBack={() => setShowMyProfileModal(false)}
          />
          <TouchableOpacity style={{ position: 'absolute', top: 40, right: 24, zIndex: 100 }} onPress={() => setShowMyProfileModal(false)}>
            <MaterialCommunityIcons name="close" size={32} color="#222" />
          </TouchableOpacity>
        </Modal>
      )}
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onHide={() => setSnackbar({ ...snackbar, visible: false })}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  postButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  privacySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyText: {
    fontSize: 14,
    marginHorizontal: 4,
  },
  postInputContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  postInput: {
    fontSize: 16,
    lineHeight: 22,
    minHeight: 100,
  },
  privacySection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  privacyOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  privacyOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  privacyOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mediaSection: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  mediaTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  mediaOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mediaOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  mediaOptionText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  selectedMediaContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    marginTop: 8,
  },
  selectedMediaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedMediaTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  mediaScrollView: {
    // Add any specific styles for the ScrollView if needed
  },
  mediaItem: {
    position: 'relative',
    marginRight: 8,
  },
  mediaPreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 4,
  },
  removeMediaButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 12,
    padding: 4,
  },
  recentPostsSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  sortText: {
    fontSize: 14,
    marginLeft: 4,
  },
  postCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postInfo: {
    flex: 1,
  },
  moreButton: {
    padding: 4,
  },
  postName: {
    fontSize: 16,
    fontWeight: '600',
  },
  postTime: {
    fontSize: 14,
    marginTop: 2,
  },
  postText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 6,
  },
  selectedVideoContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    marginTop: 8,
  },
  selectedDocumentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    marginTop: 8,
  },
  selectedLocationContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    marginTop: 8,
  },
  selectedEventContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    marginTop: 8,
  },
  selectedCelebrationContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 16,
  },
  modalButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#0073b1',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0073b1',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 