import { z } from 'zod';

const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

const prayerTimeSchema = z.object({
  azan: z.string().regex(timeRegex, 'Use 24-hour HH:mm, e.g. 05:08'),
  jamaat: z.string().regex(timeRegex, 'Use 24-hour HH:mm, e.g. 05:30'),
});

export const timetableFormSchema = z.object({
  fajr: prayerTimeSchema,
  zuhr: prayerTimeSchema,
  asr: prayerTimeSchema,
  maghrib: prayerTimeSchema,
  isha: prayerTimeSchema,
});

export type TimetableFormValues = z.infer<typeof timetableFormSchema>;
