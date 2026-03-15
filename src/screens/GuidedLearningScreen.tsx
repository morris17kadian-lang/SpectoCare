import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Lesson = {
  id: string;
  title: string;
  duration: string;
  summary: string;
  tips: string[];
};

type Module = {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  lessons: Lesson[];
};

const MODULES: Module[] = [
  {
    id: 'communication',
    title: 'Communication Strategies',
    icon: 'chatbubble-ellipses-outline',
    color: Colors.primary,
    lessons: [
      {
        id: 'c1',
        title: 'Using Visual Supports',
        duration: '5 min read',
        summary:
          'Visual supports such as picture cards, schedules, and social stories can dramatically improve communication for children with ASD.',
        tips: [
          'Use simple images alongside words for requests.',
          'Create a printed daily schedule the child can reference.',
          'Pair every verbal instruction with a visual cue.',
          'Gradually fade visuals as verbal understanding grows.',
        ],
      },
      {
        id: 'c2',
        title: 'PECS Basics',
        duration: '6 min read',
        summary:
          "The Picture Exchange Communication System (PECS) helps non-verbal or minimally verbal children initiate communication by exchanging a picture for a desired item.",
        tips: [
          'Start with a single highly motivating item.',
          'Reward exchanges immediately and enthusiastically.',
          'Progress through the 6 PECS phases at the child\'s pace.',
          'Involve all caregivers for consistency.',
        ],
      },
      {
        id: 'c3',
        title: 'Augmentative & Alternative Communication (AAC)',
        duration: '7 min read',
        summary:
          'AAC tools range from low-tech symbol boards to high-tech speech-generating devices and can give a voice to children who struggle with spoken language.',
        tips: [
          'Model AAC use yourself before expecting the child to.',
          'Never take the AAC device away as a punishment.',
          'Start with core vocabulary words (want, more, stop, help).',
          'Consult a speech-language pathologist for device selection.',
        ],
      },
    ],
  },
  {
    id: 'social',
    title: 'Social Skills Development',
    icon: 'people-outline',
    color: Colors.secondary,
    lessons: [
      {
        id: 's1',
        title: 'Social Stories',
        duration: '5 min read',
        summary:
          'Social stories are short, personalised narratives that describe social situations and appropriate responses, helping children predict and prepare for new experiences.',
        tips: [
          'Write stories in the first person from the child\'s perspective.',
          'Use a ratio of 2–5 descriptive/perspective sentences for every directive sentence.',
          'Include illustrations or photos.',
          'Review the story before the relevant situation occurs.',
        ],
      },
      {
        id: 's2',
        title: 'Turn-Taking & Play',
        duration: '4 min read',
        summary:
          'Learning to take turns is a foundational social skill. Structured games and visual timers can make the concept concrete.',
        tips: [
          'Start with simple two-player turn-taking games.',
          'Use a physical object (e.g. a "talking stick") to signal whose turn it is.',
          'Praise waiting and turn-taking immediately.',
          'Gradually increase the number of players.',
        ],
      },
      {
        id: 's3',
        title: 'Understanding Emotions',
        duration: '6 min read',
        summary:
          'Building an emotion vocabulary helps children identify and communicate their feelings before they reach a point of overwhelm.',
        tips: [
          'Use emotion charts and mirror games to label facial expressions.',
          'Name your own emotions aloud throughout the day.',
          'Read books that focus on characters\' feelings.',
          'Create a personalised "feelings thermometer" with the child.',
        ],
      },
    ],
  },
  {
    id: 'behavior',
    title: 'Behaviour Support',
    icon: 'stats-chart-outline',
    color: Colors.accent,
    lessons: [
      {
        id: 'b1',
        title: 'Positive Reinforcement',
        duration: '5 min read',
        summary:
          'Systematically rewarding desired behaviours is one of the most evidence-based strategies for increasing positive behaviours in children with ASD.',
        tips: [
          'Identify the child\'s top motivators (food, praise, toys, screen time).',
          'Deliver reinforcement immediately after the target behaviour.',
          'Be specific — "Great job asking with words!" not just "Good job!".',
          'Use a token board to build towards larger rewards.',
        ],
      },
      {
        id: 'b2',
        title: 'Managing Meltdowns',
        duration: '8 min read',
        summary:
          "Meltdowns are not tantrums — they are neurological overloads. Understanding triggers and early warning signs allows you to intervene before escalation.",
        tips: [
          'Identify the child\'s personal warning signs (pacing, humming, ear-covering).',
          'Create a calm-down kit with sensory tools the child finds regulating.',
          'Reduce demands immediately when signs appear.',
          'Debrief calmly only after the child has fully recovered.',
        ],
      },
      {
        id: 'b3',
        title: 'Sensory-Informed Strategies',
        duration: '6 min read',
        summary:
          'Many challenging behaviours are driven by sensory sensitivities. A sensory-informed approach addresses the root cause rather than just the behaviour.',
        tips: [
          'Work with an OT to identify hyper- and hypo-sensitivities.',
          'Offer sensory breaks before the child reaches overload.',
          'Modify the environment (lighting, noise, seating).',
          'Teach the child to self-advocate for sensory needs.',
        ],
      },
    ],
  },
  {
    id: 'family',
    title: 'Family & Caregiver Wellbeing',
    icon: 'heart-outline',
    color: Colors.danger,
    lessons: [
      {
        id: 'f1',
        title: 'Preventing Caregiver Burnout',
        duration: '5 min read',
        summary:
          'Caring for a child with ASD is rewarding but exhausting. Proactively managing your own wellbeing is not selfish — it is essential for sustained quality care.',
        tips: [
          'Schedule regular respite care, even for short periods.',
          'Connect with other ASD caregivers — online or in-person.',
          'Set realistic expectations and celebrate small wins.',
          'Seek professional support if you notice persistent low mood.',
        ],
      },
      {
        id: 'f2',
        title: 'Explaining ASD to Siblings',
        duration: '4 min read',
        summary:
          "Siblings often feel confused, overlooked, or embarrassed. Age-appropriate, honest conversations help them become the child's greatest allies.",
        tips: [
          'Use simple language: "Their brain works differently."',
          'Validate the sibling\'s feelings — frustration and pride can coexist.',
          'Create dedicated one-on-one time for each child.',
          'Involve siblings in therapy or learning activities when appropriate.',
        ],
      },
    ],
  },
];

export default function GuidedLearningScreen() {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const toggleModule = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedModule((prev) => (prev === id ? null : id));
    setExpandedLesson(null);
  };

  const toggleLesson = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedLesson((prev) => (prev === id ? null : id));
  };

  const markComplete = (lessonId: string) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) next.delete(lessonId);
      else next.add(lessonId);
      return next;
    });
  };

  const totalLessons = MODULES.reduce((sum, m) => sum + m.lessons.length, 0);
  const completedCount = completedLessons.size;
  const progress = totalLessons > 0 ? completedCount / totalLessons : 0;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        {canGoBack ? (
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 40 }} />
        )}
        <Text style={styles.headerTitle}>Guided Learning</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Progress banner */}
        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <Ionicons name="school-outline" size={22} color={Colors.primary} />
            <Text style={styles.progressLabel}>
              {completedCount} / {totalLessons} lessons completed
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {/* Modules */}
        {MODULES.map((module) => {
          const isModuleOpen = expandedModule === module.id;
          const moduleDone = module.lessons.filter((l) => completedLessons.has(l.id)).length;

          return (
            <View key={module.id} style={styles.moduleCard}>
              <TouchableOpacity
                style={styles.moduleHeader}
                onPress={() => toggleModule(module.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.moduleIcon, { backgroundColor: `${module.color}18` }]}>
                  <Ionicons name={module.icon} size={22} color={module.color} />
                </View>
                <View style={{ flex: 1, marginLeft: Spacing.md }}>
                  <Text style={styles.moduleTitle}>{module.title}</Text>
                  <Text style={styles.moduleMeta}>
                    {module.lessons.length} lessons · {moduleDone} done
                  </Text>
                </View>
                <Ionicons
                  name={isModuleOpen ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>

              {isModuleOpen &&
                module.lessons.map((lesson) => {
                  const isLessonOpen = expandedLesson === lesson.id;
                  const done = completedLessons.has(lesson.id);

                  return (
                    <View key={lesson.id} style={styles.lessonContainer}>
                      <TouchableOpacity
                        style={styles.lessonRow}
                        onPress={() => toggleLesson(lesson.id)}
                        activeOpacity={0.8}
                      >
                        <TouchableOpacity
                          style={[styles.checkCircle, done && styles.checkCircleDone]}
                          onPress={() => markComplete(lesson.id)}
                        >
                          {done && <Ionicons name="checkmark" size={14} color="#fff" />}
                        </TouchableOpacity>
                        <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                          <Text style={[styles.lessonTitle, done && styles.lessonTitleDone]}>
                            {lesson.title}
                          </Text>
                          <Text style={styles.lessonDuration}>{lesson.duration}</Text>
                        </View>
                        <Ionicons
                          name={isLessonOpen ? 'chevron-up' : 'chevron-down'}
                          size={16}
                          color={Colors.textMuted}
                        />
                      </TouchableOpacity>

                      {isLessonOpen && (
                        <View style={styles.lessonBody}>
                          <Text style={styles.lessonSummary}>{lesson.summary}</Text>
                          <Text style={styles.tipsHeading}>Key Tips</Text>
                          {lesson.tips.map((tip, i) => (
                            <View key={i} style={styles.tipRow}>
                              <View style={[styles.tipDot, { backgroundColor: module.color }]} />
                              <Text style={styles.tipText}>{tip}</Text>
                            </View>
                          ))}
                          <TouchableOpacity
                            style={[
                              styles.completeBtn,
                              { backgroundColor: done ? Colors.success : module.color },
                            ]}
                            onPress={() => markComplete(lesson.id)}
                          >
                            <Ionicons
                              name={done ? 'checkmark-circle' : 'checkmark-circle-outline'}
                              size={18}
                              color="#fff"
                            />
                            <Text style={styles.completeBtnText}>
                              {done ? 'Completed' : 'Mark as Complete'}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  );
                })}
            </View>
          );
        })}
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

  progressCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadow.sm,
  },
  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  progressLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
  },

  moduleCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  moduleIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moduleTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  moduleMeta: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },

  lessonContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleDone: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  lessonTitle: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  lessonTitleDone: {
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  lessonDuration: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },

  lessonBody: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surfaceAlt,
  },
  lessonSummary: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  tipsHeading: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  tipDot: {
    width: 7,
    height: 7,
    borderRadius: Radius.full,
    marginTop: 6,
    marginRight: Spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.md,
  },
  completeBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FontSize.sm,
  },
});
