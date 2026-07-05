import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTimetable, getMasjid } from '@/services/timetableService';
import { scheduleUpcomingPrayerNotifications } from '@/services/notificationService';
import type { Timetable, Masjid } from '@/models';

const CACHE_KEY = 'my-masjid:timetable-cache-v1';

interface CachedPayload {
  timetable: Timetable;
  masjid: Masjid;
}

interface TimetableState {
  timetable: Timetable | null;
  masjid: Masjid | null;
  status: 'idle' | 'loading' | 'loaded' | 'offline-cached' | 'error';
  error: string | null;
  fetch: () => Promise<void>;
}

export const useTimetableStore = create<TimetableState>((set, get) => ({
  timetable: null,
  masjid: null,
  status: 'idle',
  error: null,

  fetch: async () => {
    // Step 1 — render whatever's cached immediately. No spinner blocking
    // the home screen on a cold start with no network (Architecture §3.3).
    if (get().timetable === null) {
      try {
        const raw = await AsyncStorage.getItem(CACHE_KEY);
        if (raw) {
          const cached: CachedPayload = JSON.parse(raw);
          set({ timetable: cached.timetable, masjid: cached.masjid, status: 'offline-cached' });
        } else {
          set({ status: 'loading' });
        }
      } catch {
        set({ status: 'loading' });
      }
    }

    // Step 2 — fetch fresh data and reconcile. This is also what a Home
    // screen foreground/mount calls after an admin edit (Architecture §5,
    // Scenario A) to pick up new timings.
    try {
      const [timetable, masjid] = await Promise.all([getTimetable(), getMasjid()]);
      set({ timetable, masjid, status: 'loaded', error: null });
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ timetable, masjid }));

      // Reschedule local notifications from the fresh data — this single
      // call site covers both trigger points from Architecture §4.3
      // (foreground refresh AND immediately after an admin save), since
      // both already route through this same fetch() action. Errors here
      // are logged, not thrown - a notification-scheduling hiccup should
      // never block the timetable itself from loading.
      scheduleUpcomingPrayerNotifications(timetable, masjid.timezone).catch((err) =>
        console.warn('[notifications] failed to reschedule:', err)
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      // If we already have cached data on screen, a failed refresh isn't
      // fatal — stay on "offline-cached" rather than blowing away a working
      // screen with an error state.
      set((state) => ({
        status: state.timetable ? 'offline-cached' : 'error',
        error: message,
      }));
    }
  },
}));
