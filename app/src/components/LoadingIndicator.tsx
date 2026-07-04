import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface LoadingIndicatorProps {
  label?: string;
}

export default function LoadingIndicator({ label = 'Loading…' }: LoadingIndicatorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: theme.spacing.lg, alignItems: 'center' },
  label: { fontSize: theme.typography.caption, color: theme.colors.textSecondary },
});
