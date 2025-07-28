import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themes, defaultTheme, Theme, ThemeContextType } from '../constants/Theme';

// Create the theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme storage key
const THEME_STORAGE_KEY = '@NetworkPro:theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<string>(defaultTheme);

  // Load saved theme from storage on app start
  useEffect(() => {
    loadSavedTheme();
  }, []);

  const loadSavedTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(savedTheme);
      }
    } catch (error) {
      console.error('Error loading saved theme:', error);
    }
  };

  const saveTheme = async (themeName: string) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeName);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const setTheme = (themeName: string) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
      saveTheme(themeName);
    }
  };

  const toggleTheme = () => {
    const themeKeys = Object.keys(themes);
    const currentIndex = themeKeys.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    setTheme(themeKeys[nextIndex]);
  };

  const theme: Theme = themes[currentTheme];

  const value: ThemeContextType = {
    currentTheme,
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook to get current theme object
export const useCurrentTheme = (): Theme => {
  const { theme } = useTheme();
  return theme;
};

// Hook to get theme switching functions
export const useThemeActions = () => {
  const { setTheme, toggleTheme } = useTheme();
  return { setTheme, toggleTheme };
};

// Helper function to get appropriate logo based on theme
export const getLogoAsset = (themeName: string) => {
  switch (themeName) {
    case 'light':
      // For light theme, use a dark logo (you'll need to create this)
      // return require('../assets/images/networkpro-logo-dark.png');
      return require('../assets/images/networkpro-logo.png');
    case 'dark':
    case 'blue':
    default:
      // For dark themes, use the original logo
      return require('../assets/images/networkpro-logo.png');
  }
}; 