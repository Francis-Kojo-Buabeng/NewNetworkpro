import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useCurrentTheme } from '../../../../contexts/ThemeContext';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  postedDate: string;
  logo: any;
  description: string;
  requirements: string[];
  isSaved: boolean;
}

interface JobCardProps {
  job: Job;
  onPress?: () => void;
  onCompanyPress?: (companyName: string) => void;
  onSaveToggle?: (jobId: string) => void;
  onApply?: (jobId: string) => void;
  onAvatarPress?: () => void;
}

export default function JobCard({ 
  job, 
  onPress, 
  onCompanyPress, 
  onSaveToggle, 
  onApply, 
  onAvatarPress 
}: JobCardProps) {
  const theme = useCurrentTheme();

  return (
    <TouchableOpacity 
      style={[styles.jobCard, { backgroundColor: theme.cardColor }]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.jobHeader}>
        <TouchableOpacity onPress={onAvatarPress || (() => onCompanyPress?.(job.company))}>
          <Image source={job.logo} style={styles.companyLogo} />
        </TouchableOpacity>
        <View style={styles.jobInfo}>
          <Text style={[styles.jobTitle, { color: theme.textColor }]}>{job.title}</Text>
          <Text style={[styles.companyName, { color: theme.textSecondaryColor }]}>{job.company}</Text>
          <View style={styles.jobMeta}>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="map-marker" size={14} color={theme.textTertiaryColor} />
              <Text style={[styles.metaText, { color: theme.textTertiaryColor }]}>{job.location}</Text>
            </View>
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="cash" size={14} color={theme.textTertiaryColor} />
              <Text style={[styles.metaText, { color: theme.textTertiaryColor }]}>{job.salary}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => onSaveToggle?.(job.id)}
          style={styles.saveButton}
        >
          <MaterialCommunityIcons 
            name={job.isSaved ? "bookmark" : "bookmark-outline"} 
            size={20} 
            color={job.isSaved ? theme.primaryColor : theme.textSecondaryColor} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.jobTypeContainer}>
        <View style={[styles.jobTypeBadge, { backgroundColor: theme.primaryColor + '20' }]}>
          <Text style={[styles.jobTypeText, { color: theme.primaryColor }]}>{job.type}</Text>
        </View>
        <Text style={[styles.postedDate, { color: theme.textTertiaryColor }]}>{job.postedDate}</Text>
      </View>
      
      <Text style={[styles.jobDescription, { color: theme.textSecondaryColor }]} numberOfLines={3}>
        {job.description}
      </Text>
      
      <View style={styles.requirementsContainer}>
        {job.requirements.slice(0, 4).map((req, index) => (
          <View key={index} style={[styles.requirementBadge, { backgroundColor: theme.surfaceColor }]}>
            <Text style={[styles.requirementText, { color: theme.textSecondaryColor }]}>{req}</Text>
          </View>
        ))}
        {job.requirements.length > 4 && (
          <Text style={[styles.moreRequirements, { color: theme.primaryColor }]}>
            +{job.requirements.length - 4} more
          </Text>
        )}
      </View>
      
      <View style={styles.applyContainer}>
        <TouchableOpacity 
          style={[styles.applyButton, { backgroundColor: theme.primaryColor }]}
          activeOpacity={0.8}
          onPress={() => onApply?.(job.id)}
        >
          <Text style={[styles.applyButtonText, { color: '#fff' }]}>Apply</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.saveJobButton, { borderColor: theme.primaryColor }]}
          activeOpacity={0.8}
          onPress={() => onSaveToggle?.(job.id)}
        >
          <Text style={[styles.saveJobText, { color: theme.primaryColor }]}>Save</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  jobCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  jobHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  jobInfo: {
    flex: 1,
    minWidth: 0,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
  },
  saveButton: {
    padding: 4,
  },
  jobTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  jobTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  jobTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  postedDate: {
    fontSize: 12,
  },
  jobDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  requirementsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  requirementBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  requirementText: {
    fontSize: 12,
  },
  moreRequirements: {
    fontSize: 12,
    fontWeight: '600',
  },
  applyContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveJobButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  saveJobText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 