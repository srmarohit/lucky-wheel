interface SpinButtonProps {
  isSpinning: boolean;
  disabled: boolean;
  onSpin: () => void;
}

/** Center SPIN button; shows "..." and is disabled while the wheel spins. */
export function SpinButton({ isSpinning, disabled, onSpin }: SpinButtonProps) {
  return (
    <button
      type="button"
      onClick={onSpin}
      disabled={disabled || isSpinning}
      className="absolute top-1/2 left-1/2 z-20 size-[clamp(60px,18vw,80px)] -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-linear-to-br from-accent to-accent-dark text-[clamp(12px,3.5vw,16px)] font-bold text-white shadow-[0_4px_15px_rgba(255,71,87,0.4)] transition-all duration-200 hover:scale-110 hover:shadow-[0_6px_20px_rgba(255,71,87,0.6)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
    >
      {isSpinning ? "..." : "SPIN"}
    </button>
  );
}
