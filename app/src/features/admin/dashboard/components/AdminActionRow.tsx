import { View, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import Icon, { type IconName } from '@/components/Icon';
import PressableScale from '@/components/PressableScale';
import { theme } from '@/constants/theme';

interface AdminActionRowProps {
  title: string;
  subtitle: string;
  icon: IconName;
  tone?: 'prayer' | 'gold';
  onPress: () => void;
}

export default function AdminActionRow({ title, subtitle, icon, tone = 'prayer', onPress }: AdminActionRowProps) {
  const iconColor = tone === 'gold' ? theme.colors.accentGold : theme.colors.prayer;
  const iconBg = tone === 'gold' ? theme.colors.goldSubtle : theme.colors.prayerSubtle;
  return (
    <PressableScale onPress={onPress} style={[styles.row, theme.shadow.sm]}>
      <View style={[styles.iconTile, { backgroundColor: iconBg }]}>
        <Icon name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.textGroup}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Icon name="chevron-right" size={22} color={theme.colors.textTertiary} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm3,
    gap: 14,
  },
  iconTile: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  textGroup: { flex: 1 },
  title: { fontSize: theme.typography.bodyLg, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 2 },
  subtitle: { fontSize: theme.typography.label, color: theme.colors.textSecondary },
});
