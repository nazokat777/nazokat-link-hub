"use client";

import { LANGS, LANG_LABELS, useLang } from "@/lib/i18n";

/**
 * Til almashtirgich — o'ng yuqori burchakda, minimalist segment.
 * Preloader (z-100) tagida turadi; scroll-progress (z-80) bilan to'qnashmaydi.
 */
export function LanguageSwitcher() {
  const { lang, setLang, t } = useLang();

  return (
    <div
      role="group"
      aria-label={t.ui.langLabel}
      className="fixed right-4 top-4 z-[70] flex items-center gap-0.5 rounded-full
                 border border-line bg-ink/50 p-0.5 backdrop-blur-md sm:right-6 sm:top-6"
    >
      {LANGS.map((l) => {
        const active = l === lang;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            data-cursor
            className={
              "rounded-full px-2.5 py-1 font-display text-[0.62rem] font-semibold " +
              "uppercase tracking-[0.12em] transition-colors duration-300 " +
              (active
                ? "bg-gradient-to-br from-iris to-cyan text-ink"
                : "text-fg-low hover:text-fg-hi")
            }
          >
            {LANG_LABELS[l]}
          </button>
        );
      })}
    </div>
  );
}
