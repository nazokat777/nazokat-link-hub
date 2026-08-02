import type { LinkHubData, LinkItem } from "@/types";
import data from "@/data/links.json";

/**
 * Yagona ma'lumot kirish nuqtasi (data-access layer).
 *
 * Hozircha statik JSON'dan o'qiydi. CMS'ga o'tilganda faqat shu fayl
 * ichidagi tanani `fetch(...)` yoki SDK chaqiruviga almashtirish kifoya —
 * qaytish tipi (`LinkHubData`) o'zgarmaydi, shu tufayli hech bir komponentni
 * qayta yozish kerak bo'lmaydi.
 */
export function getLinkHubData(): LinkHubData {
  // `as` — JSON import'ini qat'iy tipga bog'laymiz (validatsiya build vaqtida).
  return data as LinkHubData;
}

/** Faqat faol havolalarni qaytaradi (active !== false). */
export function getActiveLinks(): LinkItem[] {
  return getLinkHubData().links.filter((link) => link.active !== false);
}
