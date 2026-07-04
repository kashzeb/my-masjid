import { useEffect } from 'react';
import { View, Text, ScrollView, AppState, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { useTimetableStore } from '@/store/timetableStore';
import { useCountdown } from './useCountdown';
import { getTodayPrayerTimes, getMasjidToday } from '@/utils/dateTime';
import NextEventCard from './components/NextEventCard';
import TimeRow from '@/components/TimeRow';

export default function HomeScreen() {
  const { timetable, masjid, status, error, fetch } = useTimetableStore();
  const countdown = useCountdown(timetable, masjid?.timezone);

  useEffect(() => {
    fetch();
    // Refetch on foreground (Architecture SS6.3) - the simplest option we
    // picked over a real-time listener, since edits are rare (~monthly)
    // and this is cheap enough to just always do.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') fetch();
    });
    return () => subscription.remove();
  }, [fetch]);

  if (status === 'error') {
    return (
      <View style={styles.container}>
        <Text style={styles.note}>Couldn't load timings.</Text>
        <Text style={[styles.note, { marginTop: 8, fontSize: 12 }]}>{error}</Text>
      </View>
    );
  }

  if (!timetable || !masjid) {
    return (
      <View style={styles.container}>
        <Text style={styles.note}>Loading today's timings...</Text>
      </View>
    );
  }

  const today = getTodayPrayerTimes(timetable);
  const todayDate = getMasjidToday(masjid.timezone).format('dddd, D MMMM');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.masjidName}>{masjid.name}</Text>
        <Text style={styles.date}>{todayDate}</Text>
      </View>

      {countdown && <NextEventCard event={countdown.event} countdownLabel={countdown.countdownLabel} />}

      {status === 'offline-cached' && (
        <Text style={styles.offlineNote}>Showing saved timings - may not be up to date</Text>
      )}

      <Text style={styles.sectionLabel}>Today</Text>
      <View style={styles.list}>
        {today.map((row) => (
          <TimeRow
            key={row.prayer}
            label={row.label}
            azan={row.azan}
            jamaat={row.jamaat}
            active={countdown?.event.prayer === row.prayer}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.surface },
  content: { paddingBottom: theme.spacing.xl },
  header: { paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.lg },
  masjidName: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, marginBottom: 2 },
  date: { fontSize: theme.typography.title, fontWeight: '500', color: theme.colors.textPrimary, marginBottom: theme.spacing.lg },
  offlineNote: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionLabel: {
    fontSize: theme.typography.caption,
    fontWeight: '500',
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  list: { paddingHorizontal: theme.spacing.lg },
  note: { fontSize: theme.typography.caption, color: theme.colors.textSecondary },
});
