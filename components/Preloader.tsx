"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { useGSAP } from "@gsap/react";
import { finishIntro } from "@/lib/intro";

gsap.registerPlugin(useGSAP, ScrambleTextPlugin);

/** Preloader so'zlari — brend rollari ketma-ket scramble bo'ladi. */
const WORDS = ["AI", "CONTENT", "UI/UX", "DIZAYN"];

/** Vertikal panellar soni — parda shu bo'laklarga bo'linib ochiladi. */
const SLATS = 5;

/** Seleksiya ramkasining 4 burchak tutqichi (Figma uslubi). */
const HANDLES = [
  "-left-1 -top-1",
  "-right-1 -top-1",
  "-left-1 -bottom-1",
  "-right-1 -bottom-1",
];

/**
 * Imzoli kirish pardasi — "texnologiya × dizayn" metaforasi:
 *  1) ekran markazida glitch (RGB-split) so'z rollar bo'ylab scramble
 *     bo'ladi, atrofida Figma-uslub seleksiya ramkasi chiziladi —
 *     burchak tutqichlari, "AI × DIZAYN" yorlig'i va jonli viewport
 *     o'lchami bilan (har qurilmada o'ziniki chiqadi);
 *  2) kontent zoom-blur bilan yo'qoladi;
 *  3) ekran 5 vertikal panelga bo'linib ketma-ket ochiladi (expo.inOut).
 * Takroriy tashrifda (sessionStorage) parda umuman ko'rsatilmaydi.
 * O'lchamlar clamp/vw'da — web va mobilga birdek moslashadi.
 */
export function Preloader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const dimsRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const overlay = overlayRef.current;
      const counter = counterRef.current;
      const word = wordRef.current;
      if (!overlay || !counter || !word) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Sessiya ichida takroriy tashrifda parda ko'rsatilmaydi —
      // sayt sun'iy kutish emas, kontent uchun ochiladi
      // Faqat o'qiymiz — flagni parda haqiqatan ochilganda yozamiz (pastda).
      // Boshida yozsak, React StrictMode dev'da ikkilamchi effekt tufayli
      // pardani butunlay o'tkazib yuborardi.
      let seen = false;
      try {
        seen = sessionStorage.getItem("introSeen") === "1";
      } catch {
        /* private mode — parda oddiy rejimda ishlayveradi */
      }

      if (reduced || seen) {
        overlay.style.display = "none";
        finishIntro();
        return;
      }

      // Dizayner detali: yorliqda foydalanuvchining haqiqiy viewport o'lchami
      if (dimsRef.current) {
        dimsRef.current.textContent = `${window.innerWidth} × ${window.innerHeight}`;
      }

      // Parda ochiq turganda pastdagi ko'rinmas havolalar Tab'ga tushmasin
      const main = document.querySelector("main");
      main?.setAttribute("inert", "");
      const releaseMain = () => main?.removeAttribute("inert");

      const progress = { v: 0 };
      const tl = gsap.timeline({
        onComplete: () => {
          overlay.style.display = "none";
        },
      });

      // 0) Seleksiya ramkasi "chizilib" paydo bo'ladi + tutqichlar pop
      tl.from(".frame-box", {
        autoAlpha: 0,
        scaleX: 0.55,
        scaleY: 0.35,
        duration: 0.5,
        ease: "back.out(1.7)",
      })
        .from(
          ".frame-handle",
          { scale: 0, duration: 0.3, stagger: 0.05, ease: "back.out(2.5)" },
          "-=0.2"
        )
        .from(
          [".frame-label", ".frame-dims"],
          { autoAlpha: 0, y: 6, duration: 0.3, stagger: 0.08 },
          "-=0.15"
        );

      // 1) Hisoblagich + progress chiziq
      tl.to(
        progress,
        {
          v: 100,
          duration: 1.15,
          ease: "expo.inOut",
          onUpdate: () => {
            counter.textContent = String(Math.round(progress.v)).padStart(3, "0");
            if (barRef.current) barRef.current.style.transform = `scaleX(${progress.v / 100})`;
          },
        },
        0.25
      );

      // So'zlar scramble + har almashinuvda qisqa glitch-jitter
      WORDS.forEach((w, i) => {
        const at = 0.25 + i * 0.28;
        tl.to(
          word,
          {
            duration: 0.24,
            scrambleText: { text: w, chars: "upperCase", speed: 0.5 },
            ease: "none",
          },
          at
        );
        tl.to(
          word,
          { keyframes: [{ x: -3 }, { x: 3 }, { x: -1 }, { x: 0 }], duration: 0.16 },
          at
        );
      });

      // 2) Kontent zoom-blur bilan yo'qoladi
      tl.to(
        contentRef.current,
        {
          scale: 1.35,
          autoAlpha: 0,
          filter: "blur(10px)",
          duration: 0.45,
          ease: "power3.in",
        },
        ">-0.1"
      );

      // 3) Panellar ketma-ket tepaga ochiladi — Hero shu paytda start oladi
      tl.to(
        overlay.querySelectorAll(".preloader-slat"),
        {
          yPercent: -101,
          duration: 0.8,
          stagger: 0.07,
          ease: "expo.inOut",
          onStart: () => {
            // Parda haqiqatan ochilganda flagni yozamiz — StrictMode'ning
            // ikkilamchi mount'i pardani o'tkazib yubormaydi
            try {
              sessionStorage.setItem("introSeen", "1");
            } catch {
              /* private mode */
            }
            releaseMain();
            finishIntro();
          },
        },
        ">-0.05"
      );

      return releaseMain; // komponent yo'q qilinsa ham inert qolmasin
    },
    { scope: overlayRef }
  );

  return (
    <div ref={overlayRef} aria-hidden className="fixed inset-0 z-[100]">
      {/* Vertikal panellar — ochilish pardasi */}
      {Array.from({ length: SLATS }, (_, i) => (
        <div
          key={i}
          className="preloader-slat absolute inset-y-0 border-r border-line/40 bg-ink"
          style={{ left: `${(i * 100) / SLATS}%`, width: `${100 / SLATS + 0.1}%` }}
        />
      ))}

      {/* Kontent qatlami */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col items-center justify-center px-8"
      >
        {/* So'z + Figma-uslub seleksiya ramkasi */}
        <div className="relative">
          <div className="frame-box absolute -inset-x-5 -inset-y-2 border border-cyan/50 sm:-inset-x-9 sm:-inset-y-4">
            {HANDLES.map((pos) => (
              <span
                key={pos}
                className={`frame-handle absolute h-2 w-2 border border-cyan bg-ink ${pos}`}
              />
            ))}
            <span className="frame-label absolute -top-7 left-0 font-display text-[0.6rem] font-bold uppercase tracking-[0.35em] text-cyan">
              AI × Dizayn
            </span>
            <span
              ref={dimsRef}
              className="frame-dims absolute -bottom-7 right-0 font-display text-[0.6rem] font-semibold tabular-nums tracking-[0.25em] text-fg-low"
            >
              0 × 0
            </span>
          </div>

          <span
            ref={wordRef}
            className="glitch-word font-display text-[clamp(2.6rem,13vw,6.5rem)] font-extrabold tracking-tight text-fg-hi"
          >
            AI
          </span>
        </div>

        <div className="mt-12 h-px w-44 overflow-hidden bg-line">
          <div
            ref={barRef}
            className="h-full w-full origin-left scale-x-0 bg-gradient-to-r from-iris via-cyan to-magenta"
          />
        </div>

        {/* Burchak hisoblagich — editorial detal */}
        <span className="absolute bottom-8 right-8 font-display text-sm font-bold tabular-nums tracking-[0.3em] text-fg-low">
          <span ref={counterRef} className="text-fg-hi">
            000
          </span>
          {" / 100"}
        </span>
      </div>
    </div>
  );
}
