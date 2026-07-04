import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import type { PrayerEvent } from '@/utils/dateTime';

interface NextEventCardProps {
  event: PrayerEvent;
  countdownLabel: string;
}

export default function NextEventCard({ event, countdownLabel }: NextEventCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.pill}>
        <Text style={styles.pillText}>Next Namaaz</Text>
      </View>
      <Text style={styles.eventLabel}>{event.label}</Text>
      <Text style={styles.countdown}>{countdownLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.card,
    padding: theme.spacing.xl,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: theme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginBottom: theme.spacing.md,
  },
  pillText: { fontSize: 12, fontWeight: '600', color: '#fff' },
  eventLabel: { fontSize: 20, fontWeight: '600', color: '#fff', textTransform: 'capitalize', marginBottom: 4 },
  countdown: { fontSize: 36, fontWeight: '700', color: '#fff' },
});
