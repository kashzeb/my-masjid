import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/RootNavigator';
import { useAuthStore } from '@/store/authStore';
import ScreenContainer from '@/components/ScreenContainer';
import Card from '@/components/Card';

// M0 stub still for the notification toggles (arriving in M8) - but the
// admin entry point is now real: checks actual auth state (Navigation Flow
// SS3.2) rather than always routing to Login.
export default function SettingsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const user = useAuthStore((s) => s.user);

  const handleAdminPress = () => {
    navigation.navigate(user ? 'Dashboard' : 'Login');
  };

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={styles.heading}>Settings</Text>
        <Card style={styles.card}>
          <Text style={styles.note}>Notification toggles arrive in M8</Text>
        </Card>
        <Pressable onPress={handleAdminPress} style={styles.adminLink}>
          <Text style={styles.adminLinkText}>Masjid admin</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, padding: theme.spacing.md },
  heading: {
    fontSize: theme.typography.heading,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  card: { padding: theme.spacing.lg, alignItems: 'center' },
  note: { fontSize: theme.typography.caption, color: theme.colors.textSecondary },
  adminLink: { marginTop: theme.spacing.lg, padding: 12, alignItems: 'center' },
  adminLinkText: { fontSize: theme.typography.body, color: theme.colors.textMuted },
});
