import { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, AppState, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Text from '@/components/Text';
import Icon from '@/components/Icon';
import FadeIn from '@/components/FadeIn';
import { theme } from '@/constants/theme';
import { HIJRI_ADJUST_DAYS, type PrayerName } from '@/constants/masjid';
import { useTimetableStore } from '@/store/timetableStore';
import { useAnnouncementsStore } from '@/store/announcementsStore';
import { useCountdown } from './useCountdown';
import { getTodayPrayerTimes, getMasjidToday, getHijriDate, isPrayerDoneToday } from '@/utils/dateTime';
import NextEventCard from './components/NextEventCard';
import MasjidHeader from './components/MasjidHeader';
import PrayerListRow, { type PrayerRowState } from './components/PrayerListRow';
import LatestAnnouncementCard from './components/LatestAnnouncementCard';
import HomeSkeleton from './components/HomeSkeleton';
import OfflineBanner from '@/components/OfflineBanner';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenContainer from '@/components/ScreenContainer';
import type { PublicTabParamList } from '@/app/RootNavigator';

export default function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<PublicTabParamList>>();
  const { timetable, masjid, status, fetch } = useTimetableStore();
  const { announcements, subscribe, unsubscribe } = useAnnouncementsStore();
  const countdown = useCountdown(timetable, masjid?.timezone);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetch();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') fetch();
    });
    return () => subscription.remove();
  }, [fetch]);

  useEffect(() => {
    subscribe();
    return () => unsubscribe();
  }, [subscribe, unsubscribe]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetch();
    setRefreshing(false);
  }, [fetch]);

  if (status === 'error' && !timetable) {
    return (
      <ScreenContainer style={styles.centered}>
        <View style={styles.errorIcon}>
          <Icon name="wifi-off" size={30} color={theme.colors.textSecondary} />
        </View>
        <Text style={styles.errorTitle}>Couldn't load prayer times</Text>
        <Text style={styles.errorDetail}>Check your internet connection and try again.</Text>
        <View style={styles.retry}>
          <PrimaryButton label="Try again" icon="refresh" onPress={fetch} />
        </View>
      </ScreenContainer>
    );
  }

  if (!timetable || !masjid) {
    return (
      <ScreenContainer>
        <HomeSkeleton />
      </ScreenContainer>
    );
  }

  const today = getMasjidToday(masjid.timezone);
  const hijri = getHijriDate(today, HIJRI_ADJUST_DAYS);
  const latest = announcements[0];

  const rowState = (prayer: PrayerName): PrayerRowState => {
    if (countdown?.event.prayer === prayer) return 'current';
    return isPrayerDoneToday(timetable, prayer, masjid.timezone, countdown?.now) ? 'done' : 'upcoming';
  };
  const rows = getTodayPrayerTimes(timetable);
  const badge = countdown?.event.kind === 'jamaat' ? 'NOW' : 'NEXT';

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.prayer} colors={[theme.colors.prayer]} />
        }
      >
        <FadeIn>
          <MasjidHeader
            name={masjid.name}
            city={masjid.city}
            dateLabel={today.format('dddd, D MMM')}
            hijriLabel={`${hijri.day} ${hijri.month}`}
          />
        </FadeIn>

        {countdown && (
          <FadeIn delay={60}>
            <NextEventCard event={countdown.event} countdownLabel={countdown.countdownLabel} progress={countdown.progress} />
          </FadeIn>
        )}

        {status === 'offline-cached' && <OfflineBanner />}

        <FadeIn delay={120}>
          <View style={styles.listHeader}>
            <Text style={styles.sectionLabel}>Today</Text>
            <View style={styles.columnLabels}>
              <Text style={styles.columnLabel}>Azan</Text>
              <Text style={styles.columnLabel}>Jamaat</Text>
            </View>
          </View>
          <View style={styles.list}>
            {rows.map((row) => (
              <PrayerListRow
                key={row.prayer}
                prayer={row.prayer}
                label={row.label}
                azan={row.azan}
                jamaat={row.jamaat}
                state={rowState(row.prayer)}
                badge={badge}
              />
            ))}
          </View>
        </FadeIn>

        {latest && (
          <FadeIn delay={180}>
            <LatestAnnouncementCard announcement={latest} onPress={() => navigation.navigate('Announcements')} />
          </FadeIn>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: theme.spacing.xl },
  centered: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: theme.spacing.xl },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg + 4,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.sm,
  },
  sectionLabel: { fontSize: theme.typography.title, fontWeight: '800', color: theme.colors.textPrimary },
  columnLabels: { flexDirection: 'row' },
  columnLabel: { width: 70, textAlign: 'right', fontSize: 11, fontWeight: '700', color: theme.colors.textTertiary, letterSpacing: 0.4 },
  list: { paddingHorizontal: theme.spacing.sm3, marginBottom: theme.spacing.md },
  errorIcon: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: theme.colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  errorTitle: { fontSize: theme.typography.subheading, fontWeight: '700', color: theme.colors.textPrimary, textAlign: 'center' },
  errorDetail: { fontSize: theme.typography.body, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 6 },
  retry: { alignSelf: 'stretch', marginTop: theme.spacing.xl },
});
