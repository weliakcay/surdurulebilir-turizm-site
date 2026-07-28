"use client";

import { useMemo, useState } from "react";
import {
  ULASIM,
  KONAKLAMA,
  notVer,
  AGAC_YILLIK_KG,
  DEFRA_SURUM,
  DEFRA_URL,
  type UlasimAnahtar,
} from "@/lib/defra";

const ULASIM_SIRA: UlasimAnahtar[] = [
  "ucusYurtDisi",
  "ucusYurtIci",
  "otomobilBenzin",
  "otobus",
  "tren",
];

const KISA_AD: Record<UlasimAnahtar, string> = {
  ucusYurtDisi: "Uçak · yurt dışı",
  ucusYurtIci: "Uçak · yurt içi",
  otomobilBenzin: "Otomobil",
  otomobilDizel: "Otomobil · dizel",
  otomobilHibrit: "Otomobil · hibrit",
  otobus: "Otobüs",
  tren: "Tren",
};

export function KarbonHesaplayici() {
  const [ulasim, setUlasim] = useState<UlasimAnahtar>("ucusYurtDisi");
  const [km, setKm] = useState(1200);
  const [aracKisi, setAracKisi] = useState(2);
  const [gece, setGece] = useState(5);
  const [odaKisi, setOdaKisi] = useState(2);

  const hesap = useMemo(() => {
    const u = ULASIM[ulasim];
    const aracBasina = "aracBasina" in u && u.aracBasina === true;
    // gidiş-dönüş
    let ulasimKg = km * 2 * u.katsayi;
    if (aracBasina) ulasimKg /= Math.max(1, aracKisi);

    const konaklamaKg = (gece * KONAKLAMA.turkiye.katsayi) / Math.max(1, odaKisi);
    const toplam = ulasimKg + konaklamaKg;

    return {
      ulasimKg,
      konaklamaKg,
      toplam,
      ulasimPay: toplam > 0 ? Math.round((ulasimKg / toplam) * 100) : 0,
      agac: Math.max(1, Math.round(toplam / AGAC_YILLIK_KG)),
      not: notVer(toplam),
      aracBasina,
    };
  }, [ulasim, km, aracKisi, gece, odaKisi]);

  return (
    <div className="overflow-hidden rounded-sm bg-cam text-[#eef3ee]">
      <div className="grid gap-8 p-6 md:grid-cols-[1fr_240px] md:p-8">
        {/* ---- girdiler ---- */}
        <div>
          <div className="etiket text-yosun">Gezgin aracı</div>
          <h2 className="mt-2 text-2xl leading-tight tracking-tight">
            Seyahatinin karbon ayak izi
          </h2>
          <p className="mt-1.5 text-sm text-[#9db3a7]">
            Dört soru. Hesap tarayıcında yapılır, hiçbir veri sunucuya gitmez.
          </p>

          <Grup baslik="Nasıl gidiyorsun?">
            <div className="flex flex-wrap gap-2">
              {ULASIM_SIRA.map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setUlasim(k)}
                  aria-pressed={ulasim === k}
                  className={[
                    "etiket rounded-sm border px-3 py-2 transition-colors",
                    ulasim === k
                      ? "border-yosun bg-yosun text-cam"
                      : "border-cam2 text-[#9db3a7] hover:border-yosun hover:text-[#eef3ee]",
                  ].join(" ")}
                >
                  {KISA_AD[k]}
                </button>
              ))}
            </div>
          </Grup>

          <Kaydirici
            etiket="Mesafe (tek yön)"
            deger={`${km.toLocaleString("tr-TR")} km`}
            min={50}
            max={12000}
            step={50}
            value={km}
            onChange={setKm}
          />

          {hesap.aracBasina && (
            <Kaydirici
              etiket="Araçtaki kişi sayısı"
              deger={String(aracKisi)}
              min={1}
              max={5}
              step={1}
              value={aracKisi}
              onChange={setAracKisi}
            />
          )}

          <Kaydirici
            etiket="Konaklama"
            deger={`${gece} gece`}
            min={1}
            max={30}
            step={1}
            value={gece}
            onChange={setGece}
          />

          <Kaydirici
            etiket="Odada kaç kişi"
            deger={String(odaKisi)}
            min={1}
            max={4}
            step={1}
            value={odaKisi}
            onChange={setOdaKisi}
          />
        </div>

        {/* ---- sonuç ---- */}
        <div className="border-t border-cam2 pt-6 md:border-l md:border-t-0 md:pl-7 md:pt-0">
          <div className="flex h-full flex-col justify-center">
            <div className="etiket text-[#9db3a7]">Notun</div>
            <div className="mt-1 flex items-baseline gap-3">
              <span className="text-[4.5rem] leading-none text-yosun">{hesap.not.not}</span>
              <span className="text-sm text-[#9db3a7]">{hesap.not.aciklama}</span>
            </div>

            <div className="mt-5 text-[2rem] leading-none tabular-nums">
              {Math.round(hesap.toplam).toLocaleString("tr-TR")}
              <span className="ml-1.5 text-sm text-[#9db3a7]">kg CO₂e</span>
            </div>
            <div className="etiket mt-1.5 text-[#9db3a7]">Kişi başı · gidiş-dönüş dahil</div>

            <div className="mt-5 rounded-sm border border-[rgba(143,176,63,.28)] bg-[rgba(143,176,63,.09)] p-3.5 text-sm leading-relaxed">
              Bunu bir yılda tutmak için <b className="text-yosun">{hesap.agac} ağaç</b> gerekir.
              <br />
              Ayak izinin <b className="text-yosun">%{hesap.ulasimPay}</b>'i ulaşımdan geliyor
              {hesap.ulasimPay > 70 ? " — asıl kazanç orada." : "."}
            </div>

            <dl className="mt-4 space-y-1 text-xs text-[#9db3a7]">
              <div className="flex justify-between">
                <dt>Ulaşım</dt>
                <dd className="tabular-nums">{Math.round(hesap.ulasimKg)} kg</dd>
              </div>
              <div className="flex justify-between">
                <dt>Konaklama</dt>
                <dd className="tabular-nums">{Math.round(hesap.konaklamaKg)} kg</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* ---- kaynak: editoryal ilke gereği görünür ---- */}
      <div className="border-t border-cam2 px-6 py-4 md:px-8">
        <p className="text-xs leading-relaxed text-[#7d968a]">
          <b className="text-[#9db3a7]">Katsayılar:</b>{" "}
          <a href={DEFRA_URL} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-yosun">
            {DEFRA_SURUM}
          </a>{" "}
          — uçuşlarda radiative forcing dahil. Otel katsayısı Türkiye için{" "}
          {KONAKLAMA.turkiye.katsayi} kg CO₂e/oda/gece; asıl kaynağı Cornell Hotel
          Sustainability Benchmarking endeksi. Not ölçeği bizim editoryal
          kararımızdır, DEFRA'dan gelmez.
        </p>
      </div>
    </div>
  );
}

/* ---------- yardımcılar ---------- */

function Grup({ baslik, children }: { baslik: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <div className="etiket mb-2.5 text-[#9db3a7]">{baslik}</div>
      {children}
    </div>
  );
}

function Kaydirici({
  etiket,
  deger,
  min,
  max,
  step,
  value,
  onChange,
}: {
  etiket: string;
  deger: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
}) {
  const dolu = ((value - min) / (max - min)) * 100;
  return (
    <div className="mt-5">
      <label className="etiket mb-2 flex items-baseline justify-between text-[#9db3a7]">
        <span>{etiket}</span>
        <span className="text-yosun">{deger}</span>
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-label={etiket}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ["--dolu" as string]: `${dolu}%`, color: "#eef3ee" }}
      />
    </div>
  );
}
