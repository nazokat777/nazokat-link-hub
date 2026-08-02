/**
 * Link Hub uchun markaziy tip ta'riflari.
 *
 * Bu interfeyslar `data/links.json` strukturasini aniqlaydi.
 * Kelajakda statik JSON o'rniga CMS (Sanity, Strapi, Contentful yoki
 * Supabase) API'siga o'tilganda, faqat ma'lumot manbasi (data-layer)
 * o'zgaradi — komponentlar bir xil `LinkItem` / `Profile` shartnomasiga
 * tayanadi. Shu tufayli migratsiya og'riqsiz bo'ladi.
 */

/** Lucide-react ikonka nomlari uchun (masalan: "Github", "Instagram"). */
export type IconName = string;

/**
 * Bitta havola kartasi.
 * `id` — React key va analytics-tracking uchun barqaror identifikator.
 */
export interface LinkItem {
  id: string;
  title: string;
  /** Kartaning ostidagi ixtiyoriy qisqa tavsif. */
  description?: string;
  url: string;
  /** lucide-react ikonka nomi; UI'da dinamik yuklanadi. */
  icon: IconName;
  /** Guruhlash/filtrlash uchun ixtiyoriy kategoriya. */
  category?: LinkCategory;
  /** "Yangi" yoki "Tavsiya etiladi" kabi belgi ko'rsatish uchun. */
  featured?: boolean;
  /** Vaqtincha havolani yashirish uchun (o'chirmasdan). */
  active?: boolean;
}

/** Havolalarni mantiqiy guruhlarga ajratish uchun kengaytiriladigan tur. */
export type LinkCategory =
  | "social"
  | "portfolio"
  | "contact"
  | "shop"
  | "other";

/** Ijtimoiy tarmoq ikonkalari (header ostidagi kichik qator). */
export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: IconName;
}

/** Foydalanuvchi profili — sahifa sarlavhasida ko'rsatiladi. */
export interface Profile {
  name: string;
  /** "@username" ko'rinishidagi handle. */
  handle: string;
  bio: string;
  avatarUrl: string;
  /** Hero'da aylanib turadigan kasb/rol nomlari (scramble rotator). */
  roles: string[];
  /** Marquee lentasida aylanadigan qisqa teglar. */
  tags: string[];
}

/**
 * Butun Link Hub ma'lumotining ildiz shakli.
 * `data/links.json` aynan shu strukturaga mos keladi.
 */
export interface LinkHubData {
  profile: Profile;
  links: LinkItem[];
  socials: SocialLink[];
}
