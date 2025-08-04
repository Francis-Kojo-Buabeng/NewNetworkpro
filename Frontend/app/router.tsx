import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StoriesProvider } from '../contexts/StoriesContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ProfileNavigationProvider, useProfileNavigation } from '../contexts/ProfileNavigationContext';
import { ProfileProvider } from '../contexts/ProfileContext';
import ProfileSetupScreen from './microfrontends/profile/ProfileSetupScreen';
import ProfileScreen from './microfrontends/profile/ProfileScreen';
import AppNavigator from './shell/AppNavigator';
import ForgotPasswordScreen from './shell/ForgotPasswordScreen';
import OnboardingScreen from './shell/OnboardingScreen';
import SignInScreen from './shell/SignInScreen';
import SignUpScreen from './shell/SignUpScreen';
import SplashScreen from './shell/SplashScreen';
import WelcomeScreen from './shell/WelcomeScreen';
import { fetchUserProfile, fetchUserProfileByEmail, createOrGetUserProfile } from '../services/userAPI';
import UserProfileScreen from './microfrontends/profile/UserProfileScreen';
import MyProfileScreen from './microfrontends/profile/MyProfileScreen';
import { PostsProvider } from './contexts/PostsContext';
import { userSessionService } from '../services/userSession';
import { USER_SERVICE_BASE_URL } from '../constants/Config';

export default function Router() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [createdProfile, setCreatedProfile] = useState<any | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  return (
    <ThemeProvider>
      <StoriesProvider>
        <ProfileNavigationProvider>
          <PostsProvider>
            <ProfileProvider userId={createdProfile?.id || '1'}>
              <RouterContent 
                currentScreen={currentScreen}
                setCurrentScreen={setCurrentScreen}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                hasSeenOnboarding={hasSeenOnboarding}
                setHasSeenOnboarding={setHasSeenOnboarding}
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
                isProfileComplete={isProfileComplete}
                setIsProfileComplete={setIsProfileComplete}
                userAvatar={userAvatar}
                setUserAvatar={setUserAvatar}
                isNavigating={isNavigating}
                setIsNavigating={setIsNavigating}
                router={router}
                createdProfile={createdProfile}
                setCreatedProfile={setCreatedProfile}
                userEmail={userEmail}
                setUserEmail={setUserEmail}
              />
            </ProfileProvider>
          </PostsProvider>
        </ProfileNavigationProvider>
      </StoriesProvider>
    </ThemeProvider>
  );
}

function RouterContent({
  currentScreen,
  setCurrentScreen,
  isLoading,
  setIsLoading,
  hasSeenOnboarding,
  setHasSeenOnboarding,
  isAuthenticated,
  setIsAuthenticated,
  isProfileComplete,
  setIsProfileComplete,
  userAvatar,
  setUserAvatar,
  isNavigating,
  setIsNavigating,
  router,
  createdProfile,
  setCreatedProfile,
  userEmail,
  setUserEmail
}: {
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (seen: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  isProfileComplete: boolean;
  setIsProfileComplete: (complete: boolean) => void;
  userAvatar: string | null;
  setUserAvatar: (avatar: string | null) => void;
  isNavigating: boolean;
  setIsNavigating: (navigating: boolean) => void;
  router: any;
  createdProfile: any | null;
  setCreatedProfile: (profile: any | null) => void;
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
}) {
  const { showProfileScreen, selectedProfile, closeProfile, handleConnect, handleMessage } = useProfileNavigation();
  const [showJustCreatedProfile, setShowJustCreatedProfile] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setCurrentScreen('onboarding');
    }, 2000);

    return () => clearTimeout(timer);
  }, []); // Only run once on mount

  // Navigation functions with proper state management and delays
  const navigateWithDelay = (screen: string) => {
    if (isNavigating) {
      console.log('Navigation already in progress, ignoring');
      return;
    }
    setIsNavigating(true);
    console.log('Navigating to:', screen);
    setCurrentScreen(screen);
    // Reset navigation flag after a short delay
    setTimeout(() => setIsNavigating(false), 100);
  };

  const goToOnboarding = () => navigateWithDelay('onboarding');
  const goToSignUp = () => navigateWithDelay('signup');
  const goToSignIn = () => navigateWithDelay('signin');
  const goToWelcome = () => navigateWithDelay('welcome');
  const goToMainApp = () => navigateWithDelay('main');
  const goToProfileSetup = () => navigateWithDelay('profilesetup');
  const goToForgotPassword = () => navigateWithDelay('forgotpassword');

  // Handle successful sign in - wrapper for SignInScreen interface
  const handleSignInWrapper = async (profileComplete: boolean = false) => {
    // Get email from user session service
    const session = userSessionService.getUserSession();
    if (session && session.email) {
      await handleSignIn(session.email, profileComplete);
    } else {
      console.error('Router - No user session found for sign in');
      navigateWithDelay('signin');
    }
  };

  // Handle successful sign up - wrapper for SignUpScreen interface
  const handleSignUpWrapper = async () => {
    // Get email from user session service
    const session = userSessionService.getUserSession();
    if (session && session.email) {
      await handleSignUp(session.email);
    } else {
      console.error('Router - No user session found for sign up');
      navigateWithDelay('signup');
    }
  };

  // Handle successful sign in
  const handleSignIn = async (email: string, profileComplete: boolean = false) => {
    console.log('Handling sign in for email:', email, 'profile complete:', profileComplete);
    setIsAuthenticated(true);
    setIsProfileComplete(profileComplete);
    setUserEmail(email);

    try {
      // Try to fetch existing user profile by email
      console.log('Router - Attempting to fetch user profile by email:', email);
      const userProfile = await fetchUserProfileByEmail(email);
      console.log('Router - Found existing profile:', userProfile);
      setCreatedProfile(userProfile);

      // Process avatar URL for microfrontend screens
      if (userProfile.profilePictureUrl) {
        let processedAvatarUrl: string | null = null;
        if (userProfile.profilePictureUrl.startsWith('http')) {
          processedAvatarUrl = userProfile.profilePictureUrl;
        } else if (userProfile.profilePictureUrl.startsWith('/')) {
          // Backend now returns paths like /profile-pictures/7/filename.jpg
          processedAvatarUrl = `${USER_SERVICE_BASE_URL}${userProfile.profilePictureUrl}`;
        } else {
          processedAvatarUrl = `${USER_SERVICE_BASE_URL}/profile-pictures/${userProfile.profilePictureUrl}`;
        }
        console.log('Router - Processed avatar URL for microfrontend:', processedAvatarUrl);
        setUserAvatar(processedAvatarUrl);
      }

      // Process header image URL for microfrontend screens
      if (userProfile.headerImage) {
        let processedHeaderUrl: string | null = null;
        if (userProfile.headerImage.startsWith('http')) {
          processedHeaderUrl = userProfile.headerImage;
        } else if (userProfile.headerImage.startsWith('/')) {
          // Backend now returns paths like /banner-images/7/filename.jpg
          processedHeaderUrl = `${USER_SERVICE_BASE_URL}${userProfile.headerImage}`;
        } else {
          processedHeaderUrl = `${USER_SERVICE_BASE_URL}/banner-images/${userProfile.headerImage}`;
        }
        console.log('Router - Processed header URL for microfrontend:', processedHeaderUrl);
        // Update the createdProfile with the processed header URL
        userProfile.headerImage = processedHeaderUrl;
      }

      // Check if profile is complete (has firstName)
      const isComplete = userProfile.firstName && userProfile.firstName.trim() !== '';
      setIsProfileComplete(isComplete);

      // Always navigate to main screen if profile exists, regardless of completion status
      // This allows users to use the app with incomplete profiles and complete them later
      console.log('Router - Profile exists, navigating to main screen');
      navigateWithDelay('main');
    } catch (error) {
      console.log('Router - No existing profile found, creating new one');
      try {
        // Create new profile for authenticated user
        const newProfile = await createOrGetUserProfile(email);
        console.log('Router - Created new profile:', newProfile);
        setCreatedProfile(newProfile);
        setIsProfileComplete(false);
        navigateWithDelay('profilesetup');
      } catch (createError) {
        console.error('Router - Failed to create user profile:', createError);
        // Still proceed to profile setup even if creation fails
        setIsProfileComplete(false);
        navigateWithDelay('profilesetup');
      }
    }
  };

  // Handle successful sign up
  const handleSignUp = async (email: string) => {
    console.log('Handling sign up for email:', email);
    setIsAuthenticated(true);
    setIsProfileComplete(false);
    setUserEmail(email);
    
    try {
      // Create new profile for newly registered user
      console.log('Router - Creating new profile for registered user:', email);
      const userProfile = await createOrGetUserProfile(email);
      console.log('Router - Created profile for new user:', userProfile);
      setCreatedProfile(userProfile);
    } catch (error) {
      console.error('Router - Failed to create user profile:', error);
    }
    navigateWithDelay('profilesetup');
  };

  // Update handleProfileComplete to accept createdProfile
  const handleProfileComplete = (avatarUri?: string | null, createdProfile?: any) => {
    console.log('Router - Handling profile complete');
    console.log('Router - Avatar URI received:', avatarUri);
    console.log('Router - Created profile:', createdProfile);
    setIsProfileComplete(true);
    if (avatarUri) {
      console.log('Router - Setting user avatar:', avatarUri);
      // Process avatar URL for microfrontend screens
      let processedAvatarUrl: string | null = null;
      if (avatarUri.startsWith('http')) {
        processedAvatarUrl = avatarUri;
      } else if (avatarUri.startsWith('/')) {
        // Backend now returns paths like /profile-pictures/7/filename.jpg
        processedAvatarUrl = `${USER_SERVICE_BASE_URL}${avatarUri}`;
      } else {
        processedAvatarUrl = `${USER_SERVICE_BASE_URL}/profile-pictures/${avatarUri}`;
      }
      console.log('Router - Processed avatar URL for microfrontend:', processedAvatarUrl);
      setUserAvatar(processedAvatarUrl);
    } else {
      console.log('Router - No avatar URI provided');
    }
    if (createdProfile) {
      const updatedProfile = { ...createdProfile, profilePictureUrl: avatarUri };
      console.log('Router - Setting created profile with avatar:', updatedProfile);
      setCreatedProfile(updatedProfile);
      setShowJustCreatedProfile(true);
      setCurrentScreen('profileview');
    } else {
      console.log('Router - No created profile, navigating to main');
      navigateWithDelay('main');
    }
  };

  // Mock functions for password reset (replace with real implementation)
  const handleResetPassword = async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    // In real app, this would call your backend API
  };

  if (isLoading || currentScreen === 'splash') {
    return <SplashScreen />;
  }

  // Handle profile screen display
  if (showProfileScreen && selectedProfile) {
    return (
      <UserProfileScreen
        profile={selectedProfile}
        onBack={() => {
          closeProfile();
        }}
        onConnect={() => handleConnect(selectedProfile.id)}
        onMessage={() => handleMessage(selectedProfile)}
      />
    );
  }

  if (showJustCreatedProfile && createdProfile && currentScreen === 'profileview') {
    // Map backend profile to ProfileScreen props
    const firstName = createdProfile.firstName || '';
    const lastName = createdProfile.lastName || '';
    const name = lastName ? `${firstName} ${lastName}` : firstName;
    
    console.log('Router - Created Profile:', createdProfile);
    console.log('Router - Profile Picture URL:', createdProfile.profilePictureUrl);
    console.log('Router - Header Image:', createdProfile.headerImage);
    console.log('Router - Avatar Image being passed:', createdProfile.profilePictureUrl || null);
    console.log('Router - Banner Image being passed:', createdProfile.headerImage || null);
    
    const profile = {
      id: createdProfile.id?.toString() || '',
      name,
      title: createdProfile.headline || '',
      company: createdProfile.currentCompany || '',
      location: createdProfile.location || '',
      avatar: createdProfile.profilePictureUrl ? { uri: createdProfile.profilePictureUrl } : require('@/assets/images/Avator-Image.jpg'),
      headerImage: createdProfile.headerImage, // use headerImage from createdProfile
      about: createdProfile.summary || '',
      experience: createdProfile.workExperience || [],
      education: createdProfile.education || [],
      skills: createdProfile.skills || [],
      mutualConnections: 0,
      isConnected: false,
      profileViews: createdProfile.profileViews || 0,
      followers: createdProfile.followers || 0,
    };
    
    console.log('Router - Mapped profile object:', profile);
    console.log('Router - Profile headerImage:', profile.headerImage);
    
    return (
      <MyProfileScreen
        profile={profile}
        avatarImage={createdProfile.profilePictureUrl || null}
        bannerImage={createdProfile.headerImage || null}
        onBack={() => {
          setShowJustCreatedProfile(false);
          setCurrentScreen('main');
        }}
        onProfileChange={updated => {
          console.log('Router - onProfileChange called with:', updated);
          console.log('Router - Updated headerImage:', updated.headerImage);
          console.log('Router - Previous createdProfile:', createdProfile);
          const newCreatedProfile = { ...createdProfile, ...updated, headerImage: updated.headerImage };
          console.log('Router - New createdProfile:', newCreatedProfile);
          setCreatedProfile(newCreatedProfile);
          console.log('Router - setCreatedProfile called with new profile');
        }}
      />
    );
  }

  console.log('Current screen:', currentScreen);

  switch (currentScreen) {
    case 'onboarding':
      return (
        <OnboardingScreen
          onComplete={() => {
            console.log('Onboarding completed');
            setHasSeenOnboarding(true);
            navigateWithDelay('welcome');
          }}
          onSkip={() => {
            console.log('Onboarding skipped');
            setHasSeenOnboarding(true);
            navigateWithDelay('welcome');
          }}
        />
      );
    case 'welcome':
      return (
        <WelcomeScreen 
          onSignUp={goToSignUp} 
          onSignIn={goToSignIn} 
        />
      );
    case 'signup':
      return (
        <SignUpScreen 
          onContinue={handleSignUpWrapper} 
          onBack={goToWelcome} 
          onSignIn={goToSignIn} 
        />
      );
    case 'signin':
      return (
        <SignInScreen 
          onSignIn={handleSignInWrapper} 
          onJoin={goToSignUp} 
          onForgotPassword={goToForgotPassword} 
          onBack={goToWelcome} 
        />
      );
    case 'profilesetup':
      return (
        <ProfileSetupScreen 
          onContinue={handleProfileComplete} 
        />
      );
    case 'forgotpassword':
      return (
        <ForgotPasswordScreen 
          onResetPassword={handleResetPassword} 
          onBack={goToSignIn} 
        />
      );
    case 'main':
      console.log('Router - Rendering main screen with userAvatar:', userAvatar);
      console.log('Router - Rendering main screen with createdProfile:', createdProfile);
      return (
        <AppNavigator 
          userAvatar={userAvatar}
          createdProfile={createdProfile}
          setCurrentScreen={setCurrentScreen}
          setCreatedProfile={setCreatedProfile}
          setIsAuthenticated={setIsAuthenticated}
          setIsProfileComplete={setIsProfileComplete}
        />
      );
    default:
      return <SplashScreen />;
  }
}

// Export navigation functions for use in components
export const useAppNavigation = () => {
  return {
    navigateToSignUp: () => {},
    navigateToMainApp: () => {},
    navigateToWelcome: () => {},
  };
}; 