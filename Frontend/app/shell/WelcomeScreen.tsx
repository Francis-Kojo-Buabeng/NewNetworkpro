import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { useCurrentTheme, getLogoAsset, useTheme } from '../../contexts/ThemeContext';
import ThemedLogo from '../../components/ThemedLogo';

const { width } = Dimensions.get('window');

const BEAT_DURATION = 1000;
const BEAT_SCALE = 1.1;

function AnimatedLetter({ letter, delay, style }: { letter: string; delay: number; style?: any }) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const beat = () => {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: BEAT_SCALE,
          duration: BEAT_DURATION / 2,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: BEAT_DURATION / 2,
          useNativeDriver: true,
        }),
      ]).start(() => beat());
    };
    const timeout = setTimeout(beat, delay);
    return () => clearTimeout(timeout);
  }, [scale, delay]);

  return (
    <Animated.Text style={[styles.animatedLetter, style, { transform: [{ scale }] }]}>{letter}</Animated.Text>
  );
}

interface WelcomeScreenProps {
  onSignUp: () => void;
  onSignIn: () => void;
}

export default function WelcomeScreen({ onSignUp, onSignIn }: WelcomeScreenProps) {
  const theme = useCurrentTheme();
  const { currentTheme } = useTheme();
  const welcome = 'Welcome to';
  const networkpro = 'Networkpro';

  const handleGetStarted = () => {
    console.log('Get Started button pressed');
    onSignUp();
  };

  const handleSignIn = () => {
    console.log('Sign In button pressed');
    onSignIn();
  };

  return (
    <LinearGradient
      colors={[theme.backgroundColor, theme.surfaceColor]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <ThemedLogo style={styles.logo} resizeMode="contain" />
        <MaskedView
          style={styles.titleContainer}
          maskElement={
            <View>
              <View style={styles.rowCenter}>
                {welcome.split('').map((char, i) => (
                  <AnimatedLetter key={i} letter={char} delay={i * 80} style={styles.gradientLetter} />
                ))}
              </View>
              <View style={styles.rowCenter}>
                {networkpro.split('').map((char, i) => (
                  <AnimatedLetter key={i} letter={char} delay={welcome.length * 80 + i * 80} style={[styles.gradientLetter, styles.networkproLetter]} />
                ))}
              </View>
            </View>
          }
        >
          <LinearGradient
            colors={[theme.primaryColor, theme.primaryLightColor, theme.successColor, theme.warningColor, theme.dangerColor, theme.primaryColor]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientFill}
          />
        </MaskedView>
        <Text style={[styles.subtitle, { color: theme.textSecondaryColor }]}>Connect. Grow. Succeed.</Text>
        <Text style={[styles.tagline, { color: theme.textColor }]}>Your professional journey starts here.</Text>
        <TouchableOpacity style={[styles.getStartedButton, { backgroundColor: theme.primaryColor }]} onPress={handleGetStarted}>
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.signInButton, { borderColor: theme.primaryColor }]} onPress={handleSignIn}>
          <Text style={[styles.signInButtonText, { color: theme.primaryColor }]}>Sign In</Text>
        </TouchableOpacity>
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondaryColor }]}>© {new Date().getFullYear()} NetworkPro. All rights reserved.</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    position: 'relative',
  },
  logo: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: 36,
    left: 24,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  titleContainer: {
    marginTop: 10,
    marginBottom: 30,
  },
  rowCenter: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedLetter: {
    fontSize: 54,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(24, 119, 242, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
    fontFamily: 'sans-serif',
    lineHeight: 48,
    color: '#000', // MaskedView will use the alpha channel
  },
  gradientLetter: {
    color: '#000', // Ensures the mask uses the alpha channel
  },
  gradientFill: {
    width: width * 1.5,
    height: 120,
  },
  subtitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '500',
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    fontStyle: 'italic',
    opacity: 0.85,
  },
  getStartedButton: {
    width: width * 0.8,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  getStartedButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  signInButton: {
    width: width * 0.8,
    height: 52,
    backgroundColor: 'transparent',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 18,
  },
  signInButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    opacity: 0.7,
  },
  networkproLetter: {
    fontSize: 38,
    lineHeight: 38,
  },
}); 