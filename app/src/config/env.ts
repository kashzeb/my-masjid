import Constants from 'expo-constants';

// Reads the APP_ENV baked in at build time (app.config.ts) plus Firebase
// config supplied via environment variables — never hardcoded, since dev
// and prod point at two different Firebase projects (Architecture §7).
//
// Populate these from a local `.env` file (see .env.example) which is
// git-ignored — real keys never get committed.

type AppEnv = 'dev' | 'prod';

export const appEnv: AppEnv = (Constants.expoConfig?.extra?.appEnv as AppEnv) ?? 'dev';

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? '',
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '',
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ?? '',
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ?? '',
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ?? '',
};

if (!firebaseConfig.projectId) {
  // Loud on purpose — a silently-missing Firebase config is a confusing
  // failure mode to debug later, so fail early and obviously instead.
  console.warn(
    '[env] EXPO_PUBLIC_FIREBASE_PROJECT_ID is not set — copy .env.example to .env and fill in your Firebase project config.'
  );
}
