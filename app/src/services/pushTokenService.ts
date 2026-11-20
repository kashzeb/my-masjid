import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { MASJID_ID } from '@/constants/masjid';

// Announcement push (M7) uses Expo Push rather than FCM topics: the Firebase
// JS SDK's messaging module is browser-only and can't subscribe a React
// Native device to a topic. Instead each device stores its anonymous Expo
// push token, and the `onAnnouncementCreated` Cloud Function sends to every
// token whose `announcements` flag is true.
//
// The token doc holds no personal data - just the token, platform and the
// on/off flag - so "no congregant accounts" still holds (Database Design §1).

export const ANNOUNCEMENTS_CHANNEL_ID = 'announcements';

let cachedToken: string | null = null;

async function ensureAndroidChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANNOUNCEMENTS_CHANNEL_ID, {
    name: 'Announcements',
    importance: Notifications.AndroidImportance.HIGH,
  });
}

async function getExpoPushToken(): Promise<string | null> {
  if (cachedToken) return cachedToken;
  // Simulators/emulators can't receive remote push.
  if (!Device.isDevice) return null;

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') return null;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
  if (!projectId) {
    console.warn('[push] missing EAS projectId in app config - cannot register for push');
    return null;
  }

  await ensureAndroidChannel();
  const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
  cachedToken = data;
  return data;
}

/**
 * Saves (or updates) this device's push token and its Announcements
 * preference. Safe to call repeatedly - the doc ID is the token itself, so
 * it's a plain overwrite, never a duplicate. Failures are logged, not thrown:
 * push registration must never break app start-up or the Settings screen.
 */
export async function syncAnnouncementsSubscription(enabled: boolean): Promise<void> {
  try {
    const token = await getExpoPushToken();
    if (!token) return;
    await setDoc(doc(firestore, 'masjids', MASJID_ID, 'pushTokens', token), {
      token,
      platform: Platform.OS,
      announcements: enabled,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('[push] failed to sync announcements subscription:', err);
  }
}
