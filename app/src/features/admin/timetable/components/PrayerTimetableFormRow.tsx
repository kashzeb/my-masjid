import { View, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import Icon from '@/components/Icon';
import { Controller, type Control } from 'react-hook-form';
import { theme } from '@/constants/theme';
import TimeField from '@/components/TimeField';
import type { TimetableFormValues } from '../timetableFormSchema';
import { PRAYER_ICONS, type PrayerName } from '@/constants/masjid';

interface PrayerTimetableFormRowProps {
  prayer: PrayerName;
  label: string;
  control: Control<TimetableFormValues>;
}

export default function PrayerTimetableFormRow({ prayer, label, control }: PrayerTimetableFormRowProps) {
  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <View style={styles.iconTile}>
          <Icon name={PRAYER_ICONS[prayer]} size={18} color={theme.colors.prayer} />
        </View>
        <Text style={styles.prayerLabel}>{label}</Text>
      </View>
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
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm3,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm3 },
  iconTile: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: theme.colors.prayerSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  prayerLabel: { fontSize: theme.typography.bodyLg, fontWeight: '700', color: theme.colors.textPrimary },
  row: { flexDirection: 'row' },
  spacer: { width: theme.spacing.sm },
});
