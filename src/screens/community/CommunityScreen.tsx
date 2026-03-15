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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { getPosts, createPost } from '../../services/firestoreService';
import { Post } from '../../models';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';
import { CommunityStackParamList } from '../../navigation/TabNavigator';
import { formatDistanceToNow } from 'date-fns';

type Nav = NativeStackNavigationProp<CommunityStackParamList>;

export default function CommunityScreen() {
  const { user } = useAuth();
  const navigation = useNavigation<Nav>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [posting, setPosting] = useState(false);
  const [showBox, setShowBox] = useState(false);

  const load = useCallback(() => {
    getPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handlePost = async () => {
    if (!newPost.trim() || !user) return;
    setPosting(true);
    try {
      await createPost({
        authorId: user.uid,
        authorName: user.displayName ?? 'Parent',
        authorPhoto: user.photoURL ?? undefined,
        content: newPost.trim(),
      });
      setNewPost('');
      setShowBox(false);
      load();
    } catch {
      Alert.alert('Error', 'Failed to post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Community</Text>
        <TouchableOpacity
          style={styles.composeBtn}
          onPress={() => setShowBox((v) => !v)}
        >
          <Ionicons name={showBox ? 'close' : 'add'} size={22} color={Colors.textOnPrimary} />
        </TouchableOpacity>
      </View>

      {showBox && (
        <View style={styles.composeBox}>
          <TextInput
            style={styles.composeInput}
            placeholder="Share something with the community..."
            placeholderTextColor={Colors.textMuted}
            value={newPost}
            onChangeText={setNewPost}
            multiline
            numberOfLines={3}
            maxLength={500}
            autoFocus
          />
          <View style={styles.composeActions}>
            <Text style={styles.charCount}>{newPost.length}/500</Text>
            <TouchableOpacity
              style={[styles.postBtn, (!newPost.trim() || posting) && styles.postBtnDisabled]}
              onPress={handlePost}
              disabled={!newPost.trim() || posting}
            >
              {posting ? (
                <ActivityIndicator color={Colors.textOnPrimary} size="small" />
              ) : (
                <Text style={styles.postBtnText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} color={Colors.primary} />
      ) : posts.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="chatbubbles-outline" size={56} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No posts yet</Text>
          <Text style={styles.emptyText}>Be the first to share something with the community.</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.postCard}
              onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
              activeOpacity={0.9}
            >
              <View style={styles.postHeader}>
                <View style={styles.authorAvatar}>
                  <Text style={styles.authorInitial}>
                    {item.authorName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text style={styles.authorName}>{item.authorName}</Text>
                  <Text style={styles.postTime}>
                    {formatDistanceToNow(item.createdAt, { addSuffix: true })}
                  </Text>
                </View>
              </View>
              <Text style={styles.postContent}>{item.content}</Text>
              <View style={styles.postFooter}>
                <View style={styles.postMeta}>
                  <Ionicons name="heart-outline" size={16} color={Colors.textMuted} />
                  <Text style={styles.postMetaText}>{item.likesCount}</Text>
                </View>
                <View style={styles.postMeta}>
                  <Ionicons name="chatbubble-outline" size={16} color={Colors.textMuted} />
                  <Text style={styles.postMetaText}>{item.commentCount}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  composeBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  composeBox: {
    backgroundColor: Colors.surface,
    margin: Spacing.lg,
    marginTop: 0,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  composeInput: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  composeActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  charCount: { fontSize: FontSize.xs, color: Colors.textMuted },
  postBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    minWidth: 60,
    alignItems: 'center',
  },
  postBtnDisabled: { opacity: 0.5 },
  postBtnText: { color: Colors.textOnPrimary, fontWeight: '700', fontSize: FontSize.sm },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, marginTop: Spacing.md },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm },
  list: { padding: Spacing.lg },
  postCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  authorInitial: { color: Colors.textOnPrimary, fontWeight: '700', fontSize: FontSize.lg },
  authorName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  postTime: { fontSize: FontSize.xs, color: Colors.textMuted },
  postContent: { fontSize: FontSize.md, color: Colors.textPrimary, lineHeight: 22, marginBottom: Spacing.sm },
  postFooter: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm },
  postMeta: { flexDirection: 'row', alignItems: 'center', marginRight: Spacing.md },
  postMetaText: { fontSize: FontSize.sm, color: Colors.textMuted, marginLeft: 4 },
});
