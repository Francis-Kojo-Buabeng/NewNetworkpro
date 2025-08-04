import { uploadProfilePicture, deleteProfilePicture, uploadBannerImage, deleteBannerImage } from './userAPI';
import { USER_SERVICE_BASE_URL } from '../constants/Config';

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export class ImageService {
  /**
   * Upload profile picture with consistent error handling
   */
  static async uploadAvatar(userId: string, imageUri: string): Promise<ImageUploadResult> {
    try {
      const url = await uploadProfilePicture(userId, imageUri);
      return { success: true, url };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to upload avatar' };
    }
  }

  /**
   * Upload banner image with consistent error handling
   */
  static async uploadBanner(userId: string, imageUri: string): Promise<ImageUploadResult> {
    try {
      const url = await uploadBannerImage(userId, imageUri);
      return { success: true, url };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to upload banner' };
    }
  }

  /**
   * Delete profile picture
   */
  static async deleteAvatar(userId: string): Promise<ImageUploadResult> {
    try {
      await deleteProfilePicture(userId);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to delete avatar' };
    }
  }

  /**
   * Delete banner image
   */
  static async deleteBanner(userId: string): Promise<ImageUploadResult> {
    try {
      await deleteBannerImage(userId);
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Failed to delete banner' };
    }
  }

  /**
   * Get image source for React Native Image component
   */
  static getImageSource(imageUrl?: string | null, fallbackImage?: any) {
    // Handle null, undefined, or empty string
    if (!imageUrl || typeof imageUrl !== 'string') {
      return fallbackImage || require('@/assets/images/Avator-Image.jpg');
    }
    
    // If it's already a full URL, use it directly
    if (imageUrl.startsWith('http')) {
      return { uri: imageUrl };
    }
    
    // If it's a relative path, convert to full URL
    if (imageUrl.startsWith('/')) {
      return { uri: `${USER_SERVICE_BASE_URL}${imageUrl}` };
    }
    
    // Fallback to default
    return fallbackImage || require('@/assets/images/Avator-Image.jpg');
  }

  /**
   * Check if image URL is valid
   */
  static isValidImageUrl(url?: string | null): boolean {
    if (!url) return false;
    return url.startsWith('http') || url.startsWith('/');
  }

  /**
   * Test method to verify ImageService functionality
   */
  static testImageService() {
    console.log('ImageService - Testing functionality:');
    
    // Test getImageSource with different URL types
    const testCases = [
      null,
      'http://example.com/image.jpg',
      '/profile-pictures/6/filename.jpg',
      '/banner-images/6/filename.jpg',
      'invalid-url'
    ];
    
    testCases.forEach((url, index) => {
      const source = this.getImageSource(url);
      console.log(`ImageService - Test case ${index + 1}:`, {
        input: url,
        output: source,
        isValid: this.isValidImageUrl(url)
      });
    });
    
    console.log('ImageService - Test completed');
  }

  /**
   * Comprehensive test for all ImageService methods
   */
  static async runComprehensiveTest() {
    console.log('ImageService - Running comprehensive test...');
    
    // Test 1: URL validation
    console.log('Test 1: URL validation');
    const testUrls = [
      null,
      undefined,
      '',
      'http://example.com/image.jpg',
      '/profile-pictures/6/filename.jpg',
      '/banner-images/6/filename.jpg',
      'invalid-url',
      `https://${USER_SERVICE_BASE_URL.replace('http://', '')}/profile-pictures/6/filename.jpg`
    ];
    
    testUrls.forEach((url, index) => {
      const isValid = this.isValidImageUrl(url);
      console.log(`  URL ${index + 1}: "${url}" -> isValid: ${isValid}`);
    });
    
    // Test 2: Image source generation
    console.log('Test 2: Image source generation');
    testUrls.forEach((url, index) => {
      const source = this.getImageSource(url);
      console.log(`  URL ${index + 1}: "${url}" -> source:`, source);
    });
    
    // Test 3: Fallback handling
    console.log('Test 3: Fallback handling');
    const fallbackTest = this.getImageSource(null, require('@/assets/images/banner-images/banner-01.jpg'));
    console.log('  Null URL with fallback:', fallbackTest);
    
    console.log('ImageService - Comprehensive test completed');
  }

  /**
   * Test the complete image flow
   */
  static async testCompleteFlow() {
    console.log('ImageService - Testing complete image flow...');
    
    // Test 1: Backend URL format (what we expect from backend)
    const backendUrls = [
      `${USER_SERVICE_BASE_URL}/profile-pictures/6/filename.jpg`,
      `${USER_SERVICE_BASE_URL}/banner-images/6/filename.jpg`,
      null,
      undefined
    ];
    
    console.log('Test 1: Backend URL processing');
    backendUrls.forEach((url, index) => {
      const source = this.getImageSource(url);
      const isValid = this.isValidImageUrl(url);
      console.log(`  Backend URL ${index + 1}: "${url}"`);
      console.log(`    isValid: ${isValid}`);
      console.log(`    source:`, source);
    });
    
    // Test 2: Legacy URL format (for backward compatibility)
    const legacyUrls = [
      '/profile-pictures/6/filename.jpg',
      '/banner-images/6/filename.jpg',
      '6/filename.jpg'
    ];
    
    console.log('Test 2: Legacy URL processing');
    legacyUrls.forEach((url, index) => {
      const source = this.getImageSource(url);
      const isValid = this.isValidImageUrl(url);
      console.log(`  Legacy URL ${index + 1}: "${url}"`);
      console.log(`    isValid: ${isValid}`);
      console.log(`    source:`, source);
    });
    
    console.log('ImageService - Complete flow test finished');
  }

  /**
   * Test with the actual URL from logs
   */
  static testActualUrl() {
    const actualUrl = '/profile-pictures/20/04c367c7-ab9c-42a1-880a-ffad0335eec4.jpg';
    console.log('ImageService - Testing actual URL from logs:');
    console.log('  Input URL:', actualUrl);
    const source = this.getImageSource(actualUrl);
    console.log('  Output source:', source);
    console.log('  Is valid:', this.isValidImageUrl(actualUrl));
  }
} 