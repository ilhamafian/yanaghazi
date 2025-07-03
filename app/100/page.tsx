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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CalendarCheck2,
  MapPin,
  Car,
  MessageCircle,
  VolumeOff,
  Volume2,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function RsvpPage() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [ucapanList, setUcapanList] = useState<
    Array<{ ucapan: string; nama: string; dates: string }>
  >([]);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetchUcapan();
    const timeout = setTimeout(() => {
      // fallback in case video load event fails
      setVideoLoaded(true);
    }, 5000); // 5s max wait

    return () => clearTimeout(timeout);
  }, []);

  // Play audio on load and handle mute state
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = isMuted;
      // Try to play on mount (may require user interaction on some browsers)
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {}); // ignore autoplay errors
      }
    }
  }, [isMuted]);

  // Try to play audio on first user interaction if autoplay is blocked
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const tryPlay = () => {
      audio.play().catch(() => {});
      window.removeEventListener("click", tryPlay);
      window.removeEventListener("touchstart", tryPlay);
    };
    window.addEventListener("click", tryPlay);
    window.addEventListener("touchstart", tryPlay);
    return () => {
      window.removeEventListener("click", tryPlay);
      window.removeEventListener("touchstart", tryPlay);
    };
  }, []);

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

  const fetchUcapan = async () => {
    try {
      const response = await fetch("/api/rsvp");
      if (!response.ok) throw new Error("Failed to fetch ucapan");
      const data = await response.json();
      setUcapanList(data);
    } catch (error) {
      console.error("Error fetching ucapan:", error);
    }
  };

  const registerRSVP = async (data: any) => {
    // Get the last segment of the URL as quota
    const quota = window.location.pathname.split("/").pop() || "";

    // Append quota to data
    const updatedData = { ...data, quota };

    try {
      const response = await fetch("/api/rsvp", {
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

        fetchUcapan();
      }
    } catch (error) {
      console.error("Failed to create RSVP: ", error);
    }
  };

  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <>
      {/* Audio Player and Floating Mute/Unmute Button */}
      <audio
        ref={audioRef}
        src="/audio/intro-audio.mp3"
        autoPlay
        loop
        style={{ display: "none" }}
      />
      <button
        onClick={() => {
          setIsMuted((m) => !m);
        }}
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 100,
          background: "rgba(255,255,255,0.85)",
          borderRadius: "50%",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          width: 56,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          cursor: "pointer",
        }}
        aria-label={isMuted ? "Unmute music" : "Mute music"}
      >
        {isMuted ? (
          <VolumeOff className="w-7 h-7 text-pink-600" />
        ) : (
          <Volume2 className="w-7 h-7 text-pink-600" />
        )}
      </button>
      {/* LOADING SCREEN */}
      {!videoLoaded && (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
          <div className="text-center animate-pulse">
            <p className="text-lg font-serif text-gray-600 mb-2">
              Aplikasi dibina khas oleh
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-center mb-4 text-pink-700">
              Yana <span className="text-pink-400">&amp;</span> Ghazi
            </h2>
            <div
              className="w-12 h-12 border-4 border-pink-300 border-t-transparent rounded-full animate-spin mx-auto"
              style={{ animationDuration: "2s" }} // default is 1s
            />
          </div>
        </div>
      )}

      {/* Fullscreen Welcome Video */}
      <section className="w-screen h-screen fixed top-0 left-0 z-40">
        <video
          id="welcome-video"
          src="/video/welcome.mp4"
          autoPlay
          muted
          playsInline
          loop
          className="w-full h-full object-cover"
          style={{ maxHeight: "100vh" }}
        />
        {/* Scroll Down Indicator */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center animate-bounce-slow">
          <span className="text-gray-600 text-xl font-medium tracking-wide mb-2 drop-shadow-sm font-serif italic">
            Skrol Bawah
          </span>
          <div className="rounded-full bg-white/80 shadow-lg flex items-center justify-center w-16 h-16">
            <svg
              className="w-8 h-8 text-gray-600 drop-shadow-md scale-x-125"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        <style jsx global>{`
          @keyframes bounce-slow {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-12px);
            }
          }
          .animate-bounce-slow {
            animation: bounce-slow 2.2s infinite;
          }
        `}</style>
      </section>
      {/* Main Content starts after video */}
      <div className="relative z-50 mt-[100vh] bg-white/60 backdrop-blur-md rounded-2xl">
        <section className="w-full flex flex-col items-center justify-center py-10 px-4 ">
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-center mb-2 tracking-tight font-imperial">
            Majlis Perkahwinan
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-semibold text-center mb-4 text-pink-700">
            Yana <span className="text-pink-400">&amp;</span> Ghazi
          </h2>
          <div className="text-center text-base sm:text-lg md:text-xl font-serif text-gray-700 mb-1 ">
            Sabtu, 16 August &bull; 11:00 AM
          </div>
          <div className="text-center text-base sm:text-base md:text-lg font-serif text-gray-600">
            Magica Tropicana Aman Hall,
            <br />
            Teluk Panglima Garang
          </div>
        </section>

        <Card className="m-4">
          <CardHeader>
            <CardTitle className="text-left text-3xl font-serif">
              Jemput Hadir!
            </CardTitle>
            <CardDescription className="text-left font-serif">
              Sila isi maklumat berikut untuk mengesahkan kehadiran anda.
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
                        <FormLabel className="font-serif">
                          Ucapan anda
                        </FormLabel>
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
            <CardTitle className="text-left text-3xl font-serif">
              Butiran Majlis
            </CardTitle>
            <CardDescription className="text-left font-serif">
              Di sini kami sediakan kemudahan untuk anda sambungkan butiran
              majlis ke aplikasi peranti anda.
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
                      <Button
                        variant="default"
                        className="flex items-center gap-2"
                      >
                        <MapPin className="w-5 h-5" />
                        Buka di Maps
                      </Button>
                    </a>
                    <a
                      href="https://www.waze.com/en/live-map/directions/my/selangor/telok-panglima-garang/magica-tropicana-aman-hall-(1484663-a)?navigate=yes&place=ChIJv8q3K5WxzTERa0gifK054gM"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
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
                    <p className="mb-0">Sabtu, 16 August 2025,</p>
                    <p className="mb-0">
                      Bersamaan dengan 22 Safar 1447 Hijrah
                    </p>
                    <p className="mb-0">
                      dari jam 11:00 pagi hingga 4:00 petang.
                    </p>
                  </div>
                  <div className="flex justify-end gap-4 mt-4">
                    <a
                      href="https://www.google.com/calendar/render?action=TEMPLATE&text=Majlis+Perkahwinan+Yana+%26+Ghazi&dates=20250816T030000Z/20250816T080000Z&details=Majlis+di+Magica+Tropicana+Aman+Hall%2C+Teluk+Panglima+Garang&location=Magica+Tropicana+Aman+Hall%2C+Teluk+Panglima+Garang"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="default"
                        className="flex items-center gap-2"
                      >
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
                    <p className="mb-0">Pn. Zaleha: 019-201 6673</p>
                    <p className="mb-0">En. Mohd Nazri: 010-4022 808</p>
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
                              window.open("https://wa.me/60192016673", "_blank")
                            }
                          >
                            Puan Zaleha
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              window.open("https://wa.me/60104022808", "_blank")
                            }
                          >
                            Encik Mohd Nazri
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

        <Card className="m-4">
          <CardHeader>
            <CardTitle className="text-left text-3xl font-serif">
              Ucapan Anda
            </CardTitle>
            <CardDescription className="text-left font-serif">
              Terima kasih kerana menghadiri majlis kami. Di sini kami paparkan
              ucapan-ucapan anda. Jumpa nanti!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex aspect-video items-center justify-center p-6 w-full overflow-hidden">
            <Carousel
              opts={{
                align: "start",
              }}
              orientation="vertical"
              className="w-full max-w-xs" // <-- Change from max-w-xsv to max-w-xs or sm
              plugins={[plugin.current]}
              onMouseEnter={plugin.current.stop}
              onMouseLeave={plugin.current.reset}
            >
              <CarouselContent className="-mt-1 h-[200px]">
                {ucapanList.slice().map((item, idx) => (
                  <CarouselItem key={idx} className="pt-1 md:basis-1/2">
                    <div className="p-1">
                      <Card className="w-full">
                        {" "}
                        {/* Force child card to fit */}
                        <CardContent className="flex flex-col items-center justify-center p-6">
                          <p className="text-lg font-serif text-center mb-2">
                            "{item.ucapan}"
                          </p>
                          <p className="text-sm font-serif text-center">
                            ~ {item.nama}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>

        <section className="m-4">
          <footer className="w-full text-center py-6 font-serif text-gray-600 text-base">
            Aplikasi ini dibina khas oleh{" "}
            <span className="text-pink-700 font-semibold">
              Yana &amp; Ghazi
            </span>
          </footer>
        </section>
      </div>
    </>
  );
}
