import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
// @ts-ignore — getReactNativePersistence exists at runtime; Firebase's own
// TS types are missing it (known upstream issue), not a real error.
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from './env';

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firestore = initializeFirestore(firebaseApp, {});

// Guarded against Fast Refresh calling initializeAuth twice on the same
// app instance, which Firebase rejects with auth/already-initialized.
let auth;
try {
  auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch {
  auth = getAuth(firebaseApp);
}
export { auth };