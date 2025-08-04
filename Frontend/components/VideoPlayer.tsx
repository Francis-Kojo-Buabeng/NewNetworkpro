import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrentTheme } from '../contexts/ThemeContext';
import { useVideoPlayer, VideoView } from 'expo-video';

interface VideoPlayerProps {
  source: string | number;
  style?: any;
  onClose?: () => void;
}

export default function VideoPlayer({ source, style, onClose }: VideoPlayerProps) {
  const theme = useCurrentTheme();
  const player = useVideoPlayer(source, player => {
    player.loop = false;
  });

  return (
    <View style={[styles.container, style]}> 
      <VideoView
                style={styles.video}
        player={player}
        allowsFullscreen
        allowsPictureInPicture
        nativeControls
        contentFit="contain"
                    />
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialCommunityIcons name="close" size={28} color={theme.textColor} />
                  </TouchableOpacity>
          )}
        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: 9999,
  },
  video: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 0,
    backgroundColor: '#000',
  },
  closeButton: {
    position: 'absolute',
    top: 32,
    right: 24,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 4,
  },
}); 