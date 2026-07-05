import { Pressable, View, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function Toggle({ value, onValueChange, disabled }: ToggleProps) {
  return (
    <Pressable
      onPress={() => !disabled && onValueChange(!value)}
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
    backgroundColor: '#fff',
    marginLeft: 3,
  },
  thumbOn: { marginLeft: SIZE.width - SIZE.thumb - 3 },
});
