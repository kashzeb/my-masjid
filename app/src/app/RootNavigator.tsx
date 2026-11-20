import { useState } from 'react';
import { Image } from 'react-native';
import { NavigationContainer, type NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from '@/constants/theme';
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
    <SettingsStack.Navigator screenOptions={{ headerTitleStyle: { fontWeight: '500' } }}>
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

const TAB_ICONS = {
  Home: require('../../assets/tab-home.png'),
  Announcements: require('../../assets/tab-announcements.png'),
  Settings: require('../../assets/tab-settings.png'),
};

function PublicTabs() {
  // Bumping the key on `blur` needed a second tab press to actually take
  // effect - the remount was scheduled but not committed in time for the
  // very next render. Bumping it synchronously in `tabPress`, checked
  // against whether Settings is ALREADY focused, fixes the timing: the
  // fresh key is set as part of the same interaction that navigates back
  // in, not a step behind it.
  const [settingsResetKey, setSettingsResetKey] = useState(0);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarShowLabel: true,
        tabBarStyle: {
          height: 64,
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0.5,
          borderTopColor: theme.colors.border,
          elevation: 8,
          shadowColor: '#2E2A50',
          shadowOpacity: 0.06,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: -3 },
        },
        tabBarItemStyle: { paddingVertical: 6 },
        tabBarIcon: ({ color, size }) => (
          <Image
            source={TAB_ICONS[route.name]}
            style={{ width: size * 0.8, height: size * 0.8, tintColor: color }}
            resizeMode="contain"
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Announcements" component={AnnouncementsScreen} />
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
