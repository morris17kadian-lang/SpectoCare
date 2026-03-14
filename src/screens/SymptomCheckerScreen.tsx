import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SYMPTOMS } from '../services/symptomService';
import { Symptom, SymptomCategory } from '../models';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../constants/theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CATEGORY_META: Record<
  SymptomCategory,
  { icon: React.ComponentProps<typeof Ionicons>['name']; color: string }
> = {
  Communication: { icon: 'chatbubble-ellipses-outline', color: Colors.primary },
  Behavior: { icon: 'alert-circle-outline', color: Colors.danger },
  Social: { icon: 'people-outline', color: Colors.secondary },
  Sensory: { icon: 'eye-outline', color: Colors.accent },
  Cognitive: { icon: 'bulb-outline', color: Colors.success },
  Motor: { icon: 'body-outline', color: Colors.primaryLight },
};

const CATEGORIES: SymptomCategory[] = [
  'Communication',
  'Behavior',
  'Social',
  'Sensory',
  'Cognitive',
  'Motor',
];

export default function SymptomCheckerScreen() {
  const navigation = useNavigation<Nav>();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<SymptomCategory | 'All'>('All');

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filteredSymptoms =
    activeCategory === 'All'
      ? SYMPTOMS
      : SYMPTOMS.filter((s) => s.category === activeCategory);

  const handleAnalyze = () => {
    if (selectedIds.size === 0) {
      Alert.alert('No Symptoms Selected', 'Please select at least one symptom to analyze.');
      return;
    }
    navigation.navigate('SymptomResult', { selectedSymptomIds: Array.from(selectedIds) });
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Symptom Checker</Text>
          <Text style={styles.subtitle}>Select all symptoms you have observed</Text>
        </View>
        {selectedIds.size > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{selectedIds.size}</Text>
          </View>
        )}
      </View>

      {/* Disclaimer */}
      <View style={styles.disclaimer}>
        <Ionicons name="information-circle-outline" size={16} color={Colors.primary} />
        <Text style={styles.disclaimerText}>
          This is not a medical diagnosis. Always consult a qualified professional.
        </Text>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {(['All', ...CATEGORIES] as (SymptomCategory | 'All')[]).map((cat) => {
          const isActive = activeCategory === cat;
          const meta = cat !== 'All' ? CATEGORY_META[cat] : null;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.catChip, isActive && styles.catChipActive]}
              onPress={() => setActiveCategory(cat)}
              activeOpacity={0.8}
            >
              {meta && (
                <Ionicons
                  name={meta.icon}
                  size={14}
                  color={isActive ? Colors.textOnPrimary : meta.color}
                  style={{ marginRight: 4 }}
                />
              )}
              <Text style={[styles.catChipText, isActive && styles.catChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Symptom List */}
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {CATEGORIES.filter((c) => activeCategory === 'All' || c === activeCategory).map(
          (category) => {
            const symptoms = filteredSymptoms.filter((s) => s.category === category);
            if (symptoms.length === 0) return null;
            const meta = CATEGORY_META[category];
            return (
              <View key={category} style={styles.categorySection}>
                {/* Category Header */}
                <View style={styles.categoryHeader}>
                  <View style={[styles.categoryIconWrap, { backgroundColor: `${meta.color}18` }]}>
                    <Ionicons name={meta.icon} size={18} color={meta.color} />
                  </View>
                  <Text style={[styles.categoryTitle, { color: meta.color }]}>{category}</Text>
                </View>

                {/* Symptom Cards */}
                {symptoms.map((symptom) => {
                  const selected = selectedIds.has(symptom.id);
                  return (
                    <SymptomCard
                      key={symptom.id}
                      symptom={symptom}
                      selected={selected}
                      color={meta.color}
                      onPress={() => toggle(symptom.id)}
                    />
                  );
                })}
              </View>
            );
          }
        )}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={styles.footer}>
        {selectedIds.size > 0 && (
          <Text style={styles.footerHint}>
            {selectedIds.size} symptom{selectedIds.size > 1 ? 's' : ''} selected
          </Text>
        )}
        <TouchableOpacity
          style={[styles.analyzeBtn, selectedIds.size === 0 && styles.analyzeBtnDisabled]}
          onPress={handleAnalyze}
          activeOpacity={0.85}
        >
          <Ionicons name="search" size={20} color={Colors.textOnPrimary} style={{ marginRight: Spacing.sm }} />
          <Text style={styles.analyzeBtnText}>Analyze Symptoms</Text>
        </TouchableOpacity>
        {selectedIds.size > 0 && (
          <TouchableOpacity onPress={() => setSelectedIds(new Set())} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

function SymptomCard({
  symptom,
  selected,
  color,
  onPress,
}: {
  symptom: Symptom;
  selected: boolean;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.symptomCard, selected && { borderColor: color, borderWidth: 2 }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.symptomContent}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.symptomLabel, selected && { color }]}>{symptom.label}</Text>
          <Text style={styles.symptomDesc} numberOfLines={2}>
            {symptom.description}
          </Text>
        </View>
        <View
          style={[
            styles.checkbox,
            selected && { backgroundColor: color, borderColor: color },
          ]}
        >
          {selected && <Ionicons name="checkmark" size={16} color={Colors.textOnPrimary} />}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  badge: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: { color: Colors.textOnPrimary, fontSize: FontSize.sm, fontWeight: '800' },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}12`,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  disclaimerText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.primary,
    marginLeft: Spacing.xs,
    lineHeight: 16,
  },
  categoryScroll: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  catChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  catChipText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  catChipTextActive: { color: Colors.textOnPrimary },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
  categorySection: { marginBottom: Spacing.md },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  categoryIconWrap: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  categoryTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  symptomCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  symptomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  symptomLabel: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  symptomDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: Radius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.md,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  footerHint: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  analyzeBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzeBtnDisabled: { backgroundColor: Colors.textMuted },
  analyzeBtnText: {
    color: Colors.textOnPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  clearBtn: { alignItems: 'center', marginTop: Spacing.sm },
  clearBtnText: { fontSize: FontSize.sm, color: Colors.textSecondary },
});
