import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/RootNavigator';

// M0 stub — real toggles arrive in M8. The "Masjid admin" link is wired now
// because it's the entry point into the admin stack (Navigation Flow §3.1)
// and needs to exist for M0's "all 8 screens reachable" definition of done.
//
// Settings is a screen inside the PublicTabs navigator, but "Login" lives on
// the parent root stack — this needs the root stack's navigation object
// specifically (a plain screen-props type here would only see sibling tabs).
export default function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.note}>Notification toggles arrive in M8</Text>
      <Pressable onPress={() => navigation.navigate('Login')} style={styles.adminLink}>
        <Text style={styles.adminLinkText}>Masjid admin</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.surface },
  title: { fontSize: theme.typography.title, color: theme.colors.textPrimary, fontWeight: '500' },
  note: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, marginTop: 8 },
  adminLink: { marginTop: 32, padding: 12 },
  adminLinkText: { fontSize: theme.typography.body, color: theme.colors.textMuted },
});
