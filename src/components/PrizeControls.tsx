import { useState } from "react";
import type { FormEvent } from "react";
import { PRIMARY_BUTTON_CLASSES } from "../constants/styles";
import { MAX_PRIZE_LENGTH } from "../constants/wheel";
import type { AddPrizeResult } from "../hooks/useWheel";

interface PrizeControlsProps {
  onAdd: (label: string) => AddPrizeResult;
  onReset: () => void;
}

/** Input + "Add Prize" (Enter works via form submit) and "Reset All". */
export function PrizeControls({ onAdd, onReset }: PrizeControlsProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = onAdd(value);
    if (result === "ok") {
      setValue("");
    } else if (result === "full") {
      window.alert("Maximum 12 prizes allowed!");
    }
  };

  return (
    <div className="mb-5 flex flex-wrap items-center justify-center gap-[15px] max-sm:flex-col max-sm:gap-2.5">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2.5 max-sm:w-full"
      >
        <input
          type="text"
          value={value}
          maxLength={MAX_PRIZE_LENGTH}
          placeholder="Enter a prize..."
          onChange={(event) => setValue(event.target.value)}
          className="w-[200px] rounded-lg border-2 border-[#ddd] p-3 text-base transition-colors focus:border-brand focus:outline-none max-sm:flex-1"
        />
        <button type="submit" className={PRIMARY_BUTTON_CLASSES}>
          Add Prize
        </button>
      </form>
      <button
        type="button"
        onClick={onReset}
        className={PRIMARY_BUTTON_CLASSES}
      >
        Reset All
      </button>
    </div>
  );
}
