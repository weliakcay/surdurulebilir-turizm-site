"use client";

import { useMemo, useState } from "react";

/**
 * "Bu uygulama bende işler mi?" — habere gömülen geri ödeme hesabı.
 *
 * ❗ Türkiye'ye ait sistem maliyeti ve tasarruf verisi henüz kaynaklanmadı
 * (bkz. 02-icerik/veri-kaynaklari.md açık maddeler). Bu yüzden hiçbir maliyet
 * gizli sabit olarak gömülmedi: iki para girdisi de kullanıcının kendi rakamı
 * ve arayüzde başlangıç değerlerinin gösterge olduğu yazılı.
 */

export function GeriOdeme({
  baslik = "Bu uygulama bende işler mi?",
  aciklama = "Tesisinin rakamlarını gir, geri ödeme süresini gör.",
  varsayilanYatirimOda = 9500,
  varsayilanTasarrufGece = 14,
  tasarrufEtiketi = "Gece başına tasarruf",
}: {
  baslik?: string;
  aciklama?: string;
  varsayilanYatirimOda?: number;
  varsayilanTasarrufGece?: number;
  tasarrufEtiketi?: string;
}) {
  const [oda, setOda] = useState(40);
  const [doluluk, setDoluluk] = useState(62);
  const [yatirimOda, setYatirimOda] = useState(varsayilanYatirimOda);
  const [tasarrufGece, setTasarrufGece] = useState(varsayilanTasarrufGece);

  const h = useMemo(() => {
    const satilanGece = oda * 365 * (doluluk / 100);
    const yillikTasarruf = satilanGece * tasarrufGece;
    const yatirim = oda * yatirimOda;
    const aylik = yillikTasarruf / 12;
    const ay = aylik > 0 ? Math.max(1, Math.round(yatirim / aylik)) : Infinity;
    return { satilanGece, yillikTasarruf, yatirim, ay };
  }, [oda, doluluk, yatirimOda, tasarrufGece]);

  const tl = (n: number) => Math.round(n).toLocaleString("tr-TR");

  return (
    <div className="overflow-hidden rounded-sm bg-cam text-[#eef3ee]">
      <div className="grid gap-8 p-6 md:grid-cols-[1fr_230px] md:p-7">
        <div>
          <div className="etiket text-yosun">Habere gömülü araç</div>
          <h3 className="mt-2 text-xl leading-tight tracking-tight">{baslik}</h3>
          <p className="mt-1.5 text-sm text-[#9db3a7]">{aciklama}</p>

          <Kaydirici
            etiket="Oda sayısı"
            deger={String(oda)}
            min={10}
            max={300}
            step={5}
            value={oda}
            onChange={setOda}
          />
          <Kaydirici
            etiket="Yıllık doluluk"
            deger={`%${doluluk}`}
            min={20}
            max={95}
            step={1}
            value={doluluk}
            onChange={setDoluluk}
          />

          <div className="mt-6 grid gap-4 border-t border-cam2 pt-5 sm:grid-cols-2">
            <Sayi
              etiket="Oda başına yatırım"
              birim="TL"
              value={yatirimOda}
              onChange={setYatirimOda}
            />
            <Sayi
              etiket={tasarrufEtiketi}
              birim="TL"
              value={tasarrufGece}
              onChange={setTasarrufGece}
            />
          </div>
          <p className="mt-2.5 text-xs leading-relaxed text-[#7d968a]">
            Bu iki alanın başlangıç değeri <b className="text-[#9db3a7]">göstergedir</b> — kendi
            teklifinizdeki ve faturanızdaki rakamlarla değiştirin. Sonuç girdiğiniz sayılara göre
            hesaplanır.
          </p>
        </div>

        <div className="border-t border-cam2 pt-6 md:border-l md:border-t-0 md:pl-7 md:pt-0">
          <div className="flex h-full flex-col justify-center">
            <div className="etiket text-[#9db3a7]">Geri ödeme</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-[3.6rem] leading-none tabular-nums text-yosun">
                {Number.isFinite(h.ay) ? h.ay : "—"}
              </span>
              <span className="text-sm text-[#9db3a7]">ay</span>
            </div>

            <dl className="mt-5 space-y-2 border-t border-cam2 pt-4 text-xs text-[#9db3a7]">
              <div className="flex justify-between gap-3">
                <dt>Toplam yatırım</dt>
                <dd className="tabular-nums text-[#eef3ee]">{tl(h.yatirim)} TL</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Yıllık tasarruf</dt>
                <dd className="tabular-nums text-[#eef3ee]">{tl(h.yillikTasarruf)} TL</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt>Satılan gece / yıl</dt>
                <dd className="tabular-nums text-[#eef3ee]">{tl(h.satilanGece)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
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

function Sayi({
  etiket,
  birim,
  value,
  onChange,
}: {
  etiket: string;
  birim: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="etiket mb-2 block text-[#9db3a7]">{etiket}</span>
      <span className="flex items-center gap-2 rounded-sm border border-cam2 bg-[rgba(0,0,0,.16)] px-3 py-2 focus-within:border-yosun">
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className="w-full bg-transparent font-[family-name:var(--font-mono)] text-sm tabular-nums outline-none"
        />
        <span className="etiket flex-none text-[#7d968a]">{birim}</span>
      </span>
    </label>
  );
}
