import { useEffect, useState } from 'react';
import { getNextEvent, formatCountdown, getMasjidToday } from '@/utils/dateTime';
import type { Timetable } from '@/models';

/**
 * Recomputes "what's next" on a 30-second tick — frequent enough that the
 * countdown never feels stale, cheap enough to not matter for battery
 * (this is pure client-side math, no network calls in the loop).
 */
export function useCountdown(timetable: Timetable | null, timezoneName: string | undefined) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  if (!timetable || !timezoneName) return null;

  const now = getMasjidToday(timezoneName);
  const event = getNextEvent(timetable, timezoneName, now);
  const countdownLabel = formatCountdown(event.at, now);
  return { event, countdownLabel };
}
