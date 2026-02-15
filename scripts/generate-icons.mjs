// Generate PWA icons as SVG → PNG using sharp or canvas-free approach
// Since we may not have sharp, we'll create SVG files and reference them

import { writeFileSync } from "fs";

function createSvgIcon(size) {
  const padding = Math.round(size * 0.15);
  const innerSize = size - padding * 2;
  const cx = size / 2;
  const cy = size / 2;
  const fontSize = Math.round(size * 0.35);
  const smallFont = Math.round(size * 0.12);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="#059669"/>
  <text x="${cx}" y="${cy - size * 0.02}" text-anchor="middle" dominant-baseline="central" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700" fill="white">С</text>
  <text x="${cx}" y="${cy + size * 0.28}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${smallFont}" font-weight="500" fill="rgba(255,255,255,0.9)">spesti</text>
</svg>`;
}

// Generate SVGs that can be used as icons
const sizes = [192, 512];
for (const size of sizes) {
  const svg = createSvgIcon(size);
  writeFileSync(`public/icons/icon-${size}x${size}.svg`, svg);
  console.log(`Generated icon-${size}x${size}.svg`);
}

console.log("Done! SVG icons generated.");
