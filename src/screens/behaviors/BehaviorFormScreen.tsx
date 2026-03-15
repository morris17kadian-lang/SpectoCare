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
import { useAuth } from '../../context/AuthContext';
import { addBehaviorLog } from '../../services/firestoreService';
import { Colors, Spacing, Radius, FontSize } from '../../constants/theme';
import { HomeStackParamList } from '../../navigation/TabNavigator';
import { format } from 'date-fns';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'BehaviorForm'>;
  route: RouteProp<HomeStackParamList, 'BehaviorForm'>;
};

const BEHAVIOR_TYPES = [
  'Aggression',
  'Self-injury',
  'Tantrum / Meltdown',
  'Repetitive behavior',
  'Hyperactivity',
  'Withdrawal',
  'Crying',
  'Refusal',
  'Elopement',
  'Other',
];

const SEVERITY_LEVELS: { value: 1 | 2 | 3 | 4 | 5; label: string; color: string }[] = [
  { value: 1, label: 'Mild', color: Colors.success },
  { value: 2, label: 'Low', color: Colors.success },
  { value: 3, label: 'Moderate', color: Colors.warning },
  { value: 4, label: 'High', color: Colors.danger },
  { value: 5, label: 'Severe', color: Colors.danger },
];

export default function BehaviorFormScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const { childId } = route.params;

  const [behaviorType, setBehaviorType] = useState('');
  const [severity, setSeverity] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [notes, setNotes] = useState('');
  const [date] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!behaviorType) {
      Alert.alert('Required', 'Please select a behavior type.');
      return;
    }
    if (!user) return;
    setLoading(true);
    try {
      await addBehaviorLog(user.uid, { childId, date, behaviorType, severity, notes });
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to save log.');
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
        <Text style={styles.title}>Log Behavior</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.dateText}>{date}</Text>
        </View>

        <Text style={styles.label}>Behavior Type *</Text>
        <View style={styles.typeGrid}>
          {BEHAVIOR_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.typeChip, behaviorType === t && styles.typeChipActive]}
              onPress={() => setBehaviorType(t)}
            >
              <Text style={[styles.typeChipText, behaviorType === t && styles.typeChipTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Severity *</Text>
        <View style={styles.severityRow}>
          {SEVERITY_LEVELS.map((s) => (
            <TouchableOpacity
              key={s.value}
              style={[
                styles.severityBtn,
                severity === s.value && { backgroundColor: s.color, borderColor: s.color },
              ]}
              onPress={() => setSeverity(s.value)}
            >
              <Text
                style={[
                  styles.severityBtnText,
                  severity === s.value && { color: Colors.textOnPrimary },
                ]}
              >
                {s.value}
              </Text>
              <Text
                style={[
                  styles.severityLabel,
                  severity === s.value && { color: Colors.textOnPrimary },
                ]}
              >
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Notes (optional)</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          value={notes}
          onChangeText={setNotes}
          placeholder="What happened? What triggered it? How did it end?"
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleSave} disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.textOnPrimary} /> : <Text style={styles.btnText}>Save Log</Text>}
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
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  dateText: { fontSize: FontSize.sm, color: Colors.textSecondary, marginLeft: Spacing.xs },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.md },
  typeChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    margin: 3,
    backgroundColor: Colors.surface,
  },
  typeChipActive: { borderColor: Colors.secondary, backgroundColor: `${Colors.secondary}15` },
  typeChipText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  typeChipTextActive: { color: Colors.secondary, fontWeight: '700' },
  severityRow: { flexDirection: 'row', marginBottom: Spacing.lg, justifyContent: 'space-between' },
  severityBtn: {
    flex: 1,
    marginHorizontal: 2,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.surface,
  },
  severityBtnText: { fontSize: FontSize.md, fontWeight: '800', color: Colors.textSecondary },
  severityLabel: { fontSize: 9, color: Colors.textMuted, marginTop: 2 },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  inputMultiline: { height: 110, textAlignVertical: 'top', paddingTop: Spacing.sm },
  btn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: Colors.textOnPrimary, fontSize: FontSize.lg, fontWeight: '700' },
});
