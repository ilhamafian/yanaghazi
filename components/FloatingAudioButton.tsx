import React from "react";
import { VolumeOff, Volume2 } from "lucide-react";

interface FloatingAudioButtonProps {
  isMuted: boolean;
  onToggle: () => void;
}

const FloatingAudioButton: React.FC<FloatingAudioButtonProps> = ({
  isMuted,
  onToggle,
}) => (
  <button
    onClick={onToggle}
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
    title={isMuted ? "Click to unmute" : "Click to mute"}
  >
    {isMuted ? (
      <VolumeOff className="w-7 h-7 text-rose-950" />
    ) : (
      <Volume2 className="w-7 h-7 text-rose-950" />
    )}
  </button>
);

export default FloatingAudioButton;
