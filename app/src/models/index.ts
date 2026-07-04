import type { PrayerName } from '@/constants/masjid';

export interface PrayerTime {
  azan: string; // "HH:mm", Masjid-local wall-clock time (Database Design §3.2)
  jamaat: string;
}

export type Timetable = Record<PrayerName, PrayerTime> & {
  updatedAt: number; // epoch ms, mirrors Firestore server timestamp
  updatedBy: string; // admin UID
};

export interface Masjid {
  name: string;
  city: string;
  address: string;
  timezone: string; // IANA, e.g. "Asia/Kolkata" (Database Design §3.1)
  createdAt: number;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  createdBy: string;
  updatedAt: number | null;
  updatedBy: string | null;
  deleted: boolean;
  notified: boolean;
  expiresAt: number | null; // present but unused in Phase 1 (Database Design §7)
}

export interface AdminUser {
  uid: string;
  displayName: string;
  addedAt: number;
}
