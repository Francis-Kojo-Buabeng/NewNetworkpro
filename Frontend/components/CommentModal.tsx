import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useCurrentTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

interface Comment {
  id: string;
  author: string;
  authorAvatar: any;
  text: string;
  timestamp: string;
  likes: number;
}

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  postId: string | number;
  postAuthor: string;
  existingComments?: Comment[];
}

export default function CommentModal({
  visible,
  onClose,
  postId,
  postAuthor,
  existingComments = [],
}: CommentModalProps) {
  const theme = useCurrentTheme();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>(existingComments);

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'You',
        authorAvatar: require('@/assets/images/Avator-Image.jpg'),
        text: newComment.trim(),
        timestamp: 'Just now',
        likes: 0,
      };
      
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleLikeComment = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  const renderComment = (comment: Comment) => (
    <View key={comment.id} style={styles.commentItem}>
      <Image source={comment.authorAvatar} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={[styles.commentAuthor, { color: theme.textColor }]}>
            {comment.author}
          </Text>
          <Text style={[styles.commentTime, { color: theme.textSecondaryColor }]}>
            {comment.timestamp}
          </Text>
        </View>
        <Text style={[styles.commentText, { color: theme.textColor }]}>
          {comment.text}
        </Text>
        <View style={styles.commentActions}>
          <TouchableOpacity 
            style={styles.commentAction}
            onPress={() => handleLikeComment(comment.id)}
          >
            <Text style={[styles.commentActionText, { color: theme.textSecondaryColor }]}>
              Like
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentAction}>
            <Text style={[styles.commentActionText, { color: theme.textSecondaryColor }]}>
              Reply
            </Text>
          </TouchableOpacity>
          {comment.likes > 0 && (
            <Text style={[styles.commentLikes, { color: theme.textSecondaryColor }]}>
              {comment.likes} like{comment.likes !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <KeyboardAvoidingView 
        style={[styles.container, { backgroundColor: theme.backgroundColor }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
          <TouchableOpacity onPress={onClose} style={styles.headerButton}>
            <MaterialCommunityIcons name="close" size={24} color={theme.textColor} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.textColor }]}>
            Comments ({comments.length})
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Comments List */}
        <ScrollView 
          style={styles.commentsList}
          showsVerticalScrollIndicator={false}
        >
          {comments.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons 
                name="comment-outline" 
                size={48} 
                color={theme.textSecondaryColor} 
              />
              <Text style={[styles.emptyStateText, { color: theme.textSecondaryColor }]}>
                No comments yet. Be the first to comment!
              </Text>
            </View>
          ) : (
            comments.map(renderComment)
          )}
        </ScrollView>

        {/* Comment Input */}
        <View style={[styles.inputContainer, { borderTopColor: theme.borderColor }]}>
          <View style={[styles.inputWrapper, { backgroundColor: theme.inputBackgroundColor }]}>
            <TextInput
              style={[styles.commentInput, { color: theme.textColor }]}
              placeholder="Write a comment..."
              placeholderTextColor={theme.placeholderColor}
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: newComment.trim() ? theme.primaryColor : theme.borderColor }
              ]}
              onPress={handleAddComment}
              disabled={!newComment.trim()}
            >
              <MaterialCommunityIcons 
                name="send" 
                size={20} 
                color={newComment.trim() ? '#fff' : theme.textSecondaryColor} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  commentsList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAction: {
    marginRight: 16,
  },
  commentActionText: {
    fontSize: 12,
    fontWeight: '500',
  },
  commentLikes: {
    fontSize: 12,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
}); 