"use client";

import { Hero } from "@/components/Hero";
import { LinksSection } from "@/components/LinksSection";
import { RoleMarquee } from "@/components/RoleMarquee";
import { SiteFooter } from "@/components/SiteFooter";
import { useLang } from "@/lib/i18n";
import type { LinkItem, Profile, SocialLink } from "@/types";

interface LocalizedContentProps {
  profile: Profile;
  socials: SocialLink[];
  links: LinkItem[];
}

/**
 * Tilga bog'liq kontent qatlami. `key={lang}` — til almashganda faqat shu
 * blok qayta mount bo'lib, matnlar yangi tilda silliq qayta animatsiya qiladi
 * (fon shader/neyron va preloader mount holicha qoladi).
 */
export function LocalizedContent({ profile, socials, links }: LocalizedContentProps) {
  const { lang } = useLang();

  return (
    <main
      key={lang}
      className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col px-6"
    >
      <Hero profile={profile} socials={socials} />
      <RoleMarquee />
      <LinksSection links={links} />
      <SiteFooter name={profile.name} />
    </main>
  );
}
