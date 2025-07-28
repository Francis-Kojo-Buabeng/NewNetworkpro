import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useCurrentTheme } from '../contexts/ThemeContext';
import Snackbar from './Snackbar';

const { width, height } = Dimensions.get('window');

interface Profile {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: any;
  mutualConnections: number;
  isOnline: boolean;
  isConnected: boolean;
  isPending: boolean;
  location: string;
  about: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
}

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  profile: Profile;
}

export default function ProfileModal({
  visible,
  onClose,
  profile,
}: ProfileModalProps) {
  const theme = useCurrentTheme();
  const [isConnecting, setIsConnecting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });

  const handleConnect = () => {
    setIsConnecting(true);
    // Simulate API call
    setTimeout(() => {
      setIsConnecting(false);
      setSnackbar({ visible: true, message: `Connection request sent to ${profile.name}`, type: 'success' });
      onClose();
    }, 1000);
  };

  const handleMessage = () => {
    setSnackbar({ visible: true, message: `Opening conversation with ${profile.name}`, type: 'info' });
    onClose();
  };

  const renderExperience = (exp: Experience) => (
    <View key={exp.id} style={[styles.experienceItem, { borderBottomColor: theme.borderColor }]}>
      <Text style={[styles.experienceTitle, { color: theme.textColor }]}>
        {exp.title}
      </Text>
      <Text style={[styles.experienceCompany, { color: theme.textSecondaryColor }]}>
        {exp.company}
      </Text>
      <Text style={[styles.experienceDuration, { color: theme.textTertiaryColor }]}>
        {exp.duration}
      </Text>
      <Text style={[styles.experienceDescription, { color: theme.textColor }]}>
        {exp.description}
      </Text>
    </View>
  );

  const renderEducation = (edu: Education) => (
    <View key={edu.id} style={[styles.educationItem, { borderBottomColor: theme.borderColor }]}>
      <Text style={[styles.educationDegree, { color: theme.textColor }]}>
        {edu.degree}
      </Text>
      <Text style={[styles.educationSchool, { color: theme.textSecondaryColor }]}>
        {edu.school}
      </Text>
      <Text style={[styles.educationYear, { color: theme.textTertiaryColor }]}>
        {edu.year}
      </Text>
    </View>
  );

  const renderSkill = (skill: string) => (
    <View key={skill} style={[styles.skillTag, { backgroundColor: theme.primaryColor + '20' }]}>
      <Text style={[styles.skillText, { color: theme.primaryColor }]}>
        {skill}
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <MaterialCommunityIcons name="close" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>
            Profile
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={[styles.profileHeader, { backgroundColor: theme.cardColor }]}>
            <View style={styles.profileInfo}>
              <View style={styles.avatarContainer}>
                <Image source={profile.avatar} style={styles.avatar} />
                {profile.isOnline && <View style={styles.onlineIndicator} />}
              </View>
              
              <View style={styles.profileDetails}>
                <Text style={[styles.profileName, { color: theme.textColor }]}>
                  {profile.name}
                </Text>
                <Text style={[styles.profileTitle, { color: theme.textSecondaryColor }]}>
                  {profile.title} at {profile.company}
                </Text>
                <Text style={[styles.profileLocation, { color: theme.textTertiaryColor }]}>
                  {profile.location}
                </Text>
                <Text style={[styles.mutualConnections, { color: theme.textTertiaryColor }]}>
                  {profile.mutualConnections} mutual connections
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {profile.isConnected ? (
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: theme.primaryColor }]}
                  onPress={handleMessage}
                >
                  <MaterialCommunityIcons name="message-text" size={16} color="#fff" />
                  <Text style={[styles.actionButtonText, { color: '#fff' }]}>Message</Text>
                </TouchableOpacity>
              ) : profile.isPending ? (
                <View style={styles.pendingActions}>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.primaryColor }]}>
                    <Text style={[styles.actionButtonText, { color: '#fff' }]}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }]}>
                    <Text style={[styles.actionButtonText, { color: theme.textColor }]}>Ignore</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: theme.primaryColor }]}
                  onPress={handleConnect}
                  disabled={isConnecting}
                >
                  <MaterialCommunityIcons name="account-plus" size={16} color="#fff" />
                  <Text style={[styles.actionButtonText, { color: '#fff' }]}>
                    {isConnecting ? 'Sending...' : 'Connect'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* About Section */}
          <View style={[styles.section, { backgroundColor: theme.cardColor }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>About</Text>
            <Text style={[styles.aboutText, { color: theme.textColor }]}>
              {profile.about}
            </Text>
          </View>

          {/* Experience Section */}
          <View style={[styles.section, { backgroundColor: theme.cardColor }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Experience</Text>
            {(profile.experience || []).map(renderExperience)}
          </View>

          {/* Education Section */}
          <View style={[styles.section, { backgroundColor: theme.cardColor }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Education</Text>
            {(profile.education || []).map(renderEducation)}
          </View>

          {/* Skills Section */}
          <View style={[styles.section, { backgroundColor: theme.cardColor }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Skills</Text>
            <View style={styles.skillsContainer}>
              {(profile.skills || []).map(renderSkill)}
            </View>
          </View>
        </ScrollView>
        <Snackbar
          visible={snackbar.visible}
          message={snackbar.message}
          type={snackbar.type}
          onHide={() => setSnackbar({ ...snackbar, visible: false })}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  profileInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  mutualConnections: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  actionButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
  },
  experienceItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  experienceCompany: {
    fontSize: 14,
    marginBottom: 2,
  },
  experienceDuration: {
    fontSize: 12,
    marginBottom: 8,
  },
  experienceDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  educationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  educationDegree: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  educationSchool: {
    fontSize: 14,
    marginBottom: 2,
  },
  educationYear: {
    fontSize: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 