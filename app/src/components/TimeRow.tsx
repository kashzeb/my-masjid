import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface TimeRowProps {
  label: string;
  azan: string;
  jamaat: string;
  active?: boolean; // highlights this row as the next prayer (Home screen only)
}

export default function TimeRow({ label, azan, jamaat, active = false }: TimeRowProps) {
  return (
    <View style={[styles.row, active && styles.rowActive]}>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
      <Text style={[styles.times, active && styles.timesActive]}>
        Azan {azan} · Jamaat {jamaat}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
  },
  rowActive: {
    backgroundColor: theme.colors.accentSoft,
    marginHorizontal: -theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: 8,
    borderTopWidth: 0,
  },
  label: { fontSize: theme.typography.body, color: theme.colors.textPrimary },
  labelActive: { fontWeight: '500', color: theme.colors.accentSoftText },
  times: { fontSize: theme.typography.caption, color: theme.colors.textSecondary },
  timesActive: { color: theme.colors.accent, fontWeight: '500' },
});
