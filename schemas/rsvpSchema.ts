import { z } from "zod";

// Shared base schema
const rsvpBaseSchema = z.object({
  nama: z.string(),
  kehadiran: z.string(),
  jumlah_kehadiran: z.string(),
  telefon: z.string(),
  ucapan: z.string(),
});

// Frontend schema is just the base
export const rsvpFrontendSchema = rsvpBaseSchema;

// Backend schema extends the base with `quota`
export const rsvpBackendSchema = rsvpBaseSchema.extend({
  quota: z.string(),
  date: z.date(),
});

export type backendRsvp = z.infer<typeof rsvpBackendSchema>;

// Type inference still works as expected
export type Rsvp = z.infer<typeof rsvpFrontendSchema>;
