import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { MapPin, Car, CalendarCheck2, MessageCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EventDetailsAccordion: React.FC = () => (
  <Card className="m-4">
    <CardHeader>
      <CardTitle className="text-left text-3xl font-serif">
        Butiran Majlis
      </CardTitle>
      <CardDescription className="text-left font-serif">
        Di sini kami sediakan kemudahan untuk anda sambungkan butiran majlis ke
        aplikasi peranti anda.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue="item-1"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="font-serif">
            Lokasi Majlis Melalui Waze atau Google Maps
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <div className="rounded overflow-hidden shadow-md w-full max-w-2xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.5498163150187!2d101.52977457528272!3d2.9447777970314677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cdb1952bb7cabf%3A0x3e239ad7c22486b!2sMagica%20Tropicana%20Aman%20Hall%20(1484663-A)!5e0!3m2!1sen!2smy!4v1750262753987!5m2!1sen!2smy"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
            <p>Lokasi Dewan Majlis: </p>
            <div className="leading-tight">
              <p className="mb-0">Magica Tropicana Aman Hall,</p>
              <p className="mb-0">
                Persiaran Tropicana Aman 1, Bandar Tropicana Aman,
              </p>
              <p>42500, Teluk Panglima Garang, Selangor</p>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=Magica+Tropicana+Aman+Hall"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="default" className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Buka di Maps
                </Button>
              </a>
              <a
                href="waze://?q=Magica Tropicana Aman Hall&navigate=yes"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Buka di Waze
                </Button>
              </a>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="font-serif">
            Simpan Tarikh dan Masa ke Google Calendar
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>Tarikh dan Masa: </p>
            <div className="leading-tight">
              <p className="mb-0">Sabtu, 16 Ogos 2025,</p>
              <p className="mb-0">Bersamaan dengan 22 Safar 1447 Hijrah</p>
              <p className="mb-0">dari jam 11:00 pagi hingga 4:00 petang.</p>
            </div>
            <div className="flex justify-end gap-4 mt-4">
              <a
                href="https://www.google.com/calendar/render?action=TEMPLATE&text=Majlis+Perkahwinan+Yana+%26+Ghazi&dates=20250816T030000Z/20250816T080000Z&details=Majlis+di+Magica+Tropicana+Aman+Hall%2C+Teluk+Panglima+Garang&location=Magica+Tropicana+Aman+Hall%2C+Teluk+Panglima+Garang"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="default" className="flex items-center gap-2">
                  <CalendarCheck2 className="w-5 h-5" />
                  Tambah ke Google Calendar
                </Button>
              </a>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger className="font-serif">
            Ada Soalan? Hubungi kami.
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <p>Nama & No. Telefon: </p>
            <div className="leading-tight">
              <p className="mb-0">En. Mohd Nazri: 010-4022 808</p>
              <p className="mb-0">Pn. Zaleha: 019-201 6673</p>
              <p className="mb-0">Cik Nur Farhana: 019-279 2808</p>
            </div>
            <div className="flex justify-end gap-3 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default">
                    <MessageCircle className="w-5 h-5" />
                    Hubungi
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-35" align="start">
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() =>
                        window.open("https://wa.me/60104022808", "_blank")
                      }
                    >
                      Encik Mohd Nazri
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        window.open("https://wa.me/60192016673", "_blank")
                      }
                    >
                      Puan Zaleha
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        window.open("https://wa.me/60192792808", "_blank")
                      }
                    >
                      Cik Nur Farhana
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
  </Card>
);

export default EventDetailsAccordion;
