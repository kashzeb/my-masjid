import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';
// @ts-ignore — getReactNativePersistence exists at runtime; Firebase's own
// TS types are missing it (a known upstream issue), not a real error.
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from './env';

// Guard against re-initializing on Fast Refresh during development.
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Firestore's offline persistence is on by default on native SDKs — no
// extra flag needed here (Architecture §3.3).
export const firestore = initializeFirestore(firebaseApp, {});

// Explicit AsyncStorage persistence — without this, Auth defaults to
// memory-only and an admin's login session would not survive closing the
// app, contradicting Navigation Flow §3.2's assumption that sessions persist.
//
// Guarded with try/catch: Fast Refresh can re-run this module without a
// full app restart, and calling initializeAuth twice on the same app
// instance throws auth/already-initialized — falling back to getAuth()
// just reattaches to the already-initialized instance instead of crashing.
let auth: ReturnType<typeof getAuth>;
try {
  auth = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });
} catch {
  auth = getAuth(firebaseApp);
}
export { auth };



// NOTE: firebase/messaging is deliberately NOT wired up here. It's a
// web-browser-only API (relies on `window` + Service Workers) and crashes
// immediately in React Native. M7's FCM topic subscription (Architecture
// §4.4) will need a React-Native-appropriate approach instead — most likely
// registering a native push token via expo-notifications and having the
// Cloud Function manage topic membership server-side, rather than calling
// a client-side `getMessaging()`. We'll design that properly when we
// actually reach M7, not guess at it now.
