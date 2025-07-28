import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface OtherUserMenuProps {
  visible: boolean;
  onClose: () => void;
  anchorPosition?: { top: number; right: number };
}

const OtherUserMenu: React.FC<OtherUserMenuProps> = ({ visible, onClose, anchorPosition }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={[styles.menu, anchorPosition ? { top: anchorPosition.top, right: anchorPosition.right } : {}]}>
        <TouchableOpacity style={styles.menuItem} onPress={onClose}>
          <Text style={styles.menuLabel}>Options coming soon</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
    zIndex: 1,
  },
  menu: {
    position: 'absolute',
    top: 100,
    right: 24,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 8,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: 16,
    color: '#222',
  },
});

export default OtherUserMenu; 