import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Text from '@/components/Text';
import Icon from '@/components/Icon';
import { theme } from '@/constants/theme';
import { useToastStore } from '@/store/toastStore';

/**
 * Mounted once in App.tsx above the navigator. Anywhere in the app can call
 * showToast('message'); the toast slides down from the top and fades in.
 */
export default function ToastHost() {
  const { message, variant } = useToastStore();
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!message) return;
    progress.setValue(0);
    Animated.spring(progress, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 7 }).start();
  }, [message, progress]);

  if (!message) return null;

  const tone =
    variant === 'success'
      ? { icon: 'check-circle' as const, color: theme.colors.prayer }
      : variant === 'danger'
        ? { icon: 'alert-circle-outline' as const, color: theme.colors.danger }
        : { icon: 'information-outline' as const, color: theme.colors.textSecondary };

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [-24, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.wrapper, { top: insets.top + 8, opacity: progress, transform: [{ translateY }] }]}
    >
      <Animated.View style={[styles.toast, theme.shadow.md]}>
        <Icon name={tone.icon} size={19} color={tone.color} />
        <Text style={styles.text}>{message}</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: 'absolute', left: 0, right: 0, alignItems: 'center', zIndex: 999 },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.pill,
    paddingVertical: 11,
    paddingLeft: 14,
    paddingRight: 18,
    maxWidth: '88%',
  },
  text: { fontSize: theme.typography.label, fontWeight: '700', color: theme.colors.textPrimary },
});
