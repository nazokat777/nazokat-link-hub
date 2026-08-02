/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Tashqi avatar/rasm hostlarini shu yerda ruxsat etamiz (next/image uchun).
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
