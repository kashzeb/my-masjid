import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NavigationContainer, type NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from '@/constants/theme';
import Icon, { type IconName } from '@/components/Icon';
import { fontFor } from '@/components/Text';
import { tapHaptic } from '@/utils/haptics';
import { navigationRef } from './navigationRef';

import HomeScreen from '@/features/public/home/HomeScreen';
import AnnouncementsScreen from '@/features/public/announcements/AnnouncementsScreen';
import SettingsScreen from '@/features/public/settings/SettingsScreen';
import LoginScreen from '@/features/admin/auth/LoginScreen';
import DashboardScreen from '@/features/admin/dashboard/DashboardScreen';
import EditTimetableScreen from '@/features/admin/timetable/EditTimetableScreen';
import AnnouncementListScreen from '@/features/admin/announcements/AnnouncementListScreen';
import AnnouncementFormScreen from '@/features/admin/announcements/AnnouncementFormScreen';

// The admin flow now lives INSIDE the Settings tab as its own nested stack,
// rather than as a sibling of the tab bar at the root. This is what keeps
// the bottom tab bar visible and tappable at any depth in the admin flow
// (Home/Announcements always one tap away) - per feedback, the original
// "admin screens pushed on the root stack" design (Navigation Flow §1)
// hid the tab bar the moment you left Settings, which wasn't the intent.
export type SettingsStackParamList = {
  SettingsHome: undefined;
  Login: undefined;
  Dashboard: undefined;
  EditTimetable: undefined;
  AnnouncementList: undefined;
  AnnouncementForm: { announcementId?: string } | undefined;
};

const SettingsStack = createNativeStackNavigator<SettingsStackParamList>();

function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator
      screenOptions={{
        animation: 'slide_from_right',
        headerShadowVisible: false,
        headerStyle: { backgroundColor: theme.colors.surfacePage },
        headerTintColor: theme.colors.textPrimary,
        headerTitleStyle: { fontFamily: fontFor('700'), fontSize: 17 },
        contentStyle: { backgroundColor: theme.colors.surfacePage },
      }}
    >
      <SettingsStack.Screen name="SettingsHome" component={SettingsScreen} options={{ headerShown: false }} />
      <SettingsStack.Screen name="Login" component={LoginScreen} options={{ title: 'Admin login' }} />
      <SettingsStack.Screen name="Dashboard" component={DashboardScreen} />
      <SettingsStack.Screen name="EditTimetable" component={EditTimetableScreen} options={{ title: 'Edit timings' }} />
      <SettingsStack.Screen name="AnnouncementList" component={AnnouncementListScreen} options={{ title: 'Announcements' }} />
      <SettingsStack.Screen name="AnnouncementForm" component={AnnouncementFormScreen} options={{ title: 'Announcement' }} />
    </SettingsStack.Navigator>
  );
}

// Public tab bar — Navigation Flow §2. Exactly 3 tabs, every core feature
// one tap away - now including everything nested inside Settings.
export type PublicTabParamList = {
  Home: undefined;
  Announcements: undefined;
  Settings: NavigatorScreenParams<SettingsStackParamList> | undefined;
};

const Tab = createBottomTabNavigator<PublicTabParamList>();

const TAB_ICONS: Record<keyof PublicTabParamList, { active: IconName; inactive: IconName }> = {
  Home: { active: 'home-variant', inactive: 'home-variant-outline' },
  Announcements: { active: 'bullhorn', inactive: 'bullhorn-outline' },
  Settings: { active: 'cog', inactive: 'cog-outline' },
};

// Active tab gets a soft green pill behind its icon.
function TabIcon({ name, focused, color }: { name: keyof PublicTabParamList; focused: boolean; color: string }) {
  return (
    <View style={[tabStyles.pill, focused && tabStyles.pillActive]}>
      <Icon name={focused ? TAB_ICONS[name].active : TAB_ICONS[name].inactive} size={22} color={color} />
    </View>
  );
}

const tabStyles = StyleSheet.create({
  pill: { width: 56, height: 30, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  pillActive: { backgroundColor: theme.colors.prayerSubtle },
});

function PublicTabs() {
  // Bumping the key on `blur` needed a second tab press to actually take
  // effect - the remount was scheduled but not committed in time for the
  // very next render. Bumping it synchronously in `tabPress`, checked
  // against whether Settings is ALREADY focused, fixes the timing: the
  // fresh key is set as part of the same interaction that navigates back
  // in, not a step behind it.
  const [settingsResetKey, setSettingsResetKey] = useState(0);
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenListeners={{ tabPress: () => tapHaptic() }}
      screenOptions={({ route }) => ({
        headerShown: false,
        animation: 'fade',
        tabBarActiveTintColor: theme.colors.prayerSubtleText,
        tabBarInactiveTintColor: theme.colors.textTertiary,
        tabBarLabelStyle: { fontFamily: fontFor('700'), fontSize: 11, marginTop: 2 },
        tabBarStyle: {
          height: 66 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom + 8,
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          elevation: 0,
        },
        tabBarIcon: ({ color, focused }) => <TabIcon name={route.name} focused={focused} color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Announcements" component={AnnouncementsScreen} options={{ tabBarLabel: 'Updates' }} />
      <Tab.Screen
        name="Settings"
        listeners={({ navigation }) => ({
          tabPress: () => {
            if (!navigation.isFocused()) {
              setSettingsResetKey((k) => k + 1);
            }
          },
        })}
      >
        {() => <SettingsStackNavigator key={settingsResetKey} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <PublicTabs />
    </NavigationContainer>
  );
}
