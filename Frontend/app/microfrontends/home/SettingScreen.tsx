import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Switch, ScrollView, Modal, Alert } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../contexts/ThemeContext';
import { themes } from '../../../constants/Theme';
import Snackbar from '../../../components/Snackbar';
import { deleteUserProfile } from '../../../services/userAPI';
import { useNavigation, NavigationProp } from '@react-navigation/native';

interface SettingScreenProps {
  userAvatar?: string | null;
  onClose: () => void;
  setCurrentScreen: (screen: string) => void;
  setCreatedProfile: (profile: any | null) => void;
  setIsAuthenticated: (auth: boolean) => void;
  setIsProfileComplete: (complete: boolean) => void;
}

export default function SettingScreen({ userAvatar, onClose, setCurrentScreen, setCreatedProfile, setIsAuthenticated, setIsProfileComplete }: SettingScreenProps) {
  const { theme, currentTheme, setTheme } = useTheme();
  
  // Account Settings
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  
  // Notification Settings
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  
  // Privacy Settings
  const [profileVisibility, setProfileVisibility] = useState('Public');
  
  // Theme Settings
  const [showThemeModal, setShowThemeModal] = useState(false);
  
  // App Info
  const appVersion = '1.0.0';
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });

  // Assume userId is available (replace with your actual user ID source)
  const userId = 1; // TODO: Replace with real user ID from context/auth
  const navigation = useNavigation<any>();

  const handleDeleteAccount = () => {
    setSnackbar({ visible: true, message: 'Are you sure you want to delete your account? Tap again to confirm.', type: 'error' });
    setShowDeleteAccount(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUserProfile(userId);
      // Clear auth tokens and user state here (replace with your actual logic)
      // Example: authContext.logout();
      // Example: AsyncStorage.removeItem('authToken');
      setSnackbar({ visible: true, message: 'Your account has been deleted.', type: 'success' });
      // Clear all user state
      setCreatedProfile(null);
      setIsAuthenticated(false);
      setIsProfileComplete(false);
      setTimeout(() => {
        setCurrentScreen('welcome');
      }, 1500);
    } catch (err: any) {
      setSnackbar({ visible: true, message: err.message || 'Failed to delete account.', type: 'error' });
    }
  };

  const handleThemeChange = (themeKey: string) => {
    setTheme(themeKey);
    setShowThemeModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.textColor} />
          <Text style={[styles.backText, { color: theme.textColor }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <View style={[styles.profileSection, { backgroundColor: theme.surfaceColor }]}>
            <Image 
              source={userAvatar ? { uri: userAvatar } : require('@/assets/images/Avator-Image.jpg')} 
              style={[styles.profileImage, { borderColor: theme.primaryColor }]} 
            />
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.textColor }]}>John Doe</Text>
              <Text style={[styles.profileEmail, { color: theme.textSecondaryColor }]}>john.doe@example.com</Text>
            </View>
          </View>
        </View>

        {/* Account Security */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Account Security</Text>
          
          <View style={[styles.settingItem, { backgroundColor: theme.surfaceColor }]}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="shield-check" size={20} color={theme.primaryColor} />
              <Text style={[styles.settingLabel, { color: theme.textColor }]}>Two-Factor Authentication</Text>
            </View>
            <Switch 
              value={twoFactor} 
              onValueChange={setTwoFactor}
              trackColor={theme.switchTrackColor}
              thumbColor={twoFactor ? theme.switchThumbColor.true : theme.switchThumbColor.false}
            />
          </View>

          <TouchableOpacity style={[styles.settingButton, { backgroundColor: theme.surfaceColor }]} onPress={() => setShowChangePassword(true)}>
            <MaterialCommunityIcons name="lock-reset" size={20} color={theme.primaryColor} />
            <Text style={[styles.settingButtonText, { color: theme.textColor }]}>Change Password</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textSecondaryColor} />
            </TouchableOpacity>
        </View>

        {/* Theme */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Appearance</Text>
          
          <TouchableOpacity style={[styles.settingButton, { backgroundColor: theme.surfaceColor }]} onPress={() => setShowThemeModal(true)}>
            <MaterialCommunityIcons name="palette" size={20} color={theme.primaryColor} />
            <Text style={[styles.settingButtonText, { color: theme.textColor }]}>Theme: {theme.name}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textSecondaryColor} />
          </TouchableOpacity>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Notifications</Text>
          
          <View style={[styles.settingItem, { backgroundColor: theme.surfaceColor }]}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="email" size={20} color={theme.primaryColor} />
              <Text style={[styles.settingLabel, { color: theme.textColor }]}>Email Notifications</Text>
            </View>
            <Switch 
              value={emailNotif} 
              onValueChange={setEmailNotif}
              trackColor={theme.switchTrackColor}
              thumbColor={emailNotif ? theme.switchThumbColor.true : theme.switchThumbColor.false}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: theme.surfaceColor }]}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="bell" size={20} color={theme.primaryColor} />
              <Text style={[styles.settingLabel, { color: theme.textColor }]}>Push Notifications</Text>
            </View>
            <Switch 
              value={pushNotif} 
              onValueChange={setPushNotif}
              trackColor={theme.switchTrackColor}
              thumbColor={pushNotif ? theme.switchThumbColor.true : theme.switchThumbColor.false}
            />
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Privacy</Text>
          
          <TouchableOpacity style={[styles.settingButton, { backgroundColor: theme.surfaceColor }]}>
            <MaterialCommunityIcons name="eye" size={20} color={theme.primaryColor} />
            <Text style={[styles.settingButtonText, { color: theme.textColor }]}>Profile Visibility: {profileVisibility}</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textSecondaryColor} />
          </TouchableOpacity>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Support</Text>
          
          <TouchableOpacity style={[styles.settingButton, { backgroundColor: theme.surfaceColor }]}>
            <MaterialCommunityIcons name="help-circle" size={20} color={theme.primaryColor} />
            <Text style={[styles.settingButtonText, { color: theme.textColor }]}>Contact Support</Text>
            <MaterialCommunityIcons name="chevron-right" size={20} color={theme.textSecondaryColor} />
          </TouchableOpacity>

          <View style={[styles.settingItem, { backgroundColor: theme.surfaceColor }]}>
            <View style={styles.settingInfo}>
              <MaterialCommunityIcons name="information" size={20} color={theme.textSecondaryColor} />
              <Text style={[styles.settingLabel, { color: theme.textColor }]}>App Version</Text>
            </View>
            <Text style={[styles.settingValue, { color: theme.textSecondaryColor }]}>{appVersion}</Text>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Danger Zone</Text>
          
          <TouchableOpacity style={[styles.dangerButton, { backgroundColor: theme.surfaceColor, borderColor: theme.dangerColor }]} onPress={handleDeleteAccount}>
            <MaterialCommunityIcons name="delete" size={20} color={theme.dangerColor} />
            <Text style={[styles.dangerButtonText, { color: theme.dangerColor }]}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Change Password Modal */}
      <Modal visible={showChangePassword} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlayColor }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.surfaceColor }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Change Password</Text>
            
            <TextInput 
              style={[styles.modalInput, { backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]} 
              placeholder="Current Password" 
              placeholderTextColor={theme.placeholderColor}
              secureTextEntry 
            />
            <TextInput 
              style={[styles.modalInput, { backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]} 
              placeholder="New Password" 
              placeholderTextColor={theme.placeholderColor}
              secureTextEntry 
            />
            <TextInput 
              style={[styles.modalInput, { backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]} 
              placeholder="Confirm New Password" 
              placeholderTextColor={theme.placeholderColor}
              secureTextEntry 
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.cardColor }]} 
                onPress={() => setShowChangePassword(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.textColor }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, { backgroundColor: theme.primaryColor }]}>
                <Text style={[styles.modalButtonPrimaryText, { color: theme.textColor }]}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Theme Selection Modal */}
      <Modal visible={showThemeModal} transparent animationType="slide">
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlayColor }]}>
          <View style={[styles.modalContent, { backgroundColor: theme.surfaceColor }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Choose Theme</Text>
            
            {Object.entries(themes).map(([key, themeOption]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.themeOption,
                  { backgroundColor: theme.cardColor },
                  currentTheme === key && { borderColor: theme.primaryColor, borderWidth: 2 }
                ]}
                onPress={() => handleThemeChange(key)}
              >
                <View style={styles.themeOptionContent}>
                  <View style={[styles.themePreview, { backgroundColor: themeOption.backgroundColor }]}>
                    <View style={[styles.themePreviewHeader, { backgroundColor: themeOption.surfaceColor }]} />
                    <View style={[styles.themePreviewContent, { backgroundColor: themeOption.backgroundColor }]} />
                  </View>
                  <View style={styles.themeOptionInfo}>
                    <Text style={[styles.themeOptionName, { color: theme.textColor }]}>{themeOption.name}</Text>
                    {currentTheme === key && (
                      <MaterialCommunityIcons name="check-circle" size={20} color={theme.primaryColor} />
                    )}
                  </View>
          </View>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: theme.cardColor, marginTop: 16 }]} 
              onPress={() => setShowThemeModal(false)}
            >
              <Text style={[styles.modalButtonText, { color: theme.textColor }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
      </View>
      </Modal>
      {/* Delete Account Modal */}
      <Modal visible={showDeleteAccount} transparent animationType="fade">
        <View style={[styles.modalOverlay, { backgroundColor: theme.overlayColor }]}> 
          <View style={[styles.modalContent, { backgroundColor: theme.surfaceColor }]}> 
            <Text style={[styles.modalTitle, { color: theme.dangerColor }]}>Delete Account</Text>
            <Text style={{ color: theme.textColor, marginBottom: 24, textAlign: 'center' }}>
              Are you sure you want to delete your account? This action cannot be undone.
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.cardColor }]} 
                onPress={() => setShowDeleteAccount(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.textColor }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: theme.dangerColor }]} 
                onPress={handleConfirmDelete}
              >
                <Text style={[styles.modalButtonPrimaryText, { color: '#fff' }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onHide={() => setSnackbar({ ...snackbar, visible: false })}
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSpacer: {
    width: 60,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 16,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingButtonText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalInput: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  modalButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalButtonPrimaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  themeOption: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
  },
  themeOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themePreview: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
  },
  themePreviewHeader: {
    height: 8,
  },
  themePreviewContent: {
    flex: 1,
  },
  themeOptionInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeOptionName: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 