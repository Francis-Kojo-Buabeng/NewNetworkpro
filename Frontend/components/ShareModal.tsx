import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  Share,
  Clipboard,
  Linking,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrentTheme } from '../contexts/ThemeContext';
import Snackbar from './Snackbar';

const { width, height } = Dimensions.get('window');

interface ShareOption {
  id: string;
  title: string;
  icon: string;
  color: string;
  action: () => void;
}

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  postId: string | number;
  postAuthor: string;
  postContent: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ 
  visible, 
  onClose, 
  postId, 
  postAuthor, 
  postContent 
}) => {
  const theme = useCurrentTheme();
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });

  // Create share content
  const createShareContent = () => {
    const truncatedContent = postContent.length > 100 ? `${postContent.substring(0, 100)}...` : postContent;
    return `${postAuthor} shared: "${truncatedContent}"\n\nCheck out this post on Networkpro!`;
  };

  const createShareUrl = () => {
    // In a real app, this would be a deep link to the specific post
    return `https://networkpro.app/post/${postId}`;
  };

  // Share options
  const shareOptions: ShareOption[] = [
    {
      id: 'native',
      title: 'Share',
      icon: 'share-variant',
      color: theme.primaryColor,
      action: async () => {
        try {
          const result = await Share.share({
            message: createShareContent(),
            url: createShareUrl(),
            title: `${postAuthor}'s Post`,
          });
          
          if (result.action === Share.sharedAction) {
            setSnackbar({ visible: true, message: 'Shared successfully!', type: 'success' });
          }
        } catch (error) {
          setSnackbar({ visible: true, message: 'Failed to share', type: 'error' });
        }
      },
    },
    {
      id: 'copy-link',
      title: 'Copy Link',
      icon: 'link-variant',
      color: '#007AFF',
      action: async () => {
        try {
          await Clipboard.setString(createShareUrl());
          setSnackbar({ visible: true, message: 'Link copied to clipboard!', type: 'success' });
        } catch (error) {
          setSnackbar({ visible: true, message: 'Failed to copy link', type: 'error' });
        }
      },
    },
    {
      id: 'copy-text',
      title: 'Copy Text',
      icon: 'content-copy',
      color: '#34C759',
      action: async () => {
        try {
          await Clipboard.setString(createShareContent());
          setSnackbar({ visible: true, message: 'Text copied to clipboard!', type: 'success' });
        } catch (error) {
          setSnackbar({ visible: true, message: 'Failed to copy text', type: 'error' });
        }
      },
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      icon: 'whatsapp',
      color: '#25D366',
      action: async () => {
        try {
          const message = encodeURIComponent(createShareContent());
          const url = `whatsapp://send?text=${message}`;
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            await Linking.openURL(url);
            setSnackbar({ visible: true, message: 'Opening WhatsApp...', type: 'info' });
          } else {
            setSnackbar({ visible: true, message: 'WhatsApp not installed', type: 'error' });
          }
        } catch (error) {
          setSnackbar({ visible: true, message: 'Failed to open WhatsApp', type: 'error' });
        }
      },
    },
    {
      id: 'twitter',
      title: 'Twitter',
      icon: 'twitter',
      color: '#1DA1F2',
      action: async () => {
        try {
          const message = encodeURIComponent(createShareContent());
          const url = `twitter://post?message=${message}`;
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            await Linking.openURL(url);
            setSnackbar({ visible: true, message: 'Opening Twitter...', type: 'info' });
          } else {
            setSnackbar({ visible: true, message: 'Twitter not installed', type: 'error' });
          }
        } catch (error) {
          setSnackbar({ visible: true, message: 'Failed to open Twitter', type: 'error' });
        }
      },
    },
    {
      id: 'facebook',
      title: 'Facebook',
      icon: 'facebook',
      color: '#1877F2',
      action: async () => {
        try {
          const message = encodeURIComponent(createShareContent());
          const url = `fb://share?link=${encodeURIComponent(createShareUrl())}`;
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            await Linking.openURL(url);
            setSnackbar({ visible: true, message: 'Opening Facebook...', type: 'info' });
          } else {
            setSnackbar({ visible: true, message: 'Facebook not installed', type: 'error' });
          }
        } catch (error) {
          setSnackbar({ visible: true, message: 'Failed to open Facebook', type: 'error' });
        }
      },
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      icon: 'linkedin',
      color: '#0A66C2',
      action: async () => {
        try {
          const message = encodeURIComponent(createShareContent());
          const url = `linkedin://post?text=${message}`;
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            await Linking.openURL(url);
            setSnackbar({ visible: true, message: 'Opening LinkedIn...', type: 'info' });
          } else {
            setSnackbar({ visible: true, message: 'LinkedIn not installed', type: 'error' });
          }
        } catch (error) {
          setSnackbar({ visible: true, message: 'Failed to open LinkedIn', type: 'error' });
        }
      },
    },
    {
      id: 'email',
      title: 'Email',
      icon: 'email-outline',
      color: '#FF9500',
      action: async () => {
        try {
          const subject = encodeURIComponent(`${postAuthor}'s Post on Networkpro`);
          const body = encodeURIComponent(createShareContent());
          const url = `mailto:?subject=${subject}&body=${body}`;
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            await Linking.openURL(url);
            setSnackbar({ visible: true, message: 'Opening Email...', type: 'info' });
          } else {
            setSnackbar({ visible: true, message: 'No email app found', type: 'error' });
          }
        } catch (error) {
          setSnackbar({ visible: true, message: 'Failed to open Email', type: 'error' });
        }
      },
    },
    {
      id: 'sms',
      title: 'SMS',
      icon: 'message-text-outline',
      color: '#5856D6',
      action: async () => {
        try {
          const message = encodeURIComponent(createShareContent());
          const url = `sms:?body=${message}`;
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            await Linking.openURL(url);
            setSnackbar({ visible: true, message: 'Opening Messages...', type: 'info' });
          } else {
            setSnackbar({ visible: true, message: 'No SMS app found', type: 'error' });
          }
        } catch (error) {
          setSnackbar({ visible: true, message: 'Failed to open Messages', type: 'error' });
        }
      },
    },
    {
      id: 'telegram',
      title: 'Telegram',
      icon: 'telegram',
      color: '#0088CC',
      action: async () => {
        try {
          const message = encodeURIComponent(createShareContent());
          const url = `telegram://msg?text=${message}`;
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            await Linking.openURL(url);
            setSnackbar({ visible: true, message: 'Opening Telegram...', type: 'info' });
          } else {
            setSnackbar({ visible: true, message: 'Telegram not installed', type: 'error' });
          }
        } catch (error) {
          setSnackbar({ visible: true, message: 'Failed to open Telegram', type: 'error' });
        }
      },
    },
    {
      id: 'instagram',
      title: 'Instagram',
      icon: 'instagram',
      color: '#E4405F',
      action: async () => {
        try {
          const message = encodeURIComponent(createShareContent());
          const url = `instagram://library?AssetPickerSourceType=Library&AssetPickerMediaType=Photos`;
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            await Linking.openURL(url);
            setSnackbar({ visible: true, message: 'Opening Instagram...', type: 'info' });
          } else {
            setSnackbar({ visible: true, message: 'Instagram not installed', type: 'error' });
          }
        } catch (error) {
          setSnackbar({ visible: true, message: 'Failed to open Instagram', type: 'error' });
        }
      },
    },
    {
      id: 'save',
      title: 'Save',
      icon: 'bookmark-outline',
      color: '#FF3B30',
      action: () => {
        // In a real app, this would save the post to user's saved items
        setSnackbar({ visible: true, message: 'Post saved to your collection!', type: 'success' });
      },
    },
  ];

  const handleShareOption = (option: ShareOption) => {
    option.action();
    // Don't close modal immediately for copy actions or save
    if (option.id === 'copy-link' || option.id === 'copy-text' || option.id === 'save') {
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      onClose();
    }
  };

  const renderShareOption = (option: ShareOption) => (
    <TouchableOpacity
      key={option.id}
      style={[styles.shareOption, { borderColor: theme.borderColor }]}
      onPress={() => handleShareOption(option)}
    >
      <View style={[styles.shareIcon, { backgroundColor: option.color + '20' }]}>
        <MaterialCommunityIcons name={option.icon as any} size={24} color={option.color} />
      </View>
      <Text style={[styles.shareTitle, { color: theme.textColor }]}>
        {option.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
          <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
              <Text style={[styles.headerTitle, { color: theme.textColor }]}>
                Share Post
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialCommunityIcons name="close" size={24} color={theme.textColor} />
              </TouchableOpacity>
            </View>

            {/* Post Preview */}
            <View style={[styles.postPreview, { backgroundColor: theme.cardColor }]}>
              <Text style={[styles.postAuthor, { color: theme.textColor }]}>
                {postAuthor}
              </Text>
              <Text style={[styles.postContent, { color: theme.textSecondaryColor }]}>
                {postContent.length > 100 ? `${postContent.substring(0, 100)}...` : postContent}
              </Text>
            </View>

            {/* Share Options */}
            <ScrollView style={styles.shareOptions} showsVerticalScrollIndicator={false}>
              <View style={styles.shareGrid}>
                {shareOptions.map(renderShareOption)}
              </View>
            </ScrollView>

            {/* Cancel Button */}
            <TouchableOpacity
              style={[styles.cancelButton, { borderTopColor: theme.borderColor }]}
              onPress={onClose}
            >
              <Text style={[styles.cancelText, { color: theme.textSecondaryColor }]}>
                Cancel
              </Text>
            </TouchableOpacity>
        </View>
      </View>
    </Modal>

      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onHide={() => setSnackbar({ ...snackbar, visible: false })}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  postPreview: {
    margin: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  postAuthor: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  shareOptions: {
    flex: 1,
  },
  shareGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  shareOption: {
    width: (width - 60) / 3,
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  shareIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  shareTitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ShareModal; 