/**
 * Canlı minyatürler — sitenin merkezi fikri.
 *
 * Kart görseli fotoğraf DEĞİLDİR; o haberin aracının ya da verisinin
 * kendisidir. Bkz. 00-beyin/kararlar-gunlugu.md (2026-07-27).
 *
 * Hepsi saf CSS animasyonu — JavaScript gerekmez, sunucu bileşeni olarak
 * çalışır. prefers-reduced-motion açıkken globals.css animasyonları kapatır.
 */

export type MinyaturTipi = "kadran" | "cubuklar" | "egri" | "halka";

/** Not kadranı — karbon hesaplayıcı kartı */
export function MiniKadran({ not = "C" }: { not?: string }) {
  return (
    <svg viewBox="0 0 120 78" aria-hidden className="h-full w-auto">
      <path
        d="M14 64 A46 46 0 0 1 106 64"
        stroke="currentColor"
        strokeWidth="10"
        fill="none"
        opacity=".16"
      />
      <path
        className="mini-kadran-dolgu"
        d="M14 64 A46 46 0 0 1 106 64"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <text
        x="60"
        y="62"
        textAnchor="middle"
        fontSize="23"
        fontWeight="700"
        fill="currentColor"
      >
        {not}
      </text>
    </svg>
  );
}

/** Puan çubukları — tarama testi kartı */
export function MiniCubuklar() {
  return (
    <div className="mini-cubuklar" aria-hidden>
      <i /><i /><i /><i /><i />
    </div>
  );
}

/** Geri ödeme eğrisi — "bende işler mi?" kartı */
export function MiniEgri() {
  return (
    <svg viewBox="0 0 150 90" preserveAspectRatio="none" aria-hidden className="h-full w-full max-w-[150px]">
      <line x1="0" y1="46" x2="150" y2="46" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity=".35" />
      <path
        className="mini-egri-yol"
        d="M6 82 C34 78 52 66 70 52 S110 24 144 12"
        strokeWidth="2.4"
        fill="none"
      />
      <circle className="mini-egri-nokta" cx="86" cy="42" r="4.5" />
    </svg>
  );
}

/** Oran halkası — veri haberleri */
export function MiniHalka({ oran = 0.62 }: { oran?: number }) {
  const cevre = 2 * Math.PI * 30;
  return (
    <svg viewBox="0 0 120 80" aria-hidden className="h-full w-auto">
      <circle cx="60" cy="40" r="30" fill="none" stroke="currentColor" strokeWidth="9" opacity=".16" />
      <circle
        cx="60"
        cy="40"
        r="30"
        fill="none"
        stroke="var(--color-terra)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={cevre}
        strokeDashoffset={cevre * (1 - oran)}
        transform="rotate(-90 60 40)"
      />
    </svg>
  );
}

export function Minyatur({ tipi, not }: { tipi: MinyaturTipi; not?: string }) {
  switch (tipi) {
    case "kadran":
      return <MiniKadran not={not} />;
    case "cubuklar":
      return <MiniCubuklar />;
    case "egri":
      return <MiniEgri />;
    case "halka":
      return <MiniHalka />;
  }
}
