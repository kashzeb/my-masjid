import { z } from 'zod';

export const announcementFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(120, 'Keep it under 120 characters'),
  body: z.string().min(1, 'Body is required').max(1000, 'Keep it under 1000 characters'),
});

export type AnnouncementFormValues = z.infer<typeof announcementFormSchema>;
