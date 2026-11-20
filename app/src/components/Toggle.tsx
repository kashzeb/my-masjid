import { Pressable, View, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

// "On" state uses the general UI accent (near-black), not the masjid green -
// a toggle switch isn't a prayer-identity moment, per the design system's
// explicit reservation of green for the countdown hero and next-prayer row.
export default function Toggle({ value, onValueChange, disabled }: ToggleProps) {
  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      style={[styles.track, value && styles.trackOn, disabled && styles.trackDisabled]}
    >
      <View style={[styles.thumb, value && styles.thumbOn]} />
    </Pressable>
  );
}

const SIZE = { width: 40, height: 24, thumb: 18 };

const styles = StyleSheet.create({
  track: {
    width: SIZE.width,
    height: SIZE.height,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.toggleOff,
    justifyContent: 'center',
  },
  trackOn: { backgroundColor: theme.colors.accent },
  trackDisabled: { opacity: 0.4 },
  thumb: {
    width: SIZE.thumb,
    height: SIZE.thumb,
    borderRadius: SIZE.thumb / 2,
    backgroundColor: theme.colors.surface,
    marginLeft: 3,
    ...theme.shadow.sm,
  },
  thumbOn: { marginLeft: SIZE.width - SIZE.thumb - 3 },
});
