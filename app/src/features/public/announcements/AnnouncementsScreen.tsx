import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

// M0 stub — real feed (Firestore listener) arrives in M2.
export default function AnnouncementsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Announcements</Text>
      <Text style={styles.note}>Feed arrives in M2</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surface },
  title: { fontSize: theme.typography.title, color: theme.colors.textPrimary, fontWeight: '500' },
  note: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, marginTop: 8 },
});
