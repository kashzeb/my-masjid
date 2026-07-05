import { ScrollView, View, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useTimetableStore } from '@/store/timetableStore';
import { getNextEvent, getMasjidToday } from '@/utils/dateTime';
import ScreenContainer from '@/components/ScreenContainer';
import AdminHeader from './components/AdminHeader';
import AdminActionRow from './components/AdminActionRow';
import DashboardStats from './components/DashboardStats';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/app/RootNavigator';

type Props = NativeStackScreenProps<SettingsStackParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  const { user, signOutUser } = useAuthStore();
  const { timetable, masjid } = useTimetableStore();

  const handleLogout = async () => {
    await signOutUser();
    // Lands on Settings, not Login - a deliberate landing point per
    // Navigation Flow §3.2, so logging out doesn't strand anyone on a
    // screen with nothing useful to do.
    navigation.popToTop();
  };

  const nextEvent = timetable && masjid ? getNextEvent(timetable, masjid.timezone, getMasjidToday(masjid.timezone)) : null;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <AdminHeader email={user?.email ?? 'Unknown'} onLogout={handleLogout} />

        {nextEvent && timetable && (
          <DashboardStats
            nextPrayerLabel={nextEvent.label}
            nextPrayerTime={nextEvent.at.format('h:mm A')}
            updatedAt={timetable.updatedAt}
          />
        )}

        <View style={styles.list}>
          <AdminActionRow
            title="Edit prayer timings"
            subtitle="Update Azan and Jamaat times"
            onPress={() => navigation.navigate('EditTimetable')}
          />
          <AdminActionRow
            title="Manage announcements"
            subtitle="Create, edit, or remove announcements"
            onPress={() => navigation.navigate('AnnouncementList')}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: theme.spacing.xl },
  list: { paddingHorizontal: theme.spacing.lg },
});
