/**
 * app/icon.png (32) va app/apple-icon.png (180) ni generatsiya qiladi —
 * gradient "N" brend belgisi. Next bu file-convention ikonkalarni basePath
 * bilan avtomatik chiqaradi (qo'lda asset() kerak emas). Bir marta ishga
 * tushiriladi; natija repoga commit qilinadi.
 *
 * Ishga tushirish:  node scripts/generate-icons.mjs
 */
import { createCanvas } from "@napi-rs/canvas";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function rr(ctx, X, Y, W, H, r) {
  ctx.beginPath();
  ctx.moveTo(X + r, Y);
  ctx.arcTo(X + W, Y, X + W, Y + H, r);
  ctx.arcTo(X + W, Y + H, X, Y + H, r);
  ctx.arcTo(X, Y + H, X, Y, r);
  ctx.arcTo(X, Y, X + W, Y, r);
  ctx.closePath();
}

function drawIcon(size) {
  const c = createCanvas(size, size);
  const x = c.getContext("2d");
  const s = size / 64; // 64px koordinatalarda chizamiz, so'ng masshtab

  const g = x.createLinearGradient(0, 0, size, size);
  g.addColorStop(0, "#8B5CF6");
  g.addColorStop(0.55, "#22D3EE");
  g.addColorStop(1, "#E879F9");

  // Fon
  x.fillStyle = "#050508";
  rr(x, 0, 0, size, size, 16 * s);
  x.fill();

  // Gradient chegara
  x.strokeStyle = g;
  x.lineWidth = 2.5 * s;
  rr(x, 1.25 * s, 1.25 * s, size - 2.5 * s, size - 2.5 * s, 14.75 * s);
  x.stroke();

  // "N" harfi
  x.fillStyle = g;
  x.beginPath();
  x.moveTo(20 * s, 45 * s);
  x.lineTo(20 * s, 19 * s);
  x.lineTo(25.5 * s, 19 * s);
  x.lineTo(38.5 * s, 36.5 * s);
  x.lineTo(38.5 * s, 19 * s);
  x.lineTo(44 * s, 19 * s);
  x.lineTo(44 * s, 45 * s);
  x.lineTo(38.5 * s, 45 * s);
  x.lineTo(25.5 * s, 27.5 * s);
  x.lineTo(25.5 * s, 45 * s);
  x.closePath();
  x.fill();

  return c.toBuffer("image/png");
}

writeFileSync(join(root, "app/icon.png"), drawIcon(32));
writeFileSync(join(root, "app/apple-icon.png"), drawIcon(180));
console.log("app/icon.png (32) va app/apple-icon.png (180) yozildi");
