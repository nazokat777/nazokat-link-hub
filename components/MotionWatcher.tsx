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
    // Safari/iOS < 14 da MediaQueryList EventTarget emas — addEventListener
    // yo'q va chaqirilsa TypeError butun React ildizini yiqitadi. Shuning
    // uchun feature-detect bilan eski addListener'ga tushamiz.
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }
    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  return null;
}
