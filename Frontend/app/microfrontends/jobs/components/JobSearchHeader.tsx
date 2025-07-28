import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import {
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useCurrentTheme } from '../../../../contexts/ThemeContext';

interface JobSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterToggle: () => void;
  onProfilePress: () => void;
  userAvatar?: string | null;
  showFilters: boolean;
  onNotificationPress: () => void;
}

export default function JobSearchHeader({
  searchQuery,
  onSearchChange,
  onFilterToggle,
  onProfilePress,
  userAvatar,
  showFilters,
  onNotificationPress,
}: JobSearchHeaderProps) {
  const theme = useCurrentTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.surfaceColor }]}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={onProfilePress}>
          <Image 
            source={userAvatar ? { uri: userAvatar } : require('@/assets/images/default-avator.jpg')} 
            style={[styles.profilePicture, { borderColor: theme.primaryColor }]} 
          />
        </TouchableOpacity>
        
        <View style={[styles.searchContainer, { backgroundColor: theme.inputBackgroundColor, width: 200 }]}>
          <MaterialCommunityIcons name="briefcase" size={20} color={theme.textSecondaryColor} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.textColor }]}
            placeholder="Search jobs"
            placeholderTextColor={theme.placeholderColor}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
        </View>
        
        <TouchableOpacity style={{ marginRight: 8 }} onPress={onNotificationPress}>
          <MaterialCommunityIcons name="bell-outline" size={24} color={theme.textColor} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: showFilters ? theme.primaryColor + '20' : 'transparent' }]}
          onPress={onFilterToggle}
        >
          <MaterialCommunityIcons 
            name="tune" 
            size={24} 
            color={showFilters ? theme.primaryColor : theme.textColor} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 25,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  profilePicture: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    width: 220,
    height: 40,
    marginHorizontal: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 4,
    fontSize: 14,
  },

}); 