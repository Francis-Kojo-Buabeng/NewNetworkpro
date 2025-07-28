import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import StoryCreationScreen from '../app/microfrontends/story/StoryCreationScreen';
import { Story as StoryType, useStories } from '../contexts/StoriesContext';
import { useCurrentTheme } from '../contexts/ThemeContext';
import UserProfileModal from './UserProfileModal';

interface StoryButtonProps {
  story: StoryType;
  onPress?: () => void;
  isUserStory?: boolean;
}

export default function StoryButton({ story, onPress, isUserStory = false }: StoryButtonProps) {
  const theme = useCurrentTheme();
  const { markStoryViewed } = useStories();
  const [showStoryCreation, setShowStoryCreation] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Mock user data for profile modal
  const getUserProfileData = () => ({
    name: story.userName,
    avatar: story.avatar,
    title: 'Software Engineer',
    company: 'Tech Company',
    location: 'San Francisco, CA',
    bio: 'Passionate software engineer with experience in React Native, JavaScript, and mobile development. Always eager to learn new technologies and solve complex problems.',
    connections: 150,
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Company',
        duration: '2021 - Present',
      },
      {
        title: 'Software Engineer',
        company: 'Startup Inc',
        duration: '2019 - 2021',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        school: 'University of Technology',
        year: '2019',
      },
    ],
    skills: ['React Native', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'Git'],
  });

  const handleStoryPress = () => {
    if (isUserStory) {
      setShowStoryCreation(true);
    } else if (story.media || story.text) {
      markStoryViewed(story.id);
      // TODO: Open story viewer modal here
    } else {
      setShowProfileModal(true);
    }
    if (onPress) {
      onPress();
    }
  };

  const handleStoryCreated = () => {
    setShowStoryCreation(false);
    // You can add logic here to refresh stories or update UI
  };

  return (
    <>
      <TouchableOpacity style={styles.storyItem} onPress={handleStoryPress}>
        <View style={styles.storyAvatarWrap}>
          {!isUserStory ? (
            !story.viewed ? (
              <LinearGradient
                colors={['#f9ce34', '#ee2a7b', '#6228d7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientRing}
              >
                <View style={styles.avatarBorder}>
                  <Image source={story.avatar} style={styles.avatar} />
                </View>
              </LinearGradient>
            ) : (
              <View style={styles.grayRing}>
                <View style={styles.avatarBorder}>
                  <Image source={story.avatar} style={styles.avatar} />
                </View>
              </View>
            )
          ) : (
            <View style={styles.avatarBorder}>
              <Image source={story.avatar} style={styles.avatar} />
              {/* Add button for user's story */}
              <View style={styles.addStoryButton}>
                <MaterialCommunityIcons name="plus" size={16} color="#fff" />
              </View>
            </View>
          )}
        </View>
        <Text style={[styles.storyName, { color: theme.textColor }]} numberOfLines={1}>
          {story.userName}
        </Text>
      </TouchableOpacity>
      
      {/* Story Creation Screen */}
      <StoryCreationScreen
        visible={showStoryCreation}
        onClose={() => setShowStoryCreation(false)}
        onStoryCreated={handleStoryCreated}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={getUserProfileData()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  storyItem: {
    alignItems: 'center',
    marginRight: 5,
    width: 80,
  },
  storyAvatarWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  gradientRing: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBorder: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  storyAvatar: {
    // No longer used, replaced by storyAvatarWrap/gradientRing/avatarBorder
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
  },
  storyName: {
    fontSize: 12,
    textAlign: 'center',
  },
  storyIndicator: {
    position: 'absolute',
    bottom: 8, // was 4, moved downward
    right: 4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#1877F2',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  addStoryButton: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#1877F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  grayRing: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d1d1d1',
  },
}); 