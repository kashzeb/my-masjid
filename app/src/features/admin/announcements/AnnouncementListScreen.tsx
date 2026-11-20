import { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import Icon from '@/components/Icon';
import PressableScale from '@/components/PressableScale';
import Skeleton from '@/components/Skeleton';
import FadeIn from '@/components/FadeIn';
import { theme } from '@/constants/theme';
import { useAnnouncementsStore } from '@/store/announcementsStore';
import { useAuthStore } from '@/store/authStore';
import { softDeleteAnnouncement } from '@/services/announcementsService';
import { showToast } from '@/store/toastStore';
import { successHaptic } from '@/utils/haptics';
import ScreenContainer from '@/components/ScreenContainer';
import EmptyState from '@/components/EmptyState';
import AnnouncementCard from '@/components/AnnouncementCard';
import Dialog from '@/components/Dialog';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/app/RootNavigator';

type Props = NativeStackScreenProps<SettingsStackParamList, 'AnnouncementList'>;

export default function AnnouncementListScreen({ navigation }: Props) {
  const { announcements, status, subscribe, unsubscribe } = useAnnouncementsStore();
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
      successHaptic();
      showToast('Announcement deleted', 'default');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : String(err));
    }
  };

  const loading = status === 'idle' || status === 'loading';

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.headerText}>
            <Text style={styles.heading}>Announcements</Text>
            <Text style={styles.subheading}>Publishing sends a notification to everyone</Text>
          </View>
          <PressableScale style={[styles.newButton, theme.shadow.sm]} onPress={() => navigation.navigate('AnnouncementForm')}>
            <Icon name="plus" size={18} color={theme.colors.textOnAccent} />
            <Text style={styles.newButtonText}>New</Text>
          </PressableScale>
        </View>

        {loading && [0, 1].map((i) => <Skeleton key={i} height={120} radius={theme.radius.card} style={styles.skeleton} />)}

        {status === 'error' && (
          <EmptyState icon="wifi-off" title="Couldn't load announcements" message="Check your internet connection and try again." />
        )}

        {status === 'loaded' && announcements.length === 0 && (
          <EmptyState title="Nothing published yet" message="Tap New to post your first announcement." />
        )}

        {announcements.map((item, index) => (
          <FadeIn key={item.id} delay={Math.min(index, 6) * 50}>
            <AnnouncementCard
              title={item.title}
              body={item.body}
              createdAt={item.createdAt}
              footer={
                <View style={styles.itemActions}>
                  <PressableScale
                    style={styles.actionButton}
                    onPress={() => navigation.navigate('AnnouncementForm', { announcementId: item.id })}
                  >
                    <Icon name="pencil-outline" size={16} color={theme.colors.textPrimary} />
                    <Text style={styles.actionText}>Edit</Text>
                  </PressableScale>
                  <PressableScale
                    style={[styles.actionButton, styles.actionButtonDanger]}
                    onPress={() => setPendingDelete({ id: item.id, title: item.title })}
                  >
                    <Icon name="trash-can-outline" size={16} color={theme.colors.danger} />
                    <Text style={[styles.actionText, styles.actionTextDanger]}>Delete</Text>
                  </PressableScale>
                </View>
              }
            />
          </FadeIn>
        ))}
      </ScrollView>

      <Dialog
        visible={pendingDelete !== null}
        title="Delete announcement?"
        message={pendingDelete ? `"${pendingDelete.title}" will be removed from everyone's feed.` : ''}
        buttons={[
          { label: 'Cancel', onPress: () => setPendingDelete(null), variant: 'secondary' },
          { label: 'Delete', onPress: confirmDelete, variant: 'danger' },
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
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xs,
    paddingTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  headerText: { flex: 1 },
  heading: { fontSize: 24, fontWeight: '800', color: theme.colors.textPrimary, letterSpacing: -0.4 },
  subheading: { fontSize: theme.typography.label, color: theme.colors.textSecondary, marginTop: 2 },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    paddingLeft: 12,
    paddingRight: 16,
    paddingVertical: 10,
  },
  newButtonText: { color: theme.colors.textOnAccent, fontWeight: '700', fontSize: theme.typography.label },
  skeleton: { marginBottom: theme.spacing.sm3 },
  itemActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: theme.spacing.sm3,
    paddingTop: theme.spacing.sm3,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.surfaceSunken,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  actionButtonDanger: { backgroundColor: theme.colors.dangerSubtle },
  actionText: { fontSize: theme.typography.label, fontWeight: '700', color: theme.colors.textPrimary },
  actionTextDanger: { color: theme.colors.danger },
});
