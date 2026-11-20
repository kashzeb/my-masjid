import { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import Text from '@/components/Text';
import Icon from '@/components/Icon';
import { theme } from '@/constants/theme';
import { PRAYER_ICONS } from '@/constants/masjid';
import type { PrayerEvent } from '@/utils/dateTime';

interface NextEventCardProps {
  event: PrayerEvent;
  countdownLabel: string;
  /** 0-1: how far we are between the previous event and this one. */
  progress: number;
}

const RING = { size: 76, stroke: 6 };
const RADIUS = (RING.size - RING.stroke) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// The prayer countdown hero: deep green gradient, the next Azan/Jamaat, a
// large live countdown, and a gold ring that fills as the moment approaches.
export default function NextEventCard({ event, countdownLabel, progress }: NextEventCardProps) {
  const isHours = countdownLabel.split(':').length === 3;
  const unit = isHours ? 'hours' : 'minutes';

  // Soft "breathing" pulse on the ring when the event is under a minute away.
  const pulse = useRef(new Animated.Value(1)).current;
  const imminent = !isHours && countdownLabel.startsWith('00:');
  useEffect(() => {
    if (!imminent) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.08, duration: 600, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [imminent, pulse]);

  return (
    <LinearGradient
      colors={[theme.colors.prayer, theme.colors.prayerDark, theme.colors.prayerDeep]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, theme.shadow.md]}
    >
      <View style={styles.textColumn}>
        <Text style={styles.eyebrow}>NEXT · {event.label.toUpperCase()}</Text>
        <Text style={styles.countdown} adjustsFontSizeToFit numberOfLines={1}>
          {countdownLabel}
        </Text>
        <Text style={styles.subline}>
          {unit} remaining · at {event.at.format('h:mm A')}
        </Text>
      </View>

      <Animated.View style={{ transform: [{ scale: pulse }] }}>
        <Svg width={RING.size} height={RING.size}>
          <Circle cx={RING.size / 2} cy={RING.size / 2} r={RADIUS} stroke="rgba(255,255,255,0.14)" strokeWidth={RING.stroke} fill="none" />
          <Circle
            cx={RING.size / 2}
            cy={RING.size / 2}
            r={RADIUS}
            stroke={theme.colors.goldBright}
            strokeWidth={RING.stroke}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            transform={`rotate(-90 ${RING.size / 2} ${RING.size / 2})`}
          />
        </Svg>
        <View style={styles.ringIcon}>
          <Icon name={PRAYER_ICONS[event.prayer]} size={26} color="#FFFFFF" />
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.radius.heroCard,
    paddingVertical: 22,
    paddingHorizontal: 22,
    marginHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },
  textColumn: { flex: 1 },
  eyebrow: { fontSize: 11, fontWeight: '700', color: theme.colors.prayerOnDark, letterSpacing: 1.2 },
  countdown: {
    fontSize: theme.typography.countdown,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
    marginTop: 2,
  },
  subline: { fontSize: theme.typography.label, color: '#CFEBD9', fontWeight: '500' },
  ringIcon: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
});
