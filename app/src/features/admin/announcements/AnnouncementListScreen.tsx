import { useEffect } from 'react';
import { ScrollView, Text, Pressable, Alert, View, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { useAnnouncementsStore } from '@/store/announcementsStore';
import { useAuthStore } from '@/store/authStore';
import { softDeleteAnnouncement } from '@/services/announcementsService';
import ScreenContainer from '@/components/ScreenContainer';
import LoadingIndicator from '@/components/LoadingIndicator';
import EmptyState from '@/components/EmptyState';
import AnnouncementCard from '@/components/AnnouncementCard';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/app/RootNavigator';

type Props = NativeStackScreenProps<SettingsStackParamList, 'AnnouncementList'>;

export default function AnnouncementListScreen({ navigation }: Props) {
  const { announcements, status, error, subscribe, unsubscribe } = useAnnouncementsStore();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    subscribe();
    return () => unsubscribe();
  }, [subscribe, unsubscribe]);

  const handleDelete = (id: string, title: string) => {
    Alert.alert('Delete announcement?', `"${title}" will be removed from the feed.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          softDeleteAnnouncement(id, user?.uid ?? 'unknown').catch((err) =>
            Alert.alert('Could not delete', err instanceof Error ? err.message : String(err))
          ),
      },
    ]);
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.heading}>Manage announcements</Text>
          <Pressable style={styles.newButton} onPress={() => navigation.navigate('AnnouncementForm')}>
            <Text style={styles.newButtonText}>+ New</Text>
          </Pressable>
        </View>

        {status === 'loading' && <LoadingIndicator label="Loading announcements..." />}

        {status === 'error' && (
          <Text style={styles.errorText}>Couldn't load announcements. {error}</Text>
        )}

        {status === 'loaded' && announcements.length === 0 && (
          <EmptyState message="No announcements yet. Tap + New to publish one." />
        )}

        {announcements.map((item) => (
          <View key={item.id}>
            <AnnouncementCard title={item.title} body={item.body} createdAt={item.createdAt} />
            <View style={styles.itemActions}>
              <Pressable onPress={() => navigation.navigate('AnnouncementForm', { announcementId: item.id })}>
                <Text style={styles.actionText}>Edit</Text>
              </Pressable>
              <Pressable onPress={() => handleDelete(item.id, item.title)}>
                <Text style={styles.actionTextDestructive}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { padding: theme.spacing.md, paddingBottom: theme.spacing.xl },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  heading: { fontSize: theme.typography.title, fontWeight: '700', color: theme.colors.textPrimary, flex: 1, marginRight: theme.spacing.sm },
  newButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexShrink: 0,
  },
  newButtonText: { color: theme.colors.textOnAccent, fontWeight: '600', fontSize: theme.typography.caption },
  itemActions: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: theme.spacing.sm,
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.sm3,
  },
  actionText: { fontSize: theme.typography.caption, color: theme.colors.accent, fontWeight: '600' },
  actionTextDestructive: { fontSize: theme.typography.caption, color: theme.colors.danger, fontWeight: '600' },
  errorText: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, textAlign: 'center', padding: theme.spacing.lg },
});
