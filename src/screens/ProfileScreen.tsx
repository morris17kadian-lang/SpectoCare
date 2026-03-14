import React from 'react';
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
import { useAuth } from '../context/AuthContext';
import { useChild } from '../context/ChildContext';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../constants/theme';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { selectedChild } = useChild();
  const navigation = useNavigation<Nav>();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  const MENU_ITEMS = [
    {
      label: 'My Children',
      icon: 'people-outline',
      onPress: () => navigation.navigate('Children' as any),
    },
    ...(selectedChild
      ? [
          {
            label: 'Daily Routines',
            icon: 'calendar-outline',
            onPress: () =>
              navigation.navigate('Routine', {
                childId: selectedChild.id,
                childName: selectedChild.name,
              }),
          },
          {
            label: 'Behavior Tracker',
            icon: 'stats-chart-outline',
            onPress: () =>
              navigation.navigate('BehaviorTracker', {
                childId: selectedChild.id,
                childName: selectedChild.name,
              }),
          },
          {
            label: 'Parent Journal',
            icon: 'book-outline',
            onPress: () =>
              navigation.navigate('Journal', {
                childId: selectedChild.id,
                childName: selectedChild.name,
              }),
          },
        ]
      : []),
    {
      label: 'Guidance & Tips',
      icon: 'bulb-outline',
      onPress: () => navigation.navigate('Guidance'),
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.displayName ?? 'P').charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.userName}>{user?.displayName ?? 'Parent'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {selectedChild && (
            <View style={styles.activeChildBadge}>
              <Ionicons name="person" size={12} color={Colors.primary} />
              <Text style={styles.activeChildText}> {selectedChild.name}</Text>
            </View>
          )}
        </View>

        {/* Menu */}
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, idx) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity style={styles.menuItem} onPress={item.onPress} activeOpacity={0.8}>
                <View style={styles.menuIconWrap}>
                  <Ionicons name={item.icon as any} size={20} color={Colors.primary} />
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              </TouchableOpacity>
              {idx < MENU_ITEMS.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>SpectoCare v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  scroll: { padding: Spacing.lg, paddingBottom: Spacing.xxl },
  userCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
    ...Shadow.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: { color: Colors.textOnPrimary, fontSize: FontSize.xxxl, fontWeight: '800' },
  userName: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary },
  userEmail: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  activeChildBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.primary}15`,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    marginTop: Spacing.sm,
  },
  activeChildText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    ...Shadow.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    backgroundColor: `${Colors.primary}12`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuLabel: { flex: 1, fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 72 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${Colors.danger}12`,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: `${Colors.danger}30`,
  },
  logoutText: { fontSize: FontSize.md, color: Colors.danger, fontWeight: '700', marginLeft: Spacing.sm },
  version: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.textMuted, marginTop: Spacing.xl },
});
