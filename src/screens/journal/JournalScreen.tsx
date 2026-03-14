import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { getJournalEntries, deleteJournalEntry } from '../../services/firestoreService';
import { Colors, Spacing, Radius, FontSize } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { JournalEntry } from '../../models';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Journal'>;
  route: RouteProp<RootStackParamList, 'Journal'>;
};

const MOOD_EMOJI: Record<string, string> = {
  great: '😄',
  good: '🙂',
  neutral: '😐',
  hard: '😔',
  very_hard: '😢',
};

export default function JournalScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const { childId, childName } = route.params;
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEntries = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getJournalEntries(childId);
      setEntries(data);
    } catch {
      Alert.alert('Error', 'Failed to load journal entries.');
    } finally {
      setLoading(false);
    }
  }, [user, childId]);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  const handleDelete = (entryId: string) => {
    Alert.alert('Delete Entry', 'Remove this journal entry?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            if (user) await deleteJournalEntry(entryId);
            setEntries((prev) => prev.filter((e) => e.id !== entryId));
          } catch {
            Alert.alert('Error', 'Failed to delete entry.');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: JournalEntry }) => (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.moodBadge}>
          <Text style={styles.moodEmoji}>{item.mood ? MOOD_EMOJI[item.mood] ?? '📝' : '📝'}</Text>
          <Text style={styles.moodLabel}>{item.mood ?? ''}</Text>
        </View>
        <Text style={styles.dateText}>
          {format(new Date(item.date), 'MMM d, yyyy')}
        </Text>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color={Colors.danger} />
        </TouchableOpacity>
      </View>
      <Text style={styles.noteText} numberOfLines={4}>
        {item.note}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{childName}'s Journal</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('JournalForm', { childId })}
        >
          <Ionicons name="add" size={24} color={Colors.textOnPrimary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="book-outline" size={56} color={Colors.textMuted} />
              <Text style={styles.emptyTitle}>No entries yet</Text>
              <Text style={styles.emptyText}>Tap + to add your first journal entry.</Text>
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => navigation.navigate('JournalForm', { childId })}
              >
                <Text style={styles.emptyBtnText}>New Entry</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
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
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: { flex: 1, justifyContent: 'center' },
  list: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  moodBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    marginRight: Spacing.sm,
  },
  moodEmoji: { fontSize: 16 },
  moodLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, marginLeft: 4, textTransform: 'capitalize' },
  dateText: { flex: 1, fontSize: FontSize.sm, color: Colors.textMuted },
  deleteBtn: { padding: Spacing.xs },
  noteText: { fontSize: FontSize.md, color: Colors.textPrimary, lineHeight: 22 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, marginTop: Spacing.md },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: Spacing.xs },
  emptyBtn: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  emptyBtnText: { color: Colors.textOnPrimary, fontSize: FontSize.md, fontWeight: '600' },
});
