import { StyleSheet, ActivityIndicator, View } from 'react-native';
import Text from '@/components/Text';
import Icon, { type IconName } from '@/components/Icon';
import PressableScale from '@/components/PressableScale';
import { theme } from '@/constants/theme';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: IconName;
}

// The one solid action button style: masjid green, pill-shaped, with a
// gentle press-shrink and haptic tick.
export default function PrimaryButton({ label, onPress, loading, disabled, icon }: PrimaryButtonProps) {
  return (
    <PressableScale
      style={[styles.button, theme.shadow.sm, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={theme.colors.textOnAccent} />
      ) : (
        <View style={styles.inner}>
          {icon && <Icon name={icon} size={18} color={theme.colors.textOnAccent} />}
          <Text style={styles.text}>{label}</Text>
        </View>
      )}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.pill,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonDisabled: { opacity: 0.45 },
  inner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  text: { color: theme.colors.textOnAccent, fontSize: theme.typography.body, fontWeight: '700' },
});
