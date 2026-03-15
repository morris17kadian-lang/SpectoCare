import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Colors, Spacing, Radius, FontSize, Shadow } from '../constants/theme';
import { HomeStackParamList } from '../navigation/TabNavigator';

// In a real app you'd fetch from Firestore by ID; here we use navigation state
// The full list screen already has the data, so we pass the facilityId and
// re-fetch. For now we show a placeholder-driven version until Firestore is seeded.

type Props = {
  navigation: NativeStackNavigationProp<HomeStackParamList, 'FacilityDetail'>;
  route: RouteProp<HomeStackParamList, 'FacilityDetail'>;
};

export default function FacilityDetailScreen({ navigation, route }: Props) {
  // In production you'd do: const [facility] = useState(() => fetchById(route.params.facilityId));
  // For now, display the facilityId and note that data comes from Firestore.

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={26} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Facility Details</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.placeholder}>
          <Ionicons name="business" size={64} color={Colors.primary} />
          <Text style={styles.placeholderTitle}>Facility Information</Text>
          <Text style={styles.placeholderText}>
            Connect your Firebase Firestore database and seed facility documents to see
            full details here. Each facility document should contain: name, type, address,
            city, phone, description, and isVerified fields.
          </Text>
          <Text style={styles.idText}>ID: {route.params.facilityId}</Text>
        </View>
      </ScrollView>
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
  title: { flex: 1, textAlign: 'center', fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary },
  scroll: { padding: Spacing.lg },
  placeholder: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    ...Shadow.sm,
  },
  placeholderTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, marginTop: Spacing.md },
  placeholderText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.md,
    lineHeight: 22,
  },
  idText: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: Spacing.md, fontFamily: 'monospace' },
});
