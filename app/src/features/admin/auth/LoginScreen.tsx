import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// M0 stub — real Firebase Auth wiring arrives in M3. The "replace" navigation
// (not "push") on success matters per Navigation Flow §3.2: back-from-Dashboard
// should skip Login and land on Settings.
export default function LoginScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Masjid admin login</Text>
      <Text style={styles.note}>Real auth arrives in M3</Text>
      <Pressable onPress={() => navigation.replace('Dashboard')} style={styles.button}>
        <Text style={styles.buttonText}>Continue (temporary)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surface, padding: theme.spacing.lg },
  title: { fontSize: theme.typography.title, color: theme.colors.textPrimary, fontWeight: '500' },
  note: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, marginTop: 8, marginBottom: 24 },
  button: { backgroundColor: theme.colors.accent, borderRadius: theme.radius.control, paddingVertical: 12, paddingHorizontal: 20 },
  buttonText: { color: '#fff', fontSize: theme.typography.body, fontWeight: '500' },
});
