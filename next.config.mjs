/**
 * GitHub Pages statik hosting uchun `GITHUB_PAGES=true` bilan quriladi:
 * static export + repo nomi bo'yicha basePath. Vercel (va lokal dev) esa
 * odatiy Next server rejimida ishlaydi — shuning uchun sozlama shartli.
 */
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? "/nazokat-link-hub" : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // `unoptimized` rasmlarga Next basePath'ni o'zi qo'shmaydi — shuning uchun
  // uni klientga uzatamiz va `lib/asset.ts` orqali qo'lda prefiks qilamiz.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
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
