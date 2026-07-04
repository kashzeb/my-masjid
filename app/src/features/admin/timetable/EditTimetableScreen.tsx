import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

// M0 stub — real form (Zod schema, TimeField × 10) arrives in M4.
export default function EditTimetableScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit prayer timings</Text>
      <Text style={styles.note}>Real form arrives in M4</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surface },
  title: { fontSize: theme.typography.title, color: theme.colors.textPrimary, fontWeight: '500' },
  note: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, marginTop: 8 },
});
