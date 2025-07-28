import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import { getPrivacySettings, updatePrivacySettings, PrivacySettingsDto } from '../../../services/userAPI';
import Snackbar from '../../../components/Snackbar';

interface PrivacySettingsScreenProps {
  userId: string;
  onClose: () => void;
}

export default function PrivacySettingsScreen({ userId, onClose }: PrivacySettingsScreenProps) {
  const theme = useCurrentTheme();
  const [settings, setSettings] = useState<PrivacySettingsDto>({
    profileVisible: true,
    showEmail: false,
    showPhone: false,
    showDateOfBirth: false,
    showWorkExperience: true,
    showEducation: true,
    showCertifications: true,
    allowSearchByEmail: true,
    allowSearchByPhone: false,
    allowConnectionRequests: true,
    allowMessages: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });

  useEffect(() => {
    loadPrivacySettings();
  }, []);

  const loadPrivacySettings = async () => {
    try {
      setLoading(true);
      const privacySettings = await getPrivacySettings(userId);
      setSettings(privacySettings);
    } catch (error: any) {
      setSnackbar({ visible: true, message: error.message || 'Failed to load privacy settings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updatePrivacySettings(userId, settings);
      setSnackbar({ visible: true, message: 'Privacy settings saved successfully!', type: 'success' });
    } catch (error: any) {
      setSnackbar({ visible: true, message: error.message || 'Failed to save privacy settings', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const toggleSetting = (key: keyof PrivacySettingsDto) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderSettingItem = (
    title: string,
    description: string,
    key: keyof PrivacySettingsDto,
    icon: string
  ) => (
    <View style={[styles.settingItem, { backgroundColor: theme.cardColor }]}>
      <View style={styles.settingInfo}>
        <MaterialCommunityIcons name={icon as any} size={24} color={theme.primaryColor} />
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: theme.textColor }]}>{title}</Text>
          <Text style={[styles.settingDescription, { color: theme.textSecondaryColor }]}>{description}</Text>
        </View>
      </View>
      <Switch
        value={settings[key] as boolean}
        onValueChange={() => toggleSetting(key)}
        trackColor={{ false: theme.switchTrackColor.false, true: theme.switchTrackColor.true }}
        thumbColor={settings[key] ? theme.switchThumbColor.true : theme.switchThumbColor.false}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <Text style={[styles.loadingText, { color: theme.textColor }]}>Loading privacy settings...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>Privacy Settings</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving} style={[styles.saveButton, { backgroundColor: theme.primaryColor }]}>
          <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Visibility */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Profile Visibility</Text>
          {renderSettingItem(
            'Profile Visibility',
            'Allow others to see your profile',
            'profileVisible',
            'eye'
          )}
        </View>

        {/* Contact Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Contact Information</Text>
          {renderSettingItem(
            'Show Email',
            'Display your email address on your profile',
            'showEmail',
            'email'
          )}
          {renderSettingItem(
            'Show Phone',
            'Display your phone number on your profile',
            'showPhone',
            'phone'
          )}
        </View>

        {/* Professional Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Professional Information</Text>
          {renderSettingItem(
            'Work Experience',
            'Show your work experience on your profile',
            'showWorkExperience',
            'briefcase'
          )}
          {renderSettingItem(
            'Education',
            'Show your education history on your profile',
            'showEducation',
            'school'
          )}
          {renderSettingItem(
            'Certifications',
            'Show your certifications on your profile',
            'showCertifications',
            'certificate'
          )}
        </View>

        {/* Search & Discovery */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Search & Discovery</Text>
          {renderSettingItem(
            'Search by Email',
            'Allow others to find you by email address',
            'allowSearchByEmail',
            'magnify'
          )}
          {renderSettingItem(
            'Search by Phone',
            'Allow others to find you by phone number',
            'allowSearchByPhone',
            'phone-search'
          )}
        </View>

        {/* Network & Communication */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Network & Communication</Text>
          {renderSettingItem(
            'Connection Requests',
            'Allow others to send you connection requests',
            'allowConnectionRequests',
            'account-plus'
          )}
          {renderSettingItem(
            'Messages',
            'Allow others to send you messages',
            'allowMessages',
            'message-text'
          )}
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onHide={() => setSnackbar({ visible: false, message: '', type: 'info' })}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
}); 