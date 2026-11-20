import * as Haptics from 'expo-haptics';

// Haptics are a nicety: failures (unsupported device, web) are ignored.
export function tapHaptic() {
  Haptics.selectionAsync().catch(() => {});
}

export function successHaptic() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

export function errorHaptic() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
}
