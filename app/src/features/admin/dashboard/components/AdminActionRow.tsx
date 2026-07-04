import { Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface AdminActionRowProps {
  title: string;
  subtitle: string;
  onPress: () => void;
}

export default function AdminActionRow({ title, subtitle, onPress }: AdminActionRowProps) {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.control,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  title: { fontSize: theme.typography.body, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: 2 },
  subtitle: { fontSize: theme.typography.caption, color: theme.colors.textSecondary },
});
