import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { addJournalEntry } from '../../services/firestoreService';
import { Colors, Spacing, Radius, FontSize } from '../../constants/theme';
import { HomeStackParamList } from '../../navigation/TabNavigator';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'JournalForm'>;
  route: RouteProp<HomeStackParamList, 'JournalForm'>;
};

type Mood = 'great' | 'good' | 'neutral' | 'hard' | 'very_hard';

const MOODS: { value: Mood; label: string; emoji: string; color: string }[] = [
  { value: 'great', label: 'Great', emoji: '😄', color: '#4CAF50' },
  { value: 'good', label: 'Good', emoji: '🙂', color: '#8BC34A' },
  { value: 'neutral', label: 'Okay', emoji: '😐', color: '#FFC107' },
  { value: 'hard', label: 'Hard', emoji: '😔', color: '#FF9800' },
  { value: 'very_hard', label: 'Difficult', emoji: '😢', color: '#F44336' },
];

export default function JournalFormScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const { childId } = route.params;

  const [mood, setMood] = useState<Mood>('neutral');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');

  const handleSave = async () => {
    if (!note.trim()) {
      Alert.alert('Required', 'Please write a note before saving.');
      return;
    }
    if (!user) return;
    setLoading(true);
    try {
      await addJournalEntry(user.uid, { childId, date: today, note: note.trim(), mood });
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to save entry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-down" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>New Journal Entry</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.dateText}>{format(new Date(), 'MMMM d, yyyy')}</Text>
        </View>

        <Text style={styles.label}>How did the day feel?</Text>
        <View style={styles.moodRow}>
          {MOODS.map((m) => (
            <TouchableOpacity
              key={m.value}
              style={[
                styles.moodBtn,
                mood === m.value && { borderColor: m.color, backgroundColor: `${m.color}20` },
              ]}
              onPress={() => setMood(m.value)}
            >
              <Text style={styles.moodEmoji}>{m.emoji}</Text>
              <Text
                style={[
                  styles.moodLabel,
                  mood === m.value && { color: m.color, fontWeight: '700' },
                ]}
              >
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Your notes *</Text>
        <TextInput
          style={[styles.input, styles.inputLarge]}
          value={note}
          onChangeText={setNote}
          placeholder="What happened today? Any notable moments, challenges, or wins with your child?"
          placeholderTextColor={Colors.textMuted}
          multiline
          textAlignVertical="top"
          autoFocus
        />

        <Text style={styles.charCount}>{note.length} / 1500 characters</Text>

        <TouchableOpacity
          style={[styles.btn, (loading || !note.trim()) && styles.btnDisabled]}
          onPress={handleSave}
          disabled={loading || !note.trim()}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textOnPrimary} />
          ) : (
            <>
              <Ionicons name="save-outline" size={18} color={Colors.textOnPrimary} style={{ marginRight: 6 }} />
              <Text style={styles.btnText}>Save Entry</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.lg },
  dateText: { fontSize: FontSize.sm, color: Colors.textSecondary, marginLeft: Spacing.xs },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  moodBtn: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  moodEmoji: { fontSize: 22, marginBottom: 2 },
  moodLabel: { fontSize: 10, color: Colors.textMuted },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  inputLarge: { height: 200, marginBottom: Spacing.xs },
  charCount: { fontSize: FontSize.xs, color: Colors.textMuted, textAlign: 'right', marginBottom: Spacing.lg },
  btn: {
    backgroundColor: Colors.secondary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: Colors.textOnPrimary, fontSize: FontSize.lg, fontWeight: '700' },
});
