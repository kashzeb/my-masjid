import { useEffect, useRef } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import Text from '@/components/Text';
import { theme } from '@/constants/theme';

/**
 * Now uses the real Noor Masjid photo as a background (with a built-in
 * gradient overlay baked into the image itself for text legibility),
 * replacing the earlier plain-color placeholder. Text is still hardcoded
 * rather than pulled from Firestore, deliberately - see App.tsx's comment
 * on why this never waits on a network fetch.
 */
interface SplashOverlayProps {
  /** How long the intro stays fully visible before fading out. */
  holdMs: number;
  onFinish: () => void;
}

export default function SplashOverlay({ holdMs, onFinish }: SplashOverlayProps) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(holdMs),
      Animated.timing(opacity, { toValue: 0, duration: 450, useNativeDriver: true }),
    ]);
    animation.start(({ finished }) => finished && onFinish());
    return () => animation.stop();
  }, [holdMs, onFinish, opacity]);

  return (
    <Animated.View style={[styles.container, { opacity }]} pointerEvents="none">
      <Image source={require('../../assets/splash-bg.png')} style={styles.background} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.name}>Noor Masjid</Text>
        <Text style={styles.tagline}>My Masjid</Text>
        <ActivityIndicator color="#FFFFFF" style={styles.loader} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.prayerDark,
    zIndex: 1000,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 100,
  },
  name: { fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 6 },
  tagline: { fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.75)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 24 },
  loader: { marginTop: 8 },
});
