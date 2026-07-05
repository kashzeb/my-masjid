import { View, Text, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import { theme } from '@/constants/theme';

interface AnnouncementCardProps {
  title: string;
  body: string;
  createdAt: number;
}

// Matches EventCard.jsx: a left accent bar, full height, rounded - gold
// here, since announcements get their own identity color (Architecture
// note: distinct from the near-black UI accent and the masjid-green
// prayer identity). Adapted from the original spec's "time · location"
// line, since our data is a date + free-text body, not structured metadata.
export default function AnnouncementCard({ title, body, createdAt }: AnnouncementCardProps) {
  return (
    <View style={[styles.card, theme.shadow.sm]}>
      <View style={styles.accentBar} />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.date}>{dayjs(createdAt).format('D MMMM')}</Text>
        <Text style={styles.body} numberOfLines={2}>
          {body}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm3,
  },
  accentBar: {
    width: 4,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.accentGold,
    marginRight: theme.spacing.sm3,
  },
  content: { flex: 1 },
  title: { fontSize: theme.typography.body, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: 3 },
  date: { fontSize: theme.typography.caption, color: theme.colors.textTertiary, marginBottom: 4 },
  body: { fontSize: theme.typography.label, color: theme.colors.textSecondary },
});
