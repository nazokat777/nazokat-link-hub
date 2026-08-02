/**
 * Preloader ↔ Hero sinxronizatsiya darvozasi.
 *
 * Preloader tugagach `finishIntro()` chaqiradi; Hero esa `introDone`
 * promise'ini kutib, kirish animatsiyasini boshlaydi. Preloader biror
 * sabab bilan ishlamay qolsa ham sahifa qulflanib qolmasligi uchun
 * iste'molchilar `Promise.race` bilan zaxira taymer qo'shishi kerak.
 */

let resolveIntro: (() => void) | null = null;
let finished = false;

export const introDone: Promise<void> =
  typeof window === "undefined"
    ? Promise.resolve()
    : new Promise((resolve) => {
        resolveIntro = resolve;
      });

export function finishIntro(): void {
  if (finished) return;
  finished = true;
  resolveIntro?.();
}

/** ms dan keyin rezolv bo'ladigan yordamchi (zaxira taymer uchun). */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
