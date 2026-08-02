import {
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  Clapperboard,
  Cpu,
  Github,
  Instagram,
  Link as LinkFallback,
  Linkedin,
  Mail,
  Palette,
  Send,
  Sparkles,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/types";

/**
 * Saytda ishlatiladigan ikonkalar ro'yxati — ataylab statik.
 * `import { icons }` butun lucide to'plamini (~1500 ikonka) klient
 * bundle'iga tortadi; nomma-nom import esa tree-shaking'ga yo'l ochadi.
 * Yangi ikonka kerak bo'lsa shu xaritaga qo'shing.
 */
const ICONS: Record<string, LucideIcon> = {
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  Clapperboard,
  Cpu,
  Github,
  Instagram,
  Link: LinkFallback,
  Linkedin,
  Mail,
  Palette,
  Send,
  Sparkles,
};

interface IconProps extends LucideProps {
  name: IconName;
}

/** Nomi bo'yicha ikonka render qiladi; topilmasa xavfsiz "Link" fallback. */
export function Icon({ name, ...props }: IconProps) {
  const LucideIconComponent = ICONS[name] ?? LinkFallback;
  return <LucideIconComponent {...props} />;
}
