import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import NotificationSettingsModal from '../../../components/NotificationSettingsModal';

const { width } = Dimensions.get('window');

interface Notification {
  id: string;
  type: 'connection' | 'job' | 'post' | 'message' | 'profile' | 'general';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  avatar?: any;
  actionText?: string;
  actionType?: 'accept' | 'decline' | 'view' | 'reply' | 'like';
}

export default function NotificationsScreen() {
  const theme = useCurrentTheme();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'connection',
      title: 'John Doe sent you a connection request',
      message: 'Software Engineer at Google',
      time: '2m ago',
      isRead: false,
      avatar: require('../../../assets/images/profile-pictures/image-01.jpg'),
      actionText: 'Accept',
      actionType: 'accept',
    },
    {
      id: '2',
      type: 'job',
      title: 'New job matches your profile',
      message: 'Senior React Developer at Apple',
      time: '5m ago',
      isRead: false,
      actionText: 'View',
      actionType: 'view',
    },
    {
      id: '3',
      type: 'post',
      title: 'Jane Smith liked your post',
      message: 'Product Manager at Microsoft',
      time: '10m ago',
      isRead: true,
      avatar: require('../../../assets/images/profile-pictures/image-02.webp'),
      actionText: 'Like',
      actionType: 'like',
    },
    {
      id: '4',
      type: 'message',
      title: 'New message from Alex Brown',
      message: 'Hey! I saw your post about React Native development and I was wondering if you could share some insights about your experience with the framework. I\'m currently working on a similar project and would love to connect!',
      time: '15m ago',
      isRead: false,
      avatar: require('../../../assets/images/profile-pictures/image-03.jpg'),
      actionText: 'Reply',
      actionType: 'reply',
    },
    {
      id: '5',
      type: 'profile',
      title: 'Your profile was viewed',
      message: 'Sarah Wilson viewed your profile',
      time: '1h ago',
      isRead: true,
      avatar: require('../../../assets/images/profile-pictures/image-04.jpeg'),
      actionText: 'View',
      actionType: 'view',
    },
    {
      id: '6',
      type: 'post',
      title: 'Mike Johnson liked your post',
      message: 'UX Designer at Creative Studio',
      time: '30m ago',
      isRead: false,
      avatar: require('../../../assets/images/profile-pictures/image-05.avif'),
      actionText: 'Like',
      actionType: 'like',
    },
    {
      id: '7',
      type: 'post',
      title: 'Sarah Wilson commented on your post',
      message: 'Marketing Director at Global Marketing',
      time: '45m ago',
      isRead: false,
      avatar: require('../../../assets/images/profile-pictures/image-06.webp'),
      actionText: 'Reply',
      actionType: 'reply',
    },
    {
      id: '8',
      type: 'general',
      title: 'Weekly network summary',
      message: 'You have 5 new connections this week. Your network is growing! Keep engaging with your connections to build stronger professional relationships.',
      time: '2h ago',
      isRead: true,
      actionText: 'View',
      actionType: 'view',
    },
  ]);

  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'connection':
        return 'account-plus';
      case 'job':
        return 'briefcase';
      case 'post':
        return 'thumb-up';
      case 'message':
        return 'message-text';
      case 'profile':
        return 'eye';
      case 'general':
        return 'bell';
      default:
        return 'bell';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'connection':
        return '#0077B5';
      case 'job':
        return '#4CAF50';
      case 'post':
        return '#FF9800';
      case 'message':
        return '#9C27B0';
      case 'profile':
        return '#2196F3';
      case 'general':
        return '#607D8B';
      default:
        return theme.primaryColor;
    }
  };

  const handleNotificationAction = (notification: Notification) => {
    setNotifications(prev =>
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    );
    setSelectedNotification(notification);
    setDetailModalVisible(true);
  };

  const handleDetailAction = (actionType: string) => {
    if (!selectedNotification) return;
    switch (actionType) {
      case 'accept':
        setNotifications(prev => prev.filter(n => n.id !== selectedNotification.id));
        break;
      case 'decline':
        setNotifications(prev => prev.filter(n => n.id !== selectedNotification.id));
        break;
      case 'view':
        break;
      case 'reply':
        break;
      case 'like':
        // Handle like action - could mark as liked or navigate to post
        console.log('Liked post:', selectedNotification.title);
        break;
    }
    setDetailModalVisible(false);
    setSelectedNotification(null);
  };

  const getActionButtonText = (notification: Notification) => {
    switch (notification.actionType) {
      case 'accept':
        return 'Accept Connection';
      case 'view':
        if (notification.type === 'job') {
          return 'View Job Details';
        } else if (notification.type === 'profile') {
          return 'View Profile';
        } else {
          return 'View Details';
        }
      case 'reply':
        if (notification.type === 'message') {
          return 'Reply to Message';
        } else {
          return 'Reply';
        }
      case 'like':
        return 'Like Post';
      default:
        return notification.actionText || 'View';
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const renderNotification = (notification: Notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        { 
          backgroundColor: notification.isRead ? theme.cardColor : theme.primaryColor + '10',
          borderBottomColor: theme.borderColor 
        }
      ]}
      onPress={() => handleNotificationAction(notification)}
    >
      <View style={styles.notificationContent}>
        <View style={styles.notificationIcon}>
          <MaterialCommunityIcons 
            name={getNotificationIcon(notification.type) as any} 
            size={20} 
            color={getNotificationColor(notification.type)} 
          />
        </View>
        <View style={styles.notificationInfo}>
          <Text style={[styles.notificationTitle, { color: theme.textColor }]}>
            {notification.title}
          </Text>
          <Text style={[styles.notificationMessage, { color: theme.textSecondaryColor }]} numberOfLines={2}>
            {notification.message}
          </Text>
          <Text style={[styles.notificationTime, { color: theme.textTertiaryColor }]}>
            {notification.time}
          </Text>
        </View>
        {notification.avatar && (
          <Image source={notification.avatar} style={styles.notificationAvatar} />
        )}
        {!notification.isRead && (
          <View style={[styles.unreadDot, { backgroundColor: theme.primaryColor }]} />
        )}
      </View>
      {notification.actionText && (
        <View style={styles.notificationActions}>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              { 
                backgroundColor: notification.actionType === 'accept' ? theme.primaryColor : theme.surfaceColor,
                borderColor: theme.borderColor
              }
            ]}
            onPress={() => handleNotificationAction(notification)}
          >
            <Text style={[
              styles.actionButtonText, 
              { color: notification.actionType === 'accept' ? '#fff' : theme.textColor }
            ]}>
              {notification.actionText}
            </Text>
          </TouchableOpacity>
          {notification.actionType === 'accept' && (
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }]}
              onPress={() => handleDetailAction('decline')}
            >
              <Text style={[styles.actionButtonText, { color: theme.textColor }]}>Decline</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );

  const unreadCount = notifications ? notifications.filter(n => !n.isRead).length : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}> 
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.borderColor }]}> 
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setSettingsModalVisible(true)} style={styles.headerButton}>
            <MaterialCommunityIcons name="cog" size={24} color={theme.textColor} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>Notifications {unreadCount > 0 && `(${unreadCount})`}</Text>
        <TouchableOpacity onPress={markAllAsRead} style={styles.headerButton}>
          <MaterialCommunityIcons name="check-all" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {notifications && notifications.length > 0 ? (
          notifications.map(renderNotification)
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons 
              name="bell-off" 
              size={48} 
              color={theme.textSecondaryColor} 
            />
            <Text style={[styles.emptyStateText, { color: theme.textSecondaryColor }]}>No notifications yet</Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.textTertiaryColor }]}>You'll see notifications about your network activity here</Text>
          </View>
        )}
      </ScrollView>
      {/* Detail Modal */}
      {selectedNotification && (
        <Modal
          visible={detailModalVisible}
          animationType="fade"
          transparent={true}
        >
          <View style={[styles.detailOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}> 
            <View style={[styles.detailModal, { backgroundColor: theme.cardColor }]}> 
              {/* Detail Header */}
              <View style={[styles.detailHeader, { borderBottomColor: theme.borderColor }]}> 
                <View style={styles.detailIconContainer}>
                  <MaterialCommunityIcons 
                    name={getNotificationIcon(selectedNotification.type) as any} 
                    size={24} 
                    color={getNotificationColor(selectedNotification.type)} 
                  />
                </View>
                <View style={styles.detailInfo}>
                  <Text style={[styles.detailTitle, { color: theme.textColor }]}>{selectedNotification.title}</Text>
                  <Text style={[styles.detailTime, { color: theme.textTertiaryColor }]}>{selectedNotification.time}</Text>
                </View>
                <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                  <MaterialCommunityIcons name="close" size={24} color={theme.textColor} />
                </TouchableOpacity>
              </View>
              {/* Detail Content */}
              <ScrollView style={styles.detailContent}>
                {selectedNotification.avatar && (
                  <View style={styles.detailAvatarContainer}>
                    <Image source={selectedNotification.avatar} style={styles.detailAvatar} />
                  </View>
                )}
                <Text style={[styles.detailMessage, { color: theme.textColor }]}>{selectedNotification.message}</Text>
                {/* Additional details based on notification type */}
                {selectedNotification.type === 'connection' && (
                  <View style={styles.detailSection}>
                    <Text style={[styles.detailSectionTitle, { color: theme.textColor }]}>Connection Details</Text>
                    <Text style={[styles.detailSectionText, { color: theme.textSecondaryColor }]}>This person wants to connect with you. You can accept to grow your network or decline if you prefer not to connect.</Text>
                  </View>
                )}
                {selectedNotification.type === 'job' && (
                  <View style={styles.detailSection}>
                    <Text style={[styles.detailSectionTitle, { color: theme.textColor }]}>Job Details</Text>
                    <Text style={[styles.detailSectionText, { color: theme.textSecondaryColor }]}>This job matches your skills and experience. Click view to see the full job description and apply.</Text>
                  </View>
                )}
                {selectedNotification.type === 'message' && (
                  <View style={styles.detailSection}>
                    <Text style={[styles.detailSectionTitle, { color: theme.textColor }]}>Message Preview</Text>
                    <Text style={[styles.detailSectionText, { color: theme.textSecondaryColor }]}>This is a preview of the message. Click reply to respond directly or view the full conversation.</Text>
                  </View>
                )}
              </ScrollView>
              {/* Detail Actions */}
              <View style={[styles.detailActions, { borderTopColor: theme.borderColor }]}> 
                {selectedNotification.actionType === 'accept' ? (
                  <View style={styles.detailActionButtons}>
                    <TouchableOpacity 
                      style={[styles.detailActionButton, { backgroundColor: theme.primaryColor }]}
                      onPress={() => handleDetailAction('accept')}
                    >
                      <Text style={[styles.detailActionText, { color: '#fff' }]}>Accept Connection</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.detailActionButton, { backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }]}
                      onPress={() => handleDetailAction('decline')}
                    >
                      <Text style={[styles.detailActionText, { color: theme.textColor }]}>Decline Request</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity 
                    style={[styles.detailActionButton, { backgroundColor: theme.primaryColor }]}
                    onPress={() => handleDetailAction(selectedNotification.actionType || 'view')}
                  >
                    <Text style={[styles.detailActionText, { color: '#fff' }]}>{getActionButtonText(selectedNotification)}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}
      {/* Settings Modal */}
      <NotificationSettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  notificationItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
  },
  notificationAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
    marginTop: 4,
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  detailOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  detailModal: {
    width: width * 0.9,
    borderRadius: 16,
    padding: 24,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 12,
    marginBottom: 12,
  },
  detailIconContainer: {
    marginRight: 12,
  },
  detailInfo: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  detailTime: {
    fontSize: 12,
    marginTop: 2,
  },
  detailContent: {
    maxHeight: 200,
    marginBottom: 16,
  },
  detailAvatarContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  detailAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  detailMessage: {
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  detailSection: {
    marginBottom: 12,
  },
  detailSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailSectionText: {
    fontSize: 14,
  },
  detailActions: {
    borderTopWidth: 1,
    paddingTop: 12,
    marginTop: 8,
  },
  detailActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  detailActionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
  },
  detailActionText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 