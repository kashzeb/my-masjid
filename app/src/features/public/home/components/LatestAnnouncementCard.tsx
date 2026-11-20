import { View, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import Icon from '@/components/Icon';
import PressableScale from '@/components/PressableScale';
import { formatPostedAt } from '@/components/AnnouncementCard';
import { theme } from '@/constants/theme';
import type { Announcement } from '@/models';

interface LatestAnnouncementCardProps {
  announcement: Announcement;
  onPress: () => void;
}

// One-line preview of the newest announcement at the bottom of Home, so the
// screen answers "what's happening at my Masjid?" at a glance.
export default function LatestAnnouncementCard({ announcement, onPress }: LatestAnnouncementCardProps) {
  return (
    <PressableScale style={[styles.card, theme.shadow.sm]} onPress={onPress}>
      <View style={styles.iconTile}>
        <Icon name="bullhorn-outline" size={19} color={theme.colors.accentGold} />
      </View>
      <View style={styles.textColumn}>
        <Text style={styles.eyebrow}>LATEST · {formatPostedAt(announcement.createdAt).toUpperCase()}</Text>
        <Text style={styles.title} numberOfLines={1}>
          {announcement.title}
        </Text>
      </View>
      <Icon name="chevron-right" size={22} color={theme.colors.textTertiary} />
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 14,
    marginHorizontal: theme.spacing.md,
    gap: 12,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: theme.colors.goldSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColumn: { flex: 1 },
  eyebrow: { fontSize: 10, fontWeight: '700', color: theme.colors.accentGold, letterSpacing: 0.8, marginBottom: 2 },
  title: { fontSize: theme.typography.body, fontWeight: '700', color: theme.colors.textPrimary },
});
