import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrentTheme } from '../contexts/ThemeContext';

interface UserProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: {
    name: string;
    avatar: any;
    title?: string;
    company?: string;
    location?: string;
    bio?: string;
    connections?: number;
    experience?: Array<{
      title: string;
      company: string;
      duration: string;
    }>;
    education?: Array<{
      degree: string;
      school: string;
      year: string;
    }>;
    skills?: string[];
  };
}

export default function UserProfileModal({
  visible,
  onClose,
  user,
}: UserProfileModalProps) {
  const theme = useCurrentTheme();

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
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <Image source={user.avatar} style={styles.profileAvatar} />
            <Text style={[styles.profileName, { color: theme.textColor }]}>
              {user.name}
            </Text>
            {user.title && (
              <Text style={[styles.profileTitle, { color: theme.textSecondaryColor }]}>
                {user.title}
              </Text>
            )}
            {user.company && (
              <Text style={[styles.profileCompany, { color: theme.textSecondaryColor }]}>
                {user.company}
              </Text>
            )}
            {user.location && (
              <View style={styles.locationContainer}>
                <MaterialCommunityIcons name="map-marker" size={16} color={theme.textTertiaryColor} />
                <Text style={[styles.locationText, { color: theme.textTertiaryColor }]}>
                  {user.location}
                </Text>
              </View>
            )}
            {user.connections && (
              <Text style={[styles.connectionsText, { color: theme.textSecondaryColor }]}>
                {user.connections} connections
              </Text>
            )}
          </View>

          {/* Bio Section */}
          {user.bio && (
            <View style={[styles.section, { borderBottomColor: theme.borderColor }]}>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                About
              </Text>
              <Text style={[styles.bioText, { color: theme.textColor }]}>
                {user.bio}
              </Text>
            </View>
          )}

          {/* Experience Section */}
          {user.experience && user.experience.length > 0 && (
            <View style={[styles.section, { borderBottomColor: theme.borderColor }]}>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                Experience
              </Text>
              {user.experience.map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <Text style={[styles.experienceTitle, { color: theme.textColor }]}>
                    {exp.title}
                  </Text>
                  <Text style={[styles.experienceCompany, { color: theme.textSecondaryColor }]}>
                    {exp.company}
                  </Text>
                  <Text style={[styles.experienceDuration, { color: theme.textTertiaryColor }]}>
                    {exp.duration}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Education Section */}
          {user.education && user.education.length > 0 && (
            <View style={[styles.section, { borderBottomColor: theme.borderColor }]}>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                Education
              </Text>
              {user.education.map((edu, index) => (
                <View key={index} style={styles.educationItem}>
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
              ))}
            </View>
          )}

          {/* Skills Section */}
          {user.skills && user.skills.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
                Skills
              </Text>
              <View style={styles.skillsContainer}>
                {user.skills.map((skill, index) => (
                  <View
                    key={index}
                    style={[styles.skillTag, { backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }]}
                  >
                    <Text style={[styles.skillText, { color: theme.textColor }]}>
                      {skill}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={[styles.actions, { borderTopColor: theme.borderColor }]}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.primaryColor }]}
            onPress={() => {
              console.log('Connect with', user.name);
              onClose();
            }}
          >
            <Text style={[styles.actionButtonText, { color: '#fff' }]}>
              Connect
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.surfaceColor, borderColor: theme.borderColor }]}
            onPress={() => {
              console.log('Message', user.name);
              onClose();
            }}
          >
            <Text style={[styles.actionButtonText, { color: theme.textColor }]}>
              Message
            </Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  profileTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  profileCompany: {
    fontSize: 14,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    marginLeft: 4,
  },
  connectionsText: {
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
  },
  experienceItem: {
    marginBottom: 16,
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  experienceCompany: {
    fontSize: 14,
    marginBottom: 2,
  },
  experienceDuration: {
    fontSize: 12,
  },
  educationItem: {
    marginBottom: 16,
  },
  educationDegree: {
    fontSize: 16,
    fontWeight: '500',
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
    borderWidth: 1,
  },
  skillText: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 