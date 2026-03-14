import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../constants/theme';

const SECTIONS = [
  {
    id: 'tantrums',
    title: 'Handling Tantrums & Meltdowns',
    icon: 'alert-circle-outline' as const,
    color: Colors.danger,
    tips: [
      'Stay calm — your emotional state directly affects your child.',
      'Identify triggers in advance (hunger, sensory overload, transitions).',
      'Create a safe, quiet space for your child to de-escalate.',
      'Avoid reasoning or explaining during a meltdown — wait until calm.',
      'Use visual cues and timers to warn of upcoming transitions.',
      'Keep a log to detect patterns and anticipate meltdowns.',
    ],
  },
  {
    id: 'routines',
    title: 'Building Effective Routines',
    icon: 'calendar-outline' as const,
    color: Colors.primary,
    tips: [
      'Keep meal, sleep, and activity times consistent every day.',
      'Use visual schedules (pictures or icons) your child can follow.',
      'Prepare your child for changes with "first-then" boards.',
      'Celebrate routine completion with positive reinforcement.',
      'Allow buffer time — rushing increases anxiety.',
      'Gradually introduce new activities into the existing routine.',
    ],
  },
  {
    id: 'communication',
    title: 'Communication Tips',
    icon: 'chatbubble-ellipses-outline' as const,
    color: Colors.secondary,
    tips: [
      'Use simple, clear sentences — one idea at a time.',
      'Give extra processing time — wait at least 10 seconds for a response.',
      'Use visual supports: pictures, sign language, or AAC devices.',
      "Build on your child's interests to encourage communication.",
      'Narrate daily activities to expand vocabulary naturally.',
      'Celebrate all communication attempts, not just words.',
    ],
  },
  {
    id: 'coping',
    title: 'Coping Strategies for Parents',
    icon: 'heart-outline' as const,
    color: Colors.success,
    tips: [
      'You cannot pour from an empty cup — prioritize your own wellbeing.',
      'Seek support from other parents through groups and communities.',
      'Break big challenges into smaller, manageable daily goals.',
      'Acknowledge and process your emotions — grief, frustration, and love can coexist.',
      'Learn to ask for help from family, friends, and professionals.',
      'Celebrate small wins — every step forward matters.',
      'Practice mindfulness or breathing exercises during stressful moments.',
    ],
  },
  {
    id: 'sensory',
    title: 'Managing Sensory Sensitivities',
    icon: 'eye-outline' as const,
    color: Colors.accent,
    tips: [
      'Observe what sensory inputs your child seeks or avoids.',
      'Create a "sensory toolkit" — noise-canceling headphones, fidget tools, weighted items.',
      'Reduce unnecessary sensory triggers in home and school environments.',
      'Work with an Occupational Therapist for a sensory diet plan.',
      'Warn your child before sensory-intense environments (malls, crowds).',
    ],
  },
];

export default function GuidanceScreen() {
  const navigation = useNavigation();
  const [expanded, setExpanded] = React.useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Parent Guidance</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Ionicons name="bulb" size={28} color={Colors.accent} />
          <Text style={styles.introText}>
            Evidence-based tips to help you and your child thrive every day.
          </Text>
        </View>

        {SECTIONS.map((section) => {
          const open = expanded === section.id;
          return (
            <View key={section.id} style={styles.card}>
              <TouchableOpacity
                style={styles.cardHeader}
                onPress={() => setExpanded(open ? null : section.id)}
                activeOpacity={0.85}
              >
                <View style={[styles.sectionIcon, { backgroundColor: `${section.color}18` }]}>
                  <Ionicons name={section.icon} size={22} color={section.color} />
                </View>
                <Text style={styles.cardTitle}>{section.title}</Text>
                <Ionicons
                  name={open ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
              {open && (
                <View style={styles.tipsContainer}>
                  {section.tips.map((tip, idx) => (
                    <View key={idx} style={styles.tipRow}>
                      <View style={[styles.tipDot, { backgroundColor: section.color }]} />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.disclaimer}>
          <Ionicons name="shield-checkmark-outline" size={18} color={Colors.textMuted} />
          <Text style={styles.disclaimerText}>
            This guidance is for informational purposes only and does not replace professional
            medical or therapy advice. Always consult qualified specialists for your child's needs.
          </Text>
        </View>
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
  intro: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.accent}12`,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  introText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, marginLeft: Spacing.sm, lineHeight: 20 },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  cardTitle: { flex: 1, fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  tipsContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  tipRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.sm },
  tipDot: { width: 7, height: 7, borderRadius: Radius.full, marginTop: 7, marginRight: Spacing.sm },
  tipText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: Spacing.md,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    padding: Spacing.md,
  },
  disclaimerText: { flex: 1, fontSize: FontSize.xs, color: Colors.textMuted, marginLeft: Spacing.sm, lineHeight: 18 },
});
