import { View, Text, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { theme } from '@/constants/theme';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function TextField({ label, error, style, ...inputProps }: TextFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={[styles.input, style]} placeholderTextColor={theme.colors.textMuted} {...inputProps} />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: theme.spacing.lg },
  label: { fontSize: theme.typography.caption, color: theme.colors.textSecondary, marginBottom: 6, fontWeight: '500' },
  input: {
    borderWidth: 0.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.control,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: theme.typography.body,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
  },
  error: { color: theme.colors.danger, fontSize: theme.typography.caption, marginTop: 4 },
});
