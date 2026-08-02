"use client";

import { useEffect, useState } from "react";

interface SiteFooterProps {
  name: string;
}

/** Toshkent vaqtini HH:MM formatida qaytaradi. */
function tashkentTime(): string {
  return new Intl.DateTimeFormat("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Tashkent",
  }).format(new Date());
}

/**
 * Futer — jonli Toshkent vaqti (har 30s yangilanadi), joylashuv va
 * mualliflik. Vaqt faqat klientda render bo'ladi (hydration mismatch'siz).
 */
export function SiteFooter({ name }: SiteFooterProps) {
  const [time, setTime] = useState<string | null>(null);
  // Yil ham klientda hisoblanadi: build vaqtida qotib qolgan yil keyingi
  // yanvarda hydration mismatch va eskirgan © keltirib chiqaradi
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setTime(tashkentTime());
    setYear(new Date().getFullYear());
    const id = setInterval(() => setTime(tashkentTime()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="mt-auto border-t border-line py-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="flex items-center gap-2 font-display text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-fg-low">
          Toshkent, O&apos;zbekiston
          {time && (
            <>
              <span className="text-iris" aria-hidden>
                ·
              </span>
              <span className="tabular-nums text-cyan-soft">{time}</span>
            </>
          )}
        </p>
        <p className="text-xs leading-relaxed text-fg-low">
          © {year ?? ""} {name} — AI × Dizayn
        </p>
      </div>
    </footer>
  );
}
