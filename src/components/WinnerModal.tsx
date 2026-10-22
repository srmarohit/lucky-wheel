import { useEffect } from "react";
import type { Prize } from "../types/wheel";

interface WinnerModalProps {
  winner: Prize | null;
  onClose: () => void;
}

/** Winner announcement modal. Closes via button, overlay click, or Escape. */
export function WinnerModal({ winner, onClose }: WinnerModalProps) {
  useEffect(() => {
    if (!winner) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [winner, onClose]);

  if (!winner) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-[5px]"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Winner"
        className="absolute top-1/2 left-1/2 w-[90%] max-w-[400px] -translate-x-1/2 -translate-y-1/2 animate-[modal-appear_0.5s_ease-out] rounded-[20px] bg-white p-10 text-center max-sm:p-5"
      >
        <div className="mb-5 bg-linear-to-br from-accent to-accent-dark bg-clip-text text-[2em] font-bold text-transparent max-sm:text-[1.5em]">
          🎉 Winner! 🎉
        </div>
        <div className="mb-[30px] rounded-[10px] border-l-[5px] border-brand bg-[#f8f9fa] p-5 text-[1.5em] font-bold text-brand max-sm:p-[15px] max-sm:text-[1.2em]">
          {winner.label}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-lg bg-brand px-[30px] py-[15px] text-base font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(102,126,234,0.3)]"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
