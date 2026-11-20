import { logger } from 'firebase-functions';

// Minimal Expo Push client (https://docs.expo.dev/push-notifications/sending-notifications/).
// Plain fetch instead of expo-server-sdk keeps this project to two
// dependencies and avoids that SDK's ESM-only packaging.

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const MAX_PER_REQUEST = 100; // Expo's documented batch limit

export interface PushMessage {
  to: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  sound?: 'default';
  channelId?: string;
  priority?: 'default' | 'normal' | 'high';
}

interface PushTicket {
  status: 'ok' | 'error';
  id?: string;
  message?: string;
  details?: { error?: string };
}

export interface SendResult {
  sent: number;
  failed: number;
  /** Tokens Expo says are permanently invalid - safe to delete. */
  deadTokens: string[];
}

export async function sendExpoPush(messages: PushMessage[]): Promise<SendResult> {
  const result: SendResult = { sent: 0, failed: 0, deadTokens: [] };

  for (let i = 0; i < messages.length; i += MAX_PER_REQUEST) {
    const chunk = messages.slice(i, i + MAX_PER_REQUEST);
    try {
      const res = await fetch(EXPO_PUSH_URL, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(chunk),
      });
      if (!res.ok) {
        logger.error('Expo push request failed', { status: res.status, body: await res.text() });
        result.failed += chunk.length;
        continue;
      }
      const { data: tickets } = (await res.json()) as { data: PushTicket[] };
      tickets.forEach((ticket, idx) => {
        if (ticket.status === 'ok') {
          result.sent++;
          return;
        }
        result.failed++;
        if (ticket.details?.error === 'DeviceNotRegistered') {
          result.deadTokens.push(chunk[idx].to);
        } else {
          logger.warn('Expo push ticket error', { error: ticket.details?.error, message: ticket.message });
        }
      });
    } catch (err) {
      logger.error('Expo push request threw', err);
      result.failed += chunk.length;
    }
  }

  return result;
}
