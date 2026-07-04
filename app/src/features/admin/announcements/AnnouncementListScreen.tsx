import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

// M0 stub — real CRUD list arrives in M5.
export default function AnnouncementListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage announcements</Text>
      <Text style={styles.note}>Real CRUD arrives in M5</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surface },
  title: { fontSize: theme.typography.title, color: theme.colors.textPrimary, fontWeight: '500' },
  note: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, marginTop: 8 },
});
