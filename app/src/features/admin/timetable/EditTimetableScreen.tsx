import { useEffect, useState } from 'react';
import { ScrollView, Text, Alert, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
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
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'EditTimetable'>;

export default function EditTimetableScreen({ navigation }: Props) {
  const { timetable, fetch } = useTimetableStore();
  const user = useAuthStore((s) => s.user);
  const [submitting, setSubmitting] = useState(false);

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
      Alert.alert('Saved', 'Timings updated for everyone.', [
        { text: 'Stay here', style: 'cancel' },
        // navigate() (not push) pops back to the existing Dashboard
        // instance already on the stack, rather than stacking a duplicate.
        { text: 'Go to Dashboard', onPress: () => navigation.navigate('Dashboard') },
      ]);
    } catch (err) {
      Alert.alert('Could not save', err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
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
  savedNote: { fontSize: theme.typography.caption, color: theme.colors.accent, textAlign: 'center', marginBottom: theme.spacing.md, fontWeight: '600' },
});
