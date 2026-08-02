"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Icon } from "@/components/Icon";
import type { SocialLink } from "@/types";

gsap.registerPlugin(useGSAP);

interface SocialBarProps {
  socials: SocialLink[];
}

/**
 * Ijtimoiy tarmoqlar — magnetic ikonkalar qatori: kursor yaqinlashganda
 * ikonka elastik tarzda unga tortiladi (gsap.quickTo + elastic ease).
 * Touch qurilmalarda oddiy tap-scale bilan ishlaydi.
 */
export function SocialBar({ socials }: SocialBarProps) {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const finePointer = window.matchMedia("(pointer: fine)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!finePointer || reduced) return;

      const cleanups: Array<() => void> = [];

      root.querySelectorAll<HTMLAnchorElement>("a").forEach((el) => {
        const xTo = gsap.quickTo(el, "x", { duration: 0.4, ease: "elastic.out(1,0.4)" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.4, ease: "elastic.out(1,0.4)" });

        const onMove = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - r.left - r.width / 2) * 0.35);
          yTo((e.clientY - r.top - r.height / 2) * 0.35);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener("mousemove", onMove);
        el.addEventListener("mouseleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("mousemove", onMove);
          el.removeEventListener("mouseleave", onLeave);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: rootRef }
  );

  if (socials.length === 0) return null;

  return (
    <nav
      ref={rootRef}
      aria-label="Ijtimoiy tarmoqlar"
      className="flex items-center justify-center gap-2"
    >
      {socials.map((social) => (
        <a
          key={social.id}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.platform}
          data-cursor
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-line
                     bg-panel/60 text-fg-mid backdrop-blur transition-colors duration-300
                     will-change-transform hover:border-iris/50 hover:text-iris-soft
                     hover:shadow-glow active:scale-90"
        >
          <Icon name={social.icon} size={18} />
        </a>
      ))}
    </nav>
  );
}
