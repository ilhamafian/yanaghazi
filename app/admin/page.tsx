"use client";

import { useEffect, useState } from "react";
import { columns, RSVP } from "./columns";
import { DataTable } from "./data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { jumlahKehadiran } from "@/schemas/rsvpSchema";
import QuotaTable from "@/components/QuotaTable";

export default function AdminPage() {
  const [dataTable, setDataTable] = useState<RSVP[]>([]);
  const [quotaTable, setQuotaTable] = useState<jumlahKehadiran>();

  const fetchRSVP = async () => {
    try {
      const response = await fetch("/api/admin");
      if (!response.ok) throw new Error("Failed to fetch RSVP");
      const data = await response.json();
      console.log("Uncleaned data: ", data);
      const cleanedData = data.rsvp
        .filter(
          (item: { kehadiran: string }) => item.kehadiran !== "tidak hadir"
        )
        .map((item: any) => ({
          id: item._id,
          nama: item.nama,
          kehadiran: item.kehadiran,
          jumlah_kehadiran: item.jumlah_kehadiran,
          telefon: item.telefon,
          ucapan: item.ucapan,
          quota: item.quota,
          date: new Date(item.date),
        }));

      console.log("Cleaned data: ", cleanedData);

      setDataTable(cleanedData);
      setQuotaTable(data.quotaTotal);
    } catch (error) {
      console.error("Error fetching RSVP: ", error);
    }
  };

  useEffect(() => {
    fetchRSVP();
  }, []);

  return (
    <div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Data RSVP</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <DataTable columns={columns} data={dataTable} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Kehadiran Mengikut Quota</CardTitle>
          </CardHeader>
          <CardContent>
            {quotaTable && <QuotaTable data={quotaTable} />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
