import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useCurrentTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: any;
  isOnline: boolean;
}

interface NewMessageButtonProps {
  onStartConversation?: (contact: Contact) => void;
  onCreateGroup?: () => void;
  onBroadcast?: () => void;
}

export default function NewMessageButton({ 
  onStartConversation, 
  onCreateGroup, 
  onBroadcast 
}: NewMessageButtonProps) {
  const theme = useCurrentTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [showContacts, setShowContacts] = useState(false);

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

  const handlePlusPress = () => {
    setModalVisible(true);
    setShowContacts(false);
  };

  const handleNewMessage = () => {
    setShowContacts(true);
  };

  const handleCreateGroup = () => {
    setModalVisible(false);
    onCreateGroup?.();
  };

  const handleBroadcast = () => {
    setModalVisible(false);
    onBroadcast?.();
  };

  const handleContactSelect = (contact: Contact) => {
    setModalVisible(false);
    setShowContacts(false);
    onStartConversation?.(contact);
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={[styles.contactItem, { borderBottomColor: theme.borderColor }]}
      onPress={() => handleContactSelect(item)}
    >
      <View style={styles.contactContent}>
        <View style={styles.avatarContainer}>
          <Image source={item.avatar} style={styles.avatar} />
          {item.isOnline && (
            <View style={[styles.onlineIndicator, { backgroundColor: theme.successColor }]} />
          )}
        </View>
        <View style={styles.contactInfo}>
          <Text style={[styles.contactName, { color: theme.textColor }]}>
            {item.name}
          </Text>
          <Text style={[styles.contactTitle, { color: theme.textSecondaryColor }]}>
            {item.title} at {item.company}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMainMenu = () => (
    <View style={styles.menuContainer}>
      <TouchableOpacity
        style={[styles.menuItem, { borderBottomColor: theme.borderColor }]}
        onPress={handleNewMessage}
      >
        <MaterialCommunityIcons name="message-text" size={24} color={theme.primaryColor} />
        <View style={styles.menuItemContent}>
          <Text style={[styles.menuItemTitle, { color: theme.textColor }]}>
            New Message
          </Text>
          <Text style={[styles.menuItemSubtitle, { color: theme.textSecondaryColor }]}>
            Start a conversation
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textSecondaryColor} />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.menuItem, { borderBottomColor: theme.borderColor }]}
        onPress={handleCreateGroup}
      >
        <MaterialCommunityIcons name="account-group" size={24} color={theme.primaryColor} />
        <View style={styles.menuItemContent}>
          <Text style={[styles.menuItemTitle, { color: theme.textColor }]}>
            New Group
          </Text>
          <Text style={[styles.menuItemSubtitle, { color: theme.textSecondaryColor }]}>
            Create a group chat
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textSecondaryColor} />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={handleBroadcast}
      >
        <MaterialCommunityIcons name="broadcast" size={24} color={theme.primaryColor} />
        <View style={styles.menuItemContent}>
          <Text style={[styles.menuItemTitle, { color: theme.textColor }]}>
            Broadcast
          </Text>
          <Text style={[styles.menuItemSubtitle, { color: theme.textSecondaryColor }]}>
            Send to multiple contacts
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textSecondaryColor} />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <TouchableOpacity style={styles.plusButton} onPress={handlePlusPress}>
        <MaterialCommunityIcons name="plus" size={24} color={theme.textColor} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surfaceColor }]}>
            {/* Header */}
            <View style={[styles.modalHeader, { borderBottomColor: theme.borderColor }]}>
              <Text style={[styles.modalTitle, { color: theme.textColor }]}>
                {showContacts ? 'New Message' : 'New Conversation'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false);
                  setShowContacts(false);
                }}
              >
                <MaterialCommunityIcons name="close" size={24} color={theme.textColor} />
              </TouchableOpacity>
            </View>

            {/* Back button for contacts view */}
            {showContacts && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setShowContacts(false)}
              >
                <MaterialCommunityIcons name="arrow-left" size={20} color={theme.primaryColor} />
                <Text style={[styles.backButtonText, { color: theme.primaryColor }]}>
                  Back
                </Text>
              </TouchableOpacity>
            )}

            {/* Content */}
            {showContacts ? (
              <FlatList
                data={contacts}
                renderItem={renderContact}
                keyExtractor={(item) => item.id}
                style={styles.contactsList}
                showsVerticalScrollIndicator={false}
              />
            ) : (
              renderMainMenu()
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  plusButton: {
    padding: 8,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  menuContainer: {
    paddingVertical: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 16,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuItemSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  contactsList: {
    maxHeight: 400,
  },
  contactItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
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
    borderWidth: 2,
    borderColor: '#fff',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
  },
  contactTitle: {
    fontSize: 14,
    marginTop: 2,
  },
}); 