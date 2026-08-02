"use client";

import { useEffect } from "react";

/**
 * Har bir harakat komponenti prefers-reduced-motion'ni mount paytida bir
 * marta o'qiydi. Foydalanuvchi sozlamani sessiya o'rtasida o'zgartirsa,
 * yagona to'g'ri holatga qaytishning eng ishonchli yo'li — sahifani qayta
 * yuklash (bir sahifali hub uchun yo'qotish yo'q).
 */
export function MotionWatcher() {
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => window.location.reload();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return null;
}
