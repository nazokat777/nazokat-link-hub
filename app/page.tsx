import { CustomCursor } from "@/components/CustomCursor";
import { Hero } from "@/components/Hero";
import { MotionWatcher } from "@/components/MotionWatcher";
import { LinksSection } from "@/components/LinksSection";
import { NeuralField } from "@/components/NeuralField";
import { Preloader } from "@/components/Preloader";
import { RoleMarquee } from "@/components/RoleMarquee";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ShaderBackdrop } from "@/components/ShaderBackdrop";
import { SiteFooter } from "@/components/SiteFooter";
import { getLinkHubData, getActiveLinks } from "@/lib/getLinks";

/**
 * Asosiy sahifa (Server Component) — "AI Futurizm" kompozitsiyasi:
 * preloader parda → aurora + neyron-tarmoq fon → SplitText hero →
 * marquee lenta → spotlight/tilt havola kartalari → jonli vaqtli futer.
 * Barcha harakat GSAP'da; ma'lumotlar data/links.json'dan keladi.
 */
export default function HomePage() {
  const { profile, socials } = getLinkHubData();
  const links = getActiveLinks().sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
  );

  return (
    <>
      <Preloader />
      <CustomCursor />
      <MotionWatcher />
      <ScrollProgress />

      {/* Fon qatlamlari: WebGL iridescent shader (baza) + perspektiv grid +
          neyron-tarmoq. Aurora bloblar shader bilan almashtirildi — endi rang
          oqimini GPU shader beradi. */}
      <ShaderBackdrop />
      <div className="aurora" aria-hidden>
        <div className="grid-overlay" />
      </div>
      <NeuralField />
      {/* O'qilish scrim'i: shader ustidan yumshoq qoraytirish — matn ustuvor */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[2] bg-[radial-gradient(130%_95%_at_50%_35%,transparent_30%,rgba(5,5,8,0.55)_100%)]"
      />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col px-6">
        <Hero profile={profile} socials={socials} />
        <RoleMarquee tags={profile.tags} />
        <LinksSection links={links} />
        <SiteFooter name={profile.name} />
      </main>
    </>
  );
}
