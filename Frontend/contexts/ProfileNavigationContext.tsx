import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileData {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  avatar: any;
  headerImage?: any;
  about: string;
  experience: Array<{
    id: string;
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    degree: string;
    school: string;
    year: string;
  }>;
  skills: string[];
  mutualConnections: number;
  isConnected: boolean;
  isOnline: boolean;
  isPending: boolean;
  isSuggested: boolean;
}

interface ProfileNavigationContextType {
  showProfileScreen: boolean;
  selectedProfile: ProfileData | null;
  openProfile: (profile: ProfileData) => void;
  closeProfile: () => void;
  handleConnect: (profileId: string) => void;
  handleMessage: (profile: ProfileData) => void;
}

const ProfileNavigationContext = createContext<ProfileNavigationContextType | undefined>(undefined);

interface ProfileNavigationProviderProps {
  children: ReactNode;
}

export function ProfileNavigationProvider({ children }: ProfileNavigationProviderProps) {
  const [showProfileScreen, setShowProfileScreen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<ProfileData | null>(null);

  const openProfile = (profile: ProfileData) => {
    setSelectedProfile(profile);
    setShowProfileScreen(true);
  };

  const closeProfile = () => {
    setShowProfileScreen(false);
    setSelectedProfile(null);
  };

  const handleConnect = (profileId: string) => {
    // Handle connect logic here
    console.log('Connecting with profile:', profileId);
    // You can add your connection logic here
  };

  const handleMessage = (profile: ProfileData) => {
    // Handle message logic here
    console.log('Messaging profile:', profile.name);
    // You can add your messaging logic here
  };

  const value: ProfileNavigationContextType = {
    showProfileScreen,
    selectedProfile,
    openProfile,
    closeProfile,
    handleConnect,
    handleMessage,
  };

  return (
    <ProfileNavigationContext.Provider value={value}>
      {children}
    </ProfileNavigationContext.Provider>
  );
}

export function useProfileNavigation() {
  const context = useContext(ProfileNavigationContext);
  if (context === undefined) {
    throw new Error('useProfileNavigation must be used within a ProfileNavigationProvider');
  }
  return context;
} 