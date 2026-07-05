import { Pressable, Text, View, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface AdminActionRowProps {
  title: string;
  subtitle: string;
  onPress: () => void;
}

export default function AdminActionRow({ title, subtitle, onPress }: AdminActionRowProps) {
  return (
    <Pressable onPress={onPress} style={[styles.row, theme.shadow.sm]}>
      <View style={styles.textGroup}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.control,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  textGroup: { flex: 1 },
  title: { fontSize: theme.typography.body, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: 2 },
  subtitle: { fontSize: theme.typography.label, color: theme.colors.textSecondary },
  chevron: { fontSize: 22, color: theme.colors.textTertiary, marginLeft: theme.spacing.sm },
});
