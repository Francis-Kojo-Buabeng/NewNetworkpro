import React, { useState, useEffect } from 'react';
import { Image, View, ActivityIndicator, StyleSheet, ImageStyle, ViewStyle } from 'react-native';
import { useCurrentTheme } from '../contexts/ThemeContext';

interface ImageWithFallbackProps {
  source: { uri: string } | any;
  fallbackSource?: any;
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  onLoad?: () => void;
  onError?: () => void;
  showLoadingIndicator?: boolean;
  cachePolicy?: 'default' | 'reload' | 'returnCacheDataElseLoad' | 'returnCacheDataDontLoad';
}

export default function ImageWithFallback({
  source,
  fallbackSource,
  style,
  containerStyle,
  resizeMode = 'cover',
  onLoad,
  onError,
  showLoadingIndicator = true,
  cachePolicy = 'default'
}: ImageWithFallbackProps) {
  const theme = useCurrentTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSource, setCurrentSource] = useState(source);

  // Determine if source is a remote URI
  const isRemoteUri = typeof source === 'object' && source.uri && typeof source.uri === 'string' && source.uri.startsWith('http');

  useEffect(() => {
    if (isRemoteUri && source.uri && typeof source.uri === 'string') {
      // Test if the image URL is accessible
      fetch(source.uri, { method: 'HEAD' })
        .then(response => {
          if (!response.ok) {
            throw new Error('Image not accessible');
          }
        })
        .catch(() => {
          // If remote image fails, use fallback
          if (fallbackSource) {
            setCurrentSource(fallbackSource);
            setHasError(false);
          } else {
            setHasError(true);
          }
        });
    }
  }, [source.uri, fallbackSource, isRemoteUri]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    
    // Try fallback if available
    if (fallbackSource && currentSource !== fallbackSource) {
      setCurrentSource(fallbackSource);
      setHasError(false);
      setIsLoading(true);
    } else {
      onError?.();
    }
  };

  // If we have an error and no fallback, show placeholder
  if (hasError && !fallbackSource) {
    return (
      <View style={[styles.placeholder, style, containerStyle, { backgroundColor: theme.surfaceColor }]}>
        <View style={[styles.placeholderContent, { backgroundColor: theme.cardColor }]} />
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Image
        source={currentSource}
        style={[styles.image, style]}
        resizeMode={resizeMode}
        onLoad={handleLoad}
        onError={handleError}
      />
      {isLoading && showLoadingIndicator && (
        <View style={[styles.loadingOverlay, { backgroundColor: theme.overlayColor }]}>
          <ActivityIndicator size="small" color={theme.primaryColor} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContent: {
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.3,
  },
}); 