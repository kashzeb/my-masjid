import { useEffect, useState } from 'react';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';
import RootNavigator from './RootNavigator';
import ToastHost from '@/components/ToastHost';
import SplashOverlay from '@/components/SplashOverlay';
import { requestNotificationPermission } from '@/services/notificationService';
import { navigateFromNotificationData } from '@/utils/notificationNavigation';

// Keeps the native splash visible until we explicitly hide it below -
// called at module load, before the component even renders.
SplashScreen.preventAutoHideAsync();

const SPLASH_MIN_DURATION_MS = 4000;

function App() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // Requested on launch per PRD - the standard OS permission prompt.
    requestNotificationPermission();

    // Routes a tapped notification to the right tab (Navigation Flow §4).
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      navigateFromNotificationData(response.notification.request.content.data as Record<string, unknown>);
    });

    // Hide the native splash immediately (our custom overlay below takes
    // over visually with zero gap), then keep the custom intro up for a
    // short fixed duration - deliberately NOT tied to any network fetch,
    // so it can never hang if the connection is slow or offline.
    SplashScreen.hideAsync();
    const timer = setTimeout(() => setShowIntro(false), SPLASH_MIN_DURATION_MS);

    return () => {
      subscription.remove();
      clearTimeout(timer);
    };
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <RootNavigator />
      <ToastHost />
      {showIntro && <SplashOverlay />}
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
