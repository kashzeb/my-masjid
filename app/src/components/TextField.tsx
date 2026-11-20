import { useState } from 'react';
import { View, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import Text from '@/components/Text';
import { theme } from '@/constants/theme';

interface TextFieldProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function TextField({ label, error, style, onFocus, onBlur, ...inputProps }: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, focused && styles.inputFocused, !!error && styles.inputError, style]}
        placeholderTextColor={theme.colors.textTertiary}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...inputProps}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: theme.spacing.lg },
  label: { fontSize: theme.typography.label, color: theme.colors.textSecondary, marginBottom: 8, fontWeight: '600' },
  input: {
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.control,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: theme.typography.bodyLg,
    fontFamily: theme.font.medium,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.surface,
  },
  inputFocused: { borderColor: theme.colors.accent },
  inputError: { borderColor: theme.colors.danger },
  error: { color: theme.colors.danger, fontSize: theme.typography.caption, marginTop: 6, fontWeight: '500' },
});
