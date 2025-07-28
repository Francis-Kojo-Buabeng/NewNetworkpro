import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface NetworkStats {
  totalConnections: number;
  pendingRequests: number;
  newSuggestions: number;
  profileViews: number;
}

interface NetworkOverviewModalProps {
  visible: boolean;
  onClose: () => void;
  networkStats: NetworkStats;
  theme: any;
}

export default function NetworkOverviewModal({
  visible,
  onClose,
  networkStats,
  theme,
}: NetworkOverviewModalProps) {
  const detailedStats = [
    {
      title: 'Total Connections',
      value: networkStats.totalConnections,
      icon: 'account-group',
      color: '#0077B5',
      description: 'People in your professional network',
      breakdown: [
        { label: 'Direct Connections', value: Math.floor(networkStats.totalConnections * 0.7) },
        { label: '2nd Degree', value: Math.floor(networkStats.totalConnections * 0.2) },
        { label: '3rd Degree', value: Math.floor(networkStats.totalConnections * 0.1) },
      ]
    },
    {
      title: 'Pending Requests',
      value: networkStats.pendingRequests,
      icon: 'clock-outline',
      color: '#FF6B35',
      description: 'Connection requests waiting for response',
      breakdown: [
        { label: 'This Week', value: Math.floor(networkStats.pendingRequests * 0.4) },
        { label: 'This Month', value: Math.floor(networkStats.pendingRequests * 0.6) },
      ]
    },
    {
      title: 'New Suggestions',
      value: networkStats.newSuggestions,
      icon: 'account-plus',
      color: '#4CAF50',
      description: 'People you might want to connect with',
      breakdown: [
        { label: 'Same Industry', value: Math.floor(networkStats.newSuggestions * 0.5) },
        { label: 'Mutual Connections', value: Math.floor(networkStats.newSuggestions * 0.3) },
        { label: 'Alumni', value: Math.floor(networkStats.newSuggestions * 0.2) },
      ]
    },
    {
      title: 'Profile Views',
      value: networkStats.profileViews,
      icon: 'eye-outline',
      color: '#9C27B0',
      description: 'Times your profile was viewed this month',
      breakdown: [
        { label: 'This Week', value: Math.floor(networkStats.profileViews * 0.3) },
        { label: 'This Month', value: networkStats.profileViews },
      ]
    },
  ];

  const renderStatCard = (stat: any) => (
    <View key={stat.title} style={[styles.statCard, { backgroundColor: theme.cardColor, borderColor: theme.borderColor }]}>
      <View style={styles.statHeader}>
        <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
          <MaterialCommunityIcons name={stat.icon as any} size={24} color={stat.color} />
        </View>
        <View style={styles.statInfo}>
          <Text style={[styles.statTitle, { color: theme.textColor }]}>{stat.title}</Text>
          <Text style={[styles.statValue, { color: theme.textColor }]}>{stat.value.toLocaleString()}</Text>
        </View>
      </View>
      <Text style={[styles.statDescription, { color: theme.textSecondaryColor }]}>{stat.description}</Text>
      <View style={styles.breakdownContainer}>
        {stat.breakdown.map((item: any, index: number) => (
          <View key={index} style={styles.breakdownItem}>
            <Text style={[styles.breakdownLabel, { color: theme.textTertiaryColor }]}>{item.label}</Text>
            <Text style={[styles.breakdownValue, { color: theme.textColor }]}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: theme.backgroundColor }]}>
          {/* Header */}
          <View style={[styles.modalHeader, { borderBottomColor: theme.borderColor }]}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Network Overview</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={theme.textColor} />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.statsContainer}>
              {detailedStats.map(renderStatCard)}
            </View>

            {/* Network Growth Section */}
            <View style={[styles.growthSection, { backgroundColor: theme.cardColor, borderColor: theme.borderColor }]}>
              <Text style={[styles.growthTitle, { color: theme.textColor }]}>Network Growth</Text>
              <View style={styles.growthStats}>
                <View style={styles.growthItem}>
                  <Text style={[styles.growthValue, { color: theme.primaryColor }]}>+12%</Text>
                  <Text style={[styles.growthLabel, { color: theme.textSecondaryColor }]}>This Month</Text>
                </View>
                <View style={styles.growthItem}>
                  <Text style={[styles.growthValue, { color: theme.primaryColor }]}>+8%</Text>
                  <Text style={[styles.growthLabel, { color: theme.textSecondaryColor }]}>Last Month</Text>
                </View>
                <View style={styles.growthItem}>
                  <Text style={[styles.growthValue, { color: theme.primaryColor }]}>+25%</Text>
                  <Text style={[styles.growthLabel, { color: theme.textSecondaryColor }]}>This Quarter</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '80%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    paddingVertical: 20,
    gap: 16,
  },
  statCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statDescription: {
    fontSize: 12,
    marginBottom: 12,
  },
  breakdownContainer: {
    gap: 8,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  breakdownLabel: {
    fontSize: 12,
  },
  breakdownValue: {
    fontSize: 12,
    fontWeight: '600',
  },
  growthSection: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  growthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  growthStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  growthItem: {
    alignItems: 'center',
  },
  growthValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  growthLabel: {
    fontSize: 12,
  },
}); 