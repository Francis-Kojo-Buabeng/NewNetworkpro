import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useCurrentTheme } from '../../../contexts/ThemeContext';

interface EventModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (event: { title: string; date: string; description: string }) => void;
}

export default function EventModal({ visible, onClose, onSave }: EventModalProps) {
  const theme = useCurrentTheme();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (title && date) {
      onSave({ title, date, description });
      setTitle('');
      setDate('');
      setDescription('');
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.cardColor }]}>  
          <Text style={[styles.title, { color: theme.textColor }]}>Add Event</Text>
          <TextInput
            style={[styles.input, { color: theme.textColor, borderColor: theme.borderColor }]}
            placeholder="Event Title"
            placeholderTextColor={theme.placeholderColor}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, { color: theme.textColor, borderColor: theme.borderColor }]}
            placeholder="Date (YYYY-MM-DD)"
            placeholderTextColor={theme.placeholderColor}
            value={date}
            onChangeText={setDate}
          />
          <TextInput
            style={[styles.input, { color: theme.textColor, borderColor: theme.borderColor }]}
            placeholder="Description (optional)"
            placeholderTextColor={theme.placeholderColor}
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.surfaceColor }]} onPress={onClose}>
              <Text style={{ color: theme.textColor }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: theme.primaryColor }]} onPress={handleSave}>
              <Text style={{ color: '#fff' }}>Save</Text>
            </TouchableOpacity>
          </View>
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
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 8,
  },
}); 