import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '@/constants/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

// Updated to match the design system's Button (primary variant): fully
// pill-shaped, near-black background - the primary interactive accent,
// deliberately distinct from the masjid green reserved for prayer moments.
export default function PrimaryButton({ label, onPress, loading, disabled }: PrimaryButtonProps) {
  return (
    <Pressable style={[styles.button, disabled && styles.buttonDisabled]} onPress={onPress} disabled={disabled || loading}>
      {loading ? <ActivityIndicator color={theme.colors.textOnAccent} /> : <Text style={styles.text}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.45 },
  text: { color: theme.colors.textOnAccent, fontSize: theme.typography.body, fontWeight: '600' },
});
