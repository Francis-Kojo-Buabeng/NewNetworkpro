import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Router from './router';
import { TabBarVisibilityProvider } from '../contexts/TabBarVisibilityContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout(props) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={styles.container}>
      <StatusBar style="light" translucent />
      <TabBarVisibilityProvider>
        <Router />
      </TabBarVisibilityProvider>
    </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
