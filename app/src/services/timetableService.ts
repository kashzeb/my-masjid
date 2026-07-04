import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { MASJID_ID, PRAYERS } from '@/constants/masjid';
import type { Timetable, Masjid } from '@/models';

/**
 * One-time fetch, not a real-time listener — the timetable changes ~monthly,
 * so paying for an always-open connection buys nothing (Architecture §3.2).
 */
export async function getTimetable(): Promise<Timetable> {
  const ref = doc(firestore, 'masjids', MASJID_ID, 'timetable', 'current');
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new Error(`No timetable found at masjids/${MASJID_ID}/timetable/current — seed it per the M0 README.`);
  }
  const data = snap.data();

  // Defensive check — a malformed seed document should fail loudly here,
  // not produce a confusing crash three components deep in the render tree.
  for (const prayer of PRAYERS) {
    if (!data[prayer]?.azan || !data[prayer]?.jamaat) {
      throw new Error(`Timetable document is missing azan/jamaat for "${prayer}".`);
    }
  }

  return {
    fajr: data.fajr,
    zuhr: data.zuhr,
    asr: data.asr,
    maghrib: data.maghrib,
    isha: data.isha,
    updatedAt: data.updatedAt?.toMillis?.() ?? Date.now(),
    updatedBy: data.updatedBy ?? 'unknown',
  };
}

export async function getMasjid(): Promise<Masjid> {
  const ref = doc(firestore, 'masjids', MASJID_ID);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    throw new Error(`No masjid profile found at masjids/${MASJID_ID} — seed it per the M0 README.`);
  }
  const data = snap.data();
  return {
    name: data.name,
    city: data.city,
    address: data.address,
    timezone: data.timezone,
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
  };
}
