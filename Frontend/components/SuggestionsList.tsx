import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useCurrentTheme } from '../contexts/ThemeContext';
import SuggestionCard from './SuggestionCard';

interface Suggestion {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: any;
  mutualConnections: number;
}

interface SuggestionsListProps {
  suggestions: Suggestion[];
  onConnect: (id: string) => void;
  onProfilePress: (id: string) => void;
}

export default function SuggestionsList({ suggestions, onConnect, onProfilePress }: SuggestionsListProps) {
  const theme = useCurrentTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.textColor }]}>People You May Know</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondaryColor }]}>
          {suggestions.length} suggestions
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {suggestions.map((suggestion) => (
          <SuggestionCard
            key={suggestion.id}
            id={suggestion.id}
            name={suggestion.name}
            title={suggestion.title}
            company={suggestion.company}
            avatar={suggestion.avatar}
            mutualConnections={suggestion.mutualConnections}
            onConnect={onConnect}
            onProfilePress={onProfilePress}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
}); 