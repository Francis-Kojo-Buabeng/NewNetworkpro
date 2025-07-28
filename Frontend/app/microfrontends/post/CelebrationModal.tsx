import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useCurrentTheme } from '../../../contexts/ThemeContext';

const CELEBRATIONS = [
  { key: '🎉', label: 'Party' },
  { key: '🎂', label: 'Birthday' },
  { key: '🎊', label: 'Congrats' },
  { key: '🏆', label: 'Achievement' },
  { key: '💼', label: 'Promotion' },
  { key: '👶', label: 'New Baby' },
  { key: '💍', label: 'Engagement' },
  { key: '🎓', label: 'Graduation' },
];

interface CelebrationModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (celebration: { key: string; label: string }) => void;
}

export default function CelebrationModal({ visible, onClose, onSelect }: CelebrationModalProps) {
  const theme = useCurrentTheme();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.cardColor }]}>  
          <Text style={[styles.title, { color: theme.textColor }]}>Add Celebration</Text>
          <FlatList
            data={CELEBRATIONS}
            keyExtractor={item => item.key}
            numColumns={4}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.celebrationButton, { backgroundColor: theme.surfaceColor }]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.emoji}>{item.key}</Text>
                <Text style={[styles.celebrationLabel, { color: theme.textColor }]}>{item.label}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.celebrationList}
          />
          <TouchableOpacity style={[styles.button, { backgroundColor: theme.primaryColor }]} onPress={onClose}>
            <Text style={{ color: '#fff' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  celebrationList: {
    marginBottom: 16,
  },
  celebrationButton: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
    padding: 10,
    borderRadius: 8,
    width: 60,
    height: 60,
  },
  emoji: {
    fontSize: 28,
  },
  celebrationLabel: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
}); 