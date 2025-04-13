import { z } from "zod";

export const rsvpSchema = z.object({
  nama: z.string(),
  kehadiran: z.string(),
  jumlah_kehadiran: z.string(),
  ucapan: z.string(),
});

export type Rsvp = z.infer<typeof rsvpSchema>;
