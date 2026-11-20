import { View, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import Icon, { type IconName } from '@/components/Icon';
import { theme } from '@/constants/theme';

interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: IconName;
}

export default function EmptyState({ title, message, icon = 'bullhorn-outline' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={30} color={theme.colors.accentGold} />
      </View>
      {title && <Text style={styles.title}>{title}</Text>}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 48, paddingHorizontal: theme.spacing.xl, alignItems: 'center' },
  iconWrap: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: theme.colors.goldSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  title: { fontSize: theme.typography.subheading, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 6 },
  message: { fontSize: theme.typography.body, color: theme.colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});
