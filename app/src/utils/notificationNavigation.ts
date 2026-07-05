import { navigationRef } from '@/app/navigationRef';

export function navigateFromNotificationData(data: Record<string, unknown> | undefined) {
  if (!navigationRef.isReady()) return;
  // Announcement notifications (M7) will carry screen: "Announcements";
  // prayer notifications (M6) carry screen: "Home". Defaults to Home for
  // anything unrecognized, since that's the safer landing spot.
  const screen = data?.screen === 'Announcements' ? 'Announcements' : 'Home';
  navigationRef.navigate(screen);
}
