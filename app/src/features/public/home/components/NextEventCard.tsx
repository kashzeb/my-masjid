import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import type { PrayerEvent } from '@/utils/dateTime';

interface NextEventCardProps {
  event: PrayerEvent;
  countdownLabel: string;
}

// The prayer countdown hero - the ONE place masjid green appears prominently,
// per the design system's explicit intent to reserve it for prayer-identity
// moments rather than use it as a generic UI color (that's what the new
// near-black `accent` is for, used everywhere else).
export default function NextEventCard({ event, countdownLabel }: NextEventCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>Next — {event.label}</Text>
      <Text style={styles.countdown}>{countdownLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.prayerDark,
    borderRadius: theme.radius.heroCard,
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.spacing.xl,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadow.md,
  },
  eyebrow: {
    fontSize: theme.typography.countdownLabel,
    fontWeight: '600',
    color: theme.colors.textOnAccent,
    opacity: 0.85,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
    textAlign: 'center',
  },
  countdown: {
    fontSize: theme.typography.countdown,
    fontWeight: '800',
    color: theme.colors.textOnAccent,
    fontVariant: ['tabular-nums'],
  },
});
