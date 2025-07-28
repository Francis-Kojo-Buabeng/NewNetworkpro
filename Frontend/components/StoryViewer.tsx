import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useStories } from '../contexts/StoriesContext';

const { width, height } = Dimensions.get('window');

interface StoryViewerProps {
  visible: boolean;
  initialIndex: number;
  onClose: () => void;
}

export default function StoryViewer({ visible, initialIndex, onClose }: StoryViewerProps) {
  const { stories, markStoryViewed } = useStories();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setCurrentIndex(initialIndex);
      startProgress();
    }
    // eslint-disable-next-line
  }, [visible, initialIndex]);

  useEffect(() => {
    if (visible) {
      markStoryViewed(stories[currentIndex]?.id);
      startProgress();
    }
    // eslint-disable-next-line
  }, [currentIndex, visible]);

  const startProgress = () => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000, // 5 seconds per story
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) handleNext();
    });
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      onClose();
    }
  };

  if (!visible || !stories[currentIndex]) return null;
  const story = stories[currentIndex];

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          {stories.map((_, idx) => (
            <View key={idx} style={styles.progressBarBg}>
              <Animated.View
                style={[
                  styles.progressBar,
                  idx === currentIndex
                    ? { flex: progress }
                    : idx < currentIndex
                    ? { flex: 1 }
                    : { flex: 0 },
                ]}
              />
            </View>
          ))}
        </View>
        {/* Top Gradient Overlay */}
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0)"]}
          style={styles.topGradient}
        />
        {/* Bottom Gradient Overlay */}
        <LinearGradient
          colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
          style={styles.bottomGradient}
        />
        {/* Close Button */}
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <MaterialCommunityIcons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        {/* Story Content */}
        <TouchableOpacity style={styles.leftZone} onPress={handlePrev} />
        <TouchableOpacity style={styles.rightZone} onPress={handleNext} />
        <View style={styles.content}>
          {/* WhatsApp-style content */}
          {story.media ? (
            <Image source={{ uri: story.media }} style={styles.media} resizeMode="cover" />
          ) : (
            <LinearGradient
              colors={["#485563", "#29323c"]}
              style={styles.whatsappTextBg}
            />
          )}
          {/* Overlay for text/stickers and avatar/username */}
          {story.media ? (
            (story.text || (story.stickers && story.stickers.length > 0)) && (
              <View style={styles.whatsappTextBox}>
                <View style={styles.inlineHeader}>
                  <Image source={story.avatar} style={styles.avatarSmall} />
                  <Text style={styles.userNameSmall}>{story.userName}</Text>
                </View>
                {story.text ? (
                  <Text style={styles.whatsappText}>{story.text}</Text>
                ) : null}
                {story.stickers && story.stickers.length > 0 ? (
                  <Text style={styles.whatsappSticker}>{story.stickers.join(' ')}</Text>
                ) : null}
              </View>
            )
          ) : (
            (story.text || (story.stickers && story.stickers.length > 0)) && (
              <View style={styles.whatsappTextCenter}>
                <View style={styles.inlineHeader}>
                  <Image source={story.avatar} style={styles.avatarSmall} />
                  <Text style={styles.userNameSmall}>{story.userName}</Text>
                </View>
                {story.text ? (
                  <Text style={styles.whatsappTextOnly}>{story.text}</Text>
                ) : null}
                {story.stickers && story.stickers.length > 0 ? (
                  <Text style={styles.whatsappStickerOnly}>{story.stickers.join(' ')}</Text>
                ) : null}
              </View>
            )
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height,
  },
  progressBarContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    zIndex: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: 3,
    backgroundColor: '#fff',
  },
  closeBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 20,
  },
  leftZone: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width / 2,
    zIndex: 5,
  },
  rightZone: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: width / 2,
    zIndex: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 60,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  media: {
    width: width * 0.8,
    height: height * 0.5,
    borderRadius: 16,
    marginBottom: 16,
  },
  storyText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 8,
  },
  sticker: {
    fontSize: 54,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginTop: 8,
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 5,
  },
  bottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 180,
    zIndex: 5,
  },
  textOverlayWrap: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
    paddingHorizontal: 24,
  },
  stickerOverlayWrap: {
    position: 'absolute',
    top: '60%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  headerAbsolute: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  whatsappTextBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  whatsappTextBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 60,
    marginHorizontal: 24,
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 10,
  },
  whatsappText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
  },
  whatsappSticker: {
    fontSize: 38,
    textAlign: 'center',
  },
  whatsappTextCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    paddingHorizontal: 24,
  },
  whatsappTextOnly: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  whatsappStickerOnly: {
    fontSize: 54,
    textAlign: 'center',
  },
  inlineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  userNameSmall: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 