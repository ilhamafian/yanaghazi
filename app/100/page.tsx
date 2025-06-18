/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rsvp, rsvpFrontendSchema } from "@/schemas/rsvpSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";

export default function RsvpPage() {
  const formMethods = useForm<Rsvp>({
    resolver: zodResolver(rsvpFrontendSchema),
    defaultValues: {
      nama: "",
      kehadiran: "hadir",
      jumlah_kehadiran: "1",
      telefon: "",
      ucapan: "",
    },
  });

  const registerRSVP = async (data: any) => {
    // Get the last segment of the URL as quota
    const quota = window.location.pathname.split("/").pop() || "";

    // Append quota to data
    const updatedData = { ...data, quota };

    try {
      const response = await fetch("/api/rsvp/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        toast("Terima kasih kerana hadiri!", {
          description: "Sunday, December 03, 2023 at 9:00 AM",
        });
      }
    } catch (error) {
      console.error("Failed to create RSVP: ", error);
    }
  };

  useEffect(() => {
    const video = document.getElementById("welcome-video") as HTMLVideoElement;
    if (video) {
      video.play().catch((err) => console.error("Video playback failed:", err));
    }
  }, []);

  return (
    <div>
      <div>
        <video
          id="welcome-video"
          src="/video/welcome.mp4"
          autoPlay
          playsInline
          className="w-full h-auto object-cover"
        />
      </div>
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-serif">
            R S V P
          </CardTitle>
          <CardDescription className="text-center font-serif">
            Jemput datang ke majlis kami
          </CardDescription>
        </CardHeader>
        <Form formMethods={formMethods} onSubmit={registerRSVP}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <FormField
                name="nama"
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <FormLabel className="font-serif">Nama</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="font-serif"
                        placeholder="Nama"
                      />
                    </FormControl>
                  </div>
                )}
              />
              <FormField
                name="kehadiran"
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <FormLabel className="font-serif">Kehadiran</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormItem className="flex items-center space-x-3 space-y-1">
                          <FormControl>
                            <RadioGroupItem value="hadir" />
                          </FormControl>
                          <FormLabel className="font-normal">Hadir</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-1">
                          <FormControl>
                            <RadioGroupItem value="tidakHadir" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Tidak Hadir
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </div>
                )}
              />
              <FormField
                name="jumlah_kehadiran"
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <FormItem>
                      <FormLabel className="font-serif">
                        Jumlah Kehadiran
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  </div>
                )}
              />
              <FormField
                name="telefon"
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <FormLabel className="font-serif">No. Telefon</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="font-serif"
                        placeholder="Telefon"
                      />
                    </FormControl>
                  </div>
                )}
              />
              <FormField
                name="ucapan"
                render={({ field }) => (
                  <div className="flex flex-col space-y-1.5">
                    <FormItem>
                      <FormLabel className="font-serif">Ucapan anda</FormLabel>
                      <Textarea
                        className="font-serif"
                        placeholder="Tuliskan ucapan anda di sini."
                        {...field}
                      />
                      <p className="text-sm text-muted-foreground font-serif">
                        Ucapan anda akan dipaparkan kepada semua.
                      </p>
                    </FormItem>
                  </div>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end mt-4">
            <Button type="submit" className="font-serif">
              Hantar
            </Button>
          </CardFooter>
        </Form>
      </Card>

      <Card className="m-4">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-serif">
            Lokasi & Masa
          </CardTitle>
          <CardDescription className="text-center font-serif">
            <p>Sabtu, 16 August 2025</p>
            <p>11:00 Pagi - 4:00 Petang</p>
            <p>Magica Tropicana Aman Hall,</p>
            <p>Teluk Panglima Garang</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Google Maps Embed */}
          <div className="flex justify-center">
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
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            <a
              href="https://www.google.com/maps/dir/?api=1&destination=Magica+Tropicana+Aman+Hall"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="default">Buka di Google Maps</Button>
            </a>
            <a
              href="https://www.waze.com/en/live-map/directions/my/selangor/telok-panglima-garang/magica-tropicana-aman-hall-(1484663-a)?navigate=yes&place=ChIJv8q3K5WxzTERa0gifK054gM"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline">Buka di Waze</Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
