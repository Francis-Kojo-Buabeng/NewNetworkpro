import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImageUrlUtils } from './imageOptimization';

interface CachedImage {
  url: string;
  timestamp: number;
  size: number;
  lastAccessed: number;
}

interface ImageCacheConfig {
  maxSize: number; // MB
  maxAge: number; // hours
  maxImages: number;
}

export class ImageCacheService {
  private static readonly CACHE_KEY = 'image_cache';
  private static readonly CONFIG_KEY = 'image_cache_config';
  private static readonly DEFAULT_CONFIG: ImageCacheConfig = {
    maxSize: 50, // 50MB
    maxAge: 24, // 24 hours
    maxImages: 100,
  };

  /**
   * Get cached image URL or fetch from server
   */
  static async getImageUrl(
    relativePath: string | null,
    fallbackSource?: any
  ): Promise<string | null> {
    if (!relativePath) return null;

    try {
      console.log('ImageCacheService - Processing image URL:');
      console.log('  relativePath:', relativePath);
      
      // Handle different URL formats
      let fullUrl;
      if (relativePath.startsWith('http')) {
        fullUrl = relativePath;
      } else if (relativePath.startsWith('/')) {
        // New backend format: /userId/filename
        // Determine if it's a profile picture or banner image based on the path
        if (relativePath.includes('/profile-pictures/') || relativePath.includes('/banner-images/')) {
          fullUrl = `http://10.232.142.14:8092${relativePath}`;
        } else {
          // Assume it's a profile picture by default
          fullUrl = `http://10.232.142.14:8092/profile-pictures${relativePath}`;
        }
      } else {
        // Assume it's a profile picture by default
        fullUrl = `http://10.232.142.14:8092/profile-pictures/${relativePath}`;
      }
      
      console.log('  fullUrl:', fullUrl);
      
      // Check if URL is accessible
      const isAccessible = await this.testImageAccessibility(fullUrl);
      console.log('  isAccessible:', isAccessible);
      
      if (isAccessible) {
        // Cache the successful URL
        await this.cacheImageUrl(relativePath, fullUrl);
        console.log('  returning fullUrl:', fullUrl);
        return fullUrl;
      } else {
        // Try alternative URL construction
        const alternativeUrl = 'http://10.232.142.14:8092' + relativePath;
        console.log('  trying alternativeUrl:', alternativeUrl);
        const isAlternativeAccessible = await this.testImageAccessibility(alternativeUrl);
        console.log('  isAlternativeAccessible:', isAlternativeAccessible);
        
        if (isAlternativeAccessible) {
          await this.cacheImageUrl(relativePath, alternativeUrl);
          console.log('  returning alternativeUrl:', alternativeUrl);
          return alternativeUrl;
        }
      }
    } catch (error) {
      console.warn('ImageCacheService - Error processing image URL:', error);
    }

    console.log('  returning null - no accessible URL found');
    return null;
  }

  /**
   * Test if image URL is accessible
   */
  private static async testImageAccessibility(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { 
        method: 'HEAD'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Cache image URL for future use
   */
  private static async cacheImageUrl(relativePath: string, fullUrl: string): Promise<void> {
    try {
      const cache = await this.getCache();
      const now = Date.now();
      
      cache[relativePath] = {
        url: fullUrl,
        timestamp: now,
        size: 0, // Would need to calculate actual size
        lastAccessed: now,
      };

      // Clean up old entries
      await this.cleanupCache(cache);
      
      await AsyncStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.warn('Failed to cache image URL:', error);
    }
  }

  /**
   * Get cached image URLs
   */
  private static async getCache(): Promise<Record<string, CachedImage>> {
    try {
      const cached = await AsyncStorage.getItem(this.CACHE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch (error) {
      console.warn('Failed to get image cache:', error);
      return {};
    }
  }

  /**
   * Clean up old cache entries
   */
  private static async cleanupCache(cache: Record<string, CachedImage>): Promise<void> {
    const config = await this.getConfig();
    const now = Date.now();
    const maxAgeMs = config.maxAge * 60 * 60 * 1000; // Convert hours to milliseconds

    // Remove expired entries
    Object.keys(cache).forEach(key => {
      if (now - cache[key].timestamp > maxAgeMs) {
        delete cache[key];
      }
    });

    // Remove oldest entries if too many
    const entries = Object.entries(cache);
    if (entries.length > config.maxImages) {
      entries.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
      const toRemove = entries.slice(0, entries.length - config.maxImages);
      toRemove.forEach(([key]) => delete cache[key]);
    }
  }

  /**
   * Get cache configuration
   */
  private static async getConfig(): Promise<ImageCacheConfig> {
    try {
      const config = await AsyncStorage.getItem(this.CONFIG_KEY);
      return config ? JSON.parse(config) : this.DEFAULT_CONFIG;
    } catch (error) {
      return this.DEFAULT_CONFIG;
    }
  }

  /**
   * Clear all cached images
   */
  static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.CACHE_KEY);
    } catch (error) {
      console.warn('Failed to clear image cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  static async getCacheStats(): Promise<{
    totalImages: number;
    totalSize: number;
    oldestEntry: number;
  }> {
    try {
      const cache = await this.getCache();
      const entries = Object.values(cache);
      
      return {
        totalImages: entries.length,
        totalSize: entries.reduce((sum, entry) => sum + entry.size, 0),
        oldestEntry: entries.length > 0 ? Math.min(...entries.map(e => e.timestamp)) : 0,
      };
    } catch (error) {
      return { totalImages: 0, totalSize: 0, oldestEntry: 0 };
    }
  }
} 