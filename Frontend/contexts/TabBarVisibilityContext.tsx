import React, { createContext, useContext, useMemo } from 'react';
import { useSharedValue } from 'react-native-reanimated';

interface TabBarVisibilityContextValue {
  tabBarTranslateY: { value: number };
}

const TabBarVisibilityContext = createContext<TabBarVisibilityContextValue | undefined>(undefined);

export const TabBarVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 0 = visible, 100 = hidden (move down by tab bar height)
  const tabBarTranslateY = useSharedValue(0);

  const contextValue = useMemo(() => ({
    tabBarTranslateY,
  }), [tabBarTranslateY]);

  return (
    <TabBarVisibilityContext.Provider value={contextValue}>
      {children}
    </TabBarVisibilityContext.Provider>
  );
};

export function useTabBarVisibility() {
  const ctx = useContext(TabBarVisibilityContext);
  if (!ctx) throw new Error('useTabBarVisibility must be used within TabBarVisibilityProvider');
  return ctx;
} 