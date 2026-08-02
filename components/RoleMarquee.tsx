"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLang } from "@/lib/i18n";

gsap.registerPlugin(useGSAP);

/**
 * Cheksiz marquee lenta — brend teglari (AI mutaxassis ✦ AI Content ✦ ...)
 * to'xtovsiz oqadi. Kontent 2x dublikat + pr-8 bilan seamless loop.
 * WCAG 2.2.2: harakatni to'xtatish uchun Tab bilan yetib boriladigan haqiqiy
 * tugma bor; hover ham pauza qiladi (tugma holatini buzmagan holda).
 */
export function RoleMarquee() {
  const { t } = useLang();
  const tags = t.tags;
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const pausedRef = useRef(false);
  const [paused, setPaused] = useState(false);

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
      tweenRef.current = tween;

      // Hover pauza — foydalanuvchi qo'lda to'xtatgan bo'lsa tegmaymiz
      const onEnter = () => {
        if (!pausedRef.current) gsap.to(tween, { timeScale: 0, duration: 0.5 });
      };
      const onLeave = () => {
        if (!pausedRef.current) gsap.to(tween, { timeScale: 1, duration: 0.5 });
      };
      track.addEventListener("mouseenter", onEnter);
      track.addEventListener("mouseleave", onLeave);

      return () => {
        track.removeEventListener("mouseenter", onEnter);
        track.removeEventListener("mouseleave", onLeave);
      };
    },
    { scope: trackRef }
  );

  // Tugma / klaviatura orqali barqaror to'xtat-davom ettir
  const toggle = () => {
    const tween = tweenRef.current;
    if (!tween) return;
    const next = !pausedRef.current;
    pausedRef.current = next;
    setPaused(next);
    gsap.to(tween, { timeScale: next ? 0 : 1, duration: 0.4 });
  };

  const items = [...tags, ...tags]; // seamless loop uchun 2x

  return (
    <div
      className="relative left-1/2 my-10 w-screen -translate-x-1/2 overflow-hidden
                 border-y border-line py-3.5
                 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
    >
      {/* WCAG 2.2.2: Tab bilan yetib boriladigan pauza tugmasi. Odatda
          ko'rinmas, fokus/hover'da paydo bo'ladi. aria-hidden lentada, tugmada emas. */}
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-md border border-line
                   bg-ink/70 px-2 py-1 text-[0.6rem] font-semibold uppercase tracking-wider
                   text-fg-mid opacity-0 backdrop-blur transition-opacity duration-200
                   hover:opacity-100 focus-visible:opacity-100"
      >
        {paused ? t.ui.marqueeResume : t.ui.marqueeStop}
      </button>

      {/* pr-8 — flex gap'ning yakuniy bo'shlig'ini to'ldiradi: -50% siljish
          aynan bitta davrga teng bo'lib, loop choksiz ulanadi */}
      <div
        ref={trackRef}
        aria-hidden
        className="flex w-max items-center gap-8 whitespace-nowrap pr-8"
      >
        {items.map((tag, i) => (
          <span
            key={`${tag}-${i}`}
            className="flex items-center gap-8 font-display text-[0.7rem] font-medium
                       uppercase tracking-[0.3em] text-fg-low/80"
          >
            {tag}
            <span className="text-iris/60" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
