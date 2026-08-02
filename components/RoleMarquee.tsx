"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

interface RoleMarqueeProps {
  tags: string[];
}

/**
 * Cheksiz marquee lenta — brend teglari (AI mutaxassis ✦ AI Content ✦ ...)
 * to'xtovsiz oqadi. Kontent 2x dublikat qilinadi va xPercent -50 gacha
 * siljitilib, seamless loop hosil bo'ladi. Hover'da sekinlashadi.
 */
export function RoleMarquee({ tags }: RoleMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tween = gsap.to(track, {
        xPercent: -50,
        duration: 26,
        ease: "none",
        repeat: -1,
      });

      // WCAG 2.2.2: harakatni to'xtatish imkoni — hover to'liq pauza,
      // touch qurilmalarda esa tap play/pauza almashtiradi
      let paused = false;
      const onEnter = () => gsap.to(tween, { timeScale: 0, duration: 0.5 });
      const onLeave = () => {
        if (!paused) gsap.to(tween, { timeScale: 1, duration: 0.5 });
      };
      const onPointerDown = (e: PointerEvent) => {
        if (e.pointerType !== "touch") return;
        paused = !paused;
        gsap.to(tween, { timeScale: paused ? 0 : 1, duration: 0.4 });
      };
      track.addEventListener("mouseenter", onEnter);
      track.addEventListener("mouseleave", onLeave);
      track.addEventListener("pointerdown", onPointerDown);

      return () => {
        track.removeEventListener("mouseenter", onEnter);
        track.removeEventListener("mouseleave", onLeave);
        track.removeEventListener("pointerdown", onPointerDown);
      };
    },
    { scope: trackRef }
  );

  const items = [...tags, ...tags]; // seamless loop uchun 2x

  return (
    <div
      aria-hidden
      className="relative left-1/2 my-4 w-screen -translate-x-1/2 overflow-hidden
                 border-y border-line bg-panel/40 py-4 backdrop-blur-sm
                 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
    >
      {/* pr-8 — flex gap'ning yakuniy bo'shlig'ini to'ldiradi: -50% siljish
          aynan bitta davrga teng bo'lib, loop choksiz ulanadi */}
      <div ref={trackRef} className="flex w-max items-center gap-8 whitespace-nowrap pr-8">
        {items.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="flex items-center gap-8 font-display text-sm font-semibold
                       uppercase tracking-[0.25em] text-fg-low"
          >
            {tag}
            <span className="text-iris" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
