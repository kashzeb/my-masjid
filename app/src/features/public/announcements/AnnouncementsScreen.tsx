import { useEffect } from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { useAnnouncementsStore } from '@/store/announcementsStore';
import ScreenContainer from '@/components/ScreenContainer';
import Card from '@/components/Card';
import LoadingIndicator from '@/components/LoadingIndicator';
import EmptyState from '@/components/EmptyState';
import AnnouncementCard from '@/components/AnnouncementCard';

export default function AnnouncementsScreen() {
  const { announcements, status, error, subscribe, unsubscribe } = useAnnouncementsStore();

  useEffect(() => {
    subscribe();
    return () => unsubscribe();
  }, [subscribe, unsubscribe]);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Announcements</Text>

        <Card style={styles.card}>
          {status === 'loading' && <LoadingIndicator label="Loading announcements..." />}

          {status === 'error' && (
            <Text style={styles.errorText}>Couldn't load announcements. {error}</Text>
          )}

          {status === 'loaded' && announcements.length === 0 && (
            <EmptyState message="No announcements yet. Check back soon." />
          )}

          {announcements.map((item) => (
            <AnnouncementCard key={item.id} title={item.title} body={item.body} createdAt={item.createdAt} />
          ))}
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: theme.spacing.md, paddingBottom: theme.spacing.xl },
  heading: {
    fontSize: theme.typography.heading,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  card: { padding: theme.spacing.md },
  errorText: {
    fontSize: theme.typography.caption,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    padding: theme.spacing.lg,
  },
});
