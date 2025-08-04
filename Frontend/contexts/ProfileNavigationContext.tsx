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
  isPendingReceived?: boolean; // True if current user received the request
  isSuggested: boolean;
}

interface ProfileNavigationContextType {
  showProfileScreen: boolean;
  selectedProfile: ProfileData | null;
  openProfile: (profile: ProfileData) => void;
  closeProfile: () => void;
  handleConnect: (profileId: string) => Promise<void>;
  handleMessage: (profile: ProfileData) => void;
  handleAccept: (profileId: string) => Promise<void>;
  handleIgnore: (profileId: string) => Promise<void>;
  updateProfileConnectionStatus: (profileId: string, status: 'connected' | 'pending' | 'none') => void;
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

  const updateProfileConnectionStatus = (profileId: string, status: 'connected' | 'pending' | 'none') => {
    setSelectedProfile(prev => {
      if (prev && prev.id === profileId) {
        return {
          ...prev,
          isConnected: status === 'connected',
          isPending: status === 'pending',
          isPendingReceived: false,
        };
      }
      return prev;
    });
  };

  const handleConnect = async (profileId: string) => {
    try {
      console.log('Sending connection request to profile:', profileId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the profile status to pending
      updateProfileConnectionStatus(profileId, 'pending');
      
      console.log('Connection request sent successfully');
      
      // In a real app, you would:
      // 1. Call your backend API to send the connection request
      // 2. Handle success/error responses
      // 3. Update the UI accordingly
      // 4. Show appropriate notifications to the user
      
    } catch (error) {
      console.error('Failed to send connection request:', error);
      // In a real app, you would show an error message to the user
    }
  };

  const handleMessage = (profile: ProfileData) => {
    console.log('Opening message conversation with:', profile.name);
    // The message modal is handled by the UserProfileScreen component
    // This function can be used for additional logic like:
    // - Tracking message opens
    // - Updating conversation status
    // - Showing notifications
  };

  const handleAccept = async (profileId: string) => {
    try {
      console.log('Accepting connection request from profile:', profileId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the profile status to connected
      updateProfileConnectionStatus(profileId, 'connected');
      
      console.log('Connection accepted successfully');
      
      // In a real app, you would:
      // 1. Call your backend API to accept the connection
      // 2. Update both users' connection status
      // 3. Send notifications to the other user
      // 4. Update the UI accordingly
      
    } catch (error) {
      console.error('Failed to accept connection:', error);
      // In a real app, you would show an error message to the user
    }
  };

  const handleIgnore = async (profileId: string) => {
    try {
      console.log('Ignoring connection request from profile:', profileId);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the profile status to none (not connected)
      updateProfileConnectionStatus(profileId, 'none');
      
      console.log('Connection request ignored successfully');
      
      // In a real app, you would:
      // 1. Call your backend API to ignore/reject the connection
      // 2. Remove the pending request from the database
      // 3. Update the UI accordingly
      // 4. Optionally notify the other user (or not)
      
    } catch (error) {
      console.error('Failed to ignore connection:', error);
      // In a real app, you would show an error message to the user
    }
  };

  const value: ProfileNavigationContextType = {
    showProfileScreen,
    selectedProfile,
    openProfile,
    closeProfile,
    handleConnect,
    handleMessage,
    handleAccept,
    handleIgnore,
    updateProfileConnectionStatus,
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