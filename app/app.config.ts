import type { ExpoConfig } from 'expo/config';

// APP_ENV switches which Firebase project the app talks to (Architecture §7).
// Set via EAS build profile or `APP_ENV=dev npx expo start`.
const APP_ENV = process.env.APP_ENV ?? 'dev';

const config: ExpoConfig = {
  name: 'My Masjid',
  slug: 'my-masjid',
  version: '0.1.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  icon: './assets/icon.png',
  ios: { supportsTablet: false, bundleIdentifier: 'org.noormasjid.mymasjid' },
  android: {
    package: 'org.noormasjid.mymasjid',
    adaptiveIcon: { foregroundImage: './assets/adaptive-icon.png', backgroundColor: '#03532D' },
  },
  plugins: ['expo-notifications', 'expo-font', 'expo-image', 'expo-splash-screen', 'expo-status-bar', '@react-native-community/datetimepicker'],
  extra: {
    appEnv: APP_ENV,
    eas: {
      projectId: '66c490d2-9ba1-4a3e-9668-160302757d2b',
    },
  },
};

export default config;
