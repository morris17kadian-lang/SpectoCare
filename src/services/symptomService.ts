import { Symptom, FacilityType, SymptomCheckResult, PossibleCondition } from '../models';

// ─── Symptom Dataset ────────────────────────────────────────

export const SYMPTOMS: Symptom[] = [
  {
    id: 'speech_delay',
    label: 'Speech Delay',
    description: 'Late or limited development of spoken language',
    category: 'Communication',
    relatedConditions: ['Autism Spectrum Disorder', 'Language Disorder', 'Hearing Loss'],
    suggestedFacilityTypes: ['Speech Therapist', 'Audiologist', 'Pediatrician'] as FacilityType[],
  },
  {
    id: 'no_eye_contact',
    label: 'Avoids Eye Contact',
    description: 'Difficulty or refusal to make eye contact',
    category: 'Social',
    relatedConditions: ['Autism Spectrum Disorder', 'Social Anxiety'],
    suggestedFacilityTypes: ['Psychologist', 'Autism Center'] as FacilityType[],
  },
  {
    id: 'repetitive_behavior',
    label: 'Repetitive Behaviors',
    description: 'Repeating actions, words, or movements (e.g., rocking, flapping)',
    category: 'Behavior',
    relatedConditions: ['Autism Spectrum Disorder', 'OCD', 'Sensory Processing Disorder'],
    suggestedFacilityTypes: ['Autism Center', 'Psychologist', 'Occupational Therapist'] as FacilityType[],
  },
  {
    id: 'hyperactivity',
    label: 'Hyperactivity',
    description: 'Excessive movement, restlessness, or inability to stay still',
    category: 'Behavior',
    relatedConditions: ['ADHD', 'Autism Spectrum Disorder'],
    suggestedFacilityTypes: ['Pediatrician', 'Psychologist'] as FacilityType[],
  },
  {
    id: 'aggression',
    label: 'Aggressive Behavior',
    description: 'Physical or verbal aggression toward others or self',
    category: 'Behavior',
    relatedConditions: ['ADHD', 'Autism Spectrum Disorder', 'Conduct Disorder'],
    suggestedFacilityTypes: ['Psychologist', 'Autism Center'] as FacilityType[],
  },
  {
    id: 'sensory_issues',
    label: 'Sensory Sensitivities',
    description: 'Over- or under-sensitivity to light, sound, touch, or textures',
    category: 'Sensory',
    relatedConditions: ['Sensory Processing Disorder', 'Autism Spectrum Disorder'],
    suggestedFacilityTypes: ['Occupational Therapist', 'Autism Center'] as FacilityType[],
  },
  {
    id: 'social_difficulty',
    label: 'Social Difficulty',
    description: 'Challenges making friends or engaging in social interactions',
    category: 'Social',
    relatedConditions: ['Autism Spectrum Disorder', 'Social Anxiety', 'ADHD'],
    suggestedFacilityTypes: ['Psychologist', 'Autism Center', 'Special Education School'] as FacilityType[],
  },
  {
    id: 'learning_difficulty',
    label: 'Learning Difficulty',
    description: 'Struggles with reading, writing, or academic tasks',
    category: 'Cognitive',
    relatedConditions: ['Dyslexia', 'ADHD', 'Intellectual Disability'],
    suggestedFacilityTypes: ['Special Education School', 'Psychologist', 'Pediatrician'] as FacilityType[],
  },
  {
    id: 'poor_attention',
    label: 'Poor Attention Span',
    description: 'Unable to focus or concentrate for extended periods',
    category: 'Cognitive',
    relatedConditions: ['ADHD', 'Autism Spectrum Disorder'],
    suggestedFacilityTypes: ['Pediatrician', 'Psychologist'] as FacilityType[],
  },
  {
    id: 'tantrum',
    label: 'Frequent Tantrums / Meltdowns',
    description: 'Intense emotional outbursts that are hard to manage',
    category: 'Behavior',
    relatedConditions: ['Autism Spectrum Disorder', 'ADHD', 'Sensory Processing Disorder'],
    suggestedFacilityTypes: ['Psychologist', 'Autism Center'] as FacilityType[],
  },
  {
    id: 'delayed_milestones',
    label: 'Delayed Developmental Milestones',
    description: 'Late to walk, talk, or achieve age-expected development stages',
    category: 'Motor',
    relatedConditions: ['Global Developmental Delay', 'Autism Spectrum Disorder'],
    suggestedFacilityTypes: ['Pediatrician', 'Occupational Therapist', 'Speech Therapist'] as FacilityType[],
  },
  {
    id: 'poor_motor',
    label: 'Poor Motor Coordination',
    description: 'Clumsiness, difficulty with fine or gross motor tasks',
    category: 'Motor',
    relatedConditions: ['Developmental Coordination Disorder', 'Autism Spectrum Disorder'],
    suggestedFacilityTypes: ['Occupational Therapist', 'Pediatrician'] as FacilityType[],
  },
];

// ─── Condition Rules ────────────────────────────────────────

interface ConditionRule {
  name: string;
  description: string;
  triggerSymptomIds: string[];
  minMatchCount: number;
  severity: 'low' | 'moderate' | 'high';
}

const CONDITION_RULES: ConditionRule[] = [
  {
    name: 'Autism Spectrum Disorder (ASD)',
    description:
      'A developmental condition affecting social communication, behavior, and sensory processing. A formal assessment by a qualified professional is required for diagnosis.',
    triggerSymptomIds: [
      'speech_delay',
      'no_eye_contact',
      'repetitive_behavior',
      'sensory_issues',
      'social_difficulty',
      'tantrum',
      'poor_attention',
    ],
    minMatchCount: 3,
    severity: 'high',
  },
  {
    name: 'ADHD (Attention Deficit Hyperactivity Disorder)',
    description:
      'A neurodevelopmental disorder characterized by inattention, hyperactivity, and impulsivity. Diagnosis requires professional evaluation.',
    triggerSymptomIds: ['hyperactivity', 'poor_attention', 'aggression', 'social_difficulty', 'tantrum'],
    minMatchCount: 2,
    severity: 'moderate',
  },
  {
    name: 'Sensory Processing Disorder',
    description:
      'A condition where the brain has trouble processing sensory information, affecting responses to stimuli.',
    triggerSymptomIds: ['sensory_issues', 'repetitive_behavior', 'tantrum', 'poor_motor'],
    minMatchCount: 2,
    severity: 'moderate',
  },
  {
    name: 'Global Developmental Delay',
    description:
      'Significant delays across multiple areas of development compared to peers of the same age.',
    triggerSymptomIds: ['delayed_milestones', 'speech_delay', 'poor_motor', 'learning_difficulty'],
    minMatchCount: 2,
    severity: 'high',
  },
  {
    name: 'Language Disorder',
    description:
      'Persistent difficulty with spoken language acquisition and use that impacts communication.',
    triggerSymptomIds: ['speech_delay', 'social_difficulty', 'learning_difficulty'],
    minMatchCount: 2,
    severity: 'moderate',
  },
  {
    name: 'Dyslexia / Learning Disorder',
    description:
      'A specific learning difficulty affecting reading, spelling, and writing abilities.',
    triggerSymptomIds: ['learning_difficulty', 'poor_attention', 'delayed_milestones'],
    minMatchCount: 1,
    severity: 'low',
  },
];

// ─── Analyzer ────────────────────────────────────────────────

export const analyzeSymptoms = (selectedIds: string[]): SymptomCheckResult => {
  const conditions: PossibleCondition[] = [];
  const facilityTypeSet = new Set<FacilityType>();

  // Collect suggested facilities from selected symptoms
  SYMPTOMS.filter((s) => selectedIds.includes(s.id)).forEach((s) => {
    s.suggestedFacilityTypes.forEach((ft) => facilityTypeSet.add(ft));
  });

  // Match condition rules
  CONDITION_RULES.forEach((rule) => {
    const matchCount = rule.triggerSymptomIds.filter((id) =>
      selectedIds.includes(id)
    ).length;
    if (matchCount >= rule.minMatchCount) {
      conditions.push({
        name: rule.name,
        description: rule.description,
        matchCount,
        severity: rule.severity,
      });
    }
  });

  // Sort by matchCount descending
  conditions.sort((a, b) => b.matchCount - a.matchCount);

  return {
    possibleConditions: conditions,
    suggestedFacilityTypes: Array.from(facilityTypeSet),
  };
};
