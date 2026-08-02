/**
 * `public/` ichidagi faylga to'g'ri URL qaytaradi.
 *
 * GitHub Pages'da sayt subkatalogda turadi (`/nazokat-link-hub`), va
 * `next/image` `unoptimized: true` rejimida `basePath`ni src'ga o'zi
 * qo'shmaydi. Shu bo'shliqni yopish uchun barcha statik yo'llar shu
 * yordamchi orqali o'tkaziladi. Vercel/dev'da `basePath` bo'sh — funksiya
 * yo'lni o'zgarishsiz qaytaradi.
 */
export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return path.startsWith("/") ? `${base}${path}` : path;
}
