import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getFacilities } from '../services/firestoreService';
import { Facility, FacilityType } from '../models';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../constants/theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const FACILITY_TYPES: (FacilityType | 'All')[] = [
  'All',
  'Autism Center',
  'Psychologist',
  'Speech Therapist',
  'Occupational Therapist',
  'Pediatrician',
  'Special Education School',
];

const TYPE_ICONS: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  'Autism Center': 'heart-circle-outline',
  Psychologist: 'brain-outline' as any,
  'Speech Therapist': 'chatbubble-outline',
  'Occupational Therapist': 'hand-left-outline',
  Pediatrician: 'medkit-outline',
  'Special Education School': 'school-outline',
  All: 'apps-outline',
};

export default function FacilitiesScreen() {
  const navigation = useNavigation<Nav>();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<FacilityType | 'All'>('All');

  useFocusEffect(
    useCallback(() => {
      getFacilities()
        .then(setFacilities)
        .finally(() => setLoading(false));
    }, [])
  );

  const filtered = facilities.filter((f) => {
    const matchesType = activeType === 'All' || f.type === activeType;
    const matchesSearch =
      !search ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.city.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Facilities</Text>
        <Text style={styles.subtitle}>Assessment & therapy centers near you</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or city..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Type filter */}
      <FlatList
        horizontal
        data={FACILITY_TYPES}
        keyExtractor={(t) => t}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        renderItem={({ item }) => {
          const active = activeType === item;
          return (
            <TouchableOpacity
              style={[styles.filterChip, active && styles.filterChipActive]}
              onPress={() => setActiveType(item as any)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={TYPE_ICONS[item] ?? 'business-outline'}
                size={14}
                color={active ? Colors.textOnPrimary : Colors.primary}
                style={{ marginRight: 4 }}
              />
              <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} color={Colors.primary} />
      ) : filtered.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="location-outline" size={56} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No facilities found</Text>
          <Text style={styles.emptyText}>
            {facilities.length === 0
              ? 'No facilities have been added to the database yet.'
              : 'Try a different search or filter.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(f) => f.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('FacilityDetail', { facilityId: item.id })}
              activeOpacity={0.85}
            >
              <View style={styles.cardIcon}>
                <Ionicons
                  name={TYPE_ICONS[item.type] ?? 'business-outline'}
                  size={26}
                  color={Colors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  {item.isVerified && (
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                  )}
                </View>
                <Text style={styles.cardType}>{item.type}</Text>
                <Text style={styles.cardAddress} numberOfLines={1}>
                  {item.address}, {item.city}
                </Text>
                {item.phone && (
                  <Text style={styles.cardPhone}>{item.phone}</Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2, marginBottom: Spacing.md },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  searchIcon: { marginRight: Spacing.sm },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary },
  filterScroll: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.sm },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.textSecondary },
  filterChipTextActive: { color: Colors.textOnPrimary },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, marginTop: Spacing.md },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm },
  list: { padding: Spacing.lg },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  cardIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    backgroundColor: `${Colors.primary}12`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  cardTopRow: { flexDirection: 'row', alignItems: 'center' },
  cardName: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginRight: 4,
  },
  cardType: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '600', marginTop: 1 },
  cardAddress: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  cardPhone: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
});
