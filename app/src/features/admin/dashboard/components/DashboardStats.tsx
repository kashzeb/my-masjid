import { View, Text, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import { theme } from '@/constants/theme';

interface DashboardStatsProps {
  nextPrayerLabel: string;
  nextPrayerTime: string;
  updatedAt: number;
}

export default function DashboardStats({ nextPrayerLabel, nextPrayerTime, updatedAt }: DashboardStatsProps) {
  return (
    <View style={styles.row}>
      <View style={[styles.stat, theme.shadow.sm]}>
        <Text style={styles.label}>Next prayer</Text>
        <Text style={styles.value}>{nextPrayerLabel}</Text>
        <Text style={styles.sublabel}>{nextPrayerTime}</Text>
      </View>
      <View style={[styles.stat, theme.shadow.sm]}>
        <Text style={styles.label}>Last updated</Text>
        <Text style={styles.value}>{dayjs(updatedAt).format('D MMM')}</Text>
        <Text style={styles.sublabel}>{dayjs(updatedAt).format('h:mm A')}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: theme.spacing.sm3, paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.lg },
  stat: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.control,
    padding: theme.spacing.md,
  },
  label: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, marginBottom: 6 },
  value: { fontSize: theme.typography.subheading, fontWeight: '700', color: theme.colors.textPrimary, textTransform: 'capitalize' },
  sublabel: { fontSize: theme.typography.caption, color: theme.colors.textTertiary, marginTop: 2 },
});
