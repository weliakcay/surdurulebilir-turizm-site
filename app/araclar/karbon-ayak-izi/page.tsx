import type { Metadata } from "next";
import { KarbonHesaplayici } from "@/components/araclar/karbon-hesaplayici";
import { Hareket } from "@/components/hareket";

export const metadata: Metadata = {
  title: "Karbon ayak izi hesaplayıcı",
  description:
    "Seyahatinin karbon ayak izini DEFRA 2026 katsayılarıyla hesapla. Dört soru, bir not. Veri sunucuya gitmez.",
  alternates: { canonical: "/araclar/karbon-ayak-izi" },
};

export default function Sayfa() {
  return (
    <>
      <Hareket />
      <div className="relative">
        <div className="izgara" />
        <div className="relative mx-auto max-w-4xl px-5 py-12 md:px-8">
          <div className="etiket flex items-center gap-2.5 text-terra">
            <span>Gezgin aracı</span>
            <span className="h-px max-w-[70px] flex-1 bg-current opacity-30" />
          </div>

          <h1 className="gir mt-4 max-w-[22ch] text-[2.1rem] leading-[1.05] tracking-tight md:text-[3rem]">
            Seyahatinin ayak izi ne kadar?
          </h1>
          <p className="gir mt-4 max-w-[56ch] text-lg leading-relaxed text-solgun">
            Sayı tek başına bir şey anlatmıyor — o yüzden sonucu nota çeviriyor, kaç ağaca
            karşılık geldiğini ve ayak izinin ne kadarının ulaşımdan geldiğini de gösteriyoruz.
            Çoğu seyahatte belirleyici olan konaklama değil, ulaşım.
          </p>

          <div className="gir mt-9">
            <KarbonHesaplayici />
          </div>

          <section className="gir mt-12 grid gap-8 border-t border-cizgi pt-9 md:grid-cols-2">
            <div>
              <h2 className="text-xl leading-tight tracking-tight">Yöntem</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-solgun">
                Ulaşım için mesafe gidiş-dönüş olarak iki katına çıkarılır ve yolcu-kilometre
                katsayısıyla çarpılır. Otomobilde katsayı araç başınadır, bu yüzden araçtaki
                kişi sayısına bölünür. Konaklamada otel katsayısı oda-gece başınadır ve odadaki
                kişi sayısına bölünür.
              </p>
            </div>
            <div>
              <h2 className="text-xl leading-tight tracking-tight">Neyi göstermiyor</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-solgun">
                Yeme-içme, aktiviteler ve varış noktasındaki yerel ulaşım hesaba girmiyor.
                Otel katsayısı ülke ortalamasıdır; sertifikalı bir tesiste gerçek değer belirgin
                biçimde daha düşük olabilir. Sonuç bir tahmindir, fatura değil.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
