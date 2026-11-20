import { View, Pressable, ScrollView, Linking, StyleSheet } from 'react-native';
import { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Constants from 'expo-constants';
import Text from '@/components/Text';
import Icon, { type IconName } from '@/components/Icon';
import PressableScale from '@/components/PressableScale';
import { theme } from '@/constants/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/app/RootNavigator';
import { useAuthStore } from '@/store/authStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useTimetableStore } from '@/store/timetableStore';
import { scheduleUpcomingPrayerNotifications, getNotificationPermissionGranted } from '@/services/notificationService';
import { showToast } from '@/store/toastStore';
import { PRAYERS, PRAYER_LABELS, PRAYER_ICONS, type PrayerName } from '@/constants/masjid';
import ScreenContainer from '@/components/ScreenContainer';
import Card from '@/components/Card';
import Toggle from '@/components/Toggle';

type Props = NativeStackScreenProps<SettingsStackParamList, 'SettingsHome'>;

interface ToggleRowProps {
  icon: IconName;
  iconColor: string;
  iconBg: string;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  first?: boolean;
}

function ToggleRow({ icon, iconColor, iconBg, label, value, onChange, first }: ToggleRowProps) {
  return (
    <Pressable style={[styles.row, !first && styles.rowDivider]} onPress={() => onChange(!value)}>
      <View style={[styles.rowIcon, { backgroundColor: iconBg }]}>
        <Icon name={icon} size={19} color={iconColor} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Toggle value={value} onValueChange={onChange} />
    </Pressable>
  );
}

export default function SettingsScreen({ navigation }: Props) {
  const user = useAuthStore((s) => s.user);
  const { prayerPrefs, announcementsEnabled, setPrayerPref, setAnnouncementsEnabled } = usePreferencesStore();
  const { timetable, masjid } = useTimetableStore();
  const [notificationsBlocked, setNotificationsBlocked] = useState(false);

  // Re-checked whenever Settings regains focus, so returning from the
  // phone's settings after enabling notifications updates immediately.
  useFocusEffect(
    useCallback(() => {
      getNotificationPermissionGranted().then((granted) => setNotificationsBlocked(!granted));
    }, [])
  );

  const handleAdminPress = () => {
    navigation.navigate(user ? 'Dashboard' : 'Login');
  };

  // Rescheduling lives here (not inside preferencesStore) to avoid a
  // require cycle between preferencesStore and timetableStore.
  const handlePrayerToggle = async (prayer: PrayerName, enabled: boolean) => {
    await setPrayerPref(prayer, enabled);
    showToast(`${PRAYER_LABELS[prayer]} alerts ${enabled ? 'on' : 'off'}`, enabled ? 'success' : 'default');
    if (timetable && masjid) {
      const nextPrefs = { ...prayerPrefs, [prayer]: enabled };
      scheduleUpcomingPrayerNotifications(timetable, masjid.timezone, nextPrefs).catch((err) =>
        console.warn('[notifications] failed to reschedule after preference change:', err)
      );
    }
  };

  const handleAnnouncementsToggle = async (enabled: boolean) => {
    await setAnnouncementsEnabled(enabled);
    showToast(`Announcement alerts ${enabled ? 'on' : 'off'}`, enabled ? 'success' : 'default');
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Settings</Text>
        <Text style={styles.subheading}>Choose which alerts you receive</Text>

        {notificationsBlocked && (
          <View style={styles.blockedBanner}>
            <Icon name="bell-off-outline" size={22} color={theme.colors.danger} />
            <View style={styles.blockedTextColumn}>
              <Text style={styles.blockedTitle}>Notifications are off</Text>
              <Text style={styles.blockedText}>Turn them on in your phone's settings to receive prayer and announcement alerts.</Text>
              <PressableScale onPress={() => Linking.openSettings()} style={styles.blockedButton}>
                <Text style={styles.blockedButtonText}>Open phone settings</Text>
              </PressableScale>
            </View>
          </View>
        )}

        <Text style={styles.sectionLabel}>PRAYER ALERTS</Text>
        <Card style={styles.card}>
          {PRAYERS.map((prayer, index) => (
            <ToggleRow
              key={prayer}
              first={index === 0}
              icon={PRAYER_ICONS[prayer]}
              iconColor={theme.colors.prayer}
              iconBg={theme.colors.prayerSubtle}
              label={PRAYER_LABELS[prayer]}
              value={prayerPrefs[prayer]}
              onChange={(v) => handlePrayerToggle(prayer, v)}
            />
          ))}
        </Card>
        <Text style={styles.hint}>Each alert arrives at Azan and again at Jamaat.</Text>

        <Text style={styles.sectionLabel}>MASJID UPDATES</Text>
        <Card style={styles.card}>
          <ToggleRow
            first
            icon="bullhorn-outline"
            iconColor={theme.colors.accentGold}
            iconBg={theme.colors.goldSubtle}
            label="Announcements"
            value={announcementsEnabled}
            onChange={handleAnnouncementsToggle}
          />
        </Card>

        <Text style={styles.sectionLabel}>FOR MASJID STAFF</Text>
        <PressableScale onPress={handleAdminPress} style={[styles.adminCard, theme.shadow.sm]}>
          <View style={[styles.rowIcon, { backgroundColor: theme.colors.surfaceSunken }]}>
            <Icon name="shield-account-outline" size={19} color={theme.colors.textPrimary} />
          </View>
          <View style={styles.adminTextColumn}>
            <Text style={styles.rowLabel}>Masjid admin</Text>
            <Text style={styles.adminSub}>{user ? 'Signed in · manage timings and posts' : 'Sign in to manage timings and posts'}</Text>
          </View>
          <Icon name="chevron-right" size={22} color={theme.colors.textTertiary} />
        </PressableScale>

        <Text style={styles.version}>My Masjid · version {Constants.expoConfig?.version ?? '1.0'}</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: theme.spacing.md, paddingBottom: theme.spacing.xxl },
  heading: {
    fontSize: theme.typography.heading,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
    paddingHorizontal: theme.spacing.xs,
    paddingTop: theme.spacing.md,
  },
  subheading: { fontSize: theme.typography.body, color: theme.colors.textSecondary, paddingHorizontal: theme.spacing.xs, marginTop: 2 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  card: { paddingHorizontal: theme.spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
  rowDivider: { borderTopWidth: 1, borderTopColor: theme.colors.border },
  rowIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  rowLabel: { flex: 1, fontSize: theme.typography.bodyLg, fontWeight: '600', color: theme.colors.textPrimary },
  hint: { fontSize: theme.typography.caption, color: theme.colors.textTertiary, marginTop: 8, paddingHorizontal: theme.spacing.xs },
  blockedBanner: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: theme.colors.dangerSubtle,
    borderRadius: theme.radius.card,
    padding: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  blockedTextColumn: { flex: 1 },
  blockedTitle: { fontSize: theme.typography.body, fontWeight: '700', color: theme.colors.danger, marginBottom: 2 },
  blockedText: { fontSize: theme.typography.label, color: theme.colors.danger, lineHeight: 19 },
  blockedButton: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.danger,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 10,
  },
  blockedButtonText: { fontSize: theme.typography.label, fontWeight: '700', color: '#FFFFFF' },
  adminCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
  },
  adminTextColumn: { flex: 1 },
  adminSub: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, marginTop: 1 },
  version: { textAlign: 'center', fontSize: theme.typography.caption, color: theme.colors.textTertiary, marginTop: theme.spacing.xxl },
});
