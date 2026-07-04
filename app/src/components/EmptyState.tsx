import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: theme.spacing.xl, alignItems: 'center' },
  message: { fontSize: theme.typography.body, color: theme.colors.textMuted, textAlign: 'center' },
});
