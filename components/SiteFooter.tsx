"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/lib/i18n";

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
  const { t } = useLang();
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
    <footer className="mt-auto border-t border-line py-10">
      <div className="flex flex-col items-center gap-3.5 text-center">
        <p className="flex items-center gap-2.5 font-mono text-[0.6rem] uppercase tracking-[0.22em] text-fg-low">
          {t.ui.footerLocation}
          {time && (
            <>
              <span className="text-iris/70" aria-hidden>
                ·
              </span>
              <span className="tabular-nums text-cyan-soft/90">{time}</span>
            </>
          )}
        </p>
        <p className="font-mono text-[0.65rem] tracking-[0.05em] text-fg-low/80">
          © {year ?? ""} {name} — {t.ui.footerTag}
        </p>
      </div>
    </footer>
  );
}
