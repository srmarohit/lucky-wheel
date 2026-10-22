import type { Prize } from "../types/wheel";

/** Segment fill colors, cycled by index (matches the original app). */
export const WHEEL_COLORS = [
  "#ff6b6b",
  "#4ecdc4",
  "#45b7d1",
  "#f9ca24",
  "#6c5ce7",
  "#fd79a8",
  "#e17055",
  "#00b894",
  "#fdcb6e",
  "#6c5ce7",
  "#fd79a8",
  "#00cec9",
] as const;

export const MAX_PRIZES = 12;
export const MAX_PRIZE_LENGTH = 30;
/** Longest label rendered on a wheel segment before truncating. */
export const SEGMENT_LABEL_LENGTH = 15;

export const SPIN_DURATION_MS = 3000;
export const SPIN_EASING = "cubic-bezier(0.23, 1, 0.32, 1)";

export const STORAGE_KEY = "lucky-wheel-prizes";

export const createPrize = (label: string): Prize => ({
  id: crypto.randomUUID(),
  label,
});

export const DEFAULT_PRIZES: Prize[] = [
  "🎮 Gaming Mouse",
  "📱 Phone Case",
  "🎧 Headphones",
  "🍕 Pizza Voucher",
  "☕ Coffee Mug",
  "📚 Book",
].map(createPrize);
