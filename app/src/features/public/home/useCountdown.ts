import { useEffect, useState } from 'react';
import { getNextEvent, formatCountdown, getMasjidToday } from '@/utils/dateTime';
import type { Timetable } from '@/models';

/**
 * Recomputes "what's next" on a 1-second tick, per feedback item 7 (the
 * countdown now shows live seconds, not just minutes) — a step up from the
 * original 30-second tick, still cheap since this is pure client-side math
 * with no network calls in the loop.
 */
export function useCountdown(timetable: Timetable | null, timezoneName: string | undefined) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1_000);
    return () => clearInterval(interval);
  }, []);

  if (!timetable || !timezoneName) return null;

  const now = getMasjidToday(timezoneName);
  const event = getNextEvent(timetable, timezoneName, now);
  const countdownLabel = formatCountdown(event.at, now);
  return { event, countdownLabel };
}
