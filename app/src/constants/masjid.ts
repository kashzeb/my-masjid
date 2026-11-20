// Phase 1 is single-Masjid, but every read/write goes through this constant
// rather than a hardcoded string, per Architecture §4.1's multi-tenant-ready
// data shape — adding a second Masjid later never means hunting for literals.
export const MASJID_ID = 'noor-masjid';

export const PRAYERS = ['fajr', 'zuhr', 'asr', 'maghrib', 'isha'] as const;
export type PrayerName = (typeof PRAYERS)[number];

export const PRAYER_LABELS: Record<PrayerName, string> = {
  fajr: 'Fajr',
  zuhr: 'Zuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

// FCM topic for announcements only — prayer categories are local-only toggles,
// per the hybrid notification architecture (Architecture §4.3/§4.4).
import type { IconName } from '@/components/Icon';

export const PRAYER_ICONS: Record<PrayerName, IconName> = {
  fajr: 'weather-sunset-up',
  zuhr: 'white-balance-sunny',
  asr: 'weather-sunny',
  maghrib: 'weather-sunset-down',
  isha: 'weather-night',
};

// Days to add to the Umm al-Qura (Saudi) Hijri date so it matches the
// Masjid's moon-sighted date. India usually starts each month one day after
// Saudi Arabia (Ramadan 1446: 1 Mar 2025 in Saudi, 2 Mar in India), hence -1.
// If the Masjid announces a different date, change this number.
export const HIJRI_ADJUST_DAYS = -1;

export const ANNOUNCEMENTS_TOPIC = 'announcements';

// How many days ahead local prayer notifications are scheduled.
// CORRECTED from the original 14-day recommendation (Architecture §4.3):
// iOS enforces a hard cap of 64 pending scheduled local notifications.
// 5 prayers x 2 events (azan+jamaat) x 14 days = 140, which would silently
// truncate on iOS. 6 days x 10 events/day = 60, comfortably under the cap
// on both platforms. This does shrink the "must reopen the app within N
// days" safety margin from 14 to 6 days - still reasonable given the app's
// designed usage pattern (checked frequently), but a real trade-off worth
// knowing about, not a free change.
export const NOTIFICATION_WINDOW_DAYS = 6;
