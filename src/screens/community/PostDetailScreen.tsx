import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { getPosts, getComments, addComment } from '../../services/firestoreService';
import { Post, Comment } from '../../models';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { formatDistanceToNow } from 'date-fns';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PostDetail'>;
  route: RouteProp<RootStackParamList, 'PostDetail'>;
};

export default function PostDetailScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);

  const load = useCallback(async () => {
    const [allPosts, allComments] = await Promise.all([
      getPosts(),
      getComments(route.params.postId),
    ]);
    setPost(allPosts.find((p) => p.id === route.params.postId) ?? null);
    setComments(allComments);
    setLoading(false);
  }, [route.params.postId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleComment = async () => {
    if (!commentText.trim() || !user) return;
    setPosting(true);
    try {
      await addComment({
        postId: route.params.postId,
        authorId: user.uid,
        authorName: user.displayName ?? 'Parent',
        content: commentText.trim(),
      });
      setCommentText('');
      load();
    } catch {
      Alert.alert('Error', 'Failed to post comment.');
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={{ flex: 1 }} color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Discussion</Text>
          <View style={{ width: 40 }} />
        </View>

        <FlatList
          data={comments}
          keyExtractor={(c) => c.id}
          contentContainerStyle={styles.scroll}
          ListHeaderComponent={
            post ? (
              <View style={styles.postCard}>
                <View style={styles.postHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{post.authorName.charAt(0).toUpperCase()}</Text>
                  </View>
                  <View>
                    <Text style={styles.authorName}>{post.authorName}</Text>
                    <Text style={styles.time}>
                      {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                    </Text>
                  </View>
                </View>
                <Text style={styles.postContent}>{post.content}</Text>
                <Text style={styles.commentCount}>
                  {comments.length} comment{comments.length !== 1 ? 's' : ''}
                </Text>
              </View>
            ) : null
          }
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          renderItem={({ item }) => (
            <View style={styles.commentCard}>
              <View style={styles.commentAvatar}>
                <Text style={styles.commentAvatarText}>{item.authorName.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.commentAuthor}>{item.authorName}</Text>
                <Text style={styles.commentText}>{item.content}</Text>
                <Text style={styles.commentTime}>
                  {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                </Text>
              </View>
            </View>
          )}
        />

        <View style={styles.inputRow}>
          <TextInput
            style={styles.commentInput}
            placeholder="Write a comment..."
            placeholderTextColor={Colors.textMuted}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={300}
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!commentText.trim() || posting) && styles.sendBtnDisabled]}
            onPress={handleComment}
            disabled={!commentText.trim() || posting}
          >
            {posting ? (
              <ActivityIndicator color={Colors.textOnPrimary} size="small" />
            ) : (
              <Ionicons name="send" size={18} color={Colors.textOnPrimary} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xl },
  postCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadow.sm,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  avatarText: { color: Colors.textOnPrimary, fontWeight: '700', fontSize: FontSize.lg },
  authorName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  time: { fontSize: FontSize.xs, color: Colors.textMuted },
  postContent: { fontSize: FontSize.md, color: Colors.textPrimary, lineHeight: 22, marginBottom: Spacing.sm },
  commentCount: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
  commentCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  commentAvatar: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  commentAvatarText: { color: Colors.textOnPrimary, fontWeight: '700', fontSize: FontSize.sm },
  commentAuthor: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
  commentText: { fontSize: FontSize.sm, color: Colors.textPrimary, marginTop: 2, lineHeight: 18 },
  commentTime: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  commentInput: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    maxHeight: 80,
    marginRight: Spacing.sm,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnDisabled: { opacity: 0.5 },
});
