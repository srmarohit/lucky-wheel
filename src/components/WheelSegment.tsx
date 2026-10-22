import { memo } from "react";
import { SEGMENT_LABEL_LENGTH, WHEEL_COLORS } from "../constants/wheel";
import type { Prize } from "../types/wheel";
import { labelArcPath, segmentAngle, slicePath } from "../utils/wheelGeometry";

interface WheelSegmentProps {
  prize: Prize;
  index: number;
  total: number;
}

/**
 * One colored pie slice with its label rendered along the slice's arc via
 * textPath, so text always stays inside the colored area no matter how many
 * prizes are on the wheel. Slices are drawn in a 0..100 viewBox.
 */
export const WheelSegment = memo(function WheelSegment({
  prize,
  index,
  total,
}: WheelSegmentProps) {
  const angle = segmentAngle(total);
  // Start at -90deg (top) so segment 0's leading edge points straight up,
  // matching the original wheel's orientation.
  const startAngle = -90 + index * angle;
  const endAngle = startAngle + angle;

  const pathId = `seg-${prize.id}`;
  const label =
    prize.label.length > SEGMENT_LABEL_LENGTH
      ? `${prize.label.slice(0, SEGMENT_LABEL_LENGTH)}...`
      : prize.label;

  // Shrink the font as segments get narrower so labels keep fitting.
  const fontSize = Math.min(4.2, (angle * Math.PI * 0.65) / 24);

  return (
    <g>
      <path
        d={slicePath(startAngle, endAngle)}
        fill={WHEEL_COLORS[index % WHEEL_COLORS.length]}
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={0.4}
      />
      <defs>
        <path id={pathId} d={labelArcPath(startAngle, endAngle)} fill="none" />
      </defs>
      <text
        fill="#fff"
        fontSize={fontSize}
        fontWeight={700}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
      >
        <textPath href={`#${pathId}`} startOffset="50%">
          {label}
        </textPath>
      </text>
    </g>
  );
});
