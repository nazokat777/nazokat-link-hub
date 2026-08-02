"use client";

import { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Icon } from "@/components/Icon";
import { PortraitCard } from "@/components/PortraitCard";
import { SocialBar } from "@/components/SocialBar";
import { introDone, delay } from "@/lib/intro";
import type { Profile, SocialLink } from "@/types";

gsap.registerPlugin(useGSAP, SplitText, ScrambleTextPlugin, ScrollTrigger);

interface HeroProps {
  profile: Profile;
  socials: SocialLink[];
}

/**
 * Hero — sahifaning "wow" markazi:
 *  - ism harf-harf pastdan ko'tarilib chiqadi (SplitText + 3D rotateX),
 *  - familiya gradient blok bo'lib maska ichidan sirg'alib chiqadi
 *    (gradient-clip harf splitiga chidamaydi, shuning uchun alohida),
 *  - rollar ScrambleText bilan terminal uslubida almashadi.
 * Kirish animatsiyasi preloader tugashini (`introDone`) kutadi.
 * Eslatma: `.will-reveal` elementlar CSS'da opacity:0 — shu sabab barcha
 * kirish tvinlari `fromTo` bilan yakuniy opacity:1 ga olib boriladi.
 */
export function Hero({ profile, socials }: HeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const firstNameRef = useRef<HTMLSpanElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const nameEl = nameRef.current;
      const firstName = firstNameRef.current;
      if (!root || !nameEl || !firstName) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) return; // CSS o'zi kontentni ko'rsatadi (.will-reveal override)

      // Portret boshqa hero elementlaridan farqli o'laroq .will-reveal (opacity:0)
      // olmaydi — u ikki await'dan keyin quriladigan intro'gacha to'liq o'lchamda
      // ko'rinib, so'ng scale(0)ga "sakrab" ketardi. Boshlang'ich holatni sinxron
      // (birinchi paint'dan oldin) o'rnatamiz; gsap.context cleanup'da qaytaradi.
      gsap.set(".hero-avatar", { scale: 0, autoAlpha: 0 });

      // Scroll-parallaks: pastga aylantirilganda hero qatlamlari turli
      // tezlikda suzib, sahna chuqurligini his qildiradi (scrub).
      // Sinxron yaratilgani uchun gsap.context avtomatik tozalaydi.
      const parallax = {
        trigger: root,
        start: "top top",
        end: "bottom 15%",
        scrub: 0.5,
      };
      gsap.to(".hero-avatar", { yPercent: -16, ease: "none", scrollTrigger: parallax });
      gsap.to(nameEl, { yPercent: -8, ease: "none", scrollTrigger: parallax });
      // Diqqat: bu yerda opacity animatsiya qilinmaydi — kirish fromTo'si
      // bilan to'qnashib, scroll boshlanishida sakrashga olib keladi
      gsap.to([".hero-bio", ".hero-status"], {
        yPercent: -5,
        ease: "none",
        scrollTrigger: parallax,
      });

      let split: SplitText | null = null;
      let tl: gsap.core.Timeline | null = null;
      let roleTl: gsap.core.Timeline | null = null;
      let cancelled = false;

      const play = async () => {
        // Preloader tugashini kutamiz; u ishlamay qolsa 3s zaxira
        await Promise.race([introDone, delay(3000)]);
        if (cancelled) return;

        // Shriftlar yuklangach split qilamiz — o'lchovlar aniq bo'ladi
        await document.fonts.ready;
        if (cancelled) return;

        split = new SplitText(firstName, { type: "chars" });

        // await'dan keyin yaratilgan tvinlar gsap.context'ga kirmaydi —
        // shuning uchun ular qo'lda ushlab turiladi va cleanup'da kill qilinadi
        tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        tl.set(nameEl, { opacity: 1 })
          .fromTo(
            ".hero-avatar",
            { scale: 0, rotate: -12, autoAlpha: 0 },
            { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.9, ease: "back.out(1.6)" }
          )
          .from(
            split.chars,
            {
              yPercent: 115,
              rotateX: -60,
              opacity: 0,
              duration: 0.9,
              stagger: 0.03,
            },
            "-=0.45"
          )
          .fromTo(
            ".hero-surname",
            { yPercent: 115, rotate: 5 },
            { yPercent: 0, rotate: 0, duration: 0.9 },
            "-=0.72"
          )
          .fromTo(
            ".hero-role-line",
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.5"
          )
          .fromTo(
            ".hero-bio",
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.4"
          )
          .fromTo(
            ".hero-status",
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.5 },
            "-=0.4"
          )
          .fromTo(
            ".hero-socials",
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.5 },
            "-=0.35"
          );

        // Rol rotatori — cheksiz scramble tsikl
        const roles = profile.roles.length > 0 ? profile.roles : ["AI mutaxassis"];
        const rotator = gsap.timeline({ repeat: -1, delay: 0.4 });
        roleTl = rotator;
        roles.forEach((role) => {
          rotator
            .to(roleRef.current, {
              duration: 0.9,
              scrambleText: { text: role, chars: "lowerCase", speed: 0.35 },
              ease: "none",
            })
            .to({}, { duration: 1.7 }); // o'qish pauzasi
        });
      };

      play();

      return () => {
        cancelled = true;
        tl?.kill();
        roleTl?.kill();
        split?.revert();
      };
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      aria-label="Profil"
      className="flex min-h-[88svh] flex-col items-center justify-center pt-16 text-center"
    >
      {/* Holo-karta portret — parallaks, shine va suzuvchi teglar bilan */}
      <div className="hero-avatar relative">
        <PortraitCard src={profile.avatarUrl} alt={`${profile.name} portreti`} />
      </div>

      {/* Ism: harf-kaskad (oq) + maskali gradient familiya.
          Kattaroq o'lcham + tor tracking = xalqaro editorial daraja */}
      <h1
        ref={nameRef}
        className="will-reveal mt-10 font-display text-[clamp(2.2rem,9vw,3.9rem)] font-bold leading-[1.04] tracking-[-0.02em] text-fg-hi [perspective:600px]"
      >
        <span className="split-line inline-block">
          <span ref={firstNameRef} className="inline-block">
            Nazokat
          </span>
        </span>{" "}
        <span className="split-line inline-block">
          <span className="hero-surname text-gradient inline-block will-change-transform">
            Abduazizova
          </span>
        </span>
      </h1>

      {/* Rol rotatori — engil vazn, keng tracking: sarlavhaga xalaqit bermaydi */}
      <p className="hero-role-line will-reveal mt-5 flex items-center justify-center gap-2.5 font-display text-[0.8rem] font-normal uppercase tracking-[0.22em] text-fg-mid sm:text-sm">
        {/* Screen reader uchun barqaror matn; scramble esa faqat vizual */}
        <span className="sr-only">{profile.roles.join(", ")}</span>
        <span className="text-cyan/80" aria-hidden>
          {"//"}
        </span>
        <span ref={roleRef} aria-hidden className="min-h-[1.4em] text-iris-soft">
          {profile.roles[0] ?? "AI mutaxassis"}
        </span>
        <Icon
          name="BadgeCheck"
          size={16}
          className="text-cyan/80"
          role="img"
          aria-label="Tasdiqlangan profil"
        />
      </p>

      {/* Bio — o'qish kengligi 60ch atrofida, xotirjam rang */}
      <p className="hero-bio will-reveal mx-auto mt-6 max-w-[27rem] text-[0.95rem] leading-[1.75] text-fg-mid">
        {profile.bio}
      </p>

      {/* Mavjudlik signali — pill emas, bir qator: sokin ishonch */}
      <p className="hero-status will-reveal mt-8 flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-emerald-300/90">
        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
        Yangi loyihalarga ochiqman
      </p>

      {/* Ijtimoiy tarmoqlar — magnetic ikonkalar */}
      <div className="hero-socials will-reveal mt-8">
        <SocialBar socials={socials} />
      </div>
    </section>
  );
}
