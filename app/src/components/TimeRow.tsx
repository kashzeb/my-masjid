import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface TimeRowProps {
  label: string;
  azan: string;
  jamaat: string;
  active?: boolean; // highlights this row as the next prayer (Home screen only)
}

// Matches PrayerTimeRow.jsx: a small "Next" pill next to the name (not just
// a tinted row), green-tinted background reserved for this prayer-identity
// moment, tabular numerals on the times so they align cleanly.
export default function TimeRow({ label, azan, jamaat, active = false }: TimeRowProps) {
  return (
    <View style={[styles.row, active && styles.rowActive]}>
      <View style={styles.nameGroup}>
        <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
        {active && (
          <View style={styles.nextPill}>
            <Text style={styles.nextPillText}>Next</Text>
          </View>
        )}
      </View>
      <Text style={styles.times}>
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
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.sm3,
    borderTopWidth: 0.5,
    borderTopColor: theme.colors.border,
    borderRadius: theme.radius.control,
  },
  rowActive: {
    backgroundColor: theme.colors.prayerSubtle,
    marginHorizontal: -theme.spacing.sm3,
    paddingHorizontal: theme.spacing.sm3 + theme.spacing.sm3,
    borderTopWidth: 0,
  },
  nameGroup: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontSize: theme.typography.body, color: theme.colors.textPrimary },
  labelActive: { fontWeight: '600' },
  nextPill: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  nextPillText: { fontSize: 11, fontWeight: '600', color: theme.colors.prayerDark },
  times: { fontSize: theme.typography.label, color: theme.colors.textSecondary, fontVariant: ['tabular-nums'] },
});
