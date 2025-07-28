import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrentTheme } from '../contexts/ThemeContext';

interface NotificationSettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  type: 'connection' | 'job' | 'post' | 'message' | 'profile' | 'general';
}

export default function NotificationSettingsModal({
  visible,
  onClose,
}: NotificationSettingsModalProps) {
  const theme = useCurrentTheme();
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: '1',
      title: 'Connection Requests',
      description: 'Get notified when someone wants to connect with you',
      enabled: true,
      type: 'connection',
    },
    {
      id: '2',
      title: 'Job Recommendations',
      description: 'Receive notifications about jobs that match your profile',
      enabled: true,
      type: 'job',
    },
    {
      id: '3',
      title: 'Post Interactions',
      description: 'Get notified when someone likes or comments on your posts',
      enabled: true,
      type: 'post',
    },
    {
      id: '4',
      title: 'Messages',
      description: 'Receive notifications for new messages',
      enabled: true,
      type: 'message',
    },
    {
      id: '5',
      title: 'Profile Views',
      description: 'Get notified when someone views your profile',
      enabled: false,
      type: 'profile',
    },
    {
      id: '6',
      title: 'General Updates',
      description: 'Receive weekly summaries and general updates',
      enabled: true,
      type: 'general',
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(prev =>
      prev.map(setting =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  const getSettingIcon = (type: NotificationSetting['type']) => {
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

  const getSettingColor = (type: NotificationSetting['type']) => {
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
            Notification Settings
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Notification Types
            </Text>
            <Text style={[styles.sectionDescription, { color: theme.textSecondaryColor }]}>
              Choose which notifications you want to receive
            </Text>
          </View>

          {settings && settings.map((setting) => (
            <View
              key={setting.id}
              style={[styles.settingItem, { borderBottomColor: theme.borderColor }]}
            >
              <View style={styles.settingContent}>
                <View style={[styles.settingIcon, { backgroundColor: getSettingColor(setting.type) + '20' }]}>
                  <MaterialCommunityIcons
                    name={getSettingIcon(setting.type) as any}
                    size={20}
                    color={getSettingColor(setting.type)}
                  />
                </View>
                
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingTitle, { color: theme.textColor }]}>
                    {setting.title}
                  </Text>
                  <Text style={[styles.settingDescription, { color: theme.textSecondaryColor }]}>
                    {setting.description}
                  </Text>
                </View>

                <Switch
                  value={setting.enabled}
                  onValueChange={() => toggleSetting(setting.id)}
                  trackColor={{ false: theme.borderColor, true: theme.primaryColor }}
                  thumbColor={setting.enabled ? '#fff' : theme.textSecondaryColor}
                />
              </View>
            </View>
          ))}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Additional Options
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.optionItem, { borderBottomColor: theme.borderColor }]}
            onPress={() => console.log('Manage notification schedule')}
          >
            <View style={styles.optionContent}>
              <MaterialCommunityIcons name="clock-outline" size={20} color={theme.textColor} />
              <Text style={[styles.optionText, { color: theme.textColor }]}>
                Quiet Hours
              </Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textTertiaryColor} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionItem, { borderBottomColor: theme.borderColor }]}
            onPress={() => console.log('Manage notification frequency')}
          >
            <View style={styles.optionContent}>
              <MaterialCommunityIcons name="tune" size={20} color={theme.textColor} />
              <Text style={[styles.optionText, { color: theme.textColor }]}>
                Notification Frequency
              </Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textTertiaryColor} />
            </View>
          </TouchableOpacity>
        </ScrollView>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  settingItem: {
    borderBottomWidth: 1,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  optionItem: {
    borderBottomWidth: 1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
}); 