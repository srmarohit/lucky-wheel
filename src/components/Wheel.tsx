import type { CSSProperties } from "react";
import { SPIN_DURATION_MS, SPIN_EASING } from "../constants/wheel";
import type { Prize } from "../types/wheel";
import { SpinButton } from "./SpinButton";
import { WheelPointer } from "./WheelPointer";
import { WheelSegment } from "./WheelSegment";

interface WheelProps {
  prizes: Prize[];
  rotation: number;
  isSpinning: boolean;
  onSpin: () => void;
}

/** The spinning wheel disc plus its pointer and center spin button. */
export function Wheel({ prizes, rotation, isSpinning, onSpin }: WheelProps) {
  const wheelStyle: CSSProperties = {
    transform: `rotate(${rotation}deg)`,
    transition: `transform ${SPIN_DURATION_MS}ms ${SPIN_EASING}`,
  };

  return (
    <div className="relative mx-auto mb-[30px] aspect-square w-[min(90vw,400px)]">
      <WheelPointer />
      <div
        className="h-full w-full rounded-full shadow-[0_0_30px_rgba(0,0,0,0.3)]"
        style={wheelStyle}
      >
        {prizes.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full text-lg text-[#666]">
            Add some prizes!
          </div>
        ) : (
          <svg viewBox="0 0 100 100" className="h-full w-full">
            {prizes.map((prize, index) => (
              <WheelSegment
                key={prize.id}
                prize={prize}
                index={index}
                total={prizes.length}
              />
            ))}
          </svg>
        )}
      </div>
      <SpinButton
        isSpinning={isSpinning}
        disabled={prizes.length === 0}
        onSpin={onSpin}
      />
    </div>
  );
}
