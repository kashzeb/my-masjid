import { collection, query, where, orderBy, limit, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { MASJID_ID } from '@/constants/masjid';
import type { Announcement } from '@/models';

/**
 * Real-time listener, not a one-time fetch — unlike the timetable, this is
 * the one place a live listener earns its keep (Architecture §3.2):
 * announcements are exactly the content where near-instant updates are
 * actually valuable, and the read volume is naturally bounded by `limit(20)`.
 */
export function subscribeToAnnouncements(
  onData: (announcements: Announcement[]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const q = query(
    collection(firestore, 'masjids', MASJID_ID, 'announcements'),
    where('deleted', '==', false),
    orderBy('createdAt', 'desc'),
    limit(20)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const announcements: Announcement[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          body: data.body,
          createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
          createdBy: data.createdBy ?? 'unknown',
          updatedAt: data.updatedAt?.toMillis?.() ?? null,
          updatedBy: data.updatedBy ?? null,
          deleted: data.deleted ?? false,
          notified: data.notified ?? false,
          expiresAt: data.expiresAt?.toMillis?.() ?? null,
        };
      });
      onData(announcements);
    },
    onError
  );
}
