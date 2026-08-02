"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { LinkCard } from "@/components/LinkCard";
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
    <section ref={rootRef} aria-label="Havolalar" className="pb-4 pt-10">
      <div className="links-heading will-reveal mb-6 flex items-end justify-between">
        <div>
          <p className="font-display text-[0.65rem] font-bold uppercase tracking-[0.4em] text-cyan">
            {"//"} Havolalar
          </p>
          <h2 className="mt-2 font-display text-xl font-bold text-fg-hi sm:text-2xl">
            Meni shu yerda toping
          </h2>
        </div>
        <span className="font-display text-xs font-semibold tabular-nums text-fg-low">
          {String(links.length).padStart(2, "0")}
        </span>
      </div>

      <div className="links-list flex flex-col gap-3 [perspective:900px]">
        {links.map((link, index) => (
          <LinkCard key={link.id} link={link} index={index} />
        ))}
      </div>
    </section>
  );
}
