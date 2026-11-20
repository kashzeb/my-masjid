import { useState } from 'react';
import { ScrollView, Text, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { theme } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useAnnouncementsStore } from '@/store/announcementsStore';
import { createAnnouncement, updateAnnouncement } from '@/services/announcementsService';
import { announcementFormSchema, type AnnouncementFormValues } from './announcementFormSchema';
import TextField from '@/components/TextField';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenContainer from '@/components/ScreenContainer';
import Dialog from '@/components/Dialog';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/app/RootNavigator';

type Props = NativeStackScreenProps<SettingsStackParamList, 'AnnouncementForm'>;

export default function AnnouncementFormScreen({ route, navigation }: Props) {
  const announcementId = route.params?.announcementId;
  const isEditing = Boolean(announcementId);
  const user = useAuthStore((s) => s.user);
  const { announcements } = useAnnouncementsStore();
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reuses the same store the admin list already subscribed to - the item
  // is already in memory by the time this screen is reached, no separate
  // fetch needed.
  const existing = announcements.find((a) => a.id === announcementId);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementFormSchema),
    defaultValues: { title: existing?.title ?? '', body: existing?.body ?? '' },
  });

  const onSubmit = async (data: AnnouncementFormValues) => {
    setSubmitting(true);
    try {
      if (isEditing && announcementId) {
        await updateAnnouncement(announcementId, data.title, data.body, user?.uid ?? 'unknown');
      } else {
        await createAnnouncement(data.title, data.body, user?.uid ?? 'unknown');
      }
      navigation.goBack();
    } catch (err) {
      const message =
        err instanceof Error && /network/i.test(err.message)
          ? "Couldn't reach the server — check your internet connection and try again."
          : err instanceof Error
            ? err.message
            : String(err);
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.heading}>{isEditing ? 'Edit announcement' : 'New announcement'}</Text>

          <Controller
            control={control}
            name="title"
            render={({ field }) => (
              <TextField label="Title" value={field.value} onChangeText={field.onChange} error={errors.title?.message} />
            )}
          />

          <Controller
            control={control}
            name="body"
            render={({ field }) => (
              <TextField
                label="Body"
                value={field.value}
                onChangeText={field.onChange}
                error={errors.body?.message}
                multiline
                numberOfLines={5}
                style={styles.bodyInput}
              />
            )}
          />

          <PrimaryButton
            label={isEditing ? 'Save changes' : 'Publish announcement'}
            onPress={handleSubmit(onSubmit)}
            loading={submitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <Dialog
        visible={errorMessage !== null}
        title="Couldn't save"
        message={errorMessage ?? ''}
        buttons={[{ label: 'OK', onPress: () => setErrorMessage(null), variant: 'primary' }]}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: theme.spacing.md, paddingBottom: theme.spacing.xxl * 3 },
  heading: {
    fontSize: theme.typography.heading,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  bodyInput: { minHeight: 120, textAlignVertical: 'top' },
});
