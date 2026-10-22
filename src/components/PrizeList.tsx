import type { Prize } from "../types/wheel";
import { PrizeChip } from "./PrizeChip";

interface PrizeListProps {
  prizes: Prize[];
  onRemove: (id: string) => void;
}

/** "Current Prizes" panel showing every prize as a removable chip. */
export function PrizeList({ prizes, onRemove }: PrizeListProps) {
  return (
    <section className="my-5 rounded-[10px] bg-[#f8f9fa] p-5">
      <h3 className="mb-[15px] text-center font-bold text-[#333]">
        🏆 Current Prizes
      </h3>
      <div className="flex flex-wrap justify-center gap-2.5">
        {prizes.length === 0 ? (
          <div className="flex items-center gap-2 rounded-full bg-white px-[15px] py-2 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
            No prizes added yet!
          </div>
        ) : (
          prizes.map((prize) => (
            <PrizeChip key={prize.id} prize={prize} onRemove={onRemove} />
          ))
        )}
      </div>
    </section>
  );
}
