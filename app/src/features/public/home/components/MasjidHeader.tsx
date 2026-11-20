import { View, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import Icon from '@/components/Icon';
import { theme } from '@/constants/theme';

interface MasjidHeaderProps {
  name: string;
  city?: string;
  dateLabel: string;
  hijriLabel: string;
}

export default function MasjidHeader({ name, city, dateLabel, hijriLabel }: MasjidHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.badge}>
        <Icon name="mosque" size={22} color={theme.colors.prayerOnDark} />
      </View>
      <View style={styles.textColumn}>
        <Text style={styles.masjidName} numberOfLines={1}>
          {city ? `${name} · ${city}` : name}
        </Text>
        <Text style={styles.date}>{dateLabel}</Text>
      </View>
      <View style={styles.hijriPill}>
        <Text style={styles.hijriText}>{hijriLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.colors.prayerDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm3,
  },
  textColumn: { flex: 1 },
  masjidName: { fontSize: theme.typography.label, color: theme.colors.textSecondary, fontWeight: '600', marginBottom: 1 },
  date: { fontSize: 21, fontWeight: '800', color: theme.colors.textPrimary, letterSpacing: -0.4 },
  hijriPill: {
    backgroundColor: theme.colors.goldSubtle,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: theme.spacing.sm,
  },
  hijriText: { fontSize: 11, fontWeight: '700', color: theme.colors.accentGold },
});
