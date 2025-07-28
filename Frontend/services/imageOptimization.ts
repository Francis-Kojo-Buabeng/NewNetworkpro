import * as ImageManipulator from 'expo-image-manipulator';

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  aspectRatio?: number;
}

export interface OptimizedImageResult {
  uri: string;
  width: number;
  height: number;
  size: number;
  format: string;
}

/**
 * LinkedIn-style image optimization service
 * Handles image compression, resizing, and format conversion
 */
export class ImageOptimizationService {
  private static readonly DEFAULT_OPTIONS: ImageOptimizationOptions = {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.8,
    format: 'jpeg',
  };

  /**
   * Optimize image for profile pictures (1:1 aspect ratio)
   */
  static async optimizeProfilePicture(
    imageUri: string,
    options: Partial<ImageOptimizationOptions> = {}
  ): Promise<OptimizedImageResult> {
    const mergedOptions = { ...this.DEFAULT_OPTIONS, ...options, aspectRatio: 1 };
    return this.optimizeImage(imageUri, mergedOptions);
  }

  /**
   * Optimize image for banner/header images (3:1 aspect ratio)
   */
  static async optimizeBannerImage(
    imageUri: string,
    options: Partial<ImageOptimizationOptions> = {}
  ): Promise<OptimizedImageResult> {
    const mergedOptions = { ...this.DEFAULT_OPTIONS, ...options, aspectRatio: 3 };
    return this.optimizeImage(imageUri, mergedOptions);
  }

  /**
   * Generic image optimization
   */
  static async optimizeImage(
    imageUri: string,
    options: ImageOptimizationOptions = this.DEFAULT_OPTIONS
  ): Promise<OptimizedImageResult> {
    try {
      const { maxWidth, maxHeight, quality, format, aspectRatio } = options;

      // First, get image info
      const imageInfo = await ImageManipulator.manipulateAsync(
        imageUri,
        [],
        { format: ImageManipulator.SaveFormat.JPEG }
      );

      // Calculate target dimensions
      let targetWidth = maxWidth || imageInfo.width;
      let targetHeight = maxHeight || imageInfo.height;

      // Apply aspect ratio if specified
      if (aspectRatio) {
        if (aspectRatio > 1) {
          // Landscape (banner)
          targetHeight = targetWidth / aspectRatio;
        } else {
          // Portrait/square (profile)
          targetWidth = targetHeight * aspectRatio;
        }
      }

      // Ensure dimensions don't exceed max
      if (targetWidth > (maxWidth || imageInfo.width)) {
        targetWidth = maxWidth || imageInfo.width;
        targetHeight = targetWidth / (imageInfo.width / imageInfo.height);
      }

      if (targetHeight > (maxHeight || imageInfo.height)) {
        targetHeight = maxHeight || imageInfo.height;
        targetWidth = targetHeight * (imageInfo.width / imageInfo.height);
      }

      // Resize and compress
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            resize: {
              width: Math.round(targetWidth),
              height: Math.round(targetHeight),
            },
          },
        ],
        {
          format: format === 'png' ? ImageManipulator.SaveFormat.PNG : ImageManipulator.SaveFormat.JPEG,
          compress: quality || 0.8,
        }
      );

      return {
        uri: result.uri,
        width: result.width,
        height: result.height,
        size: 0, // Would need to calculate file size
        format: format || 'jpeg',
      };
    } catch (error) {
      console.error('Image optimization failed:', error);
      throw new Error('Failed to optimize image');
    }
  }

  /**
   * Generate thumbnail for preview
   */
  static async generateThumbnail(
    imageUri: string,
    size: number = 100
  ): Promise<string> {
    try {
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            resize: {
              width: size,
              height: size,
            },
          },
        ],
        {
          format: ImageManipulator.SaveFormat.JPEG,
          compress: 0.6,
        }
      );

      return result.uri;
    } catch (error) {
      console.error('Thumbnail generation failed:', error);
      throw new Error('Failed to generate thumbnail');
    }
  }

  /**
   * Validate image dimensions and file size
   */
  static validateImage(imageUri: string, maxSizeMB: number = 10): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Check dimensions
        const isValidDimensions = img.width > 0 && img.height > 0;
        
        // Check file size (approximate)
        fetch(imageUri)
          .then(response => response.blob())
          .then(blob => {
            const sizeInMB = blob.size / (1024 * 1024);
            const isValidSize = sizeInMB <= maxSizeMB;
            resolve(isValidDimensions && isValidSize);
          })
          .catch(() => resolve(false));
      };
      img.onerror = () => resolve(false);
      img.src = imageUri;
    });
  }
}

/**
 * Image URL utilities for LinkedIn-style handling
 */
export class ImageUrlUtils {
  private static readonly BASE_URL = 'http://10.232.142.14:8092';

  /**
   * Construct full image URL from relative path
   */
  static getFullImageUrl(relativePath: string): string {
    console.log('ImageUrlUtils - Constructing full URL:');
    console.log('  relativePath:', relativePath);
    
    if (!relativePath) {
      console.log('  returning empty string - no relativePath');
      return '';
    }

    if (relativePath.startsWith('http')) {
      console.log('  returning as-is - already full URL:', relativePath);
      return relativePath;
    }

    if (relativePath.startsWith('/')) {
      const fullUrl = `${this.BASE_URL}${relativePath}`;
      console.log('  constructed full URL:', fullUrl);
      return fullUrl;
    }

    const fullUrl = `${this.BASE_URL}/${relativePath}`;
    console.log('  constructed full URL:', fullUrl);
    return fullUrl;
  }

  /**
   * Get optimized image URL with size parameters
   */
  static getOptimizedImageUrl(baseUrl: string, width: number, height: number): string {
    // LinkedIn-style URL with size parameters
    return `${baseUrl}?w=${width}&h=${height}&fit=crop`;
  }

  /**
   * Get profile picture URL with different sizes
   */
  static getProfilePictureUrl(baseUrl: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
    const sizes = {
      small: 48,
      medium: 120,
      large: 200,
    };
    
    const sizeValue = sizes[size];
    return this.getOptimizedImageUrl(baseUrl, sizeValue, sizeValue);
  }

  /**
   * Get banner image URL with optimized dimensions
   */
  static getBannerImageUrl(baseUrl: string, width: number = 1200): string {
    const height = Math.round(width / 3); // 3:1 aspect ratio
    return this.getOptimizedImageUrl(baseUrl, width, height);
  }
} 