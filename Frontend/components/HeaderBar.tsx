import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCurrentTheme } from '../contexts/ThemeContext';

interface HeaderBarProps {
  onSearch: (query: string) => void;
  onProfilePress: () => void;
  onNotificationPress: () => void;
  userAvatar?: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function HeaderBar({ 
  onSearch, 
  onProfilePress, 
  onNotificationPress, 
  userAvatar, 
  searchQuery, 
  onSearchChange 
}: HeaderBarProps) {
  const theme = useCurrentTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Title and Icons */}
      <View style={styles.topRow}>
        <Text style={[styles.title, { color: theme.textColor }]}>My Network</Text>
        <View style={styles.iconRow}>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: theme.cardColor }]} 
            onPress={onNotificationPress}
          >
            <MaterialCommunityIcons name="bell-outline" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.avatarButton, { backgroundColor: theme.cardColor }]} 
            onPress={onProfilePress}
          >
            <Image 
              source={userAvatar ? { uri: userAvatar } : require('../assets/images/default-avator.jpg')} 
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: theme.cardColor }]}>
        <MaterialCommunityIcons name="magnify" size={20} color={theme.textSecondaryColor} />
        <TextInput
          style={[styles.searchInput, { color: theme.textColor }]}
          placeholder="Search connections..."
          placeholderTextColor={theme.textSecondaryColor}
          value={searchQuery}
          onChangeText={onSearchChange}
          onSubmitEditing={() => onSearch(searchQuery)}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <MaterialCommunityIcons name="close" size={20} color={theme.textSecondaryColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
}); 