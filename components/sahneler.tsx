"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { kaydirmaDinle, sahneIlerlemesi, ara, yumusat, kis, azHareket } from "@/lib/kaydirma";

/* ══════════════ SAHNE 01 — karelerin içine doğru zoom ══════════════ */

const KARE_RENK = ["#16302a", "#1e3d34", "#3c6154", "#5f8172", "#8aa89a"];

export function SahneZoom({ baslik }: { baslik: ReactNode }) {
  const kok = useRef<HTMLElement>(null);
  const kareler = useRef<(HTMLDivElement | null)[]>([]);
  const marka = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (azHareket() || !kok.current) return;
    return kaydirmaDinle(() => {
      const el = kok.current;
      if (!el) return;
      const p = sahneIlerlemesi(el);
      const z = p * 4.6;

      kareler.current.forEach((k, i) => {
        if (!k) return;
        const o = Math.pow(2.15, z - i);
        k.style.transform = `scale(${o.toFixed(4)})`;
        k.style.opacity = String(o > 5.5 ? kis(1 - (o - 5.5) / 4) : o < 0.045 ? 0 : 1);
      });

      if (marka.current) {
        const mo = Math.pow(2.15, z - 4.15);
        marka.current.style.transform = `scale(${kis(mo, 0, 3.4).toFixed(3)})`;
        marka.current.style.opacity = String(ara(p, 0.52, 0.74) * kis(1 - ara(p, 0.94, 1)));
      }
    });
  }, []);

  return (
    <section ref={kok} className="sahne relative" style={{ height: "320vh" }}>
      <div className="sahne-yapisik grid place-items-center bg-krem">
        <div className="izgara" />
        {KARE_RENK.map((renk, i) => (
          <div
            key={renk}
            ref={(el) => {
              kareler.current[i] = el;
            }}
            aria-hidden
            className="absolute rounded-sm"
            style={{
              width: "46vmin",
              height: "46vmin",
              background: renk,
              willChange: "transform, opacity",
              transform: `scale(${Math.pow(2.15, -i)})`,
            }}
          />
        ))}
        <div
          ref={marka}
          className="absolute z-10 px-6 text-center text-krem"
          style={{ willChange: "transform, opacity", opacity: 0 }}
        >
          {baslik}
        </div>
      </div>
    </section>
  );
}

/* ══════════════ SAHNE 03 — çizim + dolgu + renk devri ══════════════ */

export function SahneCizim({
  etiket,
  cumle,
}: {
  etiket: string;
  cumle: ReactNode;
}) {
  const kok = useRef<HTMLElement>(null);
  const zemin = useRef<HTMLDivElement>(null);
  const govde = useRef<HTMLDivElement>(null);
  const yaziUst = useRef<HTMLDivElement>(null);
  const yaziAlt = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!kok.current) return;
    const el = kok.current;
    const cizgiler = Array.from(el.querySelectorAll<SVGPathElement>("[data-cizgi]"));
    const dolgular = Array.from(el.querySelectorAll<SVGGElement>("[data-dolgu]"));

    cizgiler.forEach((c) => {
      const u = c.getTotalLength();
      c.style.strokeDasharray = String(u);
      c.style.strokeDashoffset = String(u);
      c.dataset.uzunluk = String(u);
    });

    if (azHareket()) {
      cizgiler.forEach((c) => (c.style.strokeDashoffset = "0"));
      dolgular.forEach((d) => (d.style.opacity = "0.92"));
      return;
    }

    return kaydirmaDinle(() => {
      const p = sahneIlerlemesi(el);

      cizgiler.forEach((c, i) => {
        const bas = 0.05 + (i / cizgiler.length) * 0.34;
        const t = yumusat(ara(p, bas, bas + 0.28));
        c.style.strokeDashoffset = String(Number(c.dataset.uzunluk) * (1 - t));
      });

      dolgular.forEach((d, i) => {
        d.style.opacity = String(ara(p, 0.56 + i * 0.07, 0.74 + i * 0.07) * 0.94);
      });

      // krem → derin çam
      const t = ara(p, 0.42, 0.68);
      const kr = [244, 238, 229];
      const cm = [30, 61, 52];
      const c = kr.map((v, i) => Math.round(v + (cm[i] - v) * t));
      if (zemin.current) zemin.current.style.backgroundColor = `rgb(${c.join(",")})`;
      if (govde.current) govde.current.style.color = t > 0.5 ? "#eef3ee" : "#1e3d34";
      if (yaziUst.current) {
        yaziUst.current.style.opacity = String(ara(p, 0.06, 0.2));
        yaziUst.current.style.color = t > 0.5 ? "#8fb03f" : "#c0663a";
      }
      if (yaziAlt.current) {
        const q = ara(p, 0.62, 0.84);
        yaziAlt.current.style.opacity = String(q);
        yaziAlt.current.style.transform = `translateY(${(1 - q) * 24}px)`;
      }
    });
  }, []);

  return (
    <section ref={kok} className="sahne relative" style={{ height: "380vh" }}>
      <div className="sahne-yapisik block">
        <div ref={zemin} className="absolute inset-0 bg-krem" />
        <div ref={govde} className="relative grid h-full place-items-center px-5 text-cam">
          <div ref={yaziUst} className="etiket absolute left-5 top-[9vh] md:left-10" style={{ opacity: 0 }}>
            {etiket}
          </div>

          <svg
            viewBox="0 0 900 420"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
            className="w-full max-w-[900px]"
            style={{ maxHeight: "44vh" }}
          >
            <g data-dolgu style={{ opacity: 0 }}>
              <polygon
                points="150,330 150,120 430,60 710,120 710,330"
                fill="currentColor"
                opacity=".92"
              />
            </g>
            <g data-dolgu style={{ opacity: 0 }}>
              <path
                d="M170 300 C300 268 560 268 690 300 L690 336 C560 306 300 306 170 336 Z"
                fill="#7c9a83"
              />
            </g>
            {[
              "M150 330 L150 120 L430 60 L710 120 L710 330 Z",
              "M200 330 L200 240 L270 240 L270 330",
              "M330 175 L410 175 L410 240 L330 240 Z",
              "M470 175 L550 175 L550 240 L470 240 Z",
              "M600 175 L660 175 L660 240 L600 240 Z",
              "M170 300 C300 268 560 268 690 300",
              "M170 336 C300 306 560 306 690 336",
              "M790 330 L790 190 M760 220 L790 190 L820 220",
              "M60 330 L60 230 C60 200 100 200 100 230",
            ].map((d) => (
              <path
                key={d}
                data-cizgi
                d={d}
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>

          <div
            ref={yaziAlt}
            className="absolute bottom-[9vh] right-5 max-w-[26ch] text-right text-lg leading-tight tracking-tight md:right-10 md:text-2xl"
            style={{ opacity: 0 }}
          >
            {cumle}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════ SAHNE 05 — dikey kaydırma yatay şeridi sürer ══════════════ */

export function SahneSerit({
  ust,
  children,
}: {
  ust: ReactNode;
  children: ReactNode;
}) {
  const kok = useRef<HTMLElement>(null);
  const serit = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = kok.current;
    const s = serit.current;
    if (!el || !s) return;

    /**
     * Sahne yüksekliği taşma miktarına göre hesaplanır.
     *
     * Sabit yükseklik verilirse şerit ekrana sığdığında (geniş ekran, az kart)
     * kaydıracak bir şey kalmaz ve sayfada yüzlerce vh ölü kaydırma oluşur.
     * Burada 1 px yatay hareket = 1 px dikey kaydırma; taşma yoksa sahne
     * tek ekrana iner.
     */
    let mesafe = 0;

    const olc = () => {
      mesafe = Math.max(0, s.scrollWidth - window.innerWidth + 40);
      el.style.height = `calc(100vh + ${mesafe}px)`;
      if (mesafe === 0) s.style.transform = "none";
    };

    olc();
    const go = new ResizeObserver(olc);
    go.observe(s);
    window.addEventListener("resize", olc);

    const temizle = azHareket()
      ? undefined
      : kaydirmaDinle(() => {
          if (mesafe === 0) return;
          const p = sahneIlerlemesi(el);
          s.style.transform = `translateX(${-mesafe * yumusat(kis(p))}px)`;
        });

    return () => {
      go.disconnect();
      window.removeEventListener("resize", olc);
      temizle?.();
    };
  }, []);

  return (
    <section ref={kok} className="sahne relative" style={{ height: "100vh" }}>
      <div className="sahne-yapisik block bg-krem">
        <div className="izgara" />
        <div className="relative flex h-full flex-col justify-center overflow-hidden">
          <div className="mx-auto mb-7 w-full max-w-6xl px-5 md:px-10">{ust}</div>
          <div
            ref={serit}
            className="flex gap-5 pl-5 md:pl-10"
            style={{ willChange: "transform" }}
          >
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
