/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rsvp, rsvpFrontendSchema } from "@/schemas/rsvpSchema";
import { toast } from "sonner";
import { useState, useEffect, useRef, useCallback } from "react";
import Autoplay from "embla-carousel-autoplay";
import React from "react";
import LoadingScreen from "@/components/LoadingScreen";
import WelcomeVideo from "@/components/WelcomeVideo";
import FloatingAudioButton from "@/components/FloatingAudioButton";
import RSVPForm from "@/components/RSVPForm";
import EventDetailsAccordion from "@/components/EventDetailsAccordion";
import ESalamKautCard from "@/components/ESalamKautCard";
import UcapanCarousel from "@/components/UcapanCarousel";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function RsvpPage({ params }: PageProps) {
  const { id } = React.use(params);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showOpenButton, setShowOpenButton] = useState(false);
  const [ucapanList, setUcapanList] = useState<
    Array<{ ucapan: string; nama: string; dates: string }>
  >([]);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  useEffect(() => {
    fetchUcapan();
    const timeout = setTimeout(() => setShowOpenButton(true), 5000);
    return () => clearTimeout(timeout);
  }, []);

  // Combine audio-related effects
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = isMuted;
    let hasAttemptedPlay = false;
    const tryPlay = () => {
      if (hasAttemptedPlay) return;
      if (audio.paused) {
        hasAttemptedPlay = true;
        audio.play().catch(() => {
          hasAttemptedPlay = false;
        });
      }
      window.removeEventListener("click", tryPlay);
      window.removeEventListener("touchstart", tryPlay);
      window.removeEventListener("keydown", tryPlay);
    };
    window.addEventListener("click", tryPlay);
    window.addEventListener("touchstart", tryPlay);
    window.addEventListener("keydown", tryPlay);
    return () => {
      window.removeEventListener("click", tryPlay);
      window.removeEventListener("touchstart", tryPlay);
      window.removeEventListener("keydown", tryPlay);
    };
  }, [isMuted]);

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

  const fetchUcapan = useCallback(async () => {
    try {
      const response = await fetch("/api/rsvp");
      if (!response.ok) throw new Error("Failed to fetch ucapan");
      const data = await response.json();
      setUcapanList(data);
    } catch (error) {
      console.error("Error fetching ucapan:", error);
    }
  }, []);

  const registerRSVP = useCallback(
    async (data: any) => {
      const quota = id;
      const updatedData = { ...data, quota };
      try {
        const response = await fetch("/api/rsvp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });
        if (response.ok) {
          toast("Terima kasih kerana hadir!", {});
          fetchUcapan();
        }
      } catch (error) {
        console.error("Failed to create RSVP: ", error);
      }
    },
    [id, fetchUcapan]
  );

  const copyAccountNumber = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("162059096885");
      toast("Nombor akaun telah disalin!", { description: "162059096885" });
    } catch (error) {
      console.error("Failed to copy account number: ", error);
      toast("Gagal menyalin nombor akaun", { description: "Sila cuba lagi" });
    }
  }, []);

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/intro-audio.mp3"
        autoPlay
        loop
        style={{ display: "none" }}
      />
      <FloatingAudioButton
        isMuted={isMuted}
        onToggle={() => setIsMuted((m) => !m)}
      />
      <LoadingScreen
        showOpenButton={showOpenButton}
        onOpen={() => {
          setVideoLoaded(true);
          audioRef.current?.play();
        }}
        isVisible={!videoLoaded}
      />
      <WelcomeVideo
        videoLoaded={videoLoaded}
        setVideoLoaded={setVideoLoaded}
        audioRef={audioRef}
      />
      <div className="relative z-50 mt-[100vh] bg-white/60 backdrop-blur-md rounded-2xl">
        <section className="w-full flex flex-col items-center justify-center py-10 px-4">
          <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl text-center mb-2 mt-4 tracking-tight font-ballet font-[700]">
            Majlis Perkahwinan
          </h1>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-limelight font-semibold text-center mb-4 text-rose-950">
            Yana <span className="text-rose-950">&amp;</span> Ghazi
          </h2>
          <div className="text-center text-base sm:text-lg md:text-xl font-serif text-gray-700 mb-1 ">
            Sabtu, 16 Ogos &bull; 11:00AM - 04:00PM
          </div>
          <div className="text-center text-base sm:text-base md:text-lg font-serif text-gray-600">
            Magica Tropicana Aman Hall,
            <br />
            Teluk Panglima Garang
          </div>
        </section>
        <RSVPForm formMethods={formMethods} onSubmit={registerRSVP} />
        <EventDetailsAccordion />
        <ESalamKautCard onCopy={copyAccountNumber} />
        <Card className="m-4">
          <CardHeader>
            <CardTitle className="text-left text-3xl font-serif">
              Ucapan Anda
            </CardTitle>
            <CardDescription className="text-left font-serif">
              Di sini kami paparkan ucapan-ucapan anda. Jumpa nanti!
            </CardDescription>
          </CardHeader>
          <CardContent className="flex aspect-video items-center justify-center p-6 w-full overflow-hidden">
            <UcapanCarousel ucapanList={ucapanList} plugin={plugin} />
          </CardContent>
        </Card>
        <section className="m-4">
          <footer className="w-full text-center py-6 font-serif text-gray-600 text-base">
            Aplikasi ini dibina khas oleh{" "}
            <span className="text-rose-950 font-limelight font-semibold">
              Yana &amp; Ghazi
            </span>
          </footer>
        </section>
      </div>
    </>
  );
}
