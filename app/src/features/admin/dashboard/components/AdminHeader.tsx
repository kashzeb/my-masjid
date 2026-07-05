import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface AdminHeaderProps {
  email: string;
  onLogout: () => void;
}

export default function AdminHeader({ email, onLogout }: AdminHeaderProps) {
  return (
    <View style={[styles.card, theme.shadow.sm]}>
      <View>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      <Pressable onPress={onLogout} style={styles.logoutButton}>
        <Text style={styles.logout}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.control,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm3,
    marginBottom: theme.spacing.lg,
  },
  label: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, marginBottom: 2 },
  email: { fontSize: theme.typography.subheading, fontWeight: '700', color: theme.colors.textPrimary },
  logoutButton: { backgroundColor: theme.colors.accentSubtle, borderRadius: theme.radius.pill, paddingHorizontal: 12, paddingVertical: 6 },
  logout: { fontSize: theme.typography.caption, color: theme.colors.textPrimary, fontWeight: '600' },
});
