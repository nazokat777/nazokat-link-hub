import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/*
 * ============================================================
 *  VERCEL ANALYTICS — SOZLASH (ixtiyoriy, deploy paytida yoqing)
 * ------------------------------------------------------------
 *  1. Paketni o'rnating:
 *       npm install @vercel/analytics @vercel/speed-insights
 *  2. Importlarni oching:
 *       import { Analytics } from "@vercel/analytics/react";
 *       import { SpeedInsights } from "@vercel/speed-insights/next";
 *  3. <body> ichida {children} dan keyin joylashtiring:
 *       <Analytics />
 *       <SpeedInsights />
 *  Vercel'ga deploy qilinganda avtomatik ishlaydi.
 * ============================================================
 */

// Xalqaro premium juftlik: Unbounded (display) + Manrope (body).
// Shriftlar self-host qilingan (app/fonts) — tarmoqqa bog'liq emas,
// GDPR-ga ham qulay (Google serverlariga so'rov ketmaydi).
const unbounded = localFont({
  src: "./fonts/unbounded-latin.woff2",
  weight: "200 900",
  variable: "--font-display",
  display: "swap",
});

const manrope = localFont({
  src: "./fonts/manrope-latin.woff2",
  weight: "200 800",
  variable: "--font-body",
  display: "swap",
});

// Ijtimoiy tarmoq oldindan ko'rish kartasi mutlaq URL talab qiladi.
// GitHub Pages'da sayt subkatalogda; Vercel/dev'da NEXT_PUBLIC_SITE_URL
// bilan ustidan yozish mumkin. Next opengraph-image'ni shu asosda hal qiladi.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NEXT_PUBLIC_BASE_PATH
    ? `https://nazokat777.github.io${process.env.NEXT_PUBLIC_BASE_PATH}`
    : process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Nazokat Abduazizova — AI mutaxassis · UI/UX dizayner",
  description:
    "AI mutaxassis, AI content creator, UI/UX mutaxassis va dizayner Nazokat Abduazizova. Sun'iy intellekt va dizayn kuchi bir joyda — portfolio, Telegram kanal va bog'lanish havolalari.",
  openGraph: {
    title: "Nazokat Abduazizova — AI mutaxassis · UI/UX dizayner",
    description:
      "Sun'iy intellekt va dizayn kuchi bir joyda. Portfolio, AI darslar va hamkorlik havolalari.",
    type: "website",
    locale: "uz_UZ",
    images: [
      {
        url: `${siteUrl}/og.jpg`,
        width: 1200,
        height: 630,
        alt: "Nazokat Abduazizova — AI mutaxassis va UI/UX dizayner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${siteUrl}/og.jpg`],
  },
};

export const viewport: Viewport = {
  themeColor: "#070409",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={`${unbounded.variable} ${manrope.variable}`}>
      <body className="font-body antialiased">
        {/* JS o'chiq bo'lsa: reveal-kutayotgan kontent ko'rinadi, preloader yashirinadi */}
        <noscript>
          <style>{`.will-reveal{opacity:1!important} .fixed.z-\\[100\\]{display:none!important}`}</style>
        </noscript>
        {children}
        {/* <Analytics /> */}
        {/* <SpeedInsights /> */}
      </body>
    </html>
  );
}
