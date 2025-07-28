import React from 'react';
import ProfileScreen, { ProfileLayout, ProfileScreenProps } from './ProfileScreen';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCurrentTheme } from '../../../contexts/ThemeContext';

const bannerImages = [
  require('@/assets/images/banner-images/banner-01.jpg'),
  require('@/assets/images/banner-images/banner-02.jpg'),
  require('@/assets/images/banner-images/banner-03.jpg'),
  require('@/assets/images/banner-images/banner-04.jpg'),
  require('@/assets/images/banner-images/banner-05.jpg'),
  require('@/assets/images/banner-images/banner-06.jpg'),
  require('@/assets/images/banner-images/banner-07.jpg'),
];

export default function UserProfileScreen({ profile, onBack, onConnect, onMessage }: ProfileScreenProps) {
  const theme = useCurrentTheme();
  // Pick a banner image based on user id or at random
  let bannerImage = bannerImages[0];
  if (profile && profile.id) {
    const idx = parseInt(profile.id, 10);
    if (!isNaN(idx)) {
      bannerImage = bannerImages[idx % bannerImages.length];
    } else {
      bannerImage = bannerImages[Math.floor(Math.random() * bannerImages.length)];
    }
  }
  return (
    <ProfileLayout profile={profile} onBack={onBack} theme={theme} bannerImage={Image.resolveAssetSource(bannerImage).uri}>
      {/* Action Buttons before tabs */}
      <View style={[{ flexDirection: 'row', justifyContent: 'center', marginVertical: 12 }]}> 
        <TouchableOpacity 
          style={{ borderColor: theme.primaryColor, backgroundColor: theme.cardColor, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 24, borderWidth: 1, flexDirection: 'row', alignItems: 'center', marginRight: 8 }}
          onPress={onConnect}
        >
          <MaterialCommunityIcons name="account-plus-outline" size={20} color={theme.primaryColor} />
          <Text style={{ color: theme.primaryColor, fontWeight: 'bold', marginLeft: 6 }}>Connect</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ borderColor: theme.primaryColor, backgroundColor: theme.cardColor, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 24, borderWidth: 1, flexDirection: 'row', alignItems: 'center' }}
          onPress={onMessage}
        >
          <MaterialCommunityIcons name="message-text-outline" size={20} color={theme.primaryColor} />
          <Text style={{ color: theme.primaryColor, fontWeight: 'bold', marginLeft: 6 }}>Message</Text>
        </TouchableOpacity>
      </View>
    </ProfileLayout>
  );
} 