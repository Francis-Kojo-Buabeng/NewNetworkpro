import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useCurrentTheme } from '../../../../contexts/ThemeContext';
import { Job } from './JobCard';

export interface CompanyProfile {
  id: string;
  name: string;
  logo: any;
  industry: string;
  size: string;
  location: string;
  founded: string;
  description: string;
  website: string;
  activeJobs: number;
  employeeCount: string;
  revenue: string;
  specialties: string[];
  benefits: string[];
  recentJobs: Job[];
}

interface CompanyModalProps {
  visible: boolean;
  onClose: () => void;
  company: CompanyProfile | null;
}

export default function CompanyModal({ visible, onClose, company }: CompanyModalProps) {
  const theme = useCurrentTheme();

  if (!company) return null;

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
            Company Profile
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Company Header */}
          <View style={[styles.companyHeader, { backgroundColor: theme.cardColor }]}>
            <View style={styles.companyInfo}>
              <Image source={company.logo} style={styles.companyLogoLarge} />
              
              <View style={styles.companyDetails}>
                <Text style={[styles.companyNameLarge, { color: theme.textColor }]}>
                  {company.name}
                </Text>
                <Text style={[styles.companyIndustry, { color: theme.textSecondaryColor }]}>
                  {company.industry}
                </Text>
                <Text style={[styles.companyLocation, { color: theme.textTertiaryColor }]}>
                  {company.location} • {company.size}
                </Text>
                <Text style={[styles.companyFounded, { color: theme.textTertiaryColor }]}>
                  Founded {company.founded}
                </Text>
              </View>
            </View>

            {/* Company Stats */}
            <View style={styles.companyStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.textColor }]}>{company.activeJobs}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondaryColor }]}>Active Jobs</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.textColor }]}>{company.employeeCount}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondaryColor }]}>Employees</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.textColor }]}>{company.revenue}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondaryColor }]}>Revenue</Text>
              </View>
            </View>
          </View>

          {/* Company Description */}
          <View style={[styles.section, { backgroundColor: theme.cardColor }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>About {company.name}</Text>
            <Text style={[styles.companyDescription, { color: theme.textColor }]}>
              {company.description}
            </Text>
          </View>

          {/* Specialties */}
          <View style={[styles.section, { backgroundColor: theme.cardColor }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Specialties</Text>
            <View style={styles.specialtiesContainer}>
              {company.specialties.map((specialty, index) => (
                <View key={index} style={[styles.specialtyTag, { backgroundColor: theme.primaryColor + '20' }]}>
                  <Text style={[styles.specialtyText, { color: theme.primaryColor }]}>{specialty}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Benefits */}
          <View style={[styles.section, { backgroundColor: theme.cardColor }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Benefits</Text>
            <View style={styles.benefitsContainer}>
              {company.benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                  <MaterialCommunityIcons name="check-circle" size={16} color={theme.primaryColor} />
                  <Text style={[styles.benefitText, { color: theme.textColor }]}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recent Jobs */}
          <View style={[styles.section, { backgroundColor: theme.cardColor }]}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Recent Jobs</Text>
            {company.recentJobs.map((job, index) => (
              <View key={index} style={[styles.recentJobItem, { borderBottomColor: theme.borderColor }]}>
                <Text style={[styles.recentJobTitle, { color: theme.textColor }]}>{job.title}</Text>
                <Text style={[styles.recentJobLocation, { color: theme.textSecondaryColor }]}>{job.location}</Text>
                <Text style={[styles.recentJobSalary, { color: theme.textTertiaryColor }]}>{job.salary}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  companyHeader: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  companyInfo: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  companyLogoLarge: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 16,
  },
  companyDetails: {
    flex: 1,
  },
  companyNameLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  companyIndustry: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  companyLocation: {
    fontSize: 14,
    marginBottom: 2,
  },
  companyFounded: {
    fontSize: 14,
  },
  companyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  companyDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  benefitsContainer: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontSize: 14,
  },
  recentJobItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  recentJobTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recentJobLocation: {
    fontSize: 14,
    marginBottom: 2,
  },
  recentJobSalary: {
    fontSize: 12,
  },
}); 