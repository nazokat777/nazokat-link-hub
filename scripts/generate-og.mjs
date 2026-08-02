/**
 * Ijtimoiy tarmoq oldindan ko'rish kartasini (OG image) generatsiya qiladi.
 * Node canvas'da chizib, `public/og.jpg` ga yozadi — reproducible, bir marta
 * ishga tushiriladi (yoki brend o'zgarsa qayta). Natija repoga commit qilinadi.
 *
 * Ishga tushirish:  node scripts/generate-og.mjs
 */
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Brend matnini bitta manbadan (data/links.json) olamiz
const data = JSON.parse(readFileSync(join(root, "data/links.json"), "utf8"));
const roles = data.profile.roles ?? [];

// Saytdagi Unbounded shriftini ro'yxatdan o'tkazamiz (bo'lmasa tizim fonti)
try {
  GlobalFonts.registerFromPath(join(root, "app/fonts/unbounded-latin.woff2"), "Unbounded");
} catch {
  /* fallback: default sans */
}
const DISPLAY = GlobalFonts.has("Unbounded") ? "Unbounded" : "sans-serif";

const W = 1200;
const H = 630;
const canvas = createCanvas(W, H);
const x = canvas.getContext("2d");

function rr(X, Y, WW, HH, r) {
  x.beginPath();
  x.moveTo(X + r, Y);
  x.arcTo(X + WW, Y, X + WW, Y + HH, r);
  x.arcTo(X + WW, Y + HH, X, Y + HH, r);
  x.arcTo(X, Y + HH, X, Y, r);
  x.arcTo(X, Y, X + WW, Y, r);
  x.closePath();
}

// Fon
x.fillStyle = "#050508";
x.fillRect(0, 0, W, H);

// Aurora nurlar
let g = x.createRadialGradient(120, -40, 0, 120, -40, 760);
g.addColorStop(0, "rgba(139,92,246,0.45)");
g.addColorStop(1, "rgba(139,92,246,0)");
x.fillStyle = g;
x.fillRect(0, 0, W, H);
g = x.createRadialGradient(1180, 690, 0, 1180, 690, 680);
g.addColorStop(0, "rgba(34,211,238,0.32)");
g.addColorStop(1, "rgba(34,211,238,0)");
x.fillStyle = g;
x.fillRect(0, 0, W, H);
g = x.createRadialGradient(700, 300, 0, 700, 300, 420);
g.addColorStop(0, "rgba(232,121,249,0.14)");
g.addColorStop(1, "rgba(232,121,249,0)");
x.fillStyle = g;
x.fillRect(0, 0, W, H);

// Perspektiv grid — juda xira
x.strokeStyle = "rgba(235,230,255,0.05)";
x.lineWidth = 1;
for (let i = 0; i <= W; i += 60) {
  x.beginPath();
  x.moveTo(i, 0);
  x.lineTo(i, H);
  x.stroke();
}
for (let j = 0; j <= H; j += 60) {
  x.beginPath();
  x.moveTo(0, j);
  x.lineTo(W, j);
  x.stroke();
}

const portrait = await loadImage(join(root, "public/portrait.png"));

// Portret — o'ngda, gradient ramkali
const PW = 372;
const PH = 486;
const PX = W - PW - 72;
const PY = (H - PH) / 2;
const bg = x.createLinearGradient(PX, PY, PX + PW, PY + PH);
bg.addColorStop(0, "#8B5CF6");
bg.addColorStop(0.55, "#22D3EE");
bg.addColorStop(1, "#E879F9");
x.fillStyle = bg;
rr(PX - 5, PY - 5, PW + 10, PH + 10, 36);
x.fill();

x.save();
rr(PX, PY, PW, PH, 30);
x.clip();
const ar = portrait.width / portrait.height;
const tr = PW / PH;
let sw, sh, sx, sy;
if (ar > tr) {
  sh = portrait.height;
  sw = sh * tr;
  sx = (portrait.width - sw) / 2;
  sy = 0;
} else {
  sw = portrait.width;
  sh = sw / tr;
  sx = 0;
  sy = (portrait.height - sh) * 0.12;
}
x.drawImage(portrait, sx, sy, sw, sh, PX, PY, PW, PH);
// Pastdan yumshoq vignette
const vg = x.createLinearGradient(0, PY + PH - 120, 0, PY + PH);
vg.addColorStop(0, "rgba(5,5,8,0)");
vg.addColorStop(1, "rgba(5,5,8,0.55)");
x.fillStyle = vg;
x.fillRect(PX, PY + PH - 120, PW, 120);
x.restore();

// Matn — chapda
const LX = 82;
x.textBaseline = "alphabetic";

x.fillStyle = "#22D3EE";
x.font = `700 26px ${DISPLAY}`;
x.fillText("/ /  A I   ×   D I Z A Y N", LX, 158);

x.fillStyle = "#F5F3FF";
x.font = `800 94px ${DISPLAY}`;
x.fillText("Nazokat", LX, 270);

const tg = x.createLinearGradient(LX, 0, LX + 600, 0);
tg.addColorStop(0, "#A78BFA");
tg.addColorStop(0.55, "#67E8F9");
tg.addColorStop(1, "#E879F9");
x.fillStyle = tg;
x.font = `800 94px ${DISPLAY}`;
x.fillText("Abduazizova", LX, 372);

// Rol pill'lari
x.font = `600 25px ${DISPLAY}`;
let cx = LX;
let cy = 452;
for (const role of roles) {
  const w = x.measureText(role).width + 44;
  if (cx + w > 700) {
    cx = LX;
    cy += 58;
  }
  x.strokeStyle = "rgba(235,230,255,0.22)";
  x.lineWidth = 1.5;
  rr(cx, cy, w, 46, 23);
  x.stroke();
  x.fillStyle = "#B8B2CE";
  x.fillText(role, cx + 22, cy + 30);
  cx += w + 14;
}

const out = canvas.encode("jpeg", 90);
out.then((buf) => {
  writeFileSync(join(root, "public/og.jpg"), buf);
  console.log(`og.jpg yozildi: ${Math.round(buf.length / 1024)} KB`);
});
