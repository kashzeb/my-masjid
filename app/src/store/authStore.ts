import { create } from 'zustand';
import type { User } from 'firebase/auth';
import { signIn as signInService, signOutAdmin, subscribeToAuthState } from '@/services/authService';

interface AuthState {
  user: User | null;
  initialized: boolean; // false until the first auth-state callback fires
  signIn: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => {
  // Subscribes once, at store creation — Firebase Auth's own persistence
  // (Architecture-adjacent fix from earlier: initializeAuth + AsyncStorage)
  // means this fires with the restored session on cold start, not just
  // after an explicit sign-in.
  subscribeToAuthState((user) => set({ user, initialized: true }));

  return {
    user: null,
    initialized: false,
    signIn: async (email, password) => {
      await signInService(email, password);
      // No need to manually set state here — subscribeToAuthState's
      // callback above fires automatically on successful sign-in.
    },
    signOutUser: async () => {
      await signOutAdmin();
    },
  };
});
