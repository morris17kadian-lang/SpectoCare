import React, { useState, useEffect } from 'react';
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
import { addChild, updateChild, getChildren } from '../../services/firestoreService';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Child } from '../../models';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ChildForm'>;
  route: RouteProp<RootStackParamList, 'ChildForm'>;
};

const GENDERS = ['male', 'female', 'other'] as const;
const CONDITIONS = [
  'Autism Spectrum Disorder',
  'ADHD',
  'Down Syndrome',
  'Sensory Processing Disorder',
  'Speech & Language Delay',
  'Developmental Delay',
  'Other',
];

export default function ChildFormScreen({ navigation, route }: Props) {
  const { user } = useAuth();
  const isEdit = !!route.params?.childId;

  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<Child['gender']>('male');
  const [condition, setCondition] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);

  useEffect(() => {
    if (isEdit && user && route.params.childId) {
      getChildren(user.uid).then((children) => {
        const child = children.find((c) => c.id === route.params.childId);
        if (child) {
          setName(child.name);
          setDob(child.dateOfBirth);
          setGender(child.gender);
          setCondition(child.condition ?? '');
          setNotes(child.notes ?? '');
        }
        setLoadingData(false);
      });
    }
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter the child\'s name.');
      return;
    }
    if (!dob) {
      Alert.alert('Required', 'Please enter the date of birth (YYYY-MM-DD).');
      return;
    }
    if (!user) return;
    setLoading(true);
    try {
      const data = { name: name.trim(), dateOfBirth: dob, gender, condition, notes };
      if (isEdit && route.params.childId) {
        await updateChild(route.params.childId, data);
      } else {
        await addChild(user.uid, data);
      }
      navigation.goBack();
    } catch {
      Alert.alert('Error', 'Failed to save. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator style={{ flex: 1 }} color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-down" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{isEdit ? 'Edit Child' : 'Add Child'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <InputField label="Full Name *" value={name} onChangeText={setName} placeholder="Child's name" />
        <InputField
          label="Date of Birth * (YYYY-MM-DD)"
          value={dob}
          onChangeText={setDob}
          placeholder="e.g. 2020-03-15"
          keyboardType="numbers-and-punctuation"
        />

        <Text style={styles.label}>Gender *</Text>
        <View style={styles.row}>
          {GENDERS.map((g) => (
            <TouchableOpacity
              key={g}
              style={[styles.chip, gender === g && styles.chipSelected]}
              onPress={() => setGender(g)}
            >
              <Text style={[styles.chipText, gender === g && styles.chipTextSelected]}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Condition (optional)</Text>
        <View style={styles.conditionGrid}>
          {CONDITIONS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.conditionChip, condition === c && styles.conditionChipSelected]}
              onPress={() => setCondition(condition === c ? '' : c)}
            >
              <Text
                style={[styles.conditionChipText, condition === c && styles.conditionChipTextSelected]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <InputField
          label="Notes (optional)"
          value={notes}
          onChangeText={setNotes}
          placeholder="Any additional notes..."
          multiline
        />

        <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={Colors.textOnPrimary} />
          ) : (
            <Text style={styles.btnText}>{isEdit ? 'Save Changes' : 'Add Child'}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: any;
  multiline?: boolean;
}) => (
  <View style={{ marginBottom: Spacing.md }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={Colors.textMuted}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={multiline ? 3 : 1}
    />
  </View>
);

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
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.xs },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    height: 52,
  },
  inputMultiline: { height: 90, textAlignVertical: 'top', paddingTop: Spacing.sm },
  row: { flexDirection: 'row', marginBottom: Spacing.md },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  chipSelected: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}15` },
  chipText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  chipTextSelected: { color: Colors.primary },
  conditionGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.md },
  conditionChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    margin: 3,
    backgroundColor: Colors.surface,
  },
  conditionChipSelected: { borderColor: Colors.secondary, backgroundColor: `${Colors.secondary}15` },
  conditionChipText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  conditionChipTextSelected: { color: Colors.secondary, fontWeight: '700' },
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
