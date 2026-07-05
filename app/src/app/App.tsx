import { useEffect } from 'react';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import RootNavigator from './RootNavigator';
import { requestNotificationPermission } from '@/services/notificationService';
import { navigateFromNotificationData } from '@/utils/notificationNavigation';

function App() {
  useEffect(() => {
    // Requested on launch per PRD - the standard OS permission prompt.
    requestNotificationPermission();

    // Routes a tapped notification to the right tab (Navigation Flow §4).
    // Re-enabled: confirmed the Expo-Go-on-Android push restriction was
    // unconditional (triggered by the module itself, not this listener),
    // so this was never actually the cause - safe to restore now that
    // we're moving to a development build regardless.
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      navigateFromNotificationData(response.notification.request.content.data as Record<string, unknown>);
    });
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}

registerRootComponent(App);
