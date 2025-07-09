import React from "react";

interface LoadingScreenProps {
  showOpenButton: boolean;
  onOpen: () => void;
  isVisible: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  showOpenButton,
  onOpen,
  isVisible,
}) => {
  if (!isVisible) return null;
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <div className="text-center animate-pulse">
        <p className="text-lg font-serif text-gray-600 mb-2">
          Aplikasi ini dibina khas oleh
        </p>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-limelight font-semibold text-center mb-4 text-rose-950">
          Yana <span className="text-rose-950">&amp;</span> Ghazi
        </h2>
        {showOpenButton ? (
          <button
            className="px-8 py-3 rounded-full bg-rose-950 text-white font-limelight text-xl shadow-lg hover:bg-rose-800 transition"
            onClick={onOpen}
          >
            Buka
          </button>
        ) : (
          <div
            className="w-12 h-12 border-4 border-rose-950 border-t-transparent rounded-full animate-spin mx-auto"
            style={{ animationDuration: "2s" }}
          />
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
