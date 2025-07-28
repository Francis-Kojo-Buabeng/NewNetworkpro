import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Theme interface for type safety
export interface Theme {
  name: string;
  backgroundColor: string;
  surfaceColor: string;
  cardColor: string;
  textColor: string;
  textSecondaryColor: string;
  textTertiaryColor: string;
  primaryColor: string;
  primaryLightColor: string;
  dangerColor: string;
  warningColor: string;
  successColor: string;
  borderColor: string;
  shadowColor: string;
  overlayColor: string;
  inputBackgroundColor: string;
  placeholderColor: string;
  switchTrackColor: {
    false: string;
    true: string;
  };
  switchThumbColor: {
    false: string;
    true: string;
  };
}

// Theme definitions
export const themes: Record<string, Theme> = {
  dark: {
    name: 'Dark',
    backgroundColor: '#070e1c',
    surfaceColor: '#1a1a1a',
    cardColor: '#181e2a',
    textColor: '#ffffff',
    textSecondaryColor: '#b0b0b0',
    textTertiaryColor: '#666666',
    primaryColor: '#1877F2',
    primaryLightColor: '#4a90e2',
    dangerColor: '#ff4d4f',
    warningColor: '#ffb300',
    successColor: '#52c41a',
    borderColor: '#1a1a1a',
    shadowColor: '#000000',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    inputBackgroundColor: '#2a2a2a',
    placeholderColor: '#666666',
    switchTrackColor: {
      false: '#333333',
      true: '#1877F2',
    },
    switchThumbColor: {
      false: '#f4f3f4',
      true: '#ffffff',
    },
  },
  light: {
    name: 'Light',
    backgroundColor: '#ffffff',
    surfaceColor: '#f5f5f5',
    cardColor: '#ffffff',
    textColor: '#000000',
    textSecondaryColor: '#666666',
    textTertiaryColor: '#999999',
    primaryColor: '#1877F2',
    primaryLightColor: '#4a90e2',
    dangerColor: '#ff4d4f',
    warningColor: '#ffb300',
    successColor: '#52c41a',
    borderColor: '#e0e0e0',
    shadowColor: '#000000',
    overlayColor: 'rgba(0, 0, 0, 0.3)',
    inputBackgroundColor: '#f8f9fa',
    placeholderColor: '#999999',
    switchTrackColor: {
      false: '#cccccc',
      true: '#1877F2',
    },
    switchThumbColor: {
      false: '#ffffff',
      true: '#ffffff',
    },
  },
  blue: {
    name: 'Blue',
    backgroundColor: '#0f1419',
    surfaceColor: '#1a2332',
    cardColor: '#1e2a3a',
    textColor: '#ffffff',
    textSecondaryColor: '#8ba3b3',
    textTertiaryColor: '#5a6b7a',
    primaryColor: '#4a90e2',
    primaryLightColor: '#6ba3e8',
    dangerColor: '#ff6b6b',
    warningColor: '#ffd93d',
    successColor: '#6bcf7f',
    borderColor: '#1a2332',
    shadowColor: '#000000',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    inputBackgroundColor: '#2a3a4a',
    placeholderColor: '#5a6b7a',
    switchTrackColor: {
      false: '#2a3a4a',
      true: '#4a90e2',
    },
    switchThumbColor: {
      false: '#8ba3b3',
      true: '#ffffff',
    },
  },
};

// Default theme
export const defaultTheme = 'dark';

// Theme context type
export interface ThemeContextType {
  currentTheme: string;
  theme: Theme;
  setTheme: (themeName: string) => void;
  toggleTheme: () => void;
}

// Common styles that can be used across components
export const commonStyles = {
  container: {
    flex: 1,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
  },
};

// Screen dimensions
export const screenDimensions = {
  width,
  height,
};

// Spacing constants
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius constants
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
};

// Font sizes
export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Shadow styles
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
}; 