import { memo } from "react";
import { WHEEL_COLORS } from "../constants/wheel";
import type { Prize } from "../types/wheel";
import {
  labelPoint,
  segmentAngle,
  slicePath,
  wrapLabel,
} from "../utils/wheelGeometry";

interface WheelSegmentProps {
  prize: Prize;
  index: number;
  total: number;
}

/**
 * One colored pie slice. The label is word-wrapped into multiple lines and
 * drawn at the slice centroid, rotated to read outward along the radius
 * (flipped on the left half so it never renders upside down). Slices are
 * drawn in a 0..100 viewBox.
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

  // Shrink the font as segments get narrower so labels keep fitting.
  const fontSize = Math.min(4.2, (angle * Math.PI * 0.65) / 24);
  const lineHeight = fontSize * 1.15;

  // Wrap into lines that fit the radial space (~28 viewBox units long).
  const maxCharsPerLine = Math.max(6, Math.floor(28 / (fontSize * 0.55)));
  const lines = wrapLabel(prize.label, maxCharsPerLine);

  const { x, y, angle: centerAngle } = labelPoint(startAngle, endAngle);
  const normalized = ((centerAngle % 360) + 360) % 360;
  const flip = normalized > 90 && normalized < 270;
  const textRotation = centerAngle + (flip ? 180 : 0);

  return (
    <g>
      <path
        d={slicePath(startAngle, endAngle)}
        fill={WHEEL_COLORS[index % WHEEL_COLORS.length]}
        stroke="rgba(255,255,255,0.35)"
        strokeWidth={0.4}
      />
      <text
        transform={`translate(${x} ${y}) rotate(${textRotation})`}
        fill="#fff"
        fontSize={fontSize}
        fontWeight={700}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
      >
        {lines.map((line, lineIndex) => (
          <tspan
            key={lineIndex}
            x={0}
            dy={
              lineIndex === 0
                ? ((1 - lines.length) / 2) * lineHeight
                : lineHeight
            }
          >
            {line}
          </tspan>
        ))}
      </text>
    </g>
  );
});
