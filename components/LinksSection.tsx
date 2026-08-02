"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LinkCard } from "@/components/LinkCard";
import { useLang } from "@/lib/i18n";
import type { LinkItem } from "@/types";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface LinksSectionProps {
  links: LinkItem[];
}

/**
 * Havolalar bo'limi — sarlavha va kartalar scroll bilan stagger
 * bo'lib paydo bo'ladi (ScrollTrigger). Har karta o'z hover-effektlarini
 * LinkCard ichida boshqaradi.
 */
export function LinksSection({ links }: LinksSectionProps) {
  const { t } = useLang();
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.fromTo(
        root.querySelectorAll(".links-heading"),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 85%" },
        }
      );

      gsap.fromTo(
        root.querySelectorAll(".link-card"),
        { opacity: 0, y: 36, rotateX: -8 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.65,
          stagger: 0.09,
          ease: "power2.out",
          scrollTrigger: { trigger: root, start: "top 80%" },
        }
      );

      // Velocity skew — tez scroll'da kartalar oqim yo'nalishida egiladi
      // va prujinaday qaytadi (klassik GSAP getVelocity retsepti)
      const list = root.querySelector<HTMLElement>(".links-list");
      if (list) {
        const proxy = { skew: 0 };
        const skewSetter = gsap.quickSetter(list, "skewY", "deg");
        const clampSkew = gsap.utils.clamp(-4, 4);
        ScrollTrigger.create({
          onUpdate: (self) => {
            const skew = clampSkew(self.getVelocity() / -400);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: 0.7,
                ease: "power3.out",
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew),
              });
            }
          },
        });
      }
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} aria-label="Havolalar" className="pb-6 pt-6">
      <div className="links-heading will-reveal mb-8 flex items-end justify-between">
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-cyan/80">
            {t.ui.linksKicker}
          </p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-tightest text-fg-hi sm:text-[1.7rem]">
            {t.ui.linksTitle}
          </h2>
        </div>
        <span className="font-mono text-[0.65rem] tabular-nums tracking-[0.1em] text-fg-low">
          01 — {String(links.length).padStart(2, "0")}
        </span>
      </div>

      <div className="links-list flex flex-col gap-3.5 [perspective:900px]">
        {links.map((link, index) => (
          <LinkCard key={link.id} link={link} index={index} />
        ))}
      </div>
    </section>
  );
}
