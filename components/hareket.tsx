"use client";

import { useEffect } from "react";

/**
 * Sayfadaki tüm `.gir` öğelerini izler ve göründüklerinde `.ac` ekler.
 *
 * Tek bir yerden bağlandığı için sunucu bileşenleri sadece className="gir"
 * yazar; kendileri client bileşeni olmak zorunda kalmaz.
 */
export function Hareket() {
  useEffect(() => {
    const azHareket = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hedefler = document.querySelectorAll<HTMLElement>(".gir:not(.ac)");

    if (azHareket || !("IntersectionObserver" in window)) {
      hedefler.forEach((e) => e.classList.add("ac"));
      return;
    }

    const g = new IntersectionObserver(
      (girisler) => {
        for (const x of girisler) {
          if (x.isIntersecting) {
            x.target.classList.add("ac");
            g.unobserve(x.target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" },
    );

    hedefler.forEach((e) => g.observe(e));
    return () => g.disconnect();
  }, []);

  return null;
}
