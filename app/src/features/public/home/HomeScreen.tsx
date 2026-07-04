import { useEffect } from 'react';
import { View, Text, ScrollView, AppState, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { useTimetableStore } from '@/store/timetableStore';
import { useCountdown } from './useCountdown';
import { getTodayPrayerTimes, getMasjidToday } from '@/utils/dateTime';
import NextEventCard from './components/NextEventCard';
import MasjidHeader from './components/MasjidHeader';
import TimeRow from '@/components/TimeRow';
import Card from '@/components/Card';
import LoadingIndicator from '@/components/LoadingIndicator';
import OfflineBanner from '@/components/OfflineBanner';
import ScreenContainer from '@/components/ScreenContainer';

export default function HomeScreen() {
  const { timetable, masjid, status, error, fetch } = useTimetableStore();
  const countdown = useCountdown(timetable, masjid?.timezone);

  useEffect(() => {
    fetch();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') fetch();
    });
    return () => subscription.remove();
  }, [fetch]);

  if (status === 'error') {
    return (
      <ScreenContainer style={styles.centered}>
        <Text style={styles.errorTitle}>Couldn't load timings.</Text>
        <Text style={styles.errorDetail}>{error}</Text>
      </ScreenContainer>
    );
  }

  if (!timetable || !masjid) {
    return (
      <ScreenContainer style={styles.centered}>
        <LoadingIndicator label="Loading today's timings..." />
      </ScreenContainer>
    );
  }

  const today = getTodayPrayerTimes(timetable);
  const todayDate = getMasjidToday(masjid.timezone).format('dddd, D MMMM');

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <MasjidHeader name={masjid.name} dateLabel={todayDate} />

        <Card style={styles.outerCard}>
          {countdown && <NextEventCard event={countdown.event} countdownLabel={countdown.countdownLabel} />}

          {status === 'offline-cached' && <OfflineBanner />}

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
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: theme.spacing.md, paddingBottom: theme.spacing.xl },
  centered: { alignItems: 'center', justifyContent: 'center' },
  outerCard: { paddingTop: theme.spacing.lg, paddingBottom: theme.spacing.md },
  sectionLabel: {
    fontSize: theme.typography.title,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  list: { paddingHorizontal: theme.spacing.lg },
  errorTitle: { fontSize: theme.typography.body, fontWeight: '500', color: theme.colors.textPrimary, textAlign: 'center' },
  errorDetail: { fontSize: 12, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 8, paddingHorizontal: theme.spacing.lg },
});
