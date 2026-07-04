import { View, Text, StyleSheet } from 'react-native';
import { Controller, type Control } from 'react-hook-form';
import { theme } from '@/constants/theme';
import TimeField from '@/components/TimeField';
import type { TimetableFormValues } from '../timetableFormSchema';
import type { PrayerName } from '@/constants/masjid';

interface PrayerTimetableFormRowProps {
  prayer: PrayerName;
  label: string;
  control: Control<TimetableFormValues>;
}

export default function PrayerTimetableFormRow({ prayer, label, control }: PrayerTimetableFormRowProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.prayerLabel}>{label}</Text>
      <View style={styles.row}>
        <Controller
          control={control}
          name={`${prayer}.azan`}
          render={({ field, fieldState }) => (
            <TimeField label="Azan" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )}
        />
        <View style={styles.spacer} />
        <Controller
          control={control}
          name={`${prayer}.jamaat`}
          render={({ field, fieldState }) => (
            <TimeField label="Jamaat" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.control,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  prayerLabel: { fontSize: theme.typography.body, fontWeight: '600', color: theme.colors.textPrimary, marginBottom: theme.spacing.sm },
  row: { flexDirection: 'row' },
  spacer: { width: theme.spacing.sm },
});
