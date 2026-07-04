import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Dashboard'>;

// M0 stub — real dashboard content (AdminHeader, AdminActionRow) arrives in M3/M4.
export default function DashboardScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin dashboard</Text>
      <Pressable onPress={() => navigation.navigate('EditTimetable')} style={styles.row}>
        <Text style={styles.rowText}>Edit prayer timings</Text>
      </Pressable>
      <Pressable onPress={() => navigation.popToTop()} style={styles.logout}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surface, padding: theme.spacing.lg },
  title: { fontSize: theme.typography.title, color: theme.colors.textPrimary, fontWeight: '500', marginBottom: 24 },
  row: { backgroundColor: theme.colors.surfaceMuted, borderRadius: theme.radius.card, padding: 16, width: '100%' },
  rowText: { fontSize: theme.typography.body, color: theme.colors.textPrimary },
  logout: { marginTop: 24, padding: 12 },
  logoutText: { fontSize: theme.typography.caption, color: theme.colors.textMuted },
});
