import { z } from "zod";

// Shared base schema for new submissions (strict validation)
const rsvpBaseSchema = z.object({
  nama: z.string().min(1, "Nama adalah wajib diisi"),
  kehadiran: z.string().min(1, "Sila pilih kehadiran anda"),
  jumlah_kehadiran: z.string().min(1, "Sila pilih jumlah kehadiran"),
  telefon: z.string().min(1, "Nombor telefon adalah wajib diisi"),
  ucapan: z.string().optional(), // Optional field
});

// Lenient schema for reading existing data (allows empty strings)
const rsvpReadSchema = z.object({
  nama: z.string().optional().default(""),
  kehadiran: z.string().optional().default(""),
  jumlah_kehadiran: z.string().optional().default(""),
  telefon: z.string().optional().default(""),
  ucapan: z.string().optional().default(""),
});

// Frontend schema is just the base
export const rsvpFrontendSchema = rsvpBaseSchema;

// Backend schema extends the base with `quota`
export const rsvpBackendSchema = rsvpBaseSchema.extend({
  quota: z.string(),
  date: z.date(),
});

// Backend read schema for existing data
export const rsvpBackendReadSchema = rsvpReadSchema.extend({
  _id: z.string(),
  quota: z.string(),
  date: z.date(),
});

export type backendRsvp = z.infer<typeof rsvpBackendSchema>;
export type backendRsvpRead = z.infer<typeof rsvpBackendReadSchema>;

// Type inference still works as expected
export type Rsvp = z.infer<typeof rsvpFrontendSchema>;
