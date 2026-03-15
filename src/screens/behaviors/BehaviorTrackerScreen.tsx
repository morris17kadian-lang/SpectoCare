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
import { getBehaviorLogs, deleteBehaviorLog } from '../../services/firestoreService';
import { BehaviorLog } from '../../models';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../../constants/theme';
import { HomeStackParamList } from '../../navigation/TabNavigator';

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'BehaviorTracker'>;
  route: RouteProp<HomeStackParamList, 'BehaviorTracker'>;
};

const SEVERITY_COLORS = ['', Colors.success, Colors.success, Colors.warning, Colors.danger, Colors.danger];
const SEVERITY_LABELS = ['', 'Mild', 'Low', 'Moderate', 'High', 'Severe'];

export default function BehaviorTrackerScreen({ navigation, route }: Props) {
  const { childId, childName } = route.params;
  const [logs, setLogs] = useState<BehaviorLog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    getBehaviorLogs(childId)
      .then(setLogs)
      .finally(() => setLoading(false));
  }, [childId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleDelete = (log: BehaviorLog) => {
    Alert.alert('Delete Log', 'Remove this behavior log?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteBehaviorLog(log.id);
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
          <Text style={styles.title}>Behavior Tracker</Text>
          <Text style={styles.subtitle}>{childName}</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('BehaviorForm', { childId })}
        >
          <Ionicons name="add" size={22} color={Colors.textOnPrimary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator style={{ flex: 1 }} color={Colors.primary} />
      ) : logs.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="stats-chart-outline" size={56} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>No logs yet</Text>
          <Text style={styles.emptyText}>Start tracking {childName}'s behaviors to identify patterns.</Text>
          <TouchableOpacity
            style={styles.emptyBtn}
            onPress={() => navigation.navigate('BehaviorForm', { childId })}
          >
            <Text style={styles.emptyBtnText}>Log Behavior</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(l) => l.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          renderItem={({ item }) => {
            const color = SEVERITY_COLORS[item.severity];
            return (
              <View style={[styles.card, { borderLeftColor: color }]}>
                <View style={{ flex: 1 }}>
                  <View style={styles.cardTop}>
                    <Text style={styles.behaviorType}>{item.behaviorType}</Text>
                    <View style={[styles.severityBadge, { backgroundColor: `${color}20` }]}>
                      <Text style={[styles.severityText, { color }]}>
                        {SEVERITY_LABELS[item.severity]}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.date}>{item.date}</Text>
                  {item.notes && <Text style={styles.notes} numberOfLines={2}>{item.notes}</Text>}
                </View>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={18} color={Colors.danger} />
                </TouchableOpacity>
              </View>
            );
          }}
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
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderLeftWidth: 4,
    ...Shadow.sm,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  behaviorType: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
  severityBadge: { borderRadius: Radius.full, paddingHorizontal: Spacing.sm, paddingVertical: 2 },
  severityText: { fontSize: FontSize.xs, fontWeight: '700' },
  date: { fontSize: FontSize.xs, color: Colors.textMuted },
  notes: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4, lineHeight: 18 },
  deleteBtn: { padding: Spacing.xs, marginLeft: Spacing.sm },
});
