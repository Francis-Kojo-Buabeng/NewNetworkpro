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

interface HomeSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onProfilePress: () => void;
  onNotificationPress: () => void;
  userAvatar?: string | null;
}

export default function HomeSearchHeader({
  searchQuery,
  onSearchChange,
  onProfilePress,
  onNotificationPress,
  userAvatar,
}: HomeSearchHeaderProps) {
  const theme = useCurrentTheme();

  // Add debugging for userAvatar
  console.log('HomeSearchHeader - userAvatar received:', userAvatar);

  return (
    <View style={[styles.header, { backgroundColor: theme.surfaceColor }]}>
      <View style={styles.headerTop}>
        <TouchableOpacity style={styles.profileButton} onPress={onProfilePress}>
          <Image 
            source={userAvatar ? { uri: userAvatar } : require('@/assets/images/default-avator.jpg')} 
            style={[styles.profilePicture, { borderColor: theme.primaryColor }]} 
          />
        </TouchableOpacity>
        
        <View style={[styles.searchContainer, { backgroundColor: theme.inputBackgroundColor, borderColor: theme.borderColor }]}>
          <MaterialCommunityIcons name="magnify" size={20} color={theme.textSecondaryColor} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.textColor }]}
            placeholder="Search"
            placeholderTextColor={theme.placeholderColor}
            value={searchQuery}
            onChangeText={onSearchChange}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={onNotificationPress}
        >
          <MaterialCommunityIcons name="bell-outline" size={24} color={theme.textColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 25,
    paddingHorizontal: 20,
    paddingBottom: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  profileButton: {
    padding: 4,
  },
  profilePicture: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
  },
  headerButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 16,
    borderWidth: 1,
    flex: 1,
    height: 44,
    marginHorizontal: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
}); 