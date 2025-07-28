import { fetchUserProfile } from './userAPI';
import { ImageCacheService } from './imageCache';
import { ImageUrlUtils } from './imageOptimization';

export interface OptimizedProfileData {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  about: string;
  skills: string[];
  avatarUrl: string | null;
  bannerUrl: string | null;
  experience: any[];
  education: any[];
  mutualConnections: number;
  isConnected: boolean;
  profileViews: number;
  followers: number;
  // Raw data from backend
  rawProfile: any;
}

export class ProfileDataService {
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static profileCache = new Map<string, { data: OptimizedProfileData; timestamp: number }>();

  /**
   * Get optimized profile data with efficient image handling
   */
  static async getProfileData(userId: string): Promise<OptimizedProfileData> {
    try {
      console.log('ProfileDataService - getProfileData called for userId:', userId);
      
      // Check cache first
      const cached = this.profileCache.get(userId);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        console.log('ProfileDataService - Using cached profile data');
        console.log('ProfileDataService - Cached data headerImage:', cached.data.rawProfile.headerImage);
        return cached.data;
      }

      console.log('ProfileDataService - Fetching fresh profile data from database');
      
      // Fetch from database
      const rawProfile = await fetchUserProfile(userId);
      console.log('ProfileDataService - Raw profile from API:', JSON.stringify(rawProfile, null, 2));
      
      // Process and optimize the data
      const optimizedData = await this.optimizeProfileData(rawProfile);
      
      // Cache the result
      this.profileCache.set(userId, {
        data: optimizedData,
        timestamp: Date.now()
      });

      console.log('ProfileDataService - Final optimized data headerImage:', optimizedData.rawProfile.headerImage);
      console.log('ProfileDataService - Final optimized data bannerUrl:', optimizedData.bannerUrl);

      return optimizedData;
    } catch (error) {
      console.error('ProfileDataService - Failed to fetch profile:', error);
      throw new Error('Failed to load profile data');
    }
  }

  /**
   * Optimize profile data with efficient image URL handling
   */
  private static async optimizeProfileData(rawProfile: any): Promise<OptimizedProfileData> {
    // Simple name processing
    let name = 'Unknown User';
    if (rawProfile.fullName) {
      name = rawProfile.fullName;
    } else if (rawProfile.firstName || rawProfile.lastName) {
      const firstName = rawProfile.firstName || '';
      const lastName = rawProfile.lastName || '';
      name = lastName ? `${firstName} ${lastName}` : firstName;
    } else {
      name = 'Unknown User';
    }

    return {
      id: rawProfile.id?.toString() || '',
      name,
      title: rawProfile.headline || rawProfile.currentPosition || rawProfile.title || '',
      company: rawProfile.currentCompany || rawProfile.company || '',
      location: rawProfile.location || '',
      about: rawProfile.bio || rawProfile.summary || rawProfile.about || '',
      skills: rawProfile.skills || [],
      avatarUrl: rawProfile.profilePictureUrl, // Keep raw URL
      bannerUrl: rawProfile.headerImage, // Keep raw URL
      experience: rawProfile.workExperiences || rawProfile.workExperience || [],
      education: rawProfile.education || [],
      mutualConnections: 0,
      isConnected: false,
      profileViews: rawProfile.profileViews || 0,
      followers: rawProfile.followers || 0,
      rawProfile, // Keep raw data for reference
    };
  }

  /**
   * Clear profile cache for a specific user
   */
  static clearProfileCache(userId?: string): void {
    if (userId) {
      this.profileCache.delete(userId);
      console.log('ProfileDataService - Cleared cache for user:', userId);
    } else {
      this.profileCache.clear();
      console.log('ProfileDataService - Cleared all profile cache');
    }
  }

  /**
   * Get cache statistics
   */
  static getCacheStats(): { cachedProfiles: number; oldestEntry: number } {
    const entries = Array.from(this.profileCache.entries());
    const now = Date.now();
    
    return {
      cachedProfiles: entries.length,
      oldestEntry: entries.length > 0 ? 
        Math.min(...entries.map(([_, data]) => data.timestamp)) : 0,
    };
  }

  /**
   * Force refresh profile data (bypass cache)
   */
  static async refreshProfileData(userId: string): Promise<OptimizedProfileData> {
    this.clearProfileCache(userId);
    return this.getProfileData(userId);
  }

  /**
   * Update profile cache after image upload
   */
  static async updateProfileAfterImageUpload(
    userId: string, 
    imageType: 'avatar' | 'banner', 
    imageUrl: string
  ): Promise<void> {
    const cached = this.profileCache.get(userId);
    if (cached) {
      const updatedData = { ...cached.data };
      
      if (imageType === 'avatar') {
        updatedData.avatarUrl = imageUrl;
        updatedData.rawProfile.profilePictureUrl = imageUrl;
      } else if (imageType === 'banner') {
        updatedData.bannerUrl = imageUrl;
        updatedData.rawProfile.headerImage = imageUrl;
      }

      this.profileCache.set(userId, {
        data: updatedData,
        timestamp: Date.now()
      });

      console.log(`ProfileDataService - Updated ${imageType} in cache for user:`, userId);
      console.log(`ProfileDataService - URL: ${imageUrl}`);
    }
  }
} 