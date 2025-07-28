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

interface MessageSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onFilterToggle: () => void;
  onProfilePress: () => void;
  onNotificationPress: () => void;
  userAvatar?: string | null;
  showFilters: boolean;
}

export default function MessageSearchHeader({
  searchQuery,
  onSearchChange,
  onFilterToggle,
  onProfilePress,
  onNotificationPress,
  userAvatar,
  showFilters,
}: MessageSearchHeaderProps) {
  const theme = useCurrentTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.surfaceColor }]}>
      <View style={styles.headerTopRow}>
        <Image 
          source={userAvatar ? { uri: userAvatar } : require('@/assets/images/Avator-Image.jpg')} 
          style={[styles.profilePicture, { borderColor: theme.primaryColor }]} 
        />
        <View style={styles.headerSearchWrapper}>
          <View style={[styles.headerSearchContainer, { backgroundColor: theme.inputBackgroundColor, width: 210 }]}> 
            <MaterialCommunityIcons name="magnify" size={18} color={theme.textSecondaryColor} />
            <TextInput
              style={[styles.headerSearchInput, { color: theme.textColor, fontSize: 15 }]}
              placeholder="Search..."
              placeholderTextColor={theme.placeholderColor}
              value={searchQuery}
              onChangeText={onSearchChange}
              returnKeyType="search"
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 12,
  },
  headerSearchWrapper: {
    flex: 1,
  },
  headerSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  headerSearchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
  },
}); 