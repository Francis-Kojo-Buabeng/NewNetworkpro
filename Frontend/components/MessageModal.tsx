import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrentTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  sender: string;
  senderAvatar: any;
  content: string;
  timestamp: string;
  isFromMe: boolean;
}

interface Conversation {
  id: string;
  contactName: string;
  contactAvatar: any;
  contactTitle: string;
  contactCompany: string;
  isOnline: boolean;
  messages: Message[];
}

interface MessageModalProps {
  visible: boolean;
  onClose: () => void;
  conversation: Conversation;
}

export default function MessageModal({
  visible,
  onClose,
  conversation,
}: MessageModalProps) {
  const theme = useCurrentTheme();
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(conversation.messages);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'You',
        senderAvatar: require('@/assets/images/Avator-Image.jpg'),
        content: newMessage.trim(),
        timestamp: 'Just now',
        isFromMe: true,
      };
      
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.isFromMe ? styles.myMessage : styles.theirMessage,
      ]}
    >
      {!message.isFromMe && (
        <Image source={message.senderAvatar} style={styles.messageAvatar} />
      )}
      
      <View
        style={[
          styles.messageBubble,
          message.isFromMe
            ? { backgroundColor: theme.primaryColor }
            : { backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: message.isFromMe ? '#fff' : theme.textColor }
          ]}
        >
          {message.content}
        </Text>
        <Text
          style={[
            styles.messageTime,
            { color: message.isFromMe ? 'rgba(255,255,255,0.7)' : theme.textSecondaryColor }
          ]}
        >
          {message.timestamp}
        </Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <KeyboardAvoidingView 
        style={[styles.container, { backgroundColor: theme.backgroundColor }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={theme.textColor} />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <View style={styles.avatarContainer}>
              <Image source={conversation.contactAvatar} style={styles.headerAvatar} />
              {conversation.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            <View style={styles.headerDetails}>
              <Text style={[styles.contactName, { color: theme.textColor }]}>
                {conversation.contactName}
              </Text>
              <Text style={[styles.contactTitle, { color: theme.textSecondaryColor }]}>
                {conversation.contactTitle} at {conversation.contactCompany}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.headerButton}>
            <MaterialCommunityIcons name="dots-vertical" size={24} color={theme.textColor} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView 
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Message Input */}
        <View style={[styles.inputContainer, { borderTopColor: theme.borderColor }]}>
          <View style={[styles.inputWrapper, { backgroundColor: theme.inputBackgroundColor }]}>
            <TouchableOpacity style={styles.attachButton}>
              <MaterialCommunityIcons name="paperclip" size={20} color={theme.textSecondaryColor} />
            </TouchableOpacity>
            
            <TextInput
              style={[styles.messageInput, { color: theme.textColor }]}
              placeholder="Type a message..."
              placeholderTextColor={theme.placeholderColor}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={500}
            />
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: newMessage.trim() ? theme.primaryColor : theme.borderColor }
              ]}
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <MaterialCommunityIcons 
                name="send" 
                size={20} 
                color={newMessage.trim() ? '#fff' : theme.textSecondaryColor} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  contactTitle: {
    fontSize: 12,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  theirMessage: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: width * 0.75,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  messageInput: {
    flex: 1,
    fontSize: 14,
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
}); 