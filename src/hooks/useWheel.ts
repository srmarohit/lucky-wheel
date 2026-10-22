import { useCallback, useEffect, useRef, useState } from "react";
import {
  createPrize,
  DEFAULT_PRIZES,
  MAX_PRIZES,
  SPIN_DURATION_MS,
  STORAGE_KEY,
} from "../constants/wheel";
import type { Prize } from "../types/wheel";
import { computeSpinTarget } from "../utils/wheelGeometry";

export type AddPrizeResult = "ok" | "empty" | "full";

function isPrize(value: unknown): value is Prize {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" && typeof candidate.label === "string"
  );
}

function loadInitialPrizes(): Prize[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PRIZES;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_PRIZES;
    return parsed.filter(isPrize);
  } catch {
    return DEFAULT_PRIZES;
  }
}

/**
 * All wheel state and business logic: prize management, spin lifecycle,
 * winner selection, and localStorage persistence.
 */
export function useWheel() {
  const [prizes, setPrizes] = useState<Prize[]>(loadInitialPrizes);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Prize | null>(null);
  const spinTimeout = useRef<number | null>(null);

  // Persist prizes across reloads.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prizes));
    } catch {
      // Storage unavailable (private mode, quota) — persistence is best-effort.
    }
  }, [prizes]);

  // Cancel a pending spin timeout on unmount.
  useEffect(
    () => () => {
      if (spinTimeout.current !== null)
        window.clearTimeout(spinTimeout.current);
    },
    [],
  );

  const addPrize = useCallback(
    (label: string): AddPrizeResult => {
      const trimmed = label.trim();
      if (!trimmed) return "empty";
      if (prizes.length >= MAX_PRIZES) return "full";
      setPrizes((prev) => [...prev, createPrize(trimmed)]);
      return "ok";
    },
    [prizes.length],
  );

  const removePrize = useCallback((id: string) => {
    setPrizes((prev) => prev.filter((prize) => prize.id !== id));
  }, []);

  const resetPrizes = useCallback(() => {
    setPrizes([]);
  }, []);

  const spin = useCallback(() => {
    if (isSpinning || prizes.length === 0) return;

    const selectedIndex = Math.floor(Math.random() * prizes.length);
    const selectedPrize = prizes[selectedIndex];

    setIsSpinning(true);
    setRotation((prev) =>
      computeSpinTarget(prev, prizes.length, selectedIndex),
    );

    spinTimeout.current = window.setTimeout(() => {
      setWinner(selectedPrize);
      setIsSpinning(false);
      spinTimeout.current = null;
    }, SPIN_DURATION_MS);
  }, [isSpinning, prizes]);

  const closeWinner = useCallback(() => {
    setWinner(null);
  }, []);

  return {
    prizes,
    rotation,
    isSpinning,
    winner,
    addPrize,
    removePrize,
    resetPrizes,
    spin,
    closeWinner,
  };
}
