import { View, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import Icon from '@/components/Icon';
import PressableScale from '@/components/PressableScale';
import { theme } from '@/constants/theme';

interface AdminHeaderProps {
  email: string;
  onLogout: () => void;
}

export default function AdminHeader({ email, onLogout }: AdminHeaderProps) {
  const initial = email.charAt(0).toUpperCase() || 'A';
  return (
    <View style={styles.wrapper}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <View style={styles.textColumn}>
        <Text style={styles.label}>Signed in as</Text>
        <Text style={styles.email} numberOfLines={1}>
          {email}
        </Text>
      </View>
      <PressableScale onPress={onLogout} style={styles.logoutButton} accessibilityLabel="Log out">
        <Icon name="logout" size={18} color={theme.colors.textPrimary} />
        <Text style={styles.logout}>Log out</Text>
      </PressableScale>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    gap: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: theme.colors.prayerDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 19, fontWeight: '800', color: '#FFFFFF' },
  textColumn: { flex: 1 },
  label: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, fontWeight: '500' },
  email: { fontSize: theme.typography.bodyLg, fontWeight: '700', color: theme.colors.textPrimary },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logout: { fontSize: theme.typography.label, color: theme.colors.textPrimary, fontWeight: '700' },
});
