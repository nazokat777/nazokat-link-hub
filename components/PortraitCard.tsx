"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Icon } from "@/components/Icon";

gsap.registerPlugin(useGSAP);

interface PortraitCardProps {
  src: string;
  alt: string;
}

/** Portret atrofida suzuvchi teglar. */
const CHIPS = [
  { label: "AI", icon: "Cpu", className: "-right-5 top-4 sm:-right-8" },
  { label: "UI/UX", icon: "Palette", className: "-left-6 top-1/2 sm:-left-10" },
  { label: "CONTENT", icon: "Clapperboard", className: "-right-6 bottom-6 sm:-right-10" },
] as const;

/**
 * "Holo-karta" portret — heroning vizual markazi:
 *  - aylanuvchi konus-gradient ramka + halo nur,
 *  - kartada davriy holografik shine (yorug'lik chizig'i sirg'alib o'tadi),
 *  - kursor bo'ylab 3D tilt va parallaks (karta va teglar turli chuqurlikda),
 *  - teglar mustaqil "nafas olib" suzadi.
 * Touch/reduced-motion'da statik, lekin baribir premium ko'rinadi.
 */
export function PortraitCard({ src, alt }: PortraitCardProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const wrap = wrapRef.current;
      const card = cardRef.current;
      if (!wrap || !card) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return;

      // Teglar — har biri o'z ritmida suzadi
      gsap.utils.toArray<HTMLElement>(".orbit-chip").forEach((chip, i) => {
        gsap.to(chip, {
          y: i % 2 === 0 ? -9 : 11,
          duration: 2.3 + i * 0.55,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      });

      // Davriy holografik shine — karta ustidan yorug'lik o'tadi
      if (shineRef.current) {
        gsap.fromTo(
          shineRef.current,
          { xPercent: -120 },
          {
            xPercent: 480,
            duration: 2.2,
            repeat: -1,
            repeatDelay: 2.6,
            ease: "power2.inOut",
          }
        );
      }

      // 3D tilt + parallaks — faqat aniq kursorli qurilmalarda
      const finePointer = window.matchMedia("(pointer: fine)").matches;
      if (!finePointer) return;

      gsap.set(card, { transformPerspective: 900 });
      const rotX = gsap.quickTo(card, "rotationX", { duration: 0.7, ease: "power3.out" });
      const rotY = gsap.quickTo(card, "rotationY", { duration: 0.7, ease: "power3.out" });
      const posX = gsap.quickTo(wrap, "x", { duration: 0.9, ease: "power3.out" });
      const posY = gsap.quickTo(wrap, "y", { duration: 0.9, ease: "power3.out" });

      // Teglar kartaga nisbatan teskari va chuqurroq siljiydi (depth illyuziyasi)
      const chipMovers = gsap.utils.toArray<HTMLElement>(".orbit-chip").map((chip, i) => ({
        x: gsap.quickTo(chip, "x", { duration: 1.1 + i * 0.15, ease: "power3.out" }),
        depth: 14 + i * 8,
      }));

      const onMove = (e: MouseEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5; // -0.5..0.5
        const ny = e.clientY / window.innerHeight - 0.5;
        rotY(nx * 10);
        rotX(-ny * 10);
        posX(nx * 14);
        posY(ny * 10);
        chipMovers.forEach((m) => m.x(-nx * m.depth));
      };

      window.addEventListener("mousemove", onMove);
      return () => window.removeEventListener("mousemove", onMove);
    },
    { scope: wrapRef }
  );

  return (
    <div ref={wrapRef} className="relative will-change-transform">
      <div
        ref={cardRef}
        className="gradient-ring rounded-[2rem] p-1.5 shadow-halo will-change-transform"
      >
        <div className="relative aspect-[4/5] w-[200px] overflow-hidden rounded-[1.7rem] sm:w-[232px]">
          <Image
            src={src}
            alt={alt}
            width={464}
            height={580}
            priority
            className="h-full w-full object-cover object-[50%_18%]"
          />
          {/* Neon rang tuprog'i — foto brend palitrasiga singadi */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-iris/25 via-transparent to-cyan/20 mix-blend-overlay"
            aria-hidden
          />
          {/* Pastdan yumshoq vignette — teglar o'qilishi uchun */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent"
            aria-hidden
          />
          {/* Holografik shine chizig'i (GSAP surib turadi) */}
          <div
            ref={shineRef}
            className="pointer-events-none absolute inset-y-[-30%] left-[-45%] w-[38%] rotate-[16deg] bg-gradient-to-r from-transparent via-white/30 to-transparent"
            aria-hidden
          />
        </div>
      </div>

      {/* Suzuvchi teglar — glass pill'lar */}
      {CHIPS.map((chip) => (
        <span
          key={chip.label}
          className={
            "orbit-chip card-glass absolute z-10 flex items-center gap-1.5 rounded-full " +
            "px-3 py-1.5 font-display text-[0.6rem] font-bold uppercase tracking-[0.2em] " +
            "text-fg-hi shadow-card will-change-transform " +
            chip.className
          }
          aria-hidden
        >
          <Icon name={chip.icon} size={12} className="text-cyan" />
          {chip.label}
        </span>
      ))}
    </div>
  );
}
