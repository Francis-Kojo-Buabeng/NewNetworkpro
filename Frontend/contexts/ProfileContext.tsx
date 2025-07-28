import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchUserProfile } from '../services/userAPI';
import { ProfileDataService } from '../services/profileDataService';

interface ProfileData {
  id: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  headerImage: string | null;
  headline: string;
  currentCompany: string;
  location: string;
  summary: string;
  skills: string[];
  workExperience: any[];
  education: any[];
}

interface ProfileContextType {
  profileData: ProfileData | null;
  avatarUrl: string | null;
  headerImageUrl: string | null;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
  updateAvatar: (newAvatarUrl: string) => void;
  updateHeaderImage: (newHeaderImageUrl: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
  userId?: string | number;
}

export function ProfileProvider({ children, userId }: ProfileProviderProps) {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [headerImageUrl, setHeaderImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadProfileData = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const optimizedData = await ProfileDataService.getProfileData(userId.toString());
      
      const profile: ProfileData = {
        id: optimizedData.id,
        firstName: optimizedData.name.split(' ')[0] || '',
        lastName: optimizedData.name.split(' ').slice(1).join(' ') || '',
        profilePictureUrl: optimizedData.rawProfile?.profilePictureUrl || null,
        headerImage: optimizedData.rawProfile?.headerImage || null,
        headline: optimizedData.title,
        currentCompany: optimizedData.company,
        location: optimizedData.location,
        summary: optimizedData.about,
        skills: optimizedData.skills,
        workExperience: optimizedData.experience,
        education: optimizedData.education,
      };
      
      setProfileData(profile);
      setAvatarUrl(optimizedData.avatarUrl || null);
      setHeaderImageUrl(optimizedData.bannerUrl || null);
    } catch (error) {
      console.error('ProfileContext - Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    await loadProfileData();
  };

  const updateAvatar = (newAvatarUrl: string) => {
    // Handle empty string as null (for avatar removal)
    const avatarUrlToSet = newAvatarUrl === '' ? null : newAvatarUrl;
    setAvatarUrl(avatarUrlToSet);
    if (profileData) {
      setProfileData({
        ...profileData,
        profilePictureUrl: avatarUrlToSet,
      });
    }
  };

  const updateHeaderImage = (newHeaderImageUrl: string) => {
    // Handle empty string as null (for header image removal)
    const headerImageUrlToSet = newHeaderImageUrl === '' ? null : newHeaderImageUrl;
    setHeaderImageUrl(headerImageUrlToSet);
    if (profileData) {
      setProfileData({
        ...profileData,
        headerImage: headerImageUrlToSet,
      });
    }
  };

  useEffect(() => {
    if (userId) {
      loadProfileData();
    }
  }, [userId]);

  const value: ProfileContextType = {
    profileData,
    avatarUrl,
    headerImageUrl,
    isLoading,
    refreshProfile,
    updateAvatar,
    updateHeaderImage,
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
} 