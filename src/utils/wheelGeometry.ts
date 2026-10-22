/**
 * Geometry for SVG wheel segments rendered in a 0..100 viewBox
 * (center at 50,50, radius 50). Segment 0 starts pointing up (-90deg)
 * and segments run clockwise, matching the original app's layout.
 */

const CENTER = 50;
const RADIUS = 50;

/** Angle covered by a single wheel segment, in degrees. */
export function segmentAngle(prizeCount: number): number {
  return 360 / prizeCount;
}

const toRadians = (deg: number) => (deg * Math.PI) / 180;

function polarPoint(
  angleDeg: number,
  radius: number,
): { x: number; y: number } {
  return {
    x: CENTER + radius * Math.cos(toRadians(angleDeg)),
    y: CENTER + radius * Math.sin(toRadians(angleDeg)),
  };
}

/** SVG path for one pie slice spanning [startAngle, endAngle]. */
export function slicePath(startAngle: number, endAngle: number): string {
  const start = polarPoint(startAngle, RADIUS);
  const end = polarPoint(endAngle, RADIUS);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

/**
 * SVG path for the arc a segment's label follows: centered on the slice,
 * at ~65% radius so text sits inside the colored area.
 */
export function labelArcPath(startAngle: number, endAngle: number): string {
  const labelRadius = RADIUS * 0.65;
  const start = polarPoint(startAngle, labelRadius);
  const end = polarPoint(endAngle, labelRadius);
  return `M ${start.x} ${start.y} A ${labelRadius} ${labelRadius} 0 0 1 ${end.x} ${end.y}`;
}

/** Centroid of a slice's label area (~65% radius), with the slice center angle. */
export function labelPoint(
  startAngle: number,
  endAngle: number,
): { x: number; y: number; angle: number } {
  const angle = startAngle + (endAngle - startAngle) / 2;
  const { x, y } = polarPoint(angle, RADIUS * 0.65);
  return { x, y, angle };
}

/**
 * Split a label into word-wrapped lines that each fit within
 * `maxCharsPerLine`. If more than `maxLines` lines would be needed, the last
 * line is truncated with an ellipsis so text never overflows its slice.
 */
export function wrapLabel(
  label: string,
  maxCharsPerLine: number,
  maxLines = 3,
): string[] {
  const words = label.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  const last = kept[maxLines - 1];
  kept[maxLines - 1] =
    last.length > maxCharsPerLine - 1
      ? `${last.slice(0, Math.max(1, maxCharsPerLine - 1))}…`
      : `${last}…`;
  return kept;
}

/**
 * Next wheel rotation that lands segment `selectedIndex` centered under the
 * right-side pointer. Slices are drawn with segment 0's leading edge at -90deg
 * (top), so segment i's center sits at -90 + i*angle + angle/2. Rotating the
 * wheel by R moves that center to (-90 + i*angle + angle/2 + R); we want that
 * congruent to 0deg (the right pointer). Always rotates forward 5-9 full turns.
 */
export function computeSpinTarget(
  currentRotation: number,
  prizeCount: number,
  selectedIndex: number,
): number {
  const angle = segmentAngle(prizeCount);
  const spins = Math.floor(Math.random() * 5) + 5; // 5-9 full rotations
  const segmentCenter = -90 + selectedIndex * angle + angle / 2;
  const landingOffset = ((-segmentCenter % 360) + 360) % 360;
  const currentMod = ((currentRotation % 360) + 360) % 360;
  const delta =
    ((((landingOffset - currentMod) % 360) + 360) % 360) + spins * 360;
  return currentRotation + delta;
}
