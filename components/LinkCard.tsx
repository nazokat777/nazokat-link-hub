"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Icon } from "@/components/Icon";
import { useLang } from "@/lib/i18n";
import type { LinkItem } from "@/types";

gsap.registerPlugin(useGSAP);

interface LinkCardProps {
  link: LinkItem;
  /** Qator raqami (01, 02, ...) uchun. */
  index?: number;
}

const TILT_MAX = 6; // gradus — 3D og'ish chegarasi

/**
 * Havola kartasi — glass yuza, kursorga ergashuvchi spotlight,
 * 3D tilt (perspective og'ish) va gradient-halqali featured holat.
 * Scroll-reveal'ni ota LinksSection boshqaradi (.link-card klassi orqali).
 */
export function LinkCard({ link, index = 0 }: LinkCardProps) {
  const { t } = useLang();
  const copy = t.links[link.id] ?? { title: link.title, description: link.description };
  const cardRef = useRef<HTMLAnchorElement>(null);
  const number = String(index + 1).padStart(2, "0");
  const isFeatured = Boolean(link.featured);

  useGSAP(
    () => {
      const card = cardRef.current;
      if (!card) return;

      const finePointer = window.matchMedia("(pointer: fine)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!finePointer || reduced) return;

      const rotX = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
      const rotY = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });
      gsap.set(card, { transformPerspective: 700 });

      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width; // 0..1
        const py = (e.clientY - r.top) / r.height;

        // Spotlight pozitsiyasi (CSS var) + tilt burchaklari
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
        rotY((px - 0.5) * 2 * TILT_MAX);
        rotX(-(py - 0.5) * 2 * TILT_MAX);
      };
      const onLeave = () => {
        rotX(0);
        rotY(0);
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      return () => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: cardRef }
  );

  return (
    <a
      ref={cardRef}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={copy.title}
      data-cursor
      className={
        "link-card card-glass group relative flex items-center gap-4 overflow-hidden " +
        "rounded-2xl p-5 transition-shadow duration-300 will-change-transform " +
        // active:scale ishlamaydi — reveal tween kartaga doimiy inline transform
        // qoldiradi; GSAP tegmaydigan brightness bilan bosish javobini beramiz
        "active:brightness-90 sm:gap-5 " +
        (isFeatured ? "gradient-ring hover:shadow-glow" : "hover:shadow-glow-cyan")
      }
    >
      {/* Kursorga ergashuvchi yorug' dog' */}
      <span className="card-spotlight" aria-hidden />

      {/* Ikonka — ghost plita: bezak emas, belgi */}
      <span
        className={
          "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full " +
          "border border-line transition-all duration-300 group-hover:scale-105 " +
          (isFeatured
            ? "text-iris-soft group-hover:border-iris/40"
            : "text-fg-low group-hover:border-cyan/30 group-hover:text-cyan-soft")
        }
      >
        <Icon name={link.icon} size={18} />
      </span>

      {/* Matn bloki */}
      <span className="relative flex min-w-0 flex-1 flex-col gap-0.5 text-left">
        <span className="flex items-center gap-2.5">
          <span className="text-[0.6rem] font-semibold tabular-nums tracking-[0.2em] text-fg-low">
            {number}
          </span>
          {isFeatured && (
            <span className="text-[0.55rem] font-semibold uppercase tracking-[0.2em] text-iris-soft/90">
              · Asosiy
            </span>
          )}
        </span>
        <span className="mt-0.5 font-display text-[1rem] font-semibold leading-snug tracking-[-0.01em] text-fg-hi transition-colors duration-300 group-hover:text-iris-soft sm:text-[1.05rem]">
          {copy.title}
        </span>
        {copy.description && (
          <span className="mt-0.5 line-clamp-2 text-[0.8rem] leading-relaxed text-fg-low">
            {copy.description}
          </span>
        )}
      </span>

      {/* Strelka — hover'da gradient doira ichiga "uchadi" */}
      <span
        className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden
                   rounded-full text-fg-low transition-all duration-300
                   group-hover:bg-gradient-to-br group-hover:from-iris group-hover:to-cyan
                   group-hover:text-ink"
        aria-hidden
      >
        <Icon
          name="ArrowUpRight"
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:translate-y-[-2px]"
        />
      </span>
    </a>
  );
}
