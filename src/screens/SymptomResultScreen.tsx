import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { analyzeSymptoms, SYMPTOMS } from '../services/symptomService';
import { getFacilities } from '../services/firestoreService';
import { Facility, PossibleCondition, SymptomCheckResult } from '../models';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../constants/theme';
import { HomeStackParamList } from '../navigation/TabNavigator';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'SymptomResult'>;
  route: RouteProp<HomeStackParamList, 'SymptomResult'>;
};

const SEVERITY_CONFIG = {
  low: { label: 'Monitor', color: Colors.success, bg: `${Colors.success}15` },
  moderate: { label: 'Consult Soon', color: Colors.warning, bg: `${Colors.warning}15` },
  high: { label: 'Seek Assessment', color: Colors.danger, bg: `${Colors.danger}15` },
};

export default function SymptomResultScreen({ navigation, route }: Props) {
  const { selectedSymptomIds } = route.params;
  const [result, setResult] = useState<SymptomCheckResult | null>(null);
  const [suggestedFacilities, setSuggestedFacilities] = useState<Facility[]>([]);
  const [loadingFacilities, setLoadingFacilities] = useState(true);

  const selectedSymptoms = SYMPTOMS.filter((s) => selectedSymptomIds.includes(s.id));

  useEffect(() => {
    const analysis = analyzeSymptoms(selectedSymptomIds);
    setResult(analysis);

    // Fetch facilities matching suggested types from Firestore
    getFacilities()
      .then((all) => {
        const filtered = all.filter((f) => analysis.suggestedFacilityTypes.includes(f.type));
        setSuggestedFacilities(filtered.slice(0, 6));
      })
      .finally(() => setLoadingFacilities(false));
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Analysis Results</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Selected Symptoms Summary */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="list-circle" size={22} color={Colors.primary} />
            <Text style={styles.cardTitle}>Selected Symptoms</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{selectedSymptoms.length}</Text>
            </View>
          </View>
          <View style={styles.tagWrap}>
            {selectedSymptoms.map((s) => (
              <View key={s.id} style={styles.tag}>
                <Text style={styles.tagText}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Ionicons name="shield-checkmark-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.disclaimerText}>
            The following information is for educational purposes only and does not constitute
            a medical diagnosis. Please consult a qualified healthcare professional for a
            formal assessment.
          </Text>
        </View>

        {/* Possible Conditions */}
        <Text style={styles.sectionTitle}>Possible Conditions</Text>

        {result === null ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.lg }} />
        ) : result.possibleConditions.length === 0 ? (
          <View style={styles.noResultBox}>
            <Ionicons name="checkmark-circle-outline" size={40} color={Colors.success} />
            <Text style={styles.noResultTitle}>No strong indicators found</Text>
            <Text style={styles.noResultText}>
              Based on the selected symptoms, no clear patterns were identified. Consider adding
              more symptoms or consulting your pediatrician.
            </Text>
          </View>
        ) : (
          result.possibleConditions.map((condition) => (
            <ConditionCard key={condition.name} condition={condition} />
          ))
        )}

        {/* Suggested Facilities */}
        <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>
          Recommended Specialists
        </Text>
        <Text style={styles.sectionSubtitle}>
          Based on your selected symptoms, we recommend visiting:
        </Text>

        {/* Specialist Types */}
        {result && (
          <View style={styles.typeWrap}>
            {result.suggestedFacilityTypes.map((type) => (
              <View key={type} style={styles.typeChip}>
                <Ionicons name="medkit-outline" size={14} color={Colors.primary} />
                <Text style={styles.typeChipText}>{type}</Text>
              </View>
            ))}
          </View>
        )}

        {loadingFacilities ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: Spacing.md }} />
        ) : suggestedFacilities.length > 0 ? (
          suggestedFacilities.map((facility) => (
            <TouchableOpacity
              key={facility.id}
              style={styles.facilityCard}
              onPress={() => navigation.navigate('FacilityDetail', { facilityId: facility.id })}
              activeOpacity={0.85}
            >
              <View style={styles.facilityIconWrap}>
                <Ionicons name="business-outline" size={24} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.facilityName}>{facility.name}</Text>
                <Text style={styles.facilityType}>{facility.type}</Text>
                <Text style={styles.facilityLocation} numberOfLines={1}>
                  <Ionicons name="location-outline" size={12} /> {facility.address}, {facility.city}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ))
        ) : (
          <View style={[styles.noResultBox, { backgroundColor: Colors.surfaceAlt }]}>
            <Ionicons name="location-outline" size={32} color={Colors.textMuted} />
            <Text style={styles.noResultText}>
              No facilities found in database yet. Check the Facilities tab for all available
              centers.
            </Text>
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity
          style={styles.facilityBtn}
          onPress={() => navigation.navigate('Facilities' as any)}
        >
          <Ionicons name="location" size={18} color={Colors.textOnPrimary} style={{ marginRight: 6 }} />
          <Text style={styles.facilityBtnText}>View All Facilities</Text>
        </TouchableOpacity>

        <View style={{ height: Spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ConditionCard({ condition }: { condition: PossibleCondition }) {
  const { label, color, bg } = SEVERITY_CONFIG[condition.severity];
  return (
    <View style={[styles.condCard, { borderLeftColor: color }]}>
      <View style={styles.condHeader}>
        <Text style={styles.condName}>{condition.name}</Text>
        <View style={[styles.severityBadge, { backgroundColor: bg }]}>
          <Text style={[styles.severityText, { color }]}>{label}</Text>
        </View>
      </View>
      <Text style={styles.condDesc}>{condition.description}</Text>
      <View style={styles.matchRow}>
        <Ionicons name="checkmark-circle" size={14} color={color} />
        <Text style={[styles.matchText, { color }]}>
          {condition.matchCount} matching indicator{condition.matchCount > 1 ? 's' : ''}
        </Text>
      </View>
    </View>
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
  scroll: { padding: Spacing.lg },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginLeft: Spacing.sm,
    flex: 1,
  },
  countBadge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countBadgeText: { color: Colors.textOnPrimary, fontSize: FontSize.xs, fontWeight: '800' },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: {
    backgroundColor: `${Colors.primary}15`,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    margin: 3,
  },
  tagText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '600' },
  disclaimerBox: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: Colors.textMuted,
  },
  disclaimerText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  condCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderLeftWidth: 4,
    ...Shadow.sm,
  },
  condHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  condName: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  severityBadge: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
  },
  severityText: { fontSize: FontSize.xs, fontWeight: '700' },
  condDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.sm,
  },
  matchRow: { flexDirection: 'row', alignItems: 'center' },
  matchText: { fontSize: FontSize.xs, fontWeight: '600', marginLeft: 4 },
  noResultBox: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.md,
  },
  noResultTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  noResultText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  typeWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: Spacing.md },
  typeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}12`,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    margin: 3,
  },
  typeChipText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '600', marginLeft: 4 },
  facilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    ...Shadow.sm,
  },
  facilityIconWrap: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  facilityName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  facilityType: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '600', marginTop: 1 },
  facilityLocation: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  facilityBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.secondary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  facilityBtnText: { color: Colors.textOnPrimary, fontSize: FontSize.md, fontWeight: '700' },
});
