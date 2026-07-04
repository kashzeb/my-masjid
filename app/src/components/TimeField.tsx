import { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '@/constants/theme';

interface TimeFieldProps {
  label: string;
  value: string; // "HH:mm"
  onChangeText: (value: string) => void;
  error?: string;
}

function parseTimeToDate(value: string): Date {
  const [hours, minutes] = value.split(':').map(Number);
  const date = new Date();
  date.setHours(hours || 0, minutes || 0, 0, 0);
  return date;
}

function formatDateToTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

// A real native time picker, per feedback - typing "HH:mm" by hand was a
// poor experience. Android shows its own self-dismissing dialog; iOS's
// spinner-style picker doesn't auto-dismiss, so it's wrapped in a small
// bottom-sheet Modal with explicit Cancel/Done actions.
//
// Uses onValueChange/onDismiss (current API) rather than the deprecated
// onChange - onValueChange fires only on confirm, onDismiss on cancel,
// which is cleaner than the old single-callback-with-event-type approach.
export default function TimeField({ label, value, onChangeText, error }: TimeFieldProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(() => parseTimeToDate(value || '00:00'));

  const openPicker = () => {
    setTempDate(parseTimeToDate(value || '00:00'));
    setShowPicker(true);
  };

  const handleAndroidValueChange = (_event: unknown, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      onChangeText(formatDateToTime(selectedDate));
    }
  };

  const handleIosValueChange = (_event: unknown, selectedDate?: Date) => {
    if (selectedDate) setTempDate(selectedDate);
  };

  const confirmIos = () => {
    onChangeText(formatDateToTime(tempDate));
    setShowPicker(false);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable style={styles.input} onPress={openPicker}>
        <Text style={styles.valueText}>{value || 'HH:mm'}</Text>
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}

      {showPicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={tempDate}
          mode="time"
          is24Hour
          display="default"
          onValueChange={handleAndroidValueChange}
          onDismiss={() => setShowPicker(false)}
        />
      )}

      {Platform.OS === 'ios' && (
        <Modal visible={showPicker} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Pressable onPress={() => setShowPicker(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable onPress={confirmIos}>
                  <Text style={styles.doneText}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker value={tempDate} mode="time" is24Hour display="spinner" onValueChange={handleIosValueChange} />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { flex: 1 },
  label: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, marginBottom: 4 },
  input: {
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.control,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: theme.colors.surface,
  },
  valueText: { fontSize: theme.typography.body, color: theme.colors.textPrimary },
  error: { color: '#B3261E', fontSize: 11, marginTop: 4 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalSheet: { backgroundColor: theme.colors.surface, borderTopLeftRadius: theme.radius.card, borderTopRightRadius: theme.radius.card },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: theme.colors.border,
  },
  cancelText: { fontSize: theme.typography.body, color: theme.colors.textMuted },
  doneText: { fontSize: theme.typography.body, color: theme.colors.accent, fontWeight: '600' },
});
