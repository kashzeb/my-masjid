import { create } from 'zustand';
import { subscribeToAnnouncements } from '@/services/announcementsService';
import type { Announcement } from '@/models';

interface AnnouncementsState {
  announcements: Announcement[];
  status: 'idle' | 'loading' | 'loaded' | 'error';
  error: string | null;
  unsubscribeFn: (() => void) | null;
  subscribers: number;
  subscribe: () => void;
  unsubscribe: () => void;
}

export const useAnnouncementsStore = create<AnnouncementsState>((set, get) => ({
  announcements: [],
  status: 'idle',
  error: null,
  unsubscribeFn: null,
  subscribers: 0,

  // Reference-counted: Home (latest announcement preview) and the
  // Announcements tab share one Firestore listener, which is only closed
  // when the last of them unsubscribes.
  subscribe: () => {
    set((s) => ({ subscribers: s.subscribers + 1 }));
    if (get().unsubscribeFn) return;
    set({ status: 'loading' });
    const unsubscribeFn = subscribeToAnnouncements(
      (announcements) => set({ announcements, status: 'loaded', error: null }),
      (err) => set({ status: 'error', error: err.message })
    );
    set({ unsubscribeFn });
  },

  unsubscribe: () => {
    const remaining = Math.max(0, get().subscribers - 1);
    set({ subscribers: remaining });
    if (remaining > 0) return;
    get().unsubscribeFn?.();
    set({ unsubscribeFn: null });
  },
}));
