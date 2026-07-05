import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/RootNavigator';
import { useAuthStore } from '@/store/authStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useTimetableStore } from '@/store/timetableStore';
import { scheduleUpcomingPrayerNotifications } from '@/services/notificationService';
import { PRAYERS, PRAYER_LABELS, type PrayerName } from '@/constants/masjid';
import ScreenContainer from '@/components/ScreenContainer';
import Card from '@/components/Card';
import Toggle from '@/components/Toggle';

export default function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAuthStore((s) => s.user);
  const { prayerPrefs, announcementsEnabled, setPrayerPref, setAnnouncementsEnabled } = usePreferencesStore();
  const { timetable, masjid } = useTimetableStore();

  const handleAdminPress = () => {
    navigation.navigate(user ? 'Dashboard' : 'Login');
  };

  // Rescheduling lives here, not inside preferencesStore, specifically to
  // avoid a require cycle between preferencesStore and timetableStore -
  // this screen already has both pieces of data via hooks, so it's the
  // natural place for the two to meet.
  const handlePrayerToggle = async (prayer: PrayerName, enabled: boolean) => {
    await setPrayerPref(prayer, enabled);
    if (timetable && masjid) {
      const nextPrefs = { ...prayerPrefs, [prayer]: enabled };
      scheduleUpcomingPrayerNotifications(timetable, masjid.timezone, nextPrefs).catch((err) =>
        console.warn('[notifications] failed to reschedule after preference change:', err)
      );
    }
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Settings</Text>

        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>Notifications</Text>

          {PRAYERS.map((prayer) => (
            <View key={prayer} style={styles.row}>
              <Text style={styles.rowLabel}>{PRAYER_LABELS[prayer]}</Text>
              <Toggle value={prayerPrefs[prayer]} onValueChange={(v) => handlePrayerToggle(prayer, v)} />
            </View>
          ))}

          <View style={[styles.row, styles.rowLast]}>
            <View>
              <Text style={styles.rowLabel}>Announcements</Text>
              <Text style={styles.rowNote}>Push notifications for this arrive in a later update</Text>
            </View>
            <Toggle value={announcementsEnabled} onValueChange={setAnnouncementsEnabled} disabled />
          </View>
        </Card>

        <Pressable onPress={handleAdminPress} style={styles.adminLink}>
          <Text style={styles.adminLinkText}>Masjid admin</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: theme.spacing.md, paddingBottom: theme.spacing.xl },
  heading: {
    fontSize: theme.typography.heading,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  card: { padding: theme.spacing.md },
  sectionLabel: {
    fontSize: theme.typography.caption,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.sm,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
  },
  rowLast: { marginBottom: 0 },
  rowLabel: { fontSize: theme.typography.body, color: theme.colors.textPrimary },
  rowNote: { fontSize: 11, color: theme.colors.textMuted, marginTop: 2, maxWidth: 220 },
  adminLink: { marginTop: theme.spacing.lg, padding: 12, alignItems: 'center' },
  adminLinkText: { fontSize: theme.typography.body, color: theme.colors.textMuted },
});
