import * as Notifications from 'expo-notifications';
import { PRAYERS, PRAYER_LABELS, NOTIFICATION_WINDOW_DAYS, type PrayerName } from '@/constants/masjid';
import { getInstantForTime } from '@/utils/dateTime';
import type { Timetable } from '@/models';

// Ensures notifications actually display while the app is foregrounded too
// (not just backgrounded) — otherwise testing while the app happens to be
// open would look like nothing happened.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

/** Used by the Settings screen to show a banner if notifications are off. */
export async function getNotificationPermissionGranted(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === 'granted';
}

export type PrayerNotificationPrefs = Record<PrayerName, boolean>;

export const DEFAULT_PRAYER_PREFS: PrayerNotificationPrefs = {
  fajr: true,
  zuhr: true,
  asr: true,
  maghrib: true,
  isha: true,
};

/**
 * Rebuilds the entire rolling local notification schedule from scratch:
 * cancels everything previously scheduled, then schedules Azan+Jamaat
 * events for the next NOTIFICATION_WINDOW_DAYS days (Architecture §4.3).
 *
 * Cancel-and-replace is naturally idempotent — there's no separate
 * dedup/idempotency-log mechanism needed here, unlike the retired
 * server-driven design (Architecture §4.3 superseded section). Calling
 * this twice in a row just produces the same end state, not duplicates.
 */
export async function scheduleUpcomingPrayerNotifications(
  timetable: Timetable,
  timezoneName: string,
  enabledPrayers: PrayerNotificationPrefs = DEFAULT_PRAYER_PREFS
): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const now = new Date();

  for (let dayOffset = 0; dayOffset < NOTIFICATION_WINDOW_DAYS; dayOffset++) {
    for (const prayer of PRAYERS) {
      if (!enabledPrayers[prayer]) continue; // per-category opt-out (Architecture §7.4)

      const times = timetable[prayer];
      const events: Array<{ kind: 'azan' | 'jamaat'; time: string }> = [
        { kind: 'azan', time: times.azan },
        { kind: 'jamaat', time: times.jamaat },
      ];

      for (const event of events) {
        const instant = getInstantForTime(event.time, timezoneName, dayOffset).toDate();
        if (instant.getTime() <= now.getTime()) continue; // never schedule something already in the past

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${PRAYER_LABELS[prayer]} ${event.kind === 'azan' ? 'Azan' : 'Jamaat'}`,
            body: event.kind === 'azan' ? 'It is time for Azan.' : 'Jamaat is starting.',
            // Read by the notification-tap handler to route to Home (Navigation Flow §4).
            data: { screen: 'Home' },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: instant,
          },
        });
      }
    }
  }
}

export async function cancelAllPrayerNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
