import type { Metadata } from "next";
import { TaramaTesti } from "@/components/araclar/tarama-testi";
import { Hareket } from "@/components/hareket";

export const metadata: Metadata = {
  title: "Sertifika tarama testi",
  description:
    "Tesisiniz hangi sürdürülebilirlik sertifikasına hazır? 12 maddelik tarama, puan ve en hızlı kazanç önerileri.",
  alternates: { canonical: "/araclar/sertifika-taramasi" },
};

export default function Sayfa() {
  return (
    <>
      <Hareket />
      <div className="relative">
        <div className="izgara" />
        <div className="relative mx-auto max-w-4xl px-5 py-12 md:px-8">
          <div className="etiket flex items-center gap-2.5 text-terra">
            <span>İşletme aracı</span>
            <span className="h-px max-w-[70px] flex-1 bg-current opacity-30" />
          </div>

          <h1 className="gir mt-4 max-w-[24ch] text-[2.1rem] leading-[1.05] tracking-tight md:text-[3rem]">
            Tesisiniz hangi sertifikaya hazır?
          </h1>
          <p className="gir mt-4 max-w-[58ch] text-lg leading-relaxed text-solgun">
            Sürdürülebilirlik belgelendirmesinde çoğu işletme nereden başlayacağını bilmediği
            için başlamıyor. Bu tarama, hangi maddelerin zaten tamam olduğunu ve en hızlı
            kazancın nerede olduğunu gösterir.
          </p>

          <div className="gir mt-9">
            <TaramaTesti />
          </div>

          <section className="gir mt-12 grid gap-8 border-t border-cizgi pt-9 md:grid-cols-2">
            <div>
              <h2 className="text-xl leading-tight tracking-tight">Bu bir denetim değil</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-solgun">
                Tarama, öz-değerlendirmedir. Gerçek belgelendirme bağımsız denetçi tarafından
                yerinde yapılır ve dokümantasyon ister. Buradaki puan yalnızca yönünüzü
                gösterir; sonuç hakkında taahhüt içermez.
              </p>
            </div>
            <div>
              <h2 className="text-xl leading-tight tracking-tight">Sonraki adım</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-solgun">
                Puanınız düşükse önce <b className="text-murekkep">ölçümle</b> başlayın: enerji,
                su ve atık verisi olmadan hiçbir sertifika süreci ilerlemez. Veri toplamak
                masrafsızdır ve genellikle ilk tasarrufu da o veri ortaya çıkarır.
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
