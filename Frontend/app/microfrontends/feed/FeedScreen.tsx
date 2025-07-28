import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useCurrentTheme } from '../../../contexts/ThemeContext';

export default function FeedScreen() {
  const theme = useCurrentTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <Text style={[styles.text, { color: theme.textColor }]}>Feed Micro-Frontend</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 