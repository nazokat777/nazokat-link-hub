/**
 * GitHub Pages statik hosting uchun `GITHUB_PAGES=true` bilan quriladi:
 * static export + repo nomi bo'yicha basePath. Vercel (va lokal dev) esa
 * odatiy Next server rejimida ishlaydi — shuning uchun sozlama shartli.
 */
const isPages = process.env.GITHUB_PAGES === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Tashqi avatar/rasm hostlarini shu yerda ruxsat etamiz (next/image uchun).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    // Statik eksportda Next'ning rasm optimizatsiya serveri bo'lmaydi.
    ...(isPages && { unoptimized: true }),
  },
  ...(isPages && {
    output: "export",
    basePath: "/nazokat-link-hub",
  }),
};

export default nextConfig;
