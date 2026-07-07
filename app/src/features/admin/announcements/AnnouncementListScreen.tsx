import { useEffect, useState } from 'react';
import { ScrollView, Text, Pressable, View, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { useAnnouncementsStore } from '@/store/announcementsStore';
import { useAuthStore } from '@/store/authStore';
import { softDeleteAnnouncement } from '@/services/announcementsService';
import ScreenContainer from '@/components/ScreenContainer';
import LoadingIndicator from '@/components/LoadingIndicator';
import EmptyState from '@/components/EmptyState';
import AnnouncementCard from '@/components/AnnouncementCard';
import Dialog from '@/components/Dialog';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/app/RootNavigator';

type Props = NativeStackScreenProps<SettingsStackParamList, 'AnnouncementList'>;

export default function AnnouncementListScreen({ navigation }: Props) {
  const { announcements, status, error, subscribe, unsubscribe } = useAnnouncementsStore();
  const user = useAuthStore((s) => s.user);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; title: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    subscribe();
    return () => unsubscribe();
  }, [subscribe, unsubscribe]);

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    const { id } = pendingDelete;
    setPendingDelete(null);
    try {
      await softDeleteAnnouncement(id, user?.uid ?? 'unknown');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    }
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
              <Pressable
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => navigation.navigate('AnnouncementForm', { announcementId: item.id })}
              >
                <Text style={styles.actionText}>Edit</Text>
              </Pressable>
              <Pressable
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                onPress={() => setPendingDelete({ id: item.id, title: item.title })}
              >
                <Text style={styles.actionTextDestructive}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      <Dialog
        visible={pendingDelete !== null}
        title="Delete announcement?"
        message={pendingDelete ? `"${pendingDelete.title}" will be removed from the feed.` : ''}
        buttons={[
          { label: 'Cancel', onPress: () => setPendingDelete(null), variant: 'secondary' },
          { label: 'Delete', onPress: confirmDelete, variant: 'primary' },
        ]}
      />

      <Dialog
        visible={errorMessage !== null}
        title="Couldn't delete"
        message={errorMessage ?? ''}
        buttons={[{ label: 'OK', onPress: () => setErrorMessage(null), variant: 'primary' }]}
      />
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
