import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrentTheme } from '../contexts/ThemeContext';
import ShareModal from './ShareModal';

interface ShareButtonProps {
  postId: string | number;
  postAuthor: string;
  postContent: string;
  shareCount?: number;
  onPress?: () => void;
  style?: any;
  textStyle?: any;
  iconSize?: number;
  showText?: boolean;
}

export default function ShareButton({
  postId,
  postAuthor,
  postContent,
  shareCount = 0,
  onPress,
  style,
  textStyle,
  iconSize = 16,
  showText = true,
}: ShareButtonProps) {
  const theme = useCurrentTheme();
  const [isPressed, setIsPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = () => {
    setModalVisible(true);
    if (onPress) {
      onPress();
    }
  };

  return (
    <>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={[
            styles.button,
            { borderColor: theme.borderColor },
            style,
          ]}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="share-variant-outline"
            size={iconSize}
            color={isPressed ? theme.primaryColor : theme.textSecondaryColor}
          />
          {showText && (
            <Text
              style={[
                styles.text,
                { color: theme.textSecondaryColor },
                textStyle,
              ]}
            >
              {shareCount > 0 ? shareCount : 'Share'}
            </Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      <ShareModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        postId={postId}
        postAuthor={postAuthor}
        postContent={postContent}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  text: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
}); 