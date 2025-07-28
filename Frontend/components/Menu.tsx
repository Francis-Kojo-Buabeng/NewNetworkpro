import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface MenuProps {
  visible: boolean;
  onClose: () => void;
  options: { label: string; icon?: string; onPress: () => void }[];
  anchorPosition?: { top: number; right: number };
}

const Menu: React.FC<MenuProps> = ({ visible, onClose, options, anchorPosition }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <View style={[styles.menu, anchorPosition ? { top: anchorPosition.top, right: anchorPosition.right } : {}]}>
        {options.map((option, idx) => (
          <TouchableOpacity
            key={option.label}
            style={styles.menuItem}
            onPress={() => {
              option.onPress();
              onClose();
            }}
          >
            {option.icon && (
              <MaterialCommunityIcons name={option.icon as any} size={20} color="#333" style={{ marginRight: 12 }} />
            )}
            <Text style={styles.menuLabel}>{option.label}</Text>
          </TouchableOpacity>
        ))}
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
  },
  menuLabel: {
    fontSize: 16,
    color: '#222',
  },
});

export default Menu; 