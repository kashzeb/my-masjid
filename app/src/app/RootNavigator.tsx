import { NavigationContainer } from '@react-navigation/native';
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
    <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: theme.colors.accent }}>
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
  PublicTabs: undefined;
  Login: undefined;
  Dashboard: undefined;
  EditTimetable: undefined;
  AnnouncementList: undefined;
  AnnouncementForm: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
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
