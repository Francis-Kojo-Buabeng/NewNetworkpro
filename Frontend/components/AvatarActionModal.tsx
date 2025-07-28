import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCurrentTheme } from '../contexts/ThemeContext';

interface AvatarActionModalProps {
  visible: boolean;
  onClose: () => void;
  onChooseFromGallery: () => void;
  onTakePhoto: () => void;
  onRemovePhoto?: () => void;
  hasProfilePicture: boolean;
}

export default function AvatarActionModal({
  visible,
  onClose,
  onChooseFromGallery,
  onTakePhoto,
  onRemovePhoto,
  hasProfilePicture,
}: AvatarActionModalProps) {
  const theme = useCurrentTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
        <View style={[styles.modal, { backgroundColor: theme.surfaceColor }]}>
          <Text style={[styles.title, { color: theme.textColor }]}>Profile Photo</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondaryColor }]}>Choose an option</Text>
          
          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[styles.option, { borderBottomColor: theme.borderColor }]}
              onPress={() => {
                onChooseFromGallery();
                onClose();
              }}
            >
              <MaterialCommunityIcons name="image" size={24} color={theme.primaryColor} />
              <Text style={[styles.optionText, { color: theme.textColor }]}>Choose from Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.option, { borderBottomColor: theme.borderColor }]}
              onPress={() => {
                onTakePhoto();
                onClose();
              }}
            >
              <MaterialCommunityIcons name="camera" size={24} color={theme.primaryColor} />
              <Text style={[styles.optionText, { color: theme.textColor }]}>Take Photo</Text>
            </TouchableOpacity>
            
            {hasProfilePicture && onRemovePhoto && (
              <TouchableOpacity
                style={[styles.option, { borderBottomColor: theme.borderColor }]}
                onPress={() => {
                  onRemovePhoto();
                  onClose();
                }}
              >
                <MaterialCommunityIcons name="delete" size={24} color="#ff4444" />
                <Text style={[styles.optionText, { color: '#ff4444' }]}>Remove Photo</Text>
              </TouchableOpacity>
            )}
          </View>
          
          <TouchableOpacity
            style={[styles.cancelButton, { backgroundColor: theme.cardColor }]}
            onPress={onClose}
          >
            <Text style={[styles.cancelText, { color: theme.textColor }]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 