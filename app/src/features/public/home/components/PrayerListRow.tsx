import { View, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import Icon from '@/components/Icon';
import { theme } from '@/constants/theme';
import { PRAYER_ICONS, type PrayerName } from '@/constants/masjid';
import { splitTime12h } from '@/utils/dateTime';

export type PrayerRowState = 'done' | 'current' | 'upcoming';

interface PrayerListRowProps {
  prayer: PrayerName;
  label: string;
  azan: string;
  jamaat: string;
  state: PrayerRowState;
  /** Badge for the current row: "NOW" between Azan and Jamaat, else "NEXT". */
  badge?: 'NOW' | 'NEXT';
}

function TimeCell({ value, strong, active }: { value: string; strong?: boolean; active: boolean }) {
  const { time, period } = splitTime12h(value);
  return (
    <View style={styles.timeCell}>
      <Text style={[styles.time, strong && styles.timeStrong, active && styles.textActive]}>{time}</Text>
      <Text style={[styles.period, active && styles.textActive]}>{period}</Text>
    </View>
  );
}

// One prayer in today's list: icon, name, Azan and Jamaat columns. Finished
// prayers fade back with a tick; the current one is highlighted in green.
export default function PrayerListRow({ prayer, label, azan, jamaat, state, badge }: PrayerListRowProps) {
  const active = state === 'current';
  return (
    <View style={[styles.row, active && styles.rowActive, state === 'done' && styles.rowDone]}>
      <View style={[styles.iconTile, active && styles.iconTileActive]}>
        <Icon name={PRAYER_ICONS[prayer]} size={19} color={active ? '#FFFFFF' : theme.colors.textSecondary} />
      </View>
      <View style={styles.nameGroup}>
        <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
        {state === 'done' && <Icon name="check" size={15} color={theme.colors.prayer} />}
        {active && badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
      </View>
      <TimeCell value={azan} active={active} />
      <TimeCell value={jamaat} strong active={active} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowActive: { backgroundColor: theme.colors.prayerSubtle, borderColor: theme.colors.prayerBorder },
  rowDone: { opacity: 0.5 },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: theme.colors.surfaceSunken,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconTileActive: { backgroundColor: theme.colors.prayerDark },
  nameGroup: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  label: { fontSize: theme.typography.bodyLg, fontWeight: '600', color: theme.colors.textPrimary },
  labelActive: { fontWeight: '800', color: theme.colors.prayerSubtleText },
  badge: { backgroundColor: theme.colors.prayerDark, borderRadius: theme.radius.pill, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.5 },
  timeCell: { width: 70, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'flex-end', gap: 3 },
  time: { fontSize: theme.typography.bodyLg, fontWeight: '500', color: theme.colors.textPrimary, fontVariant: ['tabular-nums'] },
  timeStrong: { fontWeight: '700' },
  period: { fontSize: 10, fontWeight: '600', color: theme.colors.textTertiary },
  textActive: { color: theme.colors.prayerSubtleText },
});
