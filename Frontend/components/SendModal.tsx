import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrentTheme } from '../contexts/ThemeContext';
import Snackbar from './Snackbar';

const { width, height } = Dimensions.get('window');

interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: any;
  isOnline: boolean;
}

interface SendModalProps {
  visible: boolean;
  onClose: () => void;
  postId: string | number;
  postAuthor: string;
  postContent: string;
}

export default function SendModal({
  visible,
  onClose,
  postId,
  postAuthor,
  postContent,
}: SendModalProps) {
  const theme = useCurrentTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });

  // Mock contacts data
  const contacts: Contact[] = [
    {
      id: '1',
      name: 'John Doe',
      title: 'Software Engineer',
      company: 'Tech Solutions Inc.',
      avatar: require('@/assets/images/Avator-Image.jpg'),
      isOnline: true,
    },
    {
      id: '2',
      name: 'Jane Smith',
      title: 'Product Manager',
      company: 'Digital Marketing Pro',
      avatar: require('@/assets/images/Avator-Image.jpg'),
      isOnline: false,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      title: 'UX Designer',
      company: 'Creative Studio',
      avatar: require('@/assets/images/Avator-Image.jpg'),
      isOnline: true,
    },
    {
      id: '4',
      name: 'Sarah Wilson',
      title: 'Marketing Director',
      company: 'Global Marketing',
      avatar: require('@/assets/images/Avator-Image.jpg'),
      isOnline: false,
    },
    {
      id: '5',
      name: 'Alex Brown',
      title: 'Data Scientist',
      company: 'Analytics Corp',
      avatar: require('@/assets/images/Avator-Image.jpg'),
      isOnline: true,
    },
  ];

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactToggle = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId)
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const handleSend = () => {
    if (selectedContacts.length === 0) {
      setSnackbar({ visible: true, message: 'Please select at least one contact to send the post to.', type: 'error' });
      return;
    }

    const selectedNames = contacts
      .filter(contact => selectedContacts.includes(contact.id))
      .map(contact => contact.name)
      .join(', ');

    // Show success message and close modal
            setSelectedContacts([]);
            setMessage('');
            onClose();
    // Note: The parent component should handle showing the success snackbar
  };

  const renderContact = ({ item }: { item: Contact }) => {
    const isSelected = selectedContacts.includes(item.id);
    
    return (
      <TouchableOpacity
        style={[
          styles.contactItem,
          { borderBottomColor: theme.borderColor },
          isSelected && { backgroundColor: theme.primaryColor + '20' }
        ]}
        onPress={() => handleContactToggle(item.id)}
      >
        <View style={styles.contactInfo}>
          <View style={styles.avatarContainer}>
            <Image source={item.avatar} style={styles.contactAvatar} />
            {item.isOnline && <View style={styles.onlineIndicator} />}
          </View>
          <View style={styles.contactDetails}>
            <Text style={[styles.contactName, { color: theme.textColor }]}>
              {item.name}
            </Text>
            <Text style={[styles.contactTitle, { color: theme.textSecondaryColor }]}>
              {item.title} at {item.company}
            </Text>
          </View>
        </View>
        <View style={styles.contactActions}>
          {isSelected && (
            <MaterialCommunityIcons 
              name="check-circle" 
              size={24} 
              color={theme.primaryColor} 
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <MaterialCommunityIcons name="close" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>
            Send Post
          </Text>
          <TouchableOpacity 
            style={[
              styles.sendButton,
              { backgroundColor: selectedContacts.length > 0 ? theme.primaryColor : theme.borderColor }
            ]}
            onPress={handleSend}
            disabled={selectedContacts.length === 0}
          >
            <Text style={[
              styles.sendButtonText,
              { color: selectedContacts.length > 0 ? '#fff' : theme.textSecondaryColor }
            ]}>
              Send
            </Text>
          </TouchableOpacity>
        </View>

        {/* Post Preview */}
        <View style={[styles.postPreview, { backgroundColor: theme.cardColor }]}>
          <View style={styles.previewHeader}>
            <Text style={[styles.previewAuthor, { color: theme.textColor }]}>
              {postAuthor}
            </Text>
            <Text style={[styles.previewContent, { color: theme.textSecondaryColor }]}>
              {postContent.length > 100 ? `${postContent.substring(0, 100)}...` : postContent}
            </Text>
          </View>
        </View>

        {/* Message Input */}
        <View style={[styles.messageContainer, { borderBottomColor: theme.borderColor }]}>
          <TextInput
            style={[styles.messageInput, { color: theme.textColor, backgroundColor: theme.inputBackgroundColor }]}
            placeholder="Add a message (optional)..."
            placeholderTextColor={theme.placeholderColor}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
        </View>

        {/* Search */}
        <View style={[styles.searchContainer, { backgroundColor: theme.inputBackgroundColor }]}>
          <MaterialCommunityIcons name="magnify" size={20} color={theme.textSecondaryColor} />
          <TextInput
            style={[styles.searchInput, { color: theme.textColor }]}
            placeholder="Search contacts..."
            placeholderTextColor={theme.placeholderColor}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Contacts List */}
        <FlatList
          data={filteredContacts}
          renderItem={renderContact}
          keyExtractor={(item) => item.id}
          style={styles.contactsList}
          showsVerticalScrollIndicator={false}
        />

        {/* Selected Count */}
        {selectedContacts.length > 0 && (
          <View style={[styles.selectedCount, { backgroundColor: theme.surfaceColor }]}>
            <Text style={[styles.selectedCountText, { color: theme.textColor }]}>
              {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
            </Text>
          </View>
        )}
        <Snackbar
          visible={snackbar.visible}
          message={snackbar.message}
          type={snackbar.type}
          onHide={() => setSnackbar({ ...snackbar, visible: false })}
        />
      </View>
    </Modal>
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
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  postPreview: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  previewHeader: {
    marginBottom: 8,
  },
  previewAuthor: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  previewContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  messageInput: {
    padding: 12,
    borderRadius: 12,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  contactsList: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  contactAvatar: {
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
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactTitle: {
    fontSize: 14,
  },
  contactActions: {
    paddingLeft: 12,
  },
  selectedCount: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  selectedCountText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 