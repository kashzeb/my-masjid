import { View, Text, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { useToastStore } from '@/store/toastStore';

/**
 * Mounted once, in App.tsx, above the navigator - renders whatever's
 * currently in the toast store. Anywhere in the app can call
 * showToast('message') without needing to render anything itself.
 */
export default function ToastHost() {
  const { message, variant } = useToastStore();
  if (!message) return null;

  const tone =
    variant === 'success'
      ? { bg: theme.colors.successSubtle, text: theme.colors.prayerDark, accent: theme.colors.prayer }
      : variant === 'danger'
        ? { bg: theme.colors.dangerSubtle, text: theme.colors.danger, accent: theme.colors.danger }
        : { bg: theme.colors.surface, text: theme.colors.textPrimary, accent: theme.colors.borderStrong };

  return (
    <View style={styles.wrapper} pointerEvents="none">
      <View style={[styles.toast, { backgroundColor: tone.bg, borderLeftColor: tone.accent }, theme.shadow.md]}>
        <Text style={[styles.text, { color: tone.text }]}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  toast: {
    borderLeftWidth: 3,
    borderRadius: theme.radius.control,
    paddingVertical: 12,
    paddingHorizontal: 16,
    maxWidth: '85%',
  },
  text: { fontSize: theme.typography.label, fontWeight: '500' },
});
