"use client";

import { useMemo, useState } from "react";

/**
 * İşletme sürdürülebilirlik taraması.
 *
 * Sorular ve ağırlıklar GSTC Endüstri Kriterleri'nin dört başlığından türetildi:
 * yönetim, sosyo-ekonomik, kültürel, çevresel. Ağırlıklar toplamı 100.
 *
 * ❗ Eşikler ve sertifika hazırlık yorumu bizim editoryal kararımızdır —
 * GSTC, Green Key veya Travelife'ın resmî puanlaması değildir. Sayfada belirtilir.
 */

type Soru = { id: string; metin: string; puan: number; grup: string };

const SORULAR: Soru[] = [
  // Yönetim
  { id: "y1", grup: "Yönetim", puan: 9, metin: "Yazılı bir sürdürülebilirlik politikamız var ve personel biliyor" },
  { id: "y2", grup: "Yönetim", puan: 8, metin: "Enerji, su ve atık tüketimini düzenli ölçüyor ve kaydediyoruz" },
  { id: "y3", grup: "Yönetim", puan: 7, metin: "Misafirlerden sürdürülebilirlik konusunda geri bildirim topluyoruz" },
  // Çevresel
  { id: "c1", grup: "Çevre", puan: 10, metin: "Atıkları kaynağında ayrıştırıyoruz" },
  { id: "c2", grup: "Çevre", puan: 10, metin: "Su tasarrufu donanımı kurulu (debi sınırlayıcı, çift kademeli rezervuar)" },
  { id: "c3", grup: "Çevre", puan: 9, metin: "Enerjinin bir kısmını yenilenebilir kaynaktan alıyoruz" },
  { id: "c4", grup: "Çevre", puan: 7, metin: "Tek kullanımlık plastiği kademeli olarak kaldırdık" },
  { id: "c5", grup: "Çevre", puan: 6, metin: "Gıda atığını ölçüyor ve azaltmak için somut adım atıyoruz" },
  // Sosyo-ekonomik
  { id: "s1", grup: "Sosyo-ekonomik", puan: 9, metin: "Tedarikin önemli kısmı yerel üreticiden" },
  { id: "s2", grup: "Sosyo-ekonomik", puan: 8, metin: "Personelin çoğu bölgeden ve kayıtlı çalışıyor" },
  { id: "s3", grup: "Sosyo-ekonomik", puan: 9, metin: "Personele düzenli sürdürülebilirlik eğitimi veriyoruz" },
  // Kültürel
  { id: "k1", grup: "Kültürel", puan: 8, metin: "Yerel kültürü ve mirası tanıtan içerik veya deneyim sunuyoruz" },
];

const ESIKLER = [
  { min: 85, ad: "GSTC'ye hazır", metin: "Belgelendirme başvurusu yapılabilir. Eksikler büyük olasılıkla dokümantasyonda." },
  { min: 60, ad: "Travelife hedeflenebilir", metin: "Güçlü temel var. Ölçüm ve raporlama tarafını sıkılaştırmak gerekiyor." },
  { min: 35, ad: "Green Key erişilebilir", metin: "Yolda. En hızlı kazanç su ve atık kalemlerinde." },
  { min: 1, ad: "Başlangıç seviyesi", metin: "Önce ölçüm: enerji, su, atık verisi olmadan hiçbir sertifika ilerlemez." },
  { min: 0, ad: "Henüz başlanmadı", metin: "Yukarıdaki maddelerden birini işaretleyerek başlayın." },
];

export function TaramaTesti() {
  const [secili, setSecili] = useState<Set<string>>(new Set());

  const toplam = useMemo(
    () => SORULAR.filter((s) => secili.has(s.id)).reduce((a, s) => a + s.puan, 0),
    [secili],
  );
  const durum = ESIKLER.find((e) => toplam >= e.min)!;

  const eksikler = useMemo(
    () =>
      SORULAR.filter((s) => !secili.has(s.id))
        .sort((a, b) => b.puan - a.puan)
        .slice(0, 3),
    [secili],
  );

  function cevir(id: string) {
    setSecili((eski) => {
      const yeni = new Set(eski);
      if (yeni.has(id)) yeni.delete(id);
      else yeni.add(id);
      return yeni;
    });
  }

  const gruplar = [...new Set(SORULAR.map((s) => s.grup))];

  return (
    <div className="rounded-sm border border-cizgi bg-kart">
      <div className="border-b border-cizgi p-6 md:p-8">
        <div className="etiket text-terra">İşletme aracı</div>
        <h2 className="mt-2 text-2xl leading-tight tracking-tight">
          Sertifikaya ne kadar yakınsın?
        </h2>
        <p className="mt-1.5 max-w-[56ch] text-sm leading-relaxed text-solgun">
          Tesisinizde geçerli olan maddeleri işaretleyin. Hiçbir veri kaydedilmez veya
          gönderilmez — hesap tarayıcınızda yapılır.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_260px]">
        {/* sorular */}
        <div className="p-6 md:p-8">
          {gruplar.map((g) => (
            <div key={g} className="mb-6 last:mb-0">
              <div className="etiket mb-3 text-solgun">{g}</div>
              <div className="space-y-2">
                {SORULAR.filter((s) => s.grup === g).map((s) => {
                  const aktif = secili.has(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => cevir(s.id)}
                      aria-pressed={aktif}
                      className={[
                        "flex w-full items-start gap-3 rounded-sm border p-3 text-left text-sm leading-snug transition-colors",
                        aktif
                          ? "border-cam bg-[rgba(30,61,52,.05)] text-murekkep"
                          : "border-cizgi text-solgun hover:border-adacayi",
                      ].join(" ")}
                    >
                      <span
                        aria-hidden
                        className={[
                          "mt-0.5 grid h-4 w-4 flex-none place-items-center rounded-[2px] border text-[10px] leading-none",
                          aktif ? "border-cam bg-cam text-krem" : "border-cizgi",
                        ].join(" ")}
                      >
                        {aktif ? "✓" : ""}
                      </span>
                      <span className="flex-1">{s.metin}</span>
                      <span className="etiket flex-none pt-0.5 text-solgun">{s.puan}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* sonuç */}
        <div className="border-t border-cizgi bg-kum p-6 md:border-l md:border-t-0 md:p-7">
          <div className="etiket text-solgun">Puanın</div>
          <div className="mt-1 text-[3.4rem] leading-none tabular-nums text-cam">
            {toplam}
            <span className="text-lg text-solgun">/100</span>
          </div>

          <div className="mt-4 h-[7px] overflow-hidden rounded-full bg-cizgi">
            <div
              className="h-full rounded-full bg-cam transition-[width] duration-500"
              style={{ width: `${toplam}%` }}
            />
          </div>

          <div className="mt-5">
            <div className="text-lg leading-tight tracking-tight text-cam">{durum.ad}</div>
            <p className="mt-1.5 text-sm leading-relaxed text-solgun">{durum.metin}</p>
          </div>

          {eksikler.length > 0 && toplam > 0 && (
            <div className="mt-6 border-t border-cizgi pt-4">
              <div className="etiket text-terra">En hızlı kazanç</div>
              <ul className="mt-2.5 space-y-2 text-sm leading-snug text-solgun">
                {eksikler.map((s) => (
                  <li key={s.id} className="flex gap-2">
                    <span className="etiket flex-none pt-0.5 text-cam">+{s.puan}</span>
                    <span>{s.metin}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-cizgi px-6 py-4 md:px-8">
        <p className="text-xs leading-relaxed text-solgun">
          <b>Kaynak:</b> Sorular{" "}
          <a
            href="https://www.gstcouncil.org/"
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-2 hover:text-cam"
          >
            GSTC Endüstri Kriterleri
          </a>{" "}
          başlıklarından türetildi. Puanlama ve eşikler bizim editoryal kararımızdır;
          GSTC, Green Key veya Travelife'ın resmî değerlendirmesi <b>değildir</b> ve
          belgelendirme sonucu hakkında taahhüt içermez.
        </p>
      </div>
    </div>
  );
}
