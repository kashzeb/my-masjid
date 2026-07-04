import { Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

export default function OfflineBanner() {
  return <Text style={styles.text}>Showing saved data — may not be up to date</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
});
