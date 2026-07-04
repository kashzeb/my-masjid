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
export const ANNOUNCEMENTS_TOPIC = 'announcements';

// How many days ahead local prayer notifications are scheduled (Architecture §4.3).
export const NOTIFICATION_WINDOW_DAYS = 14;
