import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useStories } from '../../../contexts/StoriesContext';
import { useCurrentTheme } from '../../../contexts/ThemeContext';
import Snackbar from '../../../components/Snackbar';

const { width, height } = Dimensions.get('window');

interface StoryCreationScreenProps {
  visible: boolean;
  onClose: () => void;
  onStoryCreated: () => void;
}

export default function StoryCreationScreen({ visible, onClose, onStoryCreated }: StoryCreationScreenProps) {
  const theme = useCurrentTheme();
  const { addStory } = useStories();
  const [storyText, setStoryText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState(24);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showStickers, setShowStickers] = useState(false);
  const [showDrawing, setShowDrawing] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type?: 'success' | 'error' | 'info' }>({ visible: false, message: '', type: 'info' });

  const textColors = ['#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const textSizes = [16, 20, 24, 28, 32, 36, 40];

  const stickers = [
    '😀', '😂', '😍', '🎉', '🔥', '💯', '👍', '❤️',
    '😎', '🤔', '😢', '😡', '🤯', '🥳', '😴', '🤩'
  ];

  const handleTakePhoto = () => {
    setSnackbar({ visible: true, message: 'Camera feature coming soon!', type: 'info' });
  };

  const handleSelectMedia = () => {
    setSnackbar({ visible: true, message: 'Media selection feature coming soon!', type: 'info' });
  };

  const handleAddText = () => {
    setShowTextEditor(true);
  };

  const handleAddSticker = () => {
    setShowStickers(true);
  };

  const handleDrawing = () => {
    setShowDrawing(true);
  };

  const handlePostStory = () => {
    // For now, use placeholder user info
    addStory({
      userId: 'me',
      userName: 'Your Story',
      avatar: require('@/assets/images/default-avator.jpg'),
      media: selectedMedia || undefined,
      text: storyText || undefined,
      stickers: selectedSticker ? [selectedSticker] : undefined,
    });
    onStoryCreated();
    onClose();
  };

  const renderTextEditor = () => (
    <Modal
      visible={showTextEditor}
      transparent={true}
      animationType="slide"
    >
      <View style={[styles.modalOverlay, { backgroundColor: theme.overlayColor }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.cardColor }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Add Text</Text>
            <TouchableOpacity onPress={() => setShowTextEditor(false)}>
              <MaterialCommunityIcons name="close" size={24} color={theme.textColor} />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={[styles.textInput, { 
              color: textColor, 
              fontSize: textSize,
              backgroundColor: theme.inputBackgroundColor 
            }]}
            placeholder="Type your story text..."
            placeholderTextColor={theme.placeholderColor}
            value={storyText}
            onChangeText={setStoryText}
            multiline
          />
          
          <View style={styles.colorPicker}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Text Color</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {textColors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    textColor === color && styles.selectedColor
                  ]}
                  onPress={() => setTextColor(color)}
                />
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.sizePicker}>
            <Text style={[styles.sectionTitle, { color: theme.textColor }]}>Text Size</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {textSizes.map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeOption,
                    { borderColor: theme.borderColor },
                    textSize === size && { borderColor: theme.primaryColor }
                  ]}
                  onPress={() => setTextSize(size)}
                >
                  <Text style={[styles.sizeText, { 
                    color: theme.textColor, 
                    fontSize: size / 2 
                  }]}>
                    Aa
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: theme.primaryColor }]}
              onPress={() => setShowTextEditor(false)}
            >
              <Text style={[styles.modalButtonText, { color: '#fff' }]}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderStickerPicker = () => (
    <Modal
      visible={showStickers}
      transparent={true}
      animationType="slide"
    >
      <View style={[styles.modalOverlay, { backgroundColor: theme.overlayColor }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.cardColor }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.textColor }]}>Add Sticker</Text>
            <TouchableOpacity onPress={() => setShowStickers(false)}>
              <MaterialCommunityIcons name="close" size={24} color={theme.textColor} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.stickerGrid}>
            {stickers.map((sticker, index) => (
              <TouchableOpacity
                key={index}
                style={styles.stickerItem}
                onPress={() => {
                  setSelectedSticker(sticker);
                  setShowStickers(false);
                }}
              >
                <Text style={styles.stickerText}>{sticker}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.surfaceColor }]}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <MaterialCommunityIcons name="close" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>Create Story</Text>
          <TouchableOpacity onPress={handlePostStory} style={styles.headerButton}>
            <MaterialCommunityIcons name="send" size={24} color={theme.primaryColor} />
          </TouchableOpacity>
        </View>

        {/* Story Preview Area */}
        <View style={styles.previewArea}>
          {selectedMedia ? (
            <Image source={{ uri: selectedMedia }} style={styles.previewImage} />
          ) : (
            <View style={[styles.placeholderPreview, { backgroundColor: theme.cardColor }]}>
              <MaterialCommunityIcons name="image" size={64} color={theme.textSecondaryColor} />
              <Text style={[styles.placeholderText, { color: theme.textSecondaryColor }]}>
                Add photo or video to your story
              </Text>
            </View>
          )}
          
          {/* Overlay Text */}
          {storyText && (
            <View style={styles.textOverlay}>
              <Text style={[styles.overlayText, { color: textColor, fontSize: textSize }]}>
                {storyText}
              </Text>
            </View>
          )}
          
          {/* Selected Sticker */}
          {selectedSticker && (
            <View style={styles.stickerOverlay}>
              <Text style={styles.stickerOverlayText}>{selectedSticker}</Text>
            </View>
          )}
        </View>

        {/* Toolbar */}
        <View style={[styles.toolbar, { backgroundColor: theme.surfaceColor }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.toolButton} onPress={handleTakePhoto}>
              <MaterialCommunityIcons name="camera" size={24} color={theme.textColor} />
              <Text style={[styles.toolButtonText, { color: theme.textColor }]}>Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolButton} onPress={handleSelectMedia}>
              <MaterialCommunityIcons name="image" size={24} color={theme.textColor} />
              <Text style={[styles.toolButtonText, { color: theme.textColor }]}>Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolButton} onPress={handleAddText}>
              <MaterialCommunityIcons name="format-text" size={24} color={theme.textColor} />
              <Text style={[styles.toolButtonText, { color: theme.textColor }]}>Text</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolButton} onPress={handleAddSticker}>
              <MaterialCommunityIcons name="sticker-emoji" size={24} color={theme.textColor} />
              <Text style={[styles.toolButtonText, { color: theme.textColor }]}>Stickers</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolButton} onPress={handleDrawing}>
              <MaterialCommunityIcons name="pencil" size={24} color={theme.textColor} />
              <Text style={[styles.toolButtonText, { color: theme.textColor }]}>Draw</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Modals */}
        {renderTextEditor()}
        {renderStickerPicker()}
        <Snackbar
          visible={snackbar.visible}
          message={snackbar.message}
          type={snackbar.type}
          onHide={() => setSnackbar({ ...snackbar, visible: false })}
        />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  previewArea: {
    flex: 1,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  textOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  overlayText: {
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  stickerOverlay: {
    position: 'absolute',
    top: 100,
    right: 50,
  },
  stickerOverlayText: {
    fontSize: 48,
  },
  toolbar: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  toolButton: {
    alignItems: 'center',
    marginRight: 24,
    paddingVertical: 8,
  },
  toolButtonText: {
    fontSize: 12,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  textInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    minHeight: 100,
  },
  colorPicker: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  colorOption: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  selectedColor: {
    borderColor: '#1877F2',
    borderWidth: 3,
  },
  sizePicker: {
    marginBottom: 20,
  },
  sizeOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeText: {
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  stickerGrid: {
    maxHeight: 300,
  },
  stickerItem: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
  stickerText: {
    fontSize: 32,
  },
}); 