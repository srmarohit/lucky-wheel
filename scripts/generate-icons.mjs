/**
 * One-off PWA icon generator. Draws a mini prize wheel (colored slices, rim,
 * center hub) per-pixel and writes real PNG files using only Node's zlib.
 * Run with: node scripts/generate-icons.mjs
 */
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

// CRC-32 table for PNG chunk checksums.
const crcTable = new Int32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c;
});
const crc32 = (buf) => {
  let c = -1;
  for (let i = 0; i < buf.length; i++)
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** Encode an RGBA pixel buffer (Uint8Array, top-to-bottom rows) as a PNG. */
function encodePng(size, rgba) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 4 + 1);
    raw[rowStart] = 0; // filter: none
    rgba.copy
      ? rgba.copy(raw, rowStart + 1, y * size * 4, (y + 1) * size * 4)
      : raw.set(rgba.subarray(y * size * 4, (y + 1) * size * 4), rowStart + 1);
  }
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const COLORS = [
  "#ff6b6b",
  "#4ecdc4",
  "#45b7d1",
  "#f9ca24",
  "#6c5ce7",
  "#fd79a8",
];
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/** Render the wheel icon at the given pixel size. `maskable` adds safe padding. */
function renderIcon(size, { maskable = false } = {}) {
  const px = new Uint8Array(size * size * 4);
  const c = size / 2;
  // Maskable icons get a solid brand background and an inset wheel so the
  // important art survives platform masking (circle/squircle crops).
  const bg = hex("#667eea");
  const wheelR = maskable ? size * 0.32 : size * 0.44;
  const hubR = wheelR * 0.28;
  const rim = Math.max(1, size * 0.02);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - c + 0.5;
      const dy = y - c + 0.5;
      const d = Math.hypot(dx, dy);
      const i = (y * size + x) * 4;
      if (d > wheelR) {
        if (maskable) {
          px[i] = bg[0];
          px[i + 1] = bg[1];
          px[i + 2] = bg[2];
          px[i + 3] = 255;
        } // else transparent
        continue;
      }
      if (d > wheelR - rim) {
        px[i] = 255;
        px[i + 1] = 255;
        px[i + 2] = 255;
        px[i + 3] = 255; // white rim
        continue;
      }
      if (d < hubR) {
        const accent = hex("#ff4757");
        px[i] = accent[0];
        px[i + 1] = accent[1];
        px[i + 2] = accent[2];
        px[i + 3] = 255;
        continue;
      }
      // Slice color by angle; 0deg points up, clockwise.
      const angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
      const a = (angle + 360) % 360;
      const [r, g, b] = hex(COLORS[Math.floor(a / 60) % COLORS.length]);
      px[i] = r;
      px[i + 1] = g;
      px[i + 2] = b;
      px[i + 3] = 255;
    }
  }
  return encodePng(size, Buffer.from(px.buffer));
}

const icons = [
  ["pwa-192x192.png", 192, {}],
  ["pwa-512x512.png", 512, {}],
  ["apple-touch-icon.png", 180, {}],
  ["pwa-maskable-512x512.png", 512, { maskable: true }],
];
for (const [name, size, opts] of icons) {
  writeFileSync(join(outDir, name), renderIcon(size, opts));
  console.log(`wrote public/${name}`);
}
