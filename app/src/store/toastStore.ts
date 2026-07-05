import { create } from 'zustand';

type ToastVariant = 'default' | 'success' | 'danger';

interface ToastState {
  message: string | null;
  variant: ToastVariant;
  show: (message: string, variant?: ToastVariant) => void;
  hide: () => void;
}

let hideTimeout: ReturnType<typeof setTimeout> | null = null;

export const useToastStore = create<ToastState>((set) => ({
  message: null,
  variant: 'default',
  show: (message, variant = 'default') => {
    if (hideTimeout) clearTimeout(hideTimeout);
    set({ message, variant });
    hideTimeout = setTimeout(() => set({ message: null }), 2200);
  },
  hide: () => {
    if (hideTimeout) clearTimeout(hideTimeout);
    set({ message: null });
  },
}));

/** Convenience import for anywhere in the app - showToast('Saved'). */
export function showToast(message: string, variant?: ToastVariant) {
  useToastStore.getState().show(message, variant);
}
