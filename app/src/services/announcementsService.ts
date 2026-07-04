import { collection, doc, addDoc, updateDoc, query, where, orderBy, limit, onSnapshot, serverTimestamp, type Unsubscribe } from 'firebase/firestore';
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

export async function createAnnouncement(title: string, body: string, createdBy: string): Promise<void> {
  const ref = collection(firestore, 'masjids', MASJID_ID, 'announcements');
  await addDoc(ref, {
    title,
    body,
    createdAt: serverTimestamp(),
    createdBy,
    updatedAt: null,
    updatedBy: null,
    deleted: false,
    notified: false,
    expiresAt: null,
  });
}

export async function updateAnnouncement(id: string, title: string, body: string, updatedBy: string): Promise<void> {
  const ref = doc(firestore, 'masjids', MASJID_ID, 'announcements', id);
  await updateDoc(ref, { title, body, updatedAt: serverTimestamp(), updatedBy });
}

/**
 * Soft delete only - an update, not deleteDoc, per Database Design §3.3.
 * Firestore rules explicitly forbid hard deletes (`allow delete: if false`)
 * so an accidental deletion is always recoverable by an admin flipping
 * `deleted` back to false directly in the Console, even though there's no
 * "restore" button in the Phase 1 UI.
 */
export async function softDeleteAnnouncement(id: string, updatedBy: string): Promise<void> {
  const ref = doc(firestore, 'masjids', MASJID_ID, 'announcements', id);
  await updateDoc(ref, { deleted: true, updatedAt: serverTimestamp(), updatedBy });
}
