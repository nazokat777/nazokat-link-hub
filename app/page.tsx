import { CustomCursor } from "@/components/CustomCursor";
import { Hero } from "@/components/Hero";
import { MotionWatcher } from "@/components/MotionWatcher";
import { LinksSection } from "@/components/LinksSection";
import { NeuralField } from "@/components/NeuralField";
import { Preloader } from "@/components/Preloader";
import { RoleMarquee } from "@/components/RoleMarquee";
import { ScrollProgress } from "@/components/ScrollProgress";
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

      {/* Fon qatlamlari: aurora nurlar + perspektiv grid + neyron canvas */}
      <div className="aurora" aria-hidden>
        <div className="aurora-blob aurora-blob--iris" />
        <div className="aurora-blob aurora-blob--cyan" />
        <div className="aurora-blob aurora-blob--magenta" />
        <div className="grid-overlay" />
      </div>
      <NeuralField />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-xl flex-col px-6">
        <Hero profile={profile} socials={socials} />
        <RoleMarquee tags={profile.tags} />
        <LinksSection links={links} />
        <SiteFooter name={profile.name} />
      </main>
    </>
  );
}
