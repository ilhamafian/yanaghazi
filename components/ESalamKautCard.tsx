import React from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface ESalamKautCardProps {
  onCopy: () => void;
}

const ESalamKautCard: React.FC<ESalamKautCardProps> = ({ onCopy }) => (
  <Card className="m-4">
    <CardHeader>
      <CardTitle className="text-left text-3xl font-serif">
        e-Salam Kaut
      </CardTitle>
      <CardDescription className="text-left font-serif">
        Imbaskan QR dengan menggunakan aplikasi perbankan anda.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex justify-center">
        <Image
          src="/photo/QRCode.png"
          alt="E-Salam Kaut QR Code"
          width={250}
          height={250}
          className="rounded-lg shadow-md"
          priority
        />
      </div>
      <div className="text-center mt-2 font-serif">
        <p>Maybank</p>
        <p>162059096885</p>
        <p>Nur Dayana Batrisya binti Mohd Nazri</p>
      </div>
    </CardContent>
    <CardFooter className="flex justify-end mt-4">
      <Button className="font-serif flex items-center gap-2" onClick={onCopy}>
        <Copy className="w-4 h-4" />
        Salin Akaun
      </Button>
    </CardFooter>
  </Card>
);

export default ESalamKautCard;
