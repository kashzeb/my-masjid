import { useEffect, useState } from 'react';
import { formatCountdown, getMasjidToday, getEventWindow } from '@/utils/dateTime';
import type { Timetable } from '@/models';

/**
 * Recomputes "what's next" every second. Pure client-side math - no network
 * calls in the loop. `progress` (0-1) drives the Home countdown ring.
 */
export function useCountdown(timetable: Timetable | null, timezoneName: string | undefined) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1_000);
    return () => clearInterval(interval);
  }, []);

  if (!timetable || !timezoneName) return null;

  const now = getMasjidToday(timezoneName);
  const { next: event, progress } = getEventWindow(timetable, timezoneName, now);
  const countdownLabel = formatCountdown(event.at, now);
  return { event, countdownLabel, progress, now };
}
