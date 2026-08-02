"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Icon } from "@/components/Icon";
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
      aria-label={link.title}
      data-cursor
      className={
        "link-card card-glass group relative flex items-center gap-4 overflow-hidden " +
        "rounded-2xl p-4 shadow-card transition-shadow duration-300 will-change-transform " +
        // active:scale ishlamaydi — reveal tween kartaga doimiy inline transform
        // qoldiradi; GSAP tegmaydigan brightness bilan bosish javobini beramiz
        "active:brightness-90 sm:gap-5 sm:p-5 " +
        (isFeatured ? "gradient-ring hover:shadow-glow" : "hover:shadow-glow-cyan")
      }
    >
      {/* Kursorga ergashuvchi yorug' dog' */}
      <span className="card-spotlight" aria-hidden />

      {/* Ikonka — gradient plita ichida */}
      <span
        className={
          "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl " +
          "border border-line bg-gradient-to-br transition-transform duration-300 " +
          "group-hover:scale-110 " +
          (isFeatured
            ? "from-iris/25 to-cyan/10 text-iris-soft"
            : "from-panel2 to-panel text-fg-mid group-hover:text-cyan-soft")
        }
      >
        <Icon name={link.icon} size={20} />
      </span>

      {/* Matn bloki */}
      <span className="relative flex min-w-0 flex-1 flex-col gap-0.5 text-left">
        <span className="flex items-center gap-2">
          <span className="text-[0.65rem] font-bold tabular-nums tracking-widest text-fg-low">
            {number}
          </span>
          {isFeatured && (
            <span className="rounded-full bg-iris/15 px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider text-iris-soft">
              Asosiy
            </span>
          )}
        </span>
        <span className="font-display text-[1rem] font-semibold leading-snug text-fg-hi transition-colors duration-300 group-hover:text-iris-soft sm:text-[1.05rem]">
          {link.title}
        </span>
        {link.description && (
          <span className="line-clamp-2 text-[0.8rem] leading-relaxed text-fg-low">
            {link.description}
          </span>
        )}
      </span>

      {/* Strelka — hover'da gradient doira ichiga "uchadi" */}
      <span
        className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden
                   rounded-full border border-line text-fg-low transition-all duration-300
                   group-hover:border-transparent group-hover:bg-gradient-to-br
                   group-hover:from-iris group-hover:to-cyan group-hover:text-ink"
        aria-hidden
      >
        <Icon
          name="ArrowUpRight"
          size={17}
          className="transition-transform duration-300 group-hover:translate-x-[2px] group-hover:translate-y-[-2px]"
        />
      </span>
    </a>
  );
}
