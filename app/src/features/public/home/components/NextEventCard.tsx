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
      <Text style={styles.eyebrow}>Next event</Text>
      <Text style={styles.eventLabel}>{event.label}</Text>
      <Text style={styles.countdown}>{countdownLabel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.card,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  eyebrow: { fontSize: theme.typography.caption, color: theme.colors.accentSoft, marginBottom: 4 },
  eventLabel: { fontSize: 20, fontWeight: '500', color: '#fff', textTransform: 'capitalize', marginBottom: 2 },
  countdown: { fontSize: 32, fontWeight: '500', color: '#fff' },
});
