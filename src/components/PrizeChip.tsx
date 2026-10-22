import type { Prize } from "../types/wheel";

interface PrizeChipProps {
  prize: Prize;
  onRemove: (id: string) => void;
}

/** Single prize pill in the list, with a × remove button. */
export function PrizeChip({ prize, onRemove }: PrizeChipProps) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white px-[15px] py-2 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
      <span>{prize.label}</span>
      <button
        type="button"
        title="Remove"
        aria-label={`Remove ${prize.label}`}
        onClick={() => onRemove(prize.id)}
        className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-accent text-xs text-white"
      >
        ×
      </button>
    </div>
  );
}
