import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrentTheme } from '../contexts/ThemeContext';

interface LikeButtonProps {
  initialLiked?: boolean;
  initialLikeCount?: number;
  onLikeChange?: (liked: boolean, count: number) => void;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
  disabled?: boolean;
}

export default function LikeButton({
  initialLiked = false,
  initialLikeCount = 0,
  onLikeChange,
  size = 'medium',
  showCount = true,
  disabled = false,
}: LikeButtonProps) {
  const theme = useCurrentTheme();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [scaleValue] = useState(new Animated.Value(1));

  const iconSize = size === 'small' ? 14 : size === 'large' ? 20 : 16;
  const textSize = size === 'small' ? 12 : size === 'large' ? 16 : 14;

  const handleLikePress = () => {
    if (disabled) return;

    const newLiked = !isLiked;
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;

    // Animate the button
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setIsLiked(newLiked);
    setLikeCount(newCount);

    // Call the callback if provided
    if (onLikeChange) {
      onLikeChange(newLiked, newCount);
    }
  };

  const getIconName = () => {
    return isLiked ? 'thumb-up' : 'thumb-up-outline';
  };

  const getIconColor = () => {
    return isLiked ? '#1877F2' : theme.textSecondaryColor;
  };

  const getTextColor = () => {
    return isLiked ? '#1877F2' : theme.textSecondaryColor;
  };

  return (
    <TouchableOpacity
      style={[
        styles.likeButton,
        { opacity: disabled ? 0.5 : 1 }
      ]}
      onPress={handleLikePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <MaterialCommunityIcons
          name={getIconName() as any}
          size={iconSize}
          color={getIconColor()}
        />
      </Animated.View>
      {showCount && (
        <Text style={[
          styles.likeText,
          { color: getTextColor(), fontSize: textSize }
        ]}>
          Like
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  likeText: {
    marginLeft: 6,
    fontWeight: '500',
  },
}); 