import type { ExpoConfig } from 'expo/config';

// APP_ENV switches which Firebase project the app talks to (Architecture §7).
// Set via EAS build profile or `APP_ENV=dev npx expo start`.
const APP_ENV = process.env.APP_ENV ?? 'dev';
const IS_PROD = APP_ENV === 'prod';

// The development app gets its own package name and label, so it installs
// alongside the real app (testers' APK / Play Store) instead of replacing it,
// and each has its own push credentials on Expo.
const PACKAGE = IS_PROD ? 'org.noormasjid.mymasjid' : 'org.noormasjid.mymasjid.dev';

const config: ExpoConfig = {
  name: IS_PROD ? 'My Masjid' : 'My Masjid Dev',
  slug: 'my-masjid',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  icon: './assets/icon.png',
  ios: { supportsTablet: false, bundleIdentifier: PACKAGE },
  android: {
    package: PACKAGE,
    adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#03532D' },
    // Required for remote push (announcements) on Android. Download it from
    // Firebase Console → Project settings → Your apps → Android app. It's
    // git-ignored: locally it sits next to this file; on EAS it's supplied as
    // a file-type environment variable named GOOGLE_SERVICES_JSON.
    googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? './google-services.json',
  },
  plugins: ['expo-notifications', 'expo-font', 'expo-image', 'expo-splash-screen', 'expo-status-bar', '@react-native-community/datetimepicker'],
  extra: {
    appEnv: APP_ENV,
    eas: {
      projectId: '17508c90-f3d7-4127-8092-5ff2d6d87ceb',
    },
  },
  owner: 'kashif.khan19195',
};

export default config;
