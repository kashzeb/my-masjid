import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import { getFirestore } from 'firebase-admin/firestore';
import { sendExpoPush, type PushMessage } from './lib/expoPush';

// MUST match your Firestore database's location (Firebase Console →
// Firestore → the location shown at the top). For a Mumbai database that's
// "asia-south1". If the database is multi-region (nam5 / eur3), use
// "us-central1" / "europe-west1" respectively.
const REGION = 'asia-south1';

const BODY_MAX_CHARS = 180;

/**
 * Architecture §4.3: the only backend job in the system. Fires once when an
 * admin publishes an announcement and pushes it to every device that has
 * Announcements switched on.
 *
 * Idempotency (Database Design §3.3): the `notified` flag is claimed inside a
 * transaction before sending, so a duplicate trigger delivery can never send
 * the same announcement twice.
 */
export const onAnnouncementCreated = onDocumentCreated(
  { document: 'masjids/{masjidId}/announcements/{announcementId}', region: REGION },
  async (event) => {
    const snap = event.data;
    if (!snap) return;
    const { masjidId, announcementId } = event.params;
    const db = getFirestore();

    const announcement = await db.runTransaction(async (tx) => {
      const doc = await tx.get(snap.ref);
      const data = doc.data();
      if (!data || data.notified === true || data.deleted === true) return null;
      tx.update(snap.ref, { notified: true });
      return data as { title?: string; body?: string };
    });

    if (!announcement) {
      logger.info('Announcement already notified or deleted - skipping', { masjidId, announcementId });
      return;
    }

    const tokensSnap = await db
      .collection(`masjids/${masjidId}/pushTokens`)
      .where('announcements', '==', true)
      .get();

    if (tokensSnap.empty) {
      logger.info('No subscribed devices', { masjidId, announcementId });
      return;
    }

    const title = announcement.title?.trim() || 'New announcement';
    const rawBody = announcement.body?.trim() ?? '';
    const body = rawBody.length > BODY_MAX_CHARS ? `${rawBody.slice(0, BODY_MAX_CHARS - 1)}…` : rawBody;

    const messages: PushMessage[] = tokensSnap.docs.map((d) => ({
      to: d.id,
      title,
      body,
      sound: 'default',
      priority: 'high',
      channelId: 'announcements',
      // Read by the app's notification-tap handler (Navigation Flow §4).
      data: { screen: 'Announcements', announcementId },
    }));

    const result = await sendExpoPush(messages);

    if (result.deadTokens.length) {
      const batch = db.batch();
      result.deadTokens.forEach((token) => batch.delete(db.doc(`masjids/${masjidId}/pushTokens/${token}`)));
      await batch.commit();
    }

    logger.info('Announcement push complete', {
      masjidId,
      announcementId,
      devices: messages.length,
      sent: result.sent,
      failed: result.failed,
      pruned: result.deadTokens.length,
    });
  }
);
