import { View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface AdminHeaderProps {
  email: string;
  onLogout: () => void;
}

export default function AdminHeader({ email, onLogout }: AdminHeaderProps) {
  return (
    <View style={styles.row}>
      <View>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      <Pressable onPress={onLogout}>
        <Text style={styles.logout}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  label: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, marginBottom: 2 },
  email: { fontSize: theme.typography.title, fontWeight: '700', color: theme.colors.textPrimary },
  logout: { fontSize: theme.typography.caption, color: theme.colors.textMuted, paddingTop: 4 },
});
