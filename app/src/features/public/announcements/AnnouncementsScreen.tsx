import { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import Text from '@/components/Text';
import { theme } from '@/constants/theme';
import { useAnnouncementsStore } from '@/store/announcementsStore';
import ScreenContainer from '@/components/ScreenContainer';
import EmptyState from '@/components/EmptyState';
import AnnouncementCard from '@/components/AnnouncementCard';
import Skeleton from '@/components/Skeleton';
import FadeIn from '@/components/FadeIn';

function AnnouncementSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <Skeleton width={40} height={40} radius={12} />
        <View style={styles.skeletonHeaderText}>
          <Skeleton width="70%" height={15} />
          <Skeleton width={70} height={11} style={styles.gapTop} />
        </View>
      </View>
      <Skeleton height={12} />
      <Skeleton width="80%" height={12} style={styles.gapTop} />
    </View>
  );
}

export default function AnnouncementsScreen() {
  const { announcements, status, subscribe, unsubscribe } = useAnnouncementsStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    subscribe();
    return () => unsubscribe();
  }, [subscribe, unsubscribe]);

  // The feed is a live listener, so it's always current - pull-to-refresh
  // just gives people the reassuring gesture they expect.
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  }, []);

  const loading = status === 'idle' || status === 'loading';

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.accentGold} colors={[theme.colors.accentGold]} />
        }
      >
        <Text style={styles.heading}>Announcements</Text>
        <Text style={styles.subheading}>News and notices from your Masjid</Text>

        {loading && [0, 1, 2].map((i) => <AnnouncementSkeleton key={i} />)}

        {status === 'error' && (
          <EmptyState icon="wifi-off" title="Couldn't load announcements" message="Check your internet connection. New posts will appear here automatically." />
        )}

        {status === 'loaded' && announcements.length === 0 && (
          <EmptyState title="No announcements yet" message="When the Masjid posts an update, you'll see it here and get a notification." />
        )}

        {announcements.map((item, index) => (
          <FadeIn key={item.id} delay={Math.min(index, 6) * 50}>
            <AnnouncementCard title={item.title} body={item.body} createdAt={item.createdAt} defaultExpanded={index === 0} />
          </FadeIn>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: theme.spacing.md, paddingBottom: theme.spacing.xl },
  heading: {
    fontSize: theme.typography.heading,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: -0.5,
    paddingHorizontal: theme.spacing.xs,
    paddingTop: theme.spacing.md,
  },
  subheading: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.xs,
    marginTop: 2,
    marginBottom: theme.spacing.lg,
  },
  skeletonCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm3,
  },
  skeletonHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  skeletonHeaderText: { flex: 1, marginLeft: theme.spacing.sm3 },
  gapTop: { marginTop: 8 },
});
