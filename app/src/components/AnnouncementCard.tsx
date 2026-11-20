import { useState } from 'react';
import { View, StyleSheet, LayoutAnimation } from 'react-native';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Text from '@/components/Text';
import Icon from '@/components/Icon';
import PressableScale from '@/components/PressableScale';
import { theme } from '@/constants/theme';

dayjs.extend(relativeTime);

interface AnnouncementCardProps {
  title: string;
  body: string;
  createdAt: number;
  /** Start expanded (full text) instead of a two-line preview. */
  defaultExpanded?: boolean;
  /** Extra controls shown under the text, e.g. admin edit/delete. */
  footer?: React.ReactNode;
}

/** "2h ago" for recent posts, a plain date after a week. */
export function formatPostedAt(createdAt: number): string {
  const posted = dayjs(createdAt);
  return dayjs().diff(posted, 'day') < 7 ? posted.fromNow() : posted.format('D MMM YYYY');
}

// Announcement in its gold identity: icon tile, title, time, and a body that
// expands smoothly in place when tapped.
export default function AnnouncementCard({ title, body, createdAt, defaultExpanded = false, footer }: AnnouncementCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const canExpand = body.length > 90;

  const toggle = () => {
    if (!canExpand) return;
    LayoutAnimation.configureNext(LayoutAnimation.create(220, 'easeInEaseOut', 'opacity'));
    setExpanded((e) => !e);
  };

  return (
    <PressableScale style={[styles.card, theme.shadow.sm]} onPress={toggle} haptic={canExpand}>
      <View style={styles.header}>
        <View style={styles.iconTile}>
          <Icon name="bullhorn-outline" size={19} color={theme.colors.accentGold} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.date}>{formatPostedAt(createdAt)}</Text>
        </View>
      </View>
      <Text style={styles.body} numberOfLines={expanded ? undefined : 2}>
        {body}
      </Text>
      {canExpand && (
        <View style={styles.moreRow}>
          <Text style={styles.more}>{expanded ? 'Show less' : 'Read more'}</Text>
          <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={theme.colors.accentGold} />
        </View>
      )}
      {footer}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm3,
  },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.goldSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm3,
  },
  headerText: { flex: 1 },
  title: { fontSize: theme.typography.bodyLg, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 2 },
  date: { fontSize: theme.typography.caption, color: theme.colors.textTertiary, fontWeight: '500' },
  body: { fontSize: theme.typography.body, color: theme.colors.textSecondary, lineHeight: 22 },
  moreRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 8 },
  more: { fontSize: theme.typography.label, fontWeight: '700', color: theme.colors.accentGold },
});
