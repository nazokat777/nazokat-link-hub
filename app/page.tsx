import { CustomCursor } from "@/components/CustomCursor";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LocalizedContent } from "@/components/LocalizedContent";
import { MotionWatcher } from "@/components/MotionWatcher";
import { NeuralField } from "@/components/NeuralField";
import { Preloader } from "@/components/Preloader";
import { ScrollProgress } from "@/components/ScrollProgress";
import { ShaderBackdrop } from "@/components/ShaderBackdrop";
import { LangProvider } from "@/lib/i18n";
import { getLinkHubData, getActiveLinks } from "@/lib/getLinks";

/**
 * Asosiy sahifa (Server Component) — "AI Futurizm" kompozitsiyasi:
 * preloader parda → WebGL shader + neyron-tarmoq fon → SplitText hero →
 * marquee lenta → spotlight/tilt havola kartalari → jonli vaqtli futer.
 * Barcha matn uz/en/ru (LangProvider); struktura data/links.json'dan.
 */
export default function HomePage() {
  const { profile, socials } = getLinkHubData();
  const links = getActiveLinks().sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))
  );

  return (
    <LangProvider>
      <Preloader />
      <CustomCursor />
      <MotionWatcher />
      <ScrollProgress />
      <LanguageSwitcher />

      {/* Fon qatlamlari: WebGL iridescent shader (baza) + perspektiv grid +
          neyron-tarmoq. GPU shader rang oqimini beradi. */}
      <ShaderBackdrop />
      <div className="aurora" aria-hidden>
        <div className="grid-overlay" />
      </div>
      <NeuralField />
      {/* O'qilish scrim'i: shader ustidan yumshoq qoraytirish — matn ustuvor */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[2] bg-[radial-gradient(130%_95%_at_50%_35%,transparent_30%,rgba(7,4,9,0.55)_100%)]"
      />

      <LocalizedContent profile={profile} socials={socials} links={links} />
    </LangProvider>
  );
}
