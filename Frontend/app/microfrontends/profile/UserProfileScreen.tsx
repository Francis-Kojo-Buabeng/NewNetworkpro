import React, { useState } from 'react';
import ProfileScreen, { ProfileLayout, ProfileScreenProps } from './ProfileScreen';
import { TouchableOpacity, View, Text, Image, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import { useProfileNavigation } from '../../../contexts/ProfileNavigationContext';
import MessageModal from '../../../components/MessageModal';
import Snackbar from '../../../components/Snackbar';

const bannerImages = [
  require('@/assets/images/banner-images/banner-01.jpg'),
  require('@/assets/images/banner-images/banner-02.jpg'),
  require('@/assets/images/banner-images/banner-03.jpg'),
  require('@/assets/images/banner-images/banner-04.jpg'),
  require('@/assets/images/banner-images/banner-05.jpg'),
  require('@/assets/images/banner-images/banner-06.jpg'),
  require('@/assets/images/banner-images/banner-07.jpg'),
];

export default function UserProfileScreen({ profile, onBack, onConnect, onMessage }: ProfileScreenProps) {
  const theme = useCurrentTheme();
  const { handleConnect, handleMessage, handleAccept, handleIgnore } = useProfileNavigation();
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isIgnoring, setIsIgnoring] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });
  
  // Use banner image from profile if available, otherwise pick one based on user id
  let bannerImage = null;
  if (profile && profile.headerImage) {
    // If profile has a headerImage, use it directly
    bannerImage = profile.headerImage;
  } else {
    // Fallback to picking a banner image based on user id
    if (profile && profile.id) {
      const idx = parseInt(profile.id, 10);
      if (!isNaN(idx)) {
        bannerImage = Image.resolveAssetSource(bannerImages[idx % bannerImages.length]).uri;
      } else {
        bannerImage = Image.resolveAssetSource(bannerImages[Math.floor(Math.random() * bannerImages.length)]).uri;
      }
    }
  }
  
  // Get avatar image from profile
  const avatarImage = profile?.avatar || profile?.profilePictureUrl || null;
  
  console.log('UserProfileScreen - Profile:', profile);
  console.log('UserProfileScreen - Profile.avatar:', profile?.avatar);
  console.log('UserProfileScreen - Profile.profilePictureUrl:', profile?.profilePictureUrl);
  console.log('UserProfileScreen - Final avatarImage:', avatarImage);
  console.log('UserProfileScreen - Avatar type:', typeof avatarImage);
  console.log('UserProfileScreen - Banner image:', bannerImage);
  console.log('UserProfileScreen - Connection status:', {
    isConnected: profile?.isConnected,
    isPending: profile?.isPending,
    isPendingReceived: profile?.isPendingReceived
  });
  
  // Create conversation object for MessageModal
  const createConversation = () => {
    return {
      id: profile.id,
      contactName: profile.name,
      contactAvatar: avatarImage || require('@/assets/images/Avator-Image.jpg'),
      contactTitle: profile.title,
      contactCompany: profile.company,
      isOnline: profile.isOnline || false,
      messages: [
        {
          id: '1',
          sender: profile.name,
          senderAvatar: avatarImage || require('@/assets/images/Avator-Image.jpg'),
          content: `Hi! I saw your profile and thought we might have some mutual interests. Would love to connect!`,
          timestamp: '2 hours ago',
          isFromMe: false,
        },
        {
          id: '2',
          sender: 'You',
          senderAvatar: require('@/assets/images/Avator-Image.jpg'),
          content: `Thanks for reaching out! I'd be happy to connect and discuss potential opportunities.`,
          timestamp: '1 hour ago',
          isFromMe: true,
        },
        {
          id: '3',
          sender: profile.name,
          senderAvatar: avatarImage || require('@/assets/images/Avator-Image.jpg'),
          content: `Great! I'm particularly interested in your work on ${profile.company}. Do you have time for a quick chat this week?`,
          timestamp: '30 minutes ago',
          isFromMe: false,
        }
      ]
    };
  };
  
  // Handle connect button press
  const handleConnectPress = async () => {
    if (isConnecting) return;
    
    setIsConnecting(true);
    try {
      await handleConnect(profile.id);
      setSnackbar({ visible: true, message: `Connection request sent to ${profile.name}`, type: 'success' });
    } catch (error) {
      setSnackbar({ visible: true, message: 'Failed to send connection request. Please try again.', type: 'error' });
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Handle accept button press
  const handleAcceptPress = async () => {
    if (isAccepting) return;
    
    setIsAccepting(true);
    try {
      await handleAccept(profile.id);
      setSnackbar({ visible: true, message: `Connection accepted with ${profile.name}`, type: 'success' });
    } catch (error) {
      setSnackbar({ visible: true, message: 'Failed to accept connection. Please try again.', type: 'error' });
    } finally {
      setIsAccepting(false);
    }
  };
  
  // Handle ignore button press
  const handleIgnorePress = async () => {
    if (isIgnoring) return;
    
    setIsIgnoring(true);
    try {
      await handleIgnore(profile.id);
      setSnackbar({ visible: true, message: `Connection request ignored`, type: 'info' });
    } catch (error) {
      setSnackbar({ visible: true, message: 'Failed to ignore connection. Please try again.', type: 'error' });
    } finally {
      setIsIgnoring(false);
    }
  };
  
  // Handle message button press
  const handleMessagePress = () => {
    console.log('UserProfileScreen - Opening message modal for:', profile.name);
    setMessageModalVisible(true);
  };
  
  // Render different buttons based on connection status
  const renderActionButtons = () => {
    if (profile?.isConnected) {
      // Connected state - show "Connected" and "Message" buttons
      return (
        <View style={[{ flexDirection: 'row', justifyContent: 'center', marginVertical: 12 }]}>
          <View style={{ 
            borderColor: theme.successColor, 
            backgroundColor: theme.successColor, 
            borderRadius: 8, 
            paddingVertical: 8, 
            paddingHorizontal: 24, 
            borderWidth: 1, 
            flexDirection: 'row', 
            alignItems: 'center', 
            marginRight: 8 
          }}>
            <MaterialCommunityIcons name="check-circle" size={20} color="white" />
            <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 6 }}>Connected</Text>
          </View>
          <TouchableOpacity 
            style={{ 
              borderColor: theme.primaryColor, 
              backgroundColor: theme.cardColor, 
              borderRadius: 8, 
              paddingVertical: 8, 
              paddingHorizontal: 24, 
              borderWidth: 1, 
              flexDirection: 'row', 
              alignItems: 'center' 
            }}
            onPress={handleMessagePress}
          >
            <MaterialCommunityIcons name="message-text-outline" size={20} color={theme.primaryColor} />
            <Text style={{ color: theme.primaryColor, fontWeight: 'bold', marginLeft: 6 }}>Message</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (profile?.isPending && profile?.isPendingReceived) {
      // Pending received state - show "Accept" and "Ignore" buttons
      return (
        <View style={[{ flexDirection: 'row', justifyContent: 'center', marginVertical: 12 }]}>
          <TouchableOpacity 
            style={{ 
              borderColor: theme.primaryColor, 
              backgroundColor: theme.primaryColor, 
              borderRadius: 8, 
              paddingVertical: 8, 
              paddingHorizontal: 24, 
              borderWidth: 1, 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginRight: 8 
            }}
            onPress={handleAcceptPress}
            disabled={isAccepting}
          >
            {isAccepting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <MaterialCommunityIcons name="check" size={20} color="white" />
            )}
            <Text style={{ color: 'white', fontWeight: 'bold', marginLeft: 6 }}>
              {isAccepting ? 'Accepting...' : 'Accept'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ 
              borderColor: theme.borderColor, 
              backgroundColor: theme.cardColor, 
              borderRadius: 8, 
              paddingVertical: 8, 
              paddingHorizontal: 24, 
              borderWidth: 1, 
              flexDirection: 'row', 
              alignItems: 'center' 
            }}
            onPress={handleIgnorePress}
            disabled={isIgnoring}
          >
            {isIgnoring ? (
              <ActivityIndicator size="small" color={theme.textSecondaryColor} />
            ) : (
              <MaterialCommunityIcons name="close" size={20} color={theme.textSecondaryColor} />
            )}
            <Text style={{ color: theme.textSecondaryColor, fontWeight: 'bold', marginLeft: 6 }}>
              {isIgnoring ? 'Ignoring...' : 'Ignore'}
            </Text>
          </TouchableOpacity>
        </View>
      );
    } else if (profile?.isPending) {
      // Pending sent state - show "Pending" button
      return (
        <View style={[{ flexDirection: 'row', justifyContent: 'center', marginVertical: 12 }]}>
          <View style={{ 
            borderColor: theme.borderColor, 
            backgroundColor: theme.surfaceColor, 
            borderRadius: 8, 
            paddingVertical: 8, 
            paddingHorizontal: 24, 
            borderWidth: 1, 
            flexDirection: 'row', 
            alignItems: 'center', 
            opacity: 0.6 
          }}>
            <MaterialCommunityIcons name="clock-outline" size={20} color={theme.textSecondaryColor} />
            <Text style={{ color: theme.textSecondaryColor, fontWeight: 'bold', marginLeft: 6 }}>Pending</Text>
          </View>
        </View>
      );
    } else {
      // Not connected state - show "Connect" and "Message" buttons
      return (
        <View style={[{ flexDirection: 'row', justifyContent: 'center', marginVertical: 12 }]}>
          <TouchableOpacity 
            style={{ 
              borderColor: theme.primaryColor, 
              backgroundColor: theme.cardColor, 
              borderRadius: 8, 
              paddingVertical: 8, 
              paddingHorizontal: 24, 
              borderWidth: 1, 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginRight: 8 
            }}
            onPress={handleConnectPress}
            disabled={isConnecting}
          >
            {isConnecting ? (
              <ActivityIndicator size="small" color={theme.primaryColor} />
            ) : (
              <MaterialCommunityIcons name="account-plus-outline" size={20} color={theme.primaryColor} />
            )}
            <Text style={{ color: theme.primaryColor, fontWeight: 'bold', marginLeft: 6 }}>
              {isConnecting ? 'Sending...' : 'Connect'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={{ 
              borderColor: theme.primaryColor, 
              backgroundColor: theme.cardColor, 
              borderRadius: 8, 
              paddingVertical: 8, 
              paddingHorizontal: 24, 
              borderWidth: 1, 
              flexDirection: 'row', 
              alignItems: 'center' 
            }}
            onPress={handleMessagePress}
          >
            <MaterialCommunityIcons name="message-text-outline" size={20} color={theme.primaryColor} />
            <Text style={{ color: theme.primaryColor, fontWeight: 'bold', marginLeft: 6 }}>Message</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };
  
  return (
    <>
      <ProfileLayout 
        profile={profile} 
        onBack={onBack} 
        theme={theme} 
        bannerImage={bannerImage}
        avatarImage={avatarImage}
      >
        {/* Action Buttons based on connection status */}
        {renderActionButtons()}
      </ProfileLayout>
      
      {/* Message Modal */}
      <MessageModal
        visible={messageModalVisible}
        onClose={() => setMessageModalVisible(false)}
        conversation={createConversation()}
      />
      
      {/* Snackbar for feedback */}
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onHide={() => setSnackbar({ ...snackbar, visible: false })}
      />
    </>
  );
} 