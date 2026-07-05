import { View, Text, Image, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface MasjidHeaderProps {
  name: string;
  dateLabel: string;
}

export default function MasjidHeader({ name, dateLabel }: MasjidHeaderProps) {
  return (
    <View style={styles.row}>
      <Image source={require('../../../../../assets/masjid-avatar.png')} style={styles.avatar} />
      <View style={styles.textColumn}>
        <Text style={styles.masjidName}>{name}</Text>
        <Text style={styles.date}>{dateLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.prayerSubtle,
  },
  textColumn: { flex: 1 },
  masjidName: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, fontWeight: '500', marginBottom: 2 },
  date: { fontSize: theme.typography.heading, fontWeight: '700', color: theme.colors.textPrimary },
});
