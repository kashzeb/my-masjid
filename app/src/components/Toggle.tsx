import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { theme } from '@/constants/theme';
import { tapHaptic } from '@/utils/haptics';

interface ToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

const SIZE = { width: 50, height: 30, thumb: 24, pad: 3 };

// Large, high-contrast switch (elderly-friendly target size) whose thumb
// slides and track color fades between states.
export default function Toggle({ value, onValueChange, disabled }: ToggleProps) {
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, { toValue: value ? 1 : 0, useNativeDriver: false, speed: 22, bounciness: 6 }).start();
  }, [value, progress]);

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, SIZE.width - SIZE.thumb - SIZE.pad * 2] });
  const backgroundColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.colors.toggleOff, theme.colors.accent],
  });

  return (
    <Pressable
      onPress={() => {
        if (disabled) return;
        tapHaptic();
        onValueChange(!value);
      }}
      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    >
      <Animated.View style={[styles.track, { backgroundColor }, disabled && styles.trackDisabled]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: SIZE.width,
    height: SIZE.height,
    borderRadius: theme.radius.pill,
    padding: SIZE.pad,
    justifyContent: 'center',
  },
  trackDisabled: { opacity: 0.4 },
  thumb: {
    width: SIZE.thumb,
    height: SIZE.thumb,
    borderRadius: SIZE.thumb / 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});
