import { Modal, View, StyleSheet } from 'react-native';
import Text from '@/components/Text';
import PressableScale from '@/components/PressableScale';
import { theme } from '@/constants/theme';

interface DialogButton {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
}

interface DialogProps {
  visible: boolean;
  title: string;
  message: string;
  buttons: DialogButton[];
}

export default function Dialog({ visible, title, message, buttons }: DialogProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={[styles.sheet, theme.shadow.lg]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.footer}>
            {buttons.map((btn) => (
              <PressableScale
                key={btn.label}
                onPress={btn.onPress}
                style={[
                  styles.button,
                  btn.variant === 'primary' && styles.buttonPrimary,
                  btn.variant === 'danger' && styles.buttonDanger,
                  (!btn.variant || btn.variant === 'secondary') && styles.buttonSecondary,
                ]}
              >
                <Text style={[styles.buttonText, (btn.variant === 'primary' || btn.variant === 'danger') && styles.buttonTextOnFill]}>
                  {btn.label}
                </Text>
              </PressableScale>
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
    backgroundColor: 'rgba(5,12,8,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  sheet: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: theme.spacing.xl,
    width: '100%',
    maxWidth: 360,
  },
  title: { fontSize: 19, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 8 },
  message: { fontSize: theme.typography.body, color: theme.colors.textSecondary, marginBottom: theme.spacing.xl, lineHeight: 22 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  button: { paddingVertical: 11, paddingHorizontal: 18, borderRadius: theme.radius.pill },
  buttonPrimary: { backgroundColor: theme.colors.accent },
  buttonDanger: { backgroundColor: theme.colors.danger },
  buttonSecondary: { backgroundColor: theme.colors.surfaceSunken },
  buttonText: { fontSize: theme.typography.body, fontWeight: '700', color: theme.colors.textPrimary },
  buttonTextOnFill: { color: '#FFFFFF' },
});
