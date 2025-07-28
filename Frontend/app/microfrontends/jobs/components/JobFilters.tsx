import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { useCurrentTheme } from '../../../../contexts/ThemeContext';
import FilterChip from './FilterChip';

interface JobFiltersProps {
  jobTypes: string[];
  locations: string[];
  selectedJobType: string;
  selectedLocation: string;
  onJobTypeChange: (jobType: string) => void;
  onLocationChange: (location: string) => void;
}

export default function JobFilters({
  jobTypes,
  locations,
  selectedJobType,
  selectedLocation,
  onJobTypeChange,
  onLocationChange,
}: JobFiltersProps) {
  const theme = useCurrentTheme();

  return (
    <View style={[styles.filtersContainer, { backgroundColor: theme.surfaceColor }]}>
      <Text style={[styles.filterSectionTitle, { color: theme.textColor }]}>Job Type</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {jobTypes.map((type, index) => (
          <View key={index} style={styles.filterChipContainer}>
            <FilterChip
              label={type}
              isSelected={selectedJobType === type}
              onPress={() => onJobTypeChange(type)}
            />
          </View>
        ))}
      </ScrollView>
      
      <Text style={[styles.filterSectionTitle, { color: theme.textColor }]}>Location</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {locations.map((location, index) => (
          <View key={index} style={styles.filterChipContainer}>
            <FilterChip
              label={location}
              isSelected={selectedLocation === location}
              onPress={() => onLocationChange(location)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    marginTop: 16,
  },
  filterScroll: {
    marginBottom: 8,
  },
  filterChipContainer: {
    marginRight: 8,
  },
}); 