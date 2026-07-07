import { View, Text, Pressable, ScrollView, Linking, StyleSheet } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '@/constants/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/app/RootNavigator';
import { useAuthStore } from '@/store/authStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useTimetableStore } from '@/store/timetableStore';
import { scheduleUpcomingPrayerNotifications, getNotificationPermissionGranted } from '@/services/notificationService';
import { showToast } from '@/store/toastStore';
import { PRAYERS, PRAYER_LABELS, type PrayerName } from '@/constants/masjid';
import ScreenContainer from '@/components/ScreenContainer';
import Card from '@/components/Card';
import Toggle from '@/components/Toggle';

type Props = NativeStackScreenProps<SettingsStackParamList, 'SettingsHome'>;

export default function SettingsScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const { prayerPrefs, announcementsEnabled, setPrayerPref, setAnnouncementsEnabled } = usePreferencesStore();
  const { timetable, masjid } = useTimetableStore();
  const [notificationsBlocked, setNotificationsBlocked] = useState(false);

  // Re-checked every time Settings regains focus (not just on first mount) -
  // catches the common real flow of "went to system settings, enabled it,
  // came back" without needing an app restart to reflect the change.
  useFocusEffect(
    useCallback(() => {
      getNotificationPermissionGranted().then((granted) => setNotificationsBlocked(!granted));
    }, [])
  );

  const handleAdminPress = () => {
    // Login and Dashboard are now siblings of Settings in the same nested
    // stack (see RootNavigator) - no more cross-navigator hack needed here.
    navigation.navigate(user ? 'Dashboard' : 'Login');
  };

  // Rescheduling lives here (not inside preferencesStore) to avoid a
  // require cycle between preferencesStore and timetableStore.
  const handlePrayerToggle = async (prayer: PrayerName, enabled: boolean) => {
    await setPrayerPref(prayer, enabled);
    showToast(`${PRAYER_LABELS[prayer]} notifications ${enabled ? 'enabled' : 'disabled'}`, enabled ? 'success' : 'default');
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
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Settings</Text>
          <Pressable onPress={handleAdminPress} style={styles.adminButton}>
            <Text style={styles.adminButtonText}>Masjid Admin</Text>
          </Pressable>
        </View>

        <Card style={styles.card}>
          <Text style={styles.sectionLabel}>Notifications</Text>

          {notificationsBlocked && (
            <View style={styles.blockedBanner}>
              <Text style={styles.blockedText}>
                Notifications are turned off for this app in your phone's settings, so none of the toggles below will
                actually alert you.
              </Text>
              <Pressable onPress={() => Linking.openSettings()} style={styles.blockedButton}>
                <Text style={styles.blockedButtonText}>Open Settings</Text>
              </Pressable>
            </View>
          )}

          {PRAYERS.map((prayer) => (
            <Pressable
              key={prayer}
              style={styles.row}
              onPress={() => handlePrayerToggle(prayer, !prayerPrefs[prayer])}
            >
              <Text style={styles.rowLabel}>{PRAYER_LABELS[prayer]}</Text>
              <Toggle value={prayerPrefs[prayer]} onValueChange={(v) => handlePrayerToggle(prayer, v)} />
            </Pressable>
          ))}

          <Pressable
            style={[styles.row, styles.rowLast]}
            onPress={() => setAnnouncementsEnabled(!announcementsEnabled)}
            disabled
          >
            <View>
              <Text style={styles.rowLabel}>Announcements</Text>
              <Text style={styles.rowNote}>Push notifications for this arrive in a later update</Text>
            </View>
            <Toggle value={announcementsEnabled} onValueChange={setAnnouncementsEnabled} disabled />
          </Pressable>
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: theme.spacing.md, paddingBottom: theme.spacing.xl },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  heading: { fontSize: theme.typography.heading, fontWeight: '700', color: theme.colors.textPrimary, flex: 1 },
  adminButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexShrink: 0,
  },
  adminButtonText: { fontSize: theme.typography.caption, fontWeight: '600', color: theme.colors.textOnAccent },
  card: { padding: theme.spacing.md },
  blockedBanner: {
    backgroundColor: theme.colors.dangerSubtle,
    borderRadius: theme.radius.control,
    padding: theme.spacing.sm3,
    marginBottom: theme.spacing.sm,
  },
  blockedText: { fontSize: theme.typography.label, color: theme.colors.danger, marginBottom: theme.spacing.sm },
  blockedButton: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  blockedButtonText: { fontSize: theme.typography.caption, fontWeight: '600', color: '#FFFFFF' },
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
  rowNote: { fontSize: 11, color: theme.colors.textTertiary, marginTop: 2, maxWidth: 220 },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.control,
    paddingVertical: 16,
    paddingHorizontal: theme.spacing.md,
  },
  adminButtonText: { fontSize: theme.typography.body, fontWeight: '600', color: theme.colors.textPrimary },
  adminButtonChevron: { fontSize: 22, color: theme.colors.textTertiary },
});
