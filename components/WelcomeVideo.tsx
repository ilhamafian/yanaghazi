import React from "react";

interface WelcomeVideoProps {
  videoLoaded: boolean;
  setVideoLoaded: (loaded: boolean) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const WelcomeVideo: React.FC<WelcomeVideoProps> = ({
  videoLoaded,
  setVideoLoaded,
  audioRef,
}) => {
  return (
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
        <span className="text-gray-600 text-sm font-medium tracking-wide mb-1 drop-shadow-sm font-serif italic">
          Skrol Bawah
        </span>
        <div className="rounded-full bg-white/80 shadow-lg flex items-center justify-center w-10 h-10">
          <svg
            className="w-5 h-5 text-gray-600 drop-shadow-md scale-x-125"
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
  );
};

export default WelcomeVideo;
