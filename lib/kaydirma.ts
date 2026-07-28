/**
 * Paylaşılan kaydırma tikleyicisi.
 *
 * Her sahne kendi requestAnimationFrame döngüsünü açarsa sayfada üç-dört
 * döngü birden çalışır. Burada tek döngü var; sahneler ona abone olur.
 * Abone kalmayınca döngü kendini durdurur.
 */

type Dinleyici = () => void;

const dinleyiciler = new Set<Dinleyici>();
let calisiyor = false;

function dongu() {
  for (const d of dinleyiciler) d();
  if (dinleyiciler.size > 0) {
    requestAnimationFrame(dongu);
  } else {
    calisiyor = false;
  }
}

export function kaydirmaDinle(d: Dinleyici): () => void {
  dinleyiciler.add(d);
  if (!calisiyor) {
    calisiyor = true;
    requestAnimationFrame(dongu);
  }
  return () => {
    dinleyiciler.delete(d);
  };
}

export const kis = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** a..b aralığını 0..1'e eşler. */
export const ara = (p: number, a: number, b: number) => kis((p - a) / (b - a));

export const yumusat = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Bir sahnenin kaydırma ilerlemesi: 0 = sahne başı, 1 = sahne sonu. */
export function sahneIlerlemesi(el: HTMLElement): number {
  const r = el.getBoundingClientRect();
  const toplam = el.offsetHeight - window.innerHeight;
  if (toplam <= 0) return 0;
  return kis(-r.top / toplam);
}

export function azHareket(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
