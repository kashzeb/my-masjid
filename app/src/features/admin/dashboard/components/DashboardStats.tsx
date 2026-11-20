import { View, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import Text from '@/components/Text';
import Icon, { type IconName } from '@/components/Icon';
import { theme } from '@/constants/theme';

interface DashboardStatsProps {
  nextPrayerLabel: string;
  nextPrayerTime: string;
  updatedAt: number;
}

function Stat({ icon, label, value, sub }: { icon: IconName; label: string; value: string; sub: string }) {
  return (
    <View style={[styles.stat, theme.shadow.sm]}>
      <View style={styles.statHeader}>
        <Icon name={icon} size={16} color={theme.colors.textTertiary} />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.sublabel}>{sub}</Text>
    </View>
  );
}

export default function DashboardStats({ nextPrayerLabel, nextPrayerTime, updatedAt }: DashboardStatsProps) {
  return (
    <View style={styles.row}>
      <Stat icon="clock-outline" label="Next" value={nextPrayerLabel} sub={nextPrayerTime} />
      <Stat icon="calendar-clock" label="Timings updated" value={dayjs(updatedAt).format('D MMM')} sub={dayjs(updatedAt).format('h:mm A')} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: theme.spacing.sm3, paddingHorizontal: theme.spacing.md, marginBottom: theme.spacing.lg },
  stat: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
  },
  statHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  label: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, fontWeight: '600' },
  value: { fontSize: theme.typography.subheading, fontWeight: '800', color: theme.colors.textPrimary, textTransform: 'capitalize' },
  sublabel: { fontSize: theme.typography.caption, color: theme.colors.textTertiary, marginTop: 2, fontWeight: '500' },
});
