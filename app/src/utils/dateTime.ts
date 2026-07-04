import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import type { Timetable, PrayerTime } from '@/models';
import { PRAYERS, PRAYER_LABELS, type PrayerName } from '@/constants/masjid';

dayjs.extend(utc);

export type EventKind = 'azan' | 'jamaat';

export interface PrayerEvent {
  prayer: PrayerName;
  label: string; // e.g. "Asr jamaat"
  kind: EventKind;
  at: dayjs.Dayjs; // the actual instant
}

/**
 * Fixed UTC offsets, in minutes — deliberately NOT using dayjs's
 * Intl/ICU-based `.tz()` conversion here. That approach depends on the
 * device's JS engine having a complete IANA timezone database bundled,
 * which isn't guaranteed in Expo Go and produced a real, confusing bug in
 * testing (a silent no-op conversion that was off by exactly one region's
 * UTC offset). Since Noor Masjid's timezone (India) never observes DST,
 * a fixed offset is not a hack here — it's the genuinely simpler, more
 * robust option for what Phase 1 actually needs. Revisit with a real
 * Intl-based lookup only if a future Masjid is in a DST-observing region.
 */
const FIXED_UTC_OFFSET_MINUTES: Record<string, number> = {
  'Asia/Kolkata': 330, // UTC+5:30
};

function offsetFor(timezoneName: string): number {
  const offset = FIXED_UTC_OFFSET_MINUTES[timezoneName];
  if (offset === undefined) {
    console.warn(`[dateTime] No fixed UTC offset configured for "${timezoneName}" — add it to FIXED_UTC_OFFSET_MINUTES.`);
    return 0;
  }
  return offset;
}

/** "Now," expressed in the Masjid's local wall-clock time. */
function masjidNow(timezoneName: string): dayjs.Dayjs {
  return dayjs.utc().utcOffset(offsetFor(timezoneName));
}

/**
 * Parses a stored "HH:mm" wall-clock string into a real instant, for a given
 * calendar day, in the Masjid's local time (Database Design §3.2 — these are
 * repeating daily times, not absolute timestamps, so "today" or "tomorrow"
 * has to be supplied by the caller).
 */
function toInstant(timeStr: string, timezoneName: string, dayOffset: number): dayjs.Dayjs {
  const [hour, minute] = timeStr.split(':').map(Number);
  return masjidNow(timezoneName).add(dayOffset, 'day').hour(hour).minute(minute).second(0).millisecond(0);
}

/** Builds all 10 Azan/Jamaat events for one calendar day, in chronological order. */
function buildDayEvents(timetable: Timetable, timezoneName: string, dayOffset: number): PrayerEvent[] {
  return PRAYERS.flatMap((prayer): PrayerEvent[] => {
    const times: PrayerTime = timetable[prayer];
    return (['azan', 'jamaat'] as const).map((kind) => ({
      prayer,
      kind,
      label: `${PRAYER_LABELS[prayer]} ${kind}`,
      at: toInstant(times[kind], timezoneName, dayOffset),
    }));
  }).sort((a, b) => a.at.valueOf() - b.at.valueOf());
}

/**
 * The Home screen's core question: what's the next Azan or Jamaat, and how
 * long until it? Checks today first; if every event today has already
 * passed, rolls over to tomorrow's first event (same stored times, next
 * calendar day — the timetable itself doesn't change daily, per Database
 * Design §3.2).
 */
export function getNextEvent(timetable: Timetable, timezoneName: string, now = masjidNow(timezoneName)): PrayerEvent {
  const today = buildDayEvents(timetable, timezoneName, 0);
  const upcoming = today.find((event) => event.at.isAfter(now));
  if (upcoming) return upcoming;

  // Everything today has passed — first event of tomorrow.
  return buildDayEvents(timetable, timezoneName, 1)[0];
}

/** Formats a duration for the countdown display: "18 min" or "2h 14m". */
export function formatCountdown(target: dayjs.Dayjs, now: dayjs.Dayjs): string {
  const totalMinutes = Math.max(0, Math.round(target.diff(now, 'second') / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return `${hours}h ${minutes}m`;
}

/** The Masjid's current local date, formatted for the Home screen header. */
export function getMasjidToday(timezoneName: string): dayjs.Dayjs {
  return masjidNow(timezoneName);
}

/** All 5 prayers for today, for the timings list (Home screen). */
export function getTodayPrayerTimes(timetable: Timetable): Array<{ prayer: PrayerName; label: string; azan: string; jamaat: string }> {
  return PRAYERS.map((prayer) => ({
    prayer,
    label: PRAYER_LABELS[prayer],
    azan: timetable[prayer].azan,
    jamaat: timetable[prayer].jamaat,
  }));
}
