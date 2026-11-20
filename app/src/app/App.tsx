import { useCallback, useEffect, useState } from 'react';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
} from '@expo-google-fonts/manrope';
import RootNavigator from './RootNavigator';
import ToastHost from '@/components/ToastHost';
import SplashOverlay from '@/components/SplashOverlay';
import { requestNotificationPermission } from '@/services/notificationService';
import { syncAnnouncementsSubscription } from '@/services/pushTokenService';
import { usePreferencesStore } from '@/store/preferencesStore';
import { navigateFromNotificationData } from '@/utils/notificationNavigation';

function getAnnouncementsPreference(): Promise<boolean> {
  const state = usePreferencesStore.getState();
  if (state.hydrated) return Promise.resolve(state.announcementsEnabled);
  return new Promise((resolve) => {
    const unsubscribe = usePreferencesStore.subscribe((s) => {
      if (!s.hydrated) return;
      unsubscribe();
      resolve(s.announcementsEnabled);
    });
  });
}

// Keeps the native splash visible until we explicitly hide it below -
// called at module load, before the component even renders.
SplashScreen.preventAutoHideAsync();

const SPLASH_MIN_DURATION_MS = 2200;

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [fontsLoaded, fontError] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
  });
  const ready = fontsLoaded || !!fontError;
  const hideIntro = useCallback(() => setShowIntro(false), []);

  // Keep the native splash up until the fonts are ready (a fraction of a
  // second, bundled locally), so text never flashes in the system font.
  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  useEffect(() => {
    // Requested on launch per PRD - the standard OS permission prompt.
    // Once granted, register this device for announcement pushes (M7) using
    // the saved Announcements preference (waiting for it to load first).
    requestNotificationPermission().then(async (granted) => {
      if (!granted) return;
      const enabled = await getAnnouncementsPreference();
      await syncAnnouncementsSubscription(enabled);
    });

    // Routes a tapped notification to the right tab (Navigation Flow §4).
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      navigateFromNotificationData(response.notification.request.content.data as Record<string, unknown>);
    });

    return () => subscription.remove();
  }, []);

  if (!ready) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <RootNavigator />
      <ToastHost />
      {/* Fixed-duration intro, never tied to a network fetch, so it can't hang offline. */}
      {showIntro && <SplashOverlay holdMs={SPLASH_MIN_DURATION_MS} onFinish={hideIntro} />}
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
