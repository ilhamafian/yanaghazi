"use client";

import { useEffect, useState } from "react";
import { columns, RSVP } from "./columns";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [dataTable, setDataTable] = useState<RSVP[]>([]);

  const fetchRSVP = async () => {
    try {
      const response = await fetch("/api/admin");
      if (!response.ok) throw new Error("Failed to fetch RSVP");
      const data = await response.json();
      const cleanedData = data
        .filter(
          (item: { kehadiran: string }) => item.kehadiran !== "tidak hadir"
        )
        .map((item: any) => ({
          nama: item.nama,
          kehadiran: item.kehadiran,
          telefon: item.telefon,
          ucapan: item.ucapan,
          quota: item.quota,
          date: new Date(item.date),
        }));

      console.log("Cleaned data: ", cleanedData);

      setDataTable(cleanedData);
    } catch (error) {
      console.error("Error fetching RSVP: ", error);
    }
  };

  useEffect(() => {
    fetchRSVP();
  }, []);

  return (
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
}
