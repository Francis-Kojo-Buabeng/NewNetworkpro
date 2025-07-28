import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCurrentTheme, getLogoAsset, useTheme } from '../../contexts/ThemeContext';
import ThemedLogo from '../../components/ThemedLogo';

const { width } = Dimensions.get('window');

interface OnboardingScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  icon: string;
  image: any;
}

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    title: 'Connect with Top Professionals',
    description: 'Build your network. Find collaborators, mentors, and creators who share your vision.',
    icon: 'account-group',
    image: require('@/assets/images/networkpro-logo.png'),
  },
  {
    id: 2,
    title: 'Showcase Your Skills & Achievements',
    description: 'Link your work, earn badges, and highlight your best projects and expertise.',
    icon: 'star-circle',
    image: require('@/assets/images/networkpro-logo.png'),
  },
  {
    id: 3,
    title: 'Collaborate, Learn, and Grow',
    description: 'Join real-world projects, freelance teams, and startup ideas. Grow your career and skills.',
    icon: 'chat',
    image: require('@/assets/images/networkpro-logo.png'),
  },
  {
    id: 4,
    title: 'Ready to Dive In?',
    description: 'Your profile is set. Let\'s build your future together!',
    icon: 'rocket-launch',
    image: require('@/assets/images/networkpro-logo.png'),
  },
];

export default function OnboardingScreen({ onComplete, onSkip }: OnboardingScreenProps) {
  const theme = useCurrentTheme();
  const { currentTheme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const isManualScroll = useRef(false);

  // Sync currentIndex with scroll position
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    if (index !== currentIndex) {
      setCurrentIndex(index);
    }
  };

  // When pressing next, scroll to the next slide
  const handleNext = () => {
    if (currentIndex < onboardingSlides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      isManualScroll.current = true;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  // When user swipes, update currentIndex
  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / width);
    setCurrentIndex(index);
    isManualScroll.current = false;
  };

  const handleSkip = () => {
    onSkip();
  };

  const renderSlide = (slide: OnboardingSlide) => (
    <View key={slide.id} style={styles.slide} accessible accessibilityLabel={slide.title}>
      {/* Logo in the top left corner */}
      <View style={styles.logoCorner}>
        <ThemedLogo style={styles.logo} resizeMode="contain" />
      </View>
      {/* Icon/Illustration */}
      <View style={styles.illustrationContainer}>
        <MaterialCommunityIcons name={slide.icon as any} size={80} color={theme.primaryColor} />
      </View>
      {/* Title */}
      <Text style={[styles.title, { color: theme.textColor }]}>{slide.title}</Text>
      {/* Description */}
      <Text style={[styles.description, { color: theme.textSecondaryColor }]}>{slide.description}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
        style={styles.scrollView}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel="Onboarding slides"
      >
        {onboardingSlides.map(renderSlide)}
      </ScrollView>

      {/* Progress Dots */}
      <View style={styles.progressContainer} accessible accessibilityRole="progressbar">
        {onboardingSlides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              { backgroundColor: theme.textTertiaryColor },
              i === currentIndex && { backgroundColor: theme.primaryColor },
            ]}
            accessibilityLabel={i === currentIndex ? 'Current step' : undefined}
          />
        ))}
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip} accessibilityRole="button" accessibilityLabel="Skip onboarding">
          <Text style={[styles.skipText, { color: theme.textSecondaryColor }]}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: theme.primaryColor }]}
          onPress={handleNext}
          accessibilityRole="button"
          accessibilityLabel={currentIndex === onboardingSlides.length - 1 ? 'Get Started' : 'Continue'}
        >
          <Text style={[styles.nextButtonText, { color: theme.textColor }]}>
            {currentIndex === onboardingSlides.length - 1 ? 'Get Started' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  logoRow: {
    display: 'none',
  },
  logoCorner: {
    position: 'absolute',
    top: 36,
    left: 24,
    zIndex: 10,
  },
  logo: {
    width: 40,
    height: 40,
  },
  illustrationContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  progressDotActive: {
    width: 24,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
    width: '100%',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    minWidth: 120,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 