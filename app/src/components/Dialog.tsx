import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface DialogButton {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

interface DialogProps {
  visible: boolean;
  title: string;
  message: string;
  buttons: DialogButton[];
}

export default function Dialog({ visible, title, message, buttons }: DialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.sheet, theme.shadow.lg]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.footer}>
            {buttons.map((btn) => (
              <Pressable
                key={btn.label}
                onPress={btn.onPress}
                style={[styles.button, btn.variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary]}
              >
                <Text style={[styles.buttonText, btn.variant === 'primary' && styles.buttonTextPrimary]}>{btn.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,10,13,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.card,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 360,
  },
  title: { fontSize: theme.typography.subheading, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 8 },
  message: { fontSize: theme.typography.body, color: theme.colors.textSecondary, marginBottom: theme.spacing.lg },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  button: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: theme.radius.pill },
  buttonPrimary: { backgroundColor: theme.colors.accent },
  buttonSecondary: { backgroundColor: theme.colors.accentSubtle },
  buttonText: { fontSize: theme.typography.label, fontWeight: '600', color: theme.colors.textPrimary },
  buttonTextPrimary: { color: theme.colors.textOnAccent },
});
