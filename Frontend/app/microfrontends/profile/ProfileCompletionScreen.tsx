import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ProgressBarAndroid,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import { getProfileCompletion, ProfileCompletionData } from '../../../services/userAPI';
import Snackbar from '../../../components/Snackbar';

interface ProfileCompletionScreenProps {
  userId: string;
  onClose: () => void;
  onComplete?: () => void;
}

export default function ProfileCompletionScreen({ userId, onClose, onComplete }: ProfileCompletionScreenProps) {
  const theme = useCurrentTheme();
  const [completionData, setCompletionData] = useState<ProfileCompletionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });

  useEffect(() => {
    loadProfileCompletion();
  }, []);

  const loadProfileCompletion = async () => {
    try {
      setLoading(true);
      const data = await getProfileCompletion(userId);
      setCompletionData(data);
    } catch (error: any) {
      setSnackbar({ visible: true, message: error.message || 'Failed to load profile completion data', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getFieldIcon = (field: string) => {
    switch (field) {
      case 'fullName':
        return 'account';
      case 'bio':
        return 'text';
      case 'location':
        return 'map-marker';
      case 'profilePicture':
        return 'camera';
      case 'currentPosition':
        return 'briefcase';
      case 'currentCompany':
        return 'office-building';
      case 'skills':
        return 'lightning-bolt';
      case 'workExperience':
        return 'briefcase-outline';
      case 'education':
        return 'school';
      default:
        return 'help-circle';
    }
  };

  const getFieldTitle = (field: string) => {
    switch (field) {
      case 'fullName':
        return 'Full Name';
      case 'bio':
        return 'Bio/Summary';
      case 'location':
        return 'Location';
      case 'profilePicture':
        return 'Profile Picture';
      case 'currentPosition':
        return 'Current Position';
      case 'currentCompany':
        return 'Current Company';
      case 'skills':
        return 'Skills';
      case 'workExperience':
        return 'Work Experience';
      case 'education':
        return 'Education';
      default:
        return field;
    }
  };

  const getFieldDescription = (field: string) => {
    switch (field) {
      case 'fullName':
        return 'Add your full name to your profile';
      case 'bio':
        return 'Write a brief summary about yourself';
      case 'location':
        return 'Add your current location';
      case 'profilePicture':
        return 'Upload a professional profile picture';
      case 'currentPosition':
        return 'Add your current job title';
      case 'currentCompany':
        return 'Add your current company';
      case 'skills':
        return 'Add your professional skills';
      case 'workExperience':
        return 'Add your work experience';
      case 'education':
        return 'Add your education history';
      default:
        return 'Complete this field to improve your profile';
    }
  };

  const renderProgressBar = () => {
    if (!completionData) return null;

    const percentage = completionData.completionPercentage;
    const progress = percentage / 100;

    return (
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={[styles.progressTitle, { color: theme.textColor }]}>Profile Completion</Text>
          <Text style={[styles.progressPercentage, { color: theme.primaryColor }]}>{percentage}%</Text>
        </View>
        
        {Platform.OS === 'android' ? (
          <ProgressBarAndroid
            styleAttr="Horizontal"
            indeterminate={false}
            progress={progress}
            color={theme.primaryColor}
            style={styles.progressBar}
          />
        ) : (
          <View style={[styles.progressBar, { backgroundColor: theme.borderColor }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${percentage}%`, 
                  backgroundColor: theme.primaryColor 
                }
              ]} 
            />
          </View>
        )}
        
        <Text style={[styles.progressDescription, { color: theme.textSecondaryColor }]}>
          {completionData.isComplete 
            ? 'Great! Your profile is complete and professional.'
            : 'Complete the missing fields to make your profile more professional.'
          }
        </Text>
        </View>
    );
  };

  const renderMissingField = (field: string) => (
    <TouchableOpacity 
      key={field}
      style={[styles.fieldItem, { backgroundColor: theme.cardColor }]}
      onPress={() => {
        // Navigate to edit profile or specific field
        setSnackbar({ visible: true, message: `Navigate to edit ${getFieldTitle(field)}`, type: 'info' });
      }}
    >
      <View style={styles.fieldInfo}>
        <MaterialCommunityIcons 
          name={getFieldIcon(field) as any} 
          size={24} 
          color={theme.primaryColor} 
        />
        <View style={styles.fieldText}>
          <Text style={[styles.fieldTitle, { color: theme.textColor }]}>
            {getFieldTitle(field)}
          </Text>
          <Text style={[styles.fieldDescription, { color: theme.textSecondaryColor }]}>
            {getFieldDescription(field)}
          </Text>
        </View>
      </View>
            <MaterialCommunityIcons 
        name="chevron-right" 
              size={24} 
              color={theme.textSecondaryColor} 
            />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <Text style={[styles.loadingText, { color: theme.textColor }]}>Loading profile completion...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.textColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.textColor }]}>Profile Completion</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderProgressBar()}

        {completionData && completionData.missingFields.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>
              Missing Fields ({completionData.missingFields.length})
            </Text>
            <Text style={[styles.sectionDescription, { color: theme.textSecondaryColor }]}>
              Complete these fields to improve your profile completion
            </Text>
            
            <View style={styles.fieldsContainer}>
              {completionData.missingFields.map(renderMissingField)}
          </View>
          </View>
        )}

        {completionData && completionData.isComplete && (
          <View style={styles.completionSection}>
            <MaterialCommunityIcons 
              name="check-circle" 
              size={48} 
              color={theme.primaryColor} 
            />
            <Text style={[styles.completionTitle, { color: theme.textColor }]}>
              Profile Complete!
            </Text>
            <Text style={[styles.completionDescription, { color: theme.textSecondaryColor }]}>
              Your profile is now complete and professional. You're ready to network!
            </Text>
          </View>
        )}
      </ScrollView>

      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onHide={() => setSnackbar({ visible: false, message: '', type: 'info' })}
      />
    </View>
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
  backButton: {
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
    padding: 16,
  },
  progressSection: {
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  fieldsContainer: {
    gap: 8,
  },
  fieldItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  fieldInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fieldText: {
    marginLeft: 12,
    flex: 1,
  },
  fieldTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  fieldDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  completionSection: {
    alignItems: 'center',
    padding: 24,
    marginTop: 24,
  },
  completionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  completionDescription: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
}); 