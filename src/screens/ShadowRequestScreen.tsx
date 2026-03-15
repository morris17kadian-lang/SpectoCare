import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useChild } from '../context/ChildContext';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../constants/theme';

type SupportType = 'school' | 'home' | 'community' | 'therapy';
type UrgencyLevel = 'routine' | 'soon' | 'urgent';

const SUPPORT_TYPES: { value: SupportType; label: string; icon: React.ComponentProps<typeof Ionicons>['name']; desc: string }[] = [
  { value: 'school', label: 'School', icon: 'school-outline', desc: 'Classroom & learning support' },
  { value: 'home', label: 'Home', icon: 'home-outline', desc: 'Daily routines & home life' },
  { value: 'community', label: 'Community', icon: 'walk-outline', desc: 'Outings & social settings' },
  { value: 'therapy', label: 'Therapy', icon: 'medical-outline', desc: 'Therapy sessions' },
];

const URGENCY_LEVELS: { value: UrgencyLevel; label: string; color: string; desc: string }[] = [
  { value: 'routine', label: 'Routine', color: Colors.success, desc: 'Within the next few weeks' },
  { value: 'soon', label: 'Soon', color: Colors.accent, desc: 'Within the next week' },
  { value: 'urgent', label: 'Urgent', color: Colors.danger, desc: 'As soon as possible' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ShadowRequestScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const { selectedChild } = useChild();

  const [supportType, setSupportType] = useState<SupportType>('school');
  const [urgency, setUrgency] = useState<UrgencyLevel>('routine');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [needs, setNeeds] = useState('');
  const [goals, setGoals] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async () => {
    if (!location.trim()) {
      Alert.alert('Missing Field', 'Please enter the location / school name.');
      return;
    }
    if (selectedDays.length === 0) {
      Alert.alert('Missing Field', 'Please select at least one day.');
      return;
    }
    if (!needs.trim()) {
      Alert.alert('Missing Field', 'Please describe the child\'s support needs.');
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={72} color={Colors.success} />
          </View>
          <Text style={styles.successTitle}>Request Submitted!</Text>
          <Text style={styles.successSub}>
            Your shadow support request has been received. A coordinator will review it and reach
            out within 2–3 business days.
          </Text>
          <View style={styles.referenceCard}>
            <Text style={styles.referenceLabel}>Reference Number</Text>
            <Text style={styles.referenceNum}>
              SR-{Date.now().toString().slice(-6)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Text style={styles.doneBtnText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shadow Request</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Child banner */}
        <View style={styles.childBanner}>
          <Ionicons name="person-circle-outline" size={36} color={Colors.primary} />
          <View style={{ flex: 1, marginLeft: Spacing.sm }}>
            <Text style={styles.childBannerName}>
              {selectedChild?.name ?? user?.displayName ?? 'Child'}
            </Text>
            <Text style={styles.childBannerSub}>Shadow support request</Text>
          </View>
        </View>

        {/* What kind of support */}
        <Text style={styles.sectionTitle}>Type of Support Needed</Text>
        <View style={styles.supportGrid}>
          {SUPPORT_TYPES.map((type) => {
            const active = supportType === type.value;
            return (
              <TouchableOpacity
                key={type.value}
                style={[styles.supportCard, active && styles.supportCardActive]}
                onPress={() => setSupportType(type.value)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={type.icon}
                  size={24}
                  color={active ? Colors.textOnPrimary : Colors.primary}
                />
                <Text style={[styles.supportLabel, active && styles.supportLabelActive]}>
                  {type.label}
                </Text>
                <Text style={[styles.supportDesc, active && styles.supportDescActive]}>
                  {type.desc}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Location */}
        <Text style={styles.sectionTitle}>Location / Venue</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Sunshine Primary School, Room 4"
          placeholderTextColor={Colors.textMuted}
          value={location}
          onChangeText={setLocation}
        />

        {/* Days */}
        <Text style={styles.sectionTitle}>Days Required</Text>
        <View style={styles.daysRow}>
          {DAYS.map((day) => {
            const selected = selectedDays.includes(day);
            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayBtn, selected && styles.dayBtnActive]}
                onPress={() => toggleDay(day)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dayBtnText, selected && styles.dayBtnTextActive]}>
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Time */}
        <Text style={styles.sectionTitle}>Session Time</Text>
        <View style={styles.timeRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.timeLabel}>Start</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 08:30"
              placeholderTextColor={Colors.textMuted}
              value={startTime}
              onChangeText={setStartTime}
            />
          </View>
          <View style={styles.timeSeparator}>
            <Ionicons name="arrow-forward" size={18} color={Colors.textMuted} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.timeLabel}>End</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 14:30"
              placeholderTextColor={Colors.textMuted}
              value={endTime}
              onChangeText={setEndTime}
            />
          </View>
        </View>

        {/* Urgency */}
        <Text style={styles.sectionTitle}>Urgency</Text>
        <View style={styles.urgencyRow}>
          {URGENCY_LEVELS.map((u) => {
            const active = urgency === u.value;
            return (
              <TouchableOpacity
                key={u.value}
                style={[
                  styles.urgencyBtn,
                  active && { backgroundColor: u.color, borderColor: u.color },
                ]}
                onPress={() => setUrgency(u.value)}
                activeOpacity={0.8}
              >
                <Text style={[styles.urgencyLabel, active && styles.urgencyLabelActive]}>
                  {u.label}
                </Text>
                <Text style={[styles.urgencyDesc, active && styles.urgencyDescActive]}>
                  {u.desc}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Support needs */}
        <Text style={styles.sectionTitle}>Support Needs *</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Describe the specific challenges and support areas — e.g. transitions between activities, verbal communication, sensory regulation..."
          placeholderTextColor={Colors.textMuted}
          value={needs}
          onChangeText={setNeeds}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Goals */}
        <Text style={styles.sectionTitle}>Goals for Shadow</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="What outcomes would you like the shadow to work towards? e.g. increase independent task completion, reduce anxiety in social settings..."
          placeholderTextColor={Colors.textMuted}
          value={goals}
          onChangeText={setGoals}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* Additional notes */}
        <Text style={styles.sectionTitle}>Additional Notes</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Any other relevant information for the shadow coordinator..."
          placeholderTextColor={Colors.textMuted}
          value={additionalNotes}
          onChangeText={setAdditionalNotes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={Colors.textOnPrimary} />
          ) : (
            <>
              <Ionicons name="send-outline" size={18} color={Colors.textOnPrimary} />
              <Text style={styles.submitBtnText}>Submit Request</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  childBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}14`,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  childBannerName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  childBannerSub: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: Spacing.sm,
    marginTop: Spacing.md,
  },

  supportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  supportCard: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: 4,
    ...Shadow.sm,
  },
  supportCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  supportLabel: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  supportLabelActive: { color: Colors.textOnPrimary },
  supportDesc: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  supportDescActive: { color: 'rgba(255,255,255,0.8)' },

  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 13,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  textarea: {
    minHeight: 90,
    paddingTop: Spacing.sm,
  },

  daysRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  dayBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  dayBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayBtnText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  dayBtnTextActive: { color: Colors.textOnPrimary },

  timeRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  timeLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  timeSeparator: {
    paddingBottom: 16,
  },

  urgencyRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  urgencyBtn: {
    flex: 1,
    borderRadius: Radius.md,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    padding: Spacing.sm,
    alignItems: 'center',
    ...Shadow.sm,
  },
  urgencyLabel: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  urgencyLabelActive: { color: Colors.textOnPrimary },
  urgencyDesc: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
  },
  urgencyDescActive: { color: 'rgba(255,255,255,0.85)' },

  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: 16,
    marginTop: Spacing.lg,
    ...Shadow.md,
  },
  btnDisabled: { opacity: 0.65 },
  submitBtnText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },

  // Success screen
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  successIcon: {
    marginBottom: Spacing.lg,
  },
  successTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  successSub: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  referenceCard: {
    backgroundColor: `${Colors.primary}14`,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.xl,
    width: '100%',
  },
  referenceLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  referenceNum: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: 2,
  },
  doneBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    paddingVertical: 14,
    paddingHorizontal: Spacing.xxl,
    ...Shadow.md,
  },
  doneBtnText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
});
