import React from 'react';
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, FontSize, Shadow } from '../constants/theme';
import { RootStackParamList } from './AppNavigator';

import HomeScreen from '../screens/HomeScreen';
import CommunityScreen from '../screens/community/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import GuidedLearningScreen from '../screens/GuidedLearningScreen';
import ChildrenScreen from '../screens/children/ChildrenScreen';
import ChildFormScreen from '../screens/children/ChildFormScreen';
import SymptomCheckerScreen from '../screens/SymptomCheckerScreen';
import SymptomResultScreen from '../screens/SymptomResultScreen';
import FacilitiesScreen from '../screens/FacilitiesScreen';
import FacilityDetailScreen from '../screens/FacilityDetailScreen';
import RoutineScreen from '../screens/routines/RoutineScreen';
import RoutineFormScreen from '../screens/routines/RoutineFormScreen';
import BehaviorTrackerScreen from '../screens/behaviors/BehaviorTrackerScreen';
import BehaviorFormScreen from '../screens/behaviors/BehaviorFormScreen';
import JournalScreen from '../screens/journal/JournalScreen';
import JournalFormScreen from '../screens/journal/JournalFormScreen';
import GuidanceScreen from '../screens/GuidanceScreen';
import PostDetailScreen from '../screens/community/PostDetailScreen';

export type HomeStackParamList = {
  HomeMain: undefined;
  Children: undefined;
  ChildForm: { childId?: string };
  SymptomChecker: undefined;
  SymptomResult: { selectedSymptomIds: string[] };
  Facilities: undefined;
  FacilityDetail: { facilityId: string };
  Routine: { childId: string; childName: string };
  RoutineForm: { childId: string; routineId?: string };
  BehaviorTracker: { childId: string; childName: string };
  BehaviorForm: { childId: string; logId?: string };
  Journal: { childId: string; childName: string };
  JournalForm: { childId: string; entryId?: string };
  Guidance: undefined;
};

export type CommunityStackParamList = {
  CommunityMain: undefined;
  PostDetail: { postId: string };
};

const HomeNav = createNativeStackNavigator<HomeStackParamList>();
const CommunityNav = createNativeStackNavigator<CommunityStackParamList>();

function HomeStack() {
  return (
    <HomeNav.Navigator screenOptions={{ headerShown: false }}>
      <HomeNav.Screen name="HomeMain" component={HomeScreen} />
      <HomeNav.Screen name="Children" component={ChildrenScreen} />
      <HomeNav.Screen name="ChildForm" component={ChildFormScreen} options={{ presentation: 'modal' }} />
      <HomeNav.Screen name="SymptomChecker" component={SymptomCheckerScreen} />
      <HomeNav.Screen name="SymptomResult" component={SymptomResultScreen} />
      <HomeNav.Screen name="Facilities" component={FacilitiesScreen} />
      <HomeNav.Screen name="FacilityDetail" component={FacilityDetailScreen} />
      <HomeNav.Screen name="Routine" component={RoutineScreen} />
      <HomeNav.Screen name="RoutineForm" component={RoutineFormScreen} options={{ presentation: 'modal' }} />
      <HomeNav.Screen name="BehaviorTracker" component={BehaviorTrackerScreen} />
      <HomeNav.Screen name="BehaviorForm" component={BehaviorFormScreen} options={{ presentation: 'modal' }} />
      <HomeNav.Screen name="Journal" component={JournalScreen} />
      <HomeNav.Screen name="JournalForm" component={JournalFormScreen} options={{ presentation: 'modal' }} />
      <HomeNav.Screen name="Guidance" component={GuidanceScreen} />
    </HomeNav.Navigator>
  );
}

function CommunityStack() {
  return (
    <CommunityNav.Navigator screenOptions={{ headerShown: false }}>
      <CommunityNav.Screen name="CommunityMain" component={CommunityScreen} />
      <CommunityNav.Screen name="PostDetail" component={PostDetailScreen} />
    </CommunityNav.Navigator>
  );
}

export type TabParamList = {
  Home: undefined;
  Community: undefined;
  Learn: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_H = 62;
const FAB_SIZE = 58;
const CHAT_SIZE = 52;

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'android' ? Math.max(insets.bottom, 8) : insets.bottom;
  const leftRoutes = state.routes.slice(0, 2);  // Home, Community
  const rightRoutes = state.routes.slice(2);     // Learn, Settings

  const renderTab = (route: (typeof state.routes)[0], realIndex: number) => {
    const { options } = descriptors[route.key];
    const isFocused = state.index === realIndex;
    const color = isFocused ? Colors.primary : Colors.textMuted;
    return (
      <TouchableOpacity
        key={route.key}
        style={styles.tabItem}
        onPress={() => { if (!isFocused) navigation.navigate(route.name); }}
        activeOpacity={0.75}
      >
        {options.tabBarIcon?.({ focused: isFocused, color, size: 24 })}
        <Text style={[styles.tabLabel, { color }]}>{route.name}</Text>
        {isFocused && <View style={styles.dot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomPad }]}>
      {/* Tab bar */}
      <View style={[styles.tabBar, { height: TAB_H }]}>
        {leftRoutes.map((r, i) => renderTab(r, i))}
        {/* Gap in centre for FAB */}
        <View style={styles.fabGap} />
        {rightRoutes.map((r, i) => renderTab(r, i + 2))}

        {/* Centre raised FAB — Shadow Request */}
        <TouchableOpacity
          style={styles.centerFab}
          onPress={() =>
            navigation
              .getParent<NativeStackNavigationProp<RootStackParamList>>()
              ?.navigate('ShadowRequest')
          }
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Floating orange chat FAB rendered as a sibling to Tab.Navigator
// so it gets the Stack navigation context, not tab context.
function ChatFab() {
  const rootNav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === 'android' ? Math.max(insets.bottom, 8) : insets.bottom;
  return (
    <TouchableOpacity
      style={[
        styles.chatFab,
        { bottom: TAB_H + bottomPad + 16 },
      ]}
      onPress={() => rootNav.navigate('ChatBot')}
      activeOpacity={0.85}
    >
      <Ionicons name="chatbubble-ellipses" size={22} color="#fff" />
    </TouchableOpacity>
  );
}

export default function TabNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Community"
          component={CommunityStack}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Learn"
          component={GuidedLearningScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'school' : 'school-outline'} size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={ProfileScreen}
          options={{
            tabBarIcon: ({ focused, color }) => (
              <Ionicons name={focused ? 'grid' : 'grid-outline'} size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
      {/* Floating orange chat FAB — above tab bar, lower-right */}
      <ChatFab />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.tabBar,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.tabBar,
    borderTopWidth: 1,
    borderTopColor: Colors.tabBarBorder,
    alignItems: 'center',
    position: 'relative',
    ...Shadow.md,
    shadowOffset: { width: 0, height: -3 },
    elevation: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 3,
    position: 'relative',
  },
  tabLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  dot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
  },
  fabGap: {
    width: FAB_SIZE + 16,
  },
  centerFab: {
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -(FAB_SIZE / 2) }],
    top: -(FAB_SIZE / 2 + 4),
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.tabBar,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 14,
  },
  chatFab: {
    position: 'absolute',
    right: 16,
    width: CHAT_SIZE,
    height: CHAT_SIZE,
    borderRadius: CHAT_SIZE / 2,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 10,
  },
});
