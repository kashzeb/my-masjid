import { create } from 'zustand';
import { subscribeToAnnouncements } from '@/services/announcementsService';
import type { Announcement } from '@/models';

interface AnnouncementsState {
  announcements: Announcement[];
  status: 'idle' | 'loading' | 'loaded' | 'error';
  error: string | null;
  unsubscribeFn: (() => void) | null;
  subscribe: () => void;
  unsubscribe: () => void;
}

export const useAnnouncementsStore = create<AnnouncementsState>((set, get) => ({
  announcements: [],
  status: 'idle',
  error: null,
  unsubscribeFn: null,

  subscribe: () => {
    // Guard against double-subscribing (e.g. the screen re-mounting on tab
    // focus while a listener from before is still active).
    if (get().unsubscribeFn) return;
    set({ status: 'loading' });
    const unsubscribeFn = subscribeToAnnouncements(
      (announcements) => set({ announcements, status: 'loaded', error: null }),
      (err) => set({ status: 'error', error: err.message })
    );
    set({ unsubscribeFn });
  },

  unsubscribe: () => {
    get().unsubscribeFn?.();
    set({ unsubscribeFn: null });
  },
}));
