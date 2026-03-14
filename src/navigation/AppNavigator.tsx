import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../constants/theme';

// Screens rendered inside the main stack (on top of tabs)
import ChildFormScreen from '../screens/children/ChildFormScreen';
import RoutineScreen from '../screens/routines/RoutineScreen';
import RoutineFormScreen from '../screens/routines/RoutineFormScreen';
import BehaviorTrackerScreen from '../screens/behaviors/BehaviorTrackerScreen';
import BehaviorFormScreen from '../screens/behaviors/BehaviorFormScreen';
import JournalScreen from '../screens/journal/JournalScreen';
import JournalFormScreen from '../screens/journal/JournalFormScreen';
import PostDetailScreen from '../screens/community/PostDetailScreen';
import GuidanceScreen from '../screens/GuidanceScreen';
import FacilityDetailScreen from '../screens/FacilityDetailScreen';
import SymptomResultScreen from '../screens/SymptomResultScreen';

export type RootStackParamList = {
  Tabs: undefined;
  ChildForm: { childId?: string };
  Routine: { childId: string; childName: string };
  RoutineForm: { childId: string; routineId?: string };
  BehaviorTracker: { childId: string; childName: string };
  BehaviorForm: { childId: string; logId?: string };
  Journal: { childId: string; childName: string };
  JournalForm: { childId: string; entryId?: string };
  PostDetail: { postId: string };
  Guidance: undefined;
  FacilityDetail: { facilityId: string };
  SymptomResult: { selectedSymptomIds: string[] };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={TabNavigator} />
          <Stack.Screen name="ChildForm" component={ChildFormScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="Routine" component={RoutineScreen} />
          <Stack.Screen name="RoutineForm" component={RoutineFormScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="BehaviorTracker" component={BehaviorTrackerScreen} />
          <Stack.Screen name="BehaviorForm" component={BehaviorFormScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="Journal" component={JournalScreen} />
          <Stack.Screen name="JournalForm" component={JournalFormScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="PostDetail" component={PostDetailScreen} />
          <Stack.Screen name="Guidance" component={GuidanceScreen} />
          <Stack.Screen name="FacilityDetail" component={FacilityDetailScreen} />
          <Stack.Screen name="SymptomResult" component={SymptomResultScreen} />
        </Stack.Navigator>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
