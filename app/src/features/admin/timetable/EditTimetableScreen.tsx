import { useEffect, useState } from 'react';
import { ScrollView, Text, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { theme } from '@/constants/theme';
import { PRAYERS, PRAYER_LABELS } from '@/constants/masjid';
import { useTimetableStore } from '@/store/timetableStore';
import { useAuthStore } from '@/store/authStore';
import { updateTimetable } from '@/services/timetableService';
import { timetableFormSchema, type TimetableFormValues } from './timetableFormSchema';
import PrayerTimetableFormRow from './components/PrayerTimetableFormRow';
import PrimaryButton from '@/components/PrimaryButton';
import ScreenContainer from '@/components/ScreenContainer';
import Dialog from '@/components/Dialog';
import { navigationRef } from '@/app/navigationRef';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SettingsStackParamList } from '@/app/RootNavigator';

type Props = NativeStackScreenProps<SettingsStackParamList, 'EditTimetable'>;

export default function EditTimetableScreen({ navigation }: Props) {
  const { timetable, fetch } = useTimetableStore();
  const user = useAuthStore((s) => s.user);
  const [submitting, setSubmitting] = useState(false);
  const [showSavedDialog, setShowSavedDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { control, handleSubmit, reset } = useForm<TimetableFormValues>({
    resolver: zodResolver(timetableFormSchema),
    defaultValues: timetable ?? undefined,
  });

  useEffect(() => {
    if (timetable) reset(timetable);
  }, [timetable, reset]);

  const onSubmit = async (data: TimetableFormValues) => {
    setSubmitting(true);
    try {
      await updateTimetable(data, user?.uid ?? 'unknown');
      // Immediately refresh the shared store so the public Home screen
      // (and this screen) both reflect the new values right away, matching
      // Architecture SS5 Scenario A - editing is "just a write" with no
      // separate recalculation step needed.
      await fetch();
      setShowSavedDialog(true);
    } catch (err) {
      // A friendlier, non-technical message for the common case (offline);
      // otherwise fall back to whatever the actual error says, rather than
      // hiding real diagnostic information.
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

  const goToHome = () => {
    setShowSavedDialog(false);
    // EditTimetable now lives nested inside the Settings tab's own stack
    // (per feedback - keeps the bottom tab bar visible everywhere), so
    // reaching a *different* tab needs the global navigationRef rather
    // than this screen's own (Settings-stack-scoped) navigation prop.
    navigationRef.navigate('Home');
  };

  if (!timetable) {
    return (
      <ScreenContainer style={styles.centered}>
        <Text style={styles.note}>Loading current timings...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 80 : 0}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.heading}>Edit prayer timings</Text>
          <Text style={styles.subheading}>Changes apply immediately for everyone</Text>

          {PRAYERS.map((prayer) => (
            <PrayerTimetableFormRow key={prayer} prayer={prayer} label={PRAYER_LABELS[prayer]} control={control} />
          ))}

          <PrimaryButton label="Save timetable" onPress={handleSubmit(onSubmit)} loading={submitting} />
        </ScrollView>
      </KeyboardAvoidingView>

      <Dialog
        visible={showSavedDialog}
        title="Saved"
        message="Timings updated for everyone."
        buttons={[
          { label: 'Stay here', onPress: () => setShowSavedDialog(false), variant: 'secondary' },
          { label: 'Go to Home', onPress: goToHome, variant: 'primary' },
        ]}
      />

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
  centered: { alignItems: 'center', justifyContent: 'center' },
  heading: { fontSize: theme.typography.heading, fontWeight: '700', color: theme.colors.textPrimary, paddingHorizontal: theme.spacing.sm, marginBottom: 4 },
  subheading: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, paddingHorizontal: theme.spacing.sm, marginBottom: theme.spacing.lg },
  note: { fontSize: theme.typography.caption, color: theme.colors.textSecondary },
});
