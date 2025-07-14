import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface QuotaTableProps {
  data: {
    kehadiran_100: string;
    kehadiran_200: string;
    kehadiran_300: string;
    kehadiran_400: string;
    jumlah_kehadiran: string;
  };
}

export default function QuotaTable({ data }: QuotaTableProps) {
  return (
    <div>
      <Table>
        {/* <TableCaption>Kehadiran Mengikut Quota dan Keseluruhan</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Quota</TableHead>
            <TableHead>Kod Quota</TableHead>
            <TableHead className="text-right">Kehadiran</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Yana Parents</TableCell>
            <TableCell>100</TableCell>
            <TableCell className="text-right">{data.kehadiran_100}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Yana</TableCell>
            <TableCell>200</TableCell>
            <TableCell className="text-right">{data.kehadiran_200}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Ghazi Parents</TableCell>
            <TableCell>300</TableCell>
            <TableCell className="text-right">{data.kehadiran_300}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Ghazi</TableCell>
            <TableCell>400</TableCell>
            <TableCell className="text-right">{data.kehadiran_400}</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Jumlah Kehadiran</TableCell>
            <TableCell className="text-right">
              {data.jumlah_kehadiran}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
