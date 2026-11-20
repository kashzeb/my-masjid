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
 * has to be supplied by the caller). Exported for reuse by the notification
 * service (Architecture §4.3) — one fixed-offset implementation, not two
 * that could silently drift apart.
 */
export function getInstantForTime(timeStr: string, timezoneName: string, dayOffset: number): dayjs.Dayjs {
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
      at: getInstantForTime(times[kind], timezoneName, dayOffset),
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

/** Formats a duration for the countdown display, now including seconds: "18:42" or "2:14:06". */
export function formatCountdown(target: dayjs.Dayjs, now: dayjs.Dayjs): string {
  const totalSeconds = Math.max(0, target.diff(now, 'second'));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  if (hours === 0) return `${pad(minutes)}:${pad(seconds)}`;
  return `${hours}:${pad(minutes)}:${pad(seconds)}`;
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

/**
 * The events either side of "now" - used for the countdown ring's progress
 * (how far through the gap between the last event and the next one).
 */
export function getEventWindow(timetable: Timetable, timezoneName: string, now = masjidNow(timezoneName)) {
  const events = [-1, 0, 1].flatMap((offset) => buildDayEvents(timetable, timezoneName, offset));
  const nextIndex = events.findIndex((event) => event.at.isAfter(now));
  const next = events[nextIndex];
  const previous = events[nextIndex - 1];
  const span = next.at.diff(previous.at, 'second');
  const progress = span > 0 ? Math.min(1, Math.max(0, now.diff(previous.at, 'second') / span)) : 0;
  return { previous, next, progress };
}

/** True once today's Jamaat for this prayer has started. */
export function isPrayerDoneToday(timetable: Timetable, prayer: PrayerName, timezoneName: string, now = masjidNow(timezoneName)): boolean {
  return !getInstantForTime(timetable[prayer].jamaat, timezoneName, 0).isAfter(now);
}

/** "17:05" -> { time: "5:05", period: "PM" } for the prayer list. */
export function splitTime12h(timeStr: string): { time: string; period: 'AM' | 'PM' } {
  const [hour, minute] = timeStr.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return { time: `${hour12}:${String(minute).padStart(2, '0')}`, period };
}

const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  'Rabi I',
  'Rabi II',
  'Jumada I',
  'Jumada II',
  'Rajab',
  "Sha'ban",
  'Ramadan',
  'Shawwal',
  "Dhul Qa'dah",
  'Dhul Hijjah',
];

/**
 * Hijri date using the standard arithmetic (tabular / "Kuwaiti") calendar.
 * Works offline and on every device, but can differ by a day from the
 * locally moon-sighted date - `adjustDays` lets the Masjid correct that.
 */
export function getHijriDate(date: dayjs.Dayjs, adjustDays = 0): { day: number; month: string; year: number } {
  const d = date.add(adjustDays, 'day');
  const y = d.year();
  const m = d.month() + 1;
  const day = d.date();
  const t = Math.trunc;
  const a = t((m - 14) / 12);
  const jd =
    t((1461 * (y + 4800 + a)) / 4) + t((367 * (m - 2 - 12 * a)) / 12) - t((3 * t((y + 4900 + a) / 100)) / 4) + day - 32075;
  let l = jd - 1948440 + 10632;
  const n = t((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j = t((10985 - l) / 5316) * t((50 * l) / 17719) + t(l / 5670) * t((43 * l) / 15238);
  l = l - t((30 - j) / 15) * t((17719 * j) / 50) - t(j / 16) * t((15238 * j) / 43) + 29;
  const month = t((24 * l) / 709);
  const hDay = l - t((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { day: hDay, month: HIJRI_MONTHS[month - 1], year };
}
