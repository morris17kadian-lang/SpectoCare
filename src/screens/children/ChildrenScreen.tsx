import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../../context/AuthContext';
import { useChild } from '../../context/ChildContext';
import { getChildren, deleteChild } from '../../services/firestoreService';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Child } from '../../models';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ChildrenScreen() {
  const { user } = useAuth();
  const { setChildren, selectChild, selectedChild } = useChild();
  const navigation = useNavigation<Nav>();
  const [items, setItems] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getChildren(user.uid);
      setItems(data);
      setChildren(data);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleDelete = (child: Child) => {
    Alert.alert(
      'Remove Child',
      `Are you sure you want to remove ${child.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await deleteChild(child.id);
            load();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Children</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('ChildForm', {})}
        >
          <Ionicons name="add" size={22} color={Colors.textOnPrimary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={Colors.primary} />
      ) : items.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="people-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No children added yet</Text>
          <Text style={styles.emptyText}>Tap the + button to add your child's profile.</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => navigation.navigate('ChildForm', {})}
          >
            <Text style={styles.emptyBtnText}>Add Child</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(c) => c.id}
          contentContainerStyle={{ padding: Spacing.lg }}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, selectedChild?.id === item.id && styles.cardSelected]}
              onPress={() => selectChild(item)}
              activeOpacity={0.85}
            >
              <View style={styles.avatar}>
                <Ionicons
                  name={item.gender === 'female' ? 'woman' : 'man'}
                  size={32}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>
                  {calculateAge(item.dateOfBirth)} · {item.gender}
                  {item.condition ? ` · ${item.condition}` : ''}
                </Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ChildForm', { childId: item.id })}
                  style={styles.iconBtn}
                >
                  <Ionicons name="create-outline" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.iconBtn}>
                  <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                </TouchableOpacity>
              </View>
              {selectedChild?.id === item.id && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>Active</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

function calculateAge(dob: string): string {
  const birth = new Date(dob);
  const now = new Date();
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (months >= 24) return `${Math.floor(months / 12)} yrs`;
  return `${months} months`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.textPrimary },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: { flex: 1 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, marginTop: Spacing.md },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm },
  emptyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
  },
  emptyBtnText: { color: Colors.textOnPrimary, fontWeight: '700', fontSize: FontSize.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: { borderColor: Colors.primary },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  info: { flex: 1 },
  name: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  meta: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  actions: { flexDirection: 'row' },
  iconBtn: { padding: Spacing.xs, marginLeft: Spacing.xs },
  activeBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  activeBadgeText: { fontSize: FontSize.xs, color: Colors.textOnPrimary, fontWeight: '700' },
});
