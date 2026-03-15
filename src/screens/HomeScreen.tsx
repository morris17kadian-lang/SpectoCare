import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useChild } from '../context/ChildContext';
import { getChildren } from '../services/firestoreService';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../constants/theme';
import { HomeStackParamList } from '../navigation/TabNavigator';
import { Child } from '../models';

type Nav = NativeStackNavigationProp<HomeStackParamList>;

const QUICK_ACTIONS = [
  { label: 'Check Symptoms', icon: 'medical', route: 'SymptomChecker', color: Colors.danger, needsChild: false },
  { label: 'Find Facility', icon: 'location', route: 'Facilities', color: Colors.primary, needsChild: false },
  { label: 'Daily Routine', icon: 'calendar', route: 'Routine', color: Colors.secondary, needsChild: true },
  { label: 'Log Behavior', icon: 'stats-chart', route: 'BehaviorTracker', color: Colors.accent, needsChild: true },
  { label: 'Journal', icon: 'book', route: 'Journal', color: Colors.success, needsChild: true },
  { label: 'Guidance', icon: 'bulb', route: 'Guidance', color: Colors.primaryLight, needsChild: false },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const { selectedChild, setChildren } = useChild();
  const navigation = useNavigation<Nav>();
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [children, setLocalChildren] = useState<Child[]>([]);

  useEffect(() => {
    if (!user) return;
    getChildren(user.uid)
      .then((data) => {
        setLocalChildren(data);
        setChildren(data);
      })
      .finally(() => setLoadingChildren(false));
  }, [user]);

  const firstName = user?.displayName?.split(' ')[0] ?? 'Parent';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          {/* Left – notifications */}
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="notifications-outline" size={22} color={Colors.textSecondary} />
          </TouchableOpacity>

          {/* Centre – greeting */}
          <View style={styles.headerCenter}>
            <Text style={styles.greeting}>Hello, {firstName} 👋</Text>
            <Text style={styles.tagline}>Let's support your child today</Text>
          </View>

          {/* Right – profile */}
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => (navigation.getParent() as any)?.navigate('Settings')}
          >
            <Ionicons name="person-circle-outline" size={26} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions — edge-to-edge 3D circles */}
        <View style={styles.actionsRow}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={styles.actionItem}
              onPress={() => {
                if (!action.needsChild) {
                  navigation.navigate(action.route as any);
                } else if (selectedChild) {
                  navigation.navigate(action.route as any, {
                    childId: selectedChild.id,
                    childName: selectedChild.name,
                  });
                } else {
                  navigation.navigate('Children');
                }
              }}
              activeOpacity={0.75}
            >
              <View style={[styles.actionCircle, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon as any} size={22} color="#fff" />
              </View>
              <Text style={styles.actionLabel} numberOfLines={2}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Child Banner */}
        {selectedChild ? (
          <View style={styles.childBanner}>
            <View style={styles.childAvatar}>
              <Ionicons name="person" size={28} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.childBannerName}>{selectedChild.name}</Text>
              <Text style={styles.childBannerSub}>
                {selectedChild.condition ?? 'No condition recorded'} ·{' '}
                {calculateAge(selectedChild.dateOfBirth)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Children' as any)}>
              <Text style={styles.switchText}>Switch</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addChildBanner}
            onPress={() => navigation.navigate('ChildForm', {})}
          >
            <Ionicons name="add-circle-outline" size={28} color={Colors.primary} />
            <Text style={styles.addChildText}>Add your first child to get started</Text>
          </TouchableOpacity>
        )}

        {/* Tips Card */}
        <View style={styles.tipCard}>
          <Ionicons name="bulb-outline" size={22} color={Colors.accent} />
          <View style={{ flex: 1, marginLeft: Spacing.sm }}>
            <Text style={styles.tipTitle}>Daily Tip</Text>
            <Text style={styles.tipText}>
              A consistent daily routine helps reduce anxiety in children with ASD. Try to keep
              wake-up, meal, and bedtime at the same time every day.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function calculateAge(dob: string): string {
  const birth = new Date(dob);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  const totalMonths = years * 12 + months;
  if (totalMonths >= 24) return `${years} yrs`;
  if (totalMonths >= 12) return `${years} yr ${Math.abs(months)} mo`;
  return `${totalMonths} months`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xl },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerIconBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: Spacing.sm,
  },
  greeting: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  tagline: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2, textAlign: 'center' },
  childBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    ...Shadow.sm,
  },
  childAvatar: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    backgroundColor: `${Colors.primary}18`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  childBannerName: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  childBannerSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  switchText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  addChildBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}12`,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1.5,
    borderColor: `${Colors.primary}30`,
    borderStyle: 'dashed',
  },
  addChildText: {
    fontSize: FontSize.md,
    color: Colors.primary,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  // Quick actions edge-to-edge
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  actionItem: {
    flex: 1,
    alignItems: 'center',
  },
  actionCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.22,
    shadowRadius: 5,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderLeftWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.5)',
    borderLeftColor: 'rgba(255,255,255,0.3)',
    borderBottomWidth: 3,
    borderRightWidth: 2,
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderRightColor: 'rgba(0,0,0,0.12)',
  },
  actionLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 13,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: `${Colors.accent}12`,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
  },
  tipTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.accent,
    marginBottom: 4,
  },
  tipText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
