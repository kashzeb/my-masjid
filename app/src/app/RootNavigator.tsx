import { NavigationContainer, createNavigationContainerRef, type NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { theme } from '@/constants/theme';

import HomeScreen from '@/features/public/home/HomeScreen';
import AnnouncementsScreen from '@/features/public/announcements/AnnouncementsScreen';
import SettingsScreen from '@/features/public/settings/SettingsScreen';
import LoginScreen from '@/features/admin/auth/LoginScreen';
import DashboardScreen from '@/features/admin/dashboard/DashboardScreen';
import EditTimetableScreen from '@/features/admin/timetable/EditTimetableScreen';
import AnnouncementListScreen from '@/features/admin/announcements/AnnouncementListScreen';
import AnnouncementFormScreen from '@/features/admin/announcements/AnnouncementFormScreen';

// Public tab bar — Navigation Flow §2. Exactly 3 tabs, every core feature
// one tap away.
export type PublicTabParamList = {
  Home: undefined;
  Announcements: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<PublicTabParamList>();

function PublicTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
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
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: -3 },
        },
        tabBarItemStyle: { paddingVertical: 6 },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Announcements" component={AnnouncementsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// Root stack — public tabs as the permanent base, admin screens pushed on
// top (Navigation Flow §1). Real auth-gating (redirect to Login if not
// authenticated when deep-linking to Dashboard) arrives in M3 alongside
// authStore — this skeleton just makes every route reachable.
export type RootStackParamList = {
  PublicTabs: NavigatorScreenParams<PublicTabParamList> | undefined;
  Login: undefined;
  Dashboard: undefined;
  EditTimetable: undefined;
  AnnouncementList: undefined;
  AnnouncementForm: { announcementId?: string } | undefined;
};

// Lets code outside the React tree (the notification-tap handler in App.tsx)
// navigate without needing a component's own navigation prop - the
// standard React Navigation pattern for this exact situation.
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerTitleStyle: { fontWeight: '500' } }}>
        <Stack.Screen name="PublicTabs" component={PublicTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Admin login' }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="EditTimetable" component={EditTimetableScreen} options={{ title: 'Edit timings' }} />
        <Stack.Screen name="AnnouncementList" component={AnnouncementListScreen} options={{ title: 'Announcements' }} />
        <Stack.Screen name="AnnouncementForm" component={AnnouncementFormScreen} options={{ title: 'Announcement' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
