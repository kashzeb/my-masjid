import { View, Text, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import { theme } from '@/constants/theme';

interface AnnouncementCardProps {
  title: string;
  body: string;
  createdAt: number;
}

export default function AnnouncementCard({ title, body, createdAt }: AnnouncementCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.date}>{dayjs(createdAt).format('D MMMM')}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body} numberOfLines={2}>
        {body}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.control,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  date: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, marginBottom: 4 },
  title: { fontSize: theme.typography.body, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: 4 },
  body: { fontSize: theme.typography.caption, color: theme.colors.textSecondary },
});
