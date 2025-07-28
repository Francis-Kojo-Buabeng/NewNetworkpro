import React, { useState } from 'react';
import WelcomeScreen from './app/shell/WelcomeScreen';
import SignUpScreen from './app/shell/SignUpScreen';
import AppNavigator from './app/shell/AppNavigator';

export default function Router() {
  const [screen, setScreen] = useState<'welcome' | 'signup' | 'main'>('welcome');

  // Navigation handlers
  const goToSignUp = () => setScreen('signup');
  const goToMain = () => setScreen('main');
  const goToWelcome = () => setScreen('welcome');

  if (screen === 'welcome') {
    return <WelcomeScreen onSignUp={goToSignUp} onSignIn={goToSignUp} />;
  }
  if (screen === 'signup') {
    return <SignUpScreen onContinue={goToMain} onBack={goToWelcome} onSignIn={goToWelcome} />;
  }
  return <AppNavigator />;
} 