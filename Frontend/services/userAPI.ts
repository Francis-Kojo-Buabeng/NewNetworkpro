// userAPI.ts

export const API_BASE_URL = 'http://10.232.142.14:8092/api/v1/users'; // Updated to use your local IP address
import { ImageOptimizationService, ImageUrlUtils } from './imageOptimization';

export interface UserProfilePayload {
  firstName: string;
  lastName: string;
  headline?: string;
  summary?: string;
  location?: string;
  industry?: string;
  profilePictureUrl?: string;
  website?: string;
  phoneNumber?: string;
  skills?: string[];
  currentCompany?: string;
}

export async function createUserProfile(payload: UserProfilePayload) {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to create user profile');
  }
  return response.json();
}

export async function fetchUserProfile(userId: string | number) {
  console.log('userAPI - fetchUserProfile called for userId:', userId);
  console.log('userAPI - API URL:', `${API_BASE_URL}/${userId}`);
  
  const response = await fetch(`${API_BASE_URL}/${userId}`);
  console.log('userAPI - Response status:', response.status);
  console.log('userAPI - Response ok:', response.ok);
  
  if (!response.ok) {
    const error = await response.text();
    console.error('userAPI - Fetch failed:', error);
    throw new Error(error || 'Failed to fetch user profile');
  }
  
  const data = await response.json();
  console.log('userAPI - Raw profile data from API:', JSON.stringify(data, null, 2));
  console.log('userAPI - headerImage field:', data.headerImage);
  
  return data;
}

// Get user profile by email
export async function fetchUserProfileByEmail(email: string) {
  console.log('userAPI - fetchUserProfileByEmail called for email:', email);
  console.log('userAPI - API URL:', `${API_BASE_URL}/email/${encodeURIComponent(email)}`);
  
  const response = await fetch(`${API_BASE_URL}/email/${encodeURIComponent(email)}`);
  console.log('userAPI - Response status:', response.status);
  console.log('userAPI - Response ok:', response.ok);
  
  if (!response.ok) {
    const error = await response.text();
    console.error('userAPI - Fetch by email failed:', error);
    throw new Error(error || 'Failed to fetch user profile by email');
  }
  
  const data = await response.json();
  console.log('userAPI - Raw profile data from API (by email):', JSON.stringify(data, null, 2));
  
  return data;
}

// Create or get user profile by email
export async function createOrGetUserProfile(email: string) {
  console.log('userAPI - createOrGetUserProfile called for email:', email);
  console.log('userAPI - API URL:', `${API_BASE_URL}/email/${encodeURIComponent(email)}`);
  
  const response = await fetch(`${API_BASE_URL}/email/${encodeURIComponent(email)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  console.log('userAPI - Response status:', response.status);
  console.log('userAPI - Response ok:', response.ok);
  
  if (!response.ok) {
    const error = await response.text();
    console.error('userAPI - Create or get profile failed:', error);
    throw new Error(error || 'Failed to create or get user profile');
  }
  
  const data = await response.json();
  console.log('userAPI - Raw profile data from API (create or get):', JSON.stringify(data, null, 2));
  
  return data;
}

export async function updateUserProfile(userId: string | number, payload: Partial<UserProfilePayload>) {
  const response = await fetch(`${API_BASE_URL}/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to update user profile');
  }
  return response.json();
}

export async function deleteUserProfile(userId: string | number) {
  const response = await fetch(`${API_BASE_URL}/${userId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to delete user profile');
  }
  return response.text();
}

// Profile Picture Upload
export async function uploadProfilePicture(userId: string | number, imageUri: string): Promise<string> {
  try {
    console.log('userAPI - Starting profile picture upload for userId:', userId);
    console.log('userAPI - Image URI:', imageUri);
    
    // Optimize image before upload (LinkedIn-style)
    const optimizedImage = await ImageOptimizationService.optimizeProfilePicture(imageUri, {
      maxWidth: 400,
      maxHeight: 400,
      quality: 0.85,
    });
    
    console.log('userAPI - Optimized image dimensions:', optimizedImage.width, 'x', optimizedImage.height);
    
    const formData = new FormData();
    formData.append('file', {
      uri: optimizedImage.uri,
      type: 'image/jpeg',
      name: `profile-picture-${Date.now()}.jpg`,
    } as any);
    
    const uploadUrl = `${API_BASE_URL}/${userId}/profile-picture`;
    console.log('userAPI - Upload URL:', uploadUrl);
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formData,
    });
    
    console.log('userAPI - Response status:', response.status);
    console.log('userAPI - Response ok:', response.ok);
    
    if (!response.ok) {
      const error = await response.text();
      console.error('userAPI - Upload failed:', error);
      throw new Error(error || 'Failed to upload profile picture');
    }
    
    const imageUrl = await response.text();
    console.log('userAPI - Image URL from server:', imageUrl);
    
    // Backend now returns full URL, so no need to construct it
    console.log('userAPI - Using URL as-is from backend:', imageUrl);
    
    // Test URL accessibility
    try {
      console.log('userAPI - Testing URL accessibility...');
      const testResponse = await fetch(imageUrl, { method: 'HEAD' });
      console.log('userAPI - URL test response status:', testResponse.status);
      console.log('userAPI - URL test response ok:', testResponse.ok);
      
      if (!testResponse.ok) {
        console.warn('userAPI - URL might not be accessible:', imageUrl);
      }
    } catch (error) {
      console.warn('userAPI - Could not test URL:', error);
    }
    
    return imageUrl;
  } catch (error) {
    console.error('userAPI - Profile picture upload error:', error);
    throw new Error('Failed to upload profile picture. Please try again.');
  }
}

// Profile Picture Delete
export async function deleteProfilePicture(userId: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${userId}/profile-picture`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to delete profile picture');
  }
} 

// Banner Image Upload
export async function uploadBannerImage(userId: string | number, imageUri: string): Promise<string> {
  try {
    console.log('userAPI - Starting banner upload for userId:', userId);
    console.log('userAPI - Banner Image URI:', imageUri);
    
    // Optimize image before upload (LinkedIn-style)
    const optimizedImage = await ImageOptimizationService.optimizeBannerImage(imageUri, {
      maxWidth: 1200,
      maxHeight: 400,
      quality: 0.8,
    });
    
    console.log('userAPI - Optimized banner dimensions:', optimizedImage.width, 'x', optimizedImage.height);
    
    const formData = new FormData();
    formData.append('file', {
      uri: optimizedImage.uri,
      type: 'image/jpeg',
      name: `banner-image-${Date.now()}.jpg`,
    } as any);
    
    const uploadUrl = `${API_BASE_URL}/${userId}/banner-image`;
    console.log('userAPI - Banner upload URL:', uploadUrl);
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formData,
    });
    
    console.log('userAPI - Banner response status:', response.status);
    console.log('userAPI - Banner response ok:', response.ok);
    
    if (!response.ok) {
      const error = await response.text();
      console.error('userAPI - Banner upload failed:', error);
      throw new Error(error || 'Failed to upload banner image');
    }
    
    const imageUrl = await response.text();
    console.log('userAPI - Banner URL from server:', imageUrl);
    
    // Backend now returns full URL, so no need to construct it
    console.log('userAPI - Using banner URL as-is from backend:', imageUrl);
    
    // Test URL accessibility
    try {
      console.log('userAPI - Testing banner URL accessibility...');
      const testResponse = await fetch(imageUrl, { method: 'HEAD' });
      console.log('userAPI - Banner URL test response status:', testResponse.status);
      console.log('userAPI - Banner URL test response ok:', testResponse.ok);
      
      if (!testResponse.ok) {
        console.warn('userAPI - Banner URL might not be accessible:', imageUrl);
      }
    } catch (error) {
      console.warn('userAPI - Could not test banner URL:', error);
    }
    
    return imageUrl;
  } catch (error) {
    console.error('userAPI - Banner image upload error:', error);
    throw new Error('Failed to upload banner image. Please try again.');
  }
}

// Banner Image Delete
export async function deleteBannerImage(userId: string | number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/${userId}/banner-image`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to delete banner image');
  }
}

export interface PrivacySettingsDto {
  id?: number;
  profileVisible: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showDateOfBirth: boolean;
  showWorkExperience: boolean;
  showEducation: boolean;
  showCertifications: boolean;
  allowSearchByEmail: boolean;
  allowSearchByPhone: boolean;
  allowConnectionRequests: boolean;
  allowMessages: boolean;
}

export interface ProfileCompletionData {
  completionPercentage: number;
  isComplete: boolean;
  missingFields: string[];
}

// Privacy Settings API
export async function getPrivacySettings(userId: string | number): Promise<PrivacySettingsDto> {
  const response = await fetch(`${API_BASE_URL}/${userId}/privacy-settings`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to fetch privacy settings');
  }
  return response.json();
}

export async function updatePrivacySettings(userId: string | number, privacySettings: PrivacySettingsDto): Promise<PrivacySettingsDto> {
  const response = await fetch(`${API_BASE_URL}/${userId}/privacy-settings`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(privacySettings),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to update privacy settings');
  }
  return response.json();
}

// Profile Completion API
export async function getProfileCompletion(userId: string | number): Promise<ProfileCompletionData> {
  const response = await fetch(`${API_BASE_URL}/${userId}/completion`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to fetch profile completion data');
  }
  return response.json();
}

// User Search
export interface UserProfileSearchDto {
  keyword?: string;
  location?: string;
  industry?: string;
  skills?: string[];
  company?: string;
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  minExperienceYears?: number;
  maxExperienceYears?: number;
  includeIncompleteProfiles?: boolean;
  page?: number;
  size?: number;
}

export async function searchUsers(searchDto: UserProfileSearchDto) {
  const response = await fetch(`${API_BASE_URL}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(searchDto),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to search users');
  }
  return response.json();
}

export async function searchUsersBySkills(skills: string[]) {
  const response = await fetch(`${API_BASE_URL}/search/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skills }),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to search users by skills');
  }
  return response.json();
}

export async function searchUsersByLocation(location: string) {
  const response = await fetch(`${API_BASE_URL}/search/location`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location }),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to search users by location');
  }
  return response.json();
}

export async function getAllPublicUsers() {
  const response = await fetch(`${API_BASE_URL}`);
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to fetch public users');
  }
  return response.json();
}

export async function checkUserProfileExists(userId: string | number) {
  const response = await fetch(`${API_BASE_URL}/${userId}`);
  return response.ok;
}

// Find user profile by email
export async function findUserProfileByEmail(email: string): Promise<any | null> {
  console.log('userAPI - Searching for user profile by email:', email);
  
  try {
    // First, get all public users and search by email
    const allUsers = await getAllPublicUsers();
    const userProfile = allUsers.find((user: any) => user.email === email);
    
    if (userProfile) {
      console.log('userAPI - Found user profile by email:', userProfile);
      return userProfile;
    } else {
      console.log('userAPI - No user profile found for email:', email);
      return null;
    }
  } catch (error) {
    console.error('userAPI - Error finding user profile by email:', error);
    return null;
  }
} 