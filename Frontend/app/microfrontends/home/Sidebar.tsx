import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import SettingScreen from './SettingScreen';
import NetworkOverviewModal from '../../../components/NetworkOverviewModal';

const { width, height } = Dimensions.get('window');

interface SidebarProps {
  userAvatar?: string | null;
  onClose: () => void;
  onMePress?: () => void;
  onMessagesPress?: () => void;
  setCurrentScreen?: (screen: string) => void;
  setCreatedProfile?: (profile: any | null) => void;
  setIsAuthenticated?: (auth: boolean) => void;
  setIsProfileComplete?: (complete: boolean) => void;
}

const sidebarItems = [
  { label: 'Home', icon: 'home-variant', active: true },
  { label: 'Network Overview', icon: 'chart-line' },
  { label: 'Discover', icon: 'compass-outline' },
  { label: 'Messages', icon: 'message-outline' },
  { label: 'Settings', icon: 'cog-outline' },
];

export default function Sidebar({ userAvatar, onClose, onMePress, onMessagesPress, setCurrentScreen, setCreatedProfile, setIsAuthenticated, setIsProfileComplete }: SidebarProps) {
  const theme = useCurrentTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showNetworkOverview, setShowNetworkOverview] = useState(false);
  const safeSetCurrentScreen = setCurrentScreen || (() => {});
  const safeSetCreatedProfile = setCreatedProfile || (() => {});
  const safeSetIsAuthenticated = setIsAuthenticated || (() => {});
  const safeSetIsProfileComplete = setIsProfileComplete || (() => {});

  const networkStats = {
    totalConnections: 847,
    pendingRequests: 12,
    newSuggestions: 23,
    profileViews: 45,
  };

  const handleSidebarItemPress = (label: string) => {
    if (label === 'Settings') {
      setShowSettings(true);
    } else if (label === 'Network Overview') {
      setShowNetworkOverview(true);
    } else if (label === 'Messages' && typeof onMessagesPress === 'function') {
      onMessagesPress();
    }
  };

  return (
    <View style={styles.overlay}>
      {/* Semi-transparent backdrop */}
      <TouchableOpacity style={[styles.backdrop, { backgroundColor: theme.overlayColor }]} onPress={onClose} activeOpacity={1} />
      
      {/* Settings Screen - Full Screen Overlay */}
      {showSettings && (
        <View style={styles.fullScreenOverlay}>
          <SettingScreen
            userAvatar={userAvatar}
            onClose={() => setShowSettings(false)}
            setCurrentScreen={safeSetCurrentScreen}
            setCreatedProfile={safeSetCreatedProfile}
            setIsAuthenticated={safeSetIsAuthenticated}
            setIsProfileComplete={safeSetIsProfileComplete}
          />
        </View>
      )}
      
      {/* Network Overview Modal */}
      <NetworkOverviewModal
        visible={showNetworkOverview}
        onClose={() => setShowNetworkOverview(false)}
        networkStats={networkStats}
        theme={theme}
      />
      
      {/* Sidebar - Only show when settings is not active */}
      {!showSettings && (
        <View style={[styles.sidebar, { backgroundColor: theme.surfaceColor }]}>
          <TouchableOpacity style={[styles.closeBtn, { backgroundColor: theme.cardColor }]} onPress={onClose}>
            <MaterialCommunityIcons name="close" size={24} color={theme.textSecondaryColor} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.profilePicWrap, { borderColor: theme.primaryColor }]} onPress={onMePress}>
            <Image source={userAvatar ? { uri: userAvatar } : require('@/assets/images/Avator-Image.jpg')} style={styles.profilePic} />
          </TouchableOpacity>
          
          <View style={styles.sidebarNav}>
            {sidebarItems.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.sidebarItem, 
                  { backgroundColor: item.active ? theme.cardColor : 'transparent' }
                ]}
                onPress={() => handleSidebarItemPress(item.label)}
              >
                <MaterialCommunityIcons 
                  name={item.icon as any} 
                  size={26} 
                  color={item.active ? theme.primaryColor : theme.textSecondaryColor} 
                />
                <Text style={[
                  styles.sidebarLabel, 
                  { color: item.active ? theme.primaryColor : theme.textSecondaryColor },
                  item.active && { fontWeight: 'bold' }
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
  fullScreenOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1002,
  },
  sidebar: {
    width: 280,
    height: '100%',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1001,
  },
  closeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    borderRadius: 20,
    padding: 4,
  },
  profilePicWrap: {
    marginBottom: 32,
    borderWidth: 2,
    borderRadius: 32,
    padding: 2,
    alignSelf: 'center',
  },
  profilePic: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  sidebarNav: {
    flex: 1,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 16,
  },
  sidebarLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
}); 