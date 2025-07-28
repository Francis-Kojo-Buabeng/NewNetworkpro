import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MeScreenProps {
  userAvatar?: string | null;
  userName?: string;
  userTitle?: string;
  userLocation?: string;
  userBio?: string;
}

export default function MeScreen({ userAvatar, userName, userTitle, userLocation, userBio }: MeScreenProps) {
  return (
    <View style={styles.container}>
      {/* Banner */}
      <View style={styles.bannerWrap}>
        <Image source={require('@/assets/images/profile-pictures/image-03.jpg')} style={styles.banner} />
        {/* Centered avatar overlays banner */}
        <View style={styles.avatarWrap}>
          <Image
            source={userAvatar ? { uri: userAvatar } : require('@/assets/images/Avator-Image.jpg')}
            style={styles.avatar}
          />
        </View>
      </View>
      {/* Main Card */}
      <View style={styles.card}>
        <Text style={styles.name}>{userName || 'Your Name'}</Text>
        <Text style={styles.title}>{userTitle || 'Your Headline/Title'}</Text>
        <Text style={styles.location}>{userLocation || 'Your Location'}</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>
      {/* About Section Card */}
      <View style={styles.aboutCard}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.bio}>{userBio || 'Add a short bio about yourself, your experience, or your goals.'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f8',
  },
  bannerWrap: {
    width: '100%',
    height: 120,
    backgroundColor: '#dbeafe',
    position: 'relative',
    marginBottom: 0,
  },
  banner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  avatarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -40,
    alignItems: 'center',
    zIndex: 10,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    marginTop: 0,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    color: '#555',
    marginBottom: 2,
    textAlign: 'center',
  },
  location: {
    fontSize: 14,
    color: '#888',
    marginBottom: 12,
    textAlign: 'center',
  },
  editBtn: {
    alignSelf: 'center',
    backgroundColor: '#1877F2',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginBottom: 0,
    marginTop: 8,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  aboutCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginTop: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    color: '#222',
    textAlign: 'left',
  },
  bio: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    textAlign: 'left',
  },
}); 