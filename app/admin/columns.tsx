"use client";

import { ColumnDef } from "@tanstack/react-table";

export type RSVP = {
  nama: string;
  kehadiran: string;
  telefon: string;
  ucapan: string;
  quota: string;
  date: Date;
};

export const columns: ColumnDef<RSVP>[] = [
  {
    accessorKey: "nama",
    header: "Nama",
  },
  {
    accessorKey: "telefon",
    header: "Telefon",
  },
  {
    accessorKey: "quota",
    header: "Quota",
  },
  {
    accessorKey: "date",
    header: "Tarikh",
  },
];
