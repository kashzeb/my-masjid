import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_PRAYER_PREFS, type PrayerNotificationPrefs } from '@/services/notificationService';
import type { PrayerName } from '@/constants/masjid';

const CACHE_KEY = 'my-masjid:notification-prefs-v1';

interface StoredPrefs {
  prayerPrefs: PrayerNotificationPrefs;
  announcementsEnabled: boolean;
}

interface PreferencesState {
  prayerPrefs: PrayerNotificationPrefs;
  // Stored now for forward-compatibility with M7 — has NO functional effect
  // yet, since there's no FCM topic subscription to actually turn on/off
  // until the Cloud Function piece exists. Toggling this today just saves
  // a preference nobody reads yet.
  announcementsEnabled: boolean;
  hydrated: boolean;
  setPrayerPref: (prayer: PrayerName, enabled: boolean) => Promise<void>;
  setAnnouncementsEnabled: (enabled: boolean) => Promise<void>;
}

async function persist(prayerPrefs: PrayerNotificationPrefs, announcementsEnabled: boolean) {
  try {
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify({ prayerPrefs, announcementsEnabled }));
  } catch (err) {
    console.warn('[preferences] failed to persist:', err);
  }
}

export const usePreferencesStore = create<PreferencesState>((set, get) => {
  // Hydrate immediately at store creation (mirrors authStore's pattern) -
  // an AsyncStorage read is fast and virtually always finishes well before
  // the Firestore round-trip in timetableStore.fetch() does, so this
  // shouldn't race against the first notification scheduling call in
  // practice, even without an explicit "wait for hydration" mechanism.
  (async () => {
    try {
      const raw = await AsyncStorage.getItem(CACHE_KEY);
      if (raw) {
        const stored: StoredPrefs = JSON.parse(raw);
        set({ prayerPrefs: stored.prayerPrefs, announcementsEnabled: stored.announcementsEnabled, hydrated: true });
      } else {
        set({ hydrated: true });
      }
    } catch {
      set({ hydrated: true });
    }
  })();

  return {
    prayerPrefs: DEFAULT_PRAYER_PREFS,
    announcementsEnabled: true,
    hydrated: false,

    setPrayerPref: async (prayer, enabled) => {
      const nextPrefs = { ...get().prayerPrefs, [prayer]: enabled };
      set({ prayerPrefs: nextPrefs });
      await persist(nextPrefs, get().announcementsEnabled);
      // Rescheduling notifications after this change is the caller's
      // responsibility (SettingsScreen) - this store deliberately doesn't
      // import timetableStore to avoid a require cycle between the two
      // store files.
    },

    setAnnouncementsEnabled: async (enabled) => {
      set({ announcementsEnabled: enabled });
      await persist(get().prayerPrefs, enabled);
    },
  };
});
