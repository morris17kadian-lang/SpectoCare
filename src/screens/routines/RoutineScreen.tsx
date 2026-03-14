import React, { useCallback, useState } from 'react';
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { getRoutines, deleteRoutine } from '../../services/firestoreService';
import { Routine } from '../../models';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';
import { RootStackParamList } from '../../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Routine'>;
  route: RouteProp<RootStackParamList, 'Routine'>;
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function RoutineScreen({ navigation, route }: Props) {
  const { childId, childName } = route.params;
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    getRoutines(childId)
      .then(setRoutines)
      .finally(() => setLoading(false));
  }, [childId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleDelete = (r: Routine) => {
    Alert.alert('Delete Routine', `Remove "${r.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteRoutine(r.id);
          load();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Daily Routines</Text>
          <Text style={styles.subtitle}>{childName}</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('RoutineForm', { childId })}
        >
          <Ionicons name="add" size={22} color={Colors.textOnPrimary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} color={Colors.primary} />
      ) : routines.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="calendar-outline" size={56} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No routines yet</Text>
          <Text style={styles.emptyText}>Add a routine for {childName} to help structure their day.</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => navigation.navigate('RoutineForm', { childId })}
          >
            <Text style={styles.emptyBtnText}>Add Routine</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={routines}
          keyExtractor={(r) => r.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.timeBox}>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.routineTitle}>{item.title}</Text>
                {item.notes && <Text style={styles.routineNotes} numberOfLines={1}>{item.notes}</Text>}
                <View style={styles.daysRow}>
                  {DAYS.map((d, i) => (
                    <View
                      key={d}
                      style={[
                        styles.dayChip,
                        item.daysOfWeek.includes(i) && styles.dayChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayChipText,
                          item.daysOfWeek.includes(i) && styles.dayChipTextActive,
                        ]}
                      >
                        {d[0]}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('RoutineForm', { childId, routineId: item.id })}
                  style={styles.iconBtn}
                >
                  <Ionicons name="create-outline" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.iconBtn}>
                  <Ionicons name="trash-outline" size={20} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
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
  title: { flex: 1, fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textSecondary },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emptyTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, marginTop: Spacing.md },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm },
  emptyBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, marginTop: Spacing.lg },
  emptyBtnText: { color: Colors.textOnPrimary, fontWeight: '700' },
  list: { padding: Spacing.lg },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Shadow.sm,
  },
  timeBox: {
    backgroundColor: `${Colors.primary}15`,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginRight: Spacing.md,
    minWidth: 56,
    alignItems: 'center',
  },
  timeText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
  routineTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  routineNotes: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  daysRow: { flexDirection: 'row', marginTop: Spacing.xs },
  dayChip: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 3,
  },
  dayChipActive: { backgroundColor: Colors.primary },
  dayChipText: { fontSize: 9, fontWeight: '700', color: Colors.textMuted },
  dayChipTextActive: { color: Colors.textOnPrimary },
  actions: { flexDirection: 'row' },
  iconBtn: { padding: Spacing.xs, marginLeft: Spacing.xs },
});
