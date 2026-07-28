import type { Metadata } from "next";
import Link from "next/link";
import { tumHaberler } from "@/lib/content";
import { HaberKarti } from "@/components/haber-karti";
import { Hareket } from "@/components/hareket";
import { KarbonHesaplayici } from "@/components/araclar/karbon-hesaplayici";

export const metadata: Metadata = {
  title: "Gezginim",
  description:
    "Kendi karbon ayak izini ölç, seyahatini hafiflet, nereye gideceğine bilerek karar ver.",
  alternates: { canonical: "/gezgin" },
};

export default function Sayfa() {
  const haberler = tumHaberler().slice(0, 6);

  return (
    <>
      <Hareket />

      {/* giriş — terrakota, gezgin rengi */}
      <section className="relative bg-terra text-[#fff5ee]">
        <div className="izgara izgara-koyu" />
        <div className="relative mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-16">
          <div className="etiket flex items-center gap-2.5 text-[#ffe0cc]">
            <span>Gezgin</span>
            <span className="h-px max-w-[70px] flex-1 bg-current opacity-40" />
          </div>

          <div className="mt-5 grid items-end gap-5 md:grid-cols-6 md:gap-6">
            <h1 className="gir gir-sol text-[2.2rem] leading-[1.02] tracking-tight md:col-span-4 md:text-[3.4rem]">
              Seyahatini bırakmadan hafifletmek
            </h1>
            <p className="gir gir-sag pb-2 leading-relaxed text-[#ffd9c4] md:col-span-2">
              Suçlu duygusu üretmiyoruz. Ölçüyoruz, karşılaştırıyoruz ve nerede gerçekten
              fark yarattığını gösteriyoruz.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/araclar/karbon-ayak-izi"
              className="etiket rounded-sm bg-[#fff5ee] px-4 py-2.5 text-terra transition-opacity hover:opacity-90"
            >
              Ayak izini ölç
            </Link>
            <Link
              href="/isletme"
              className="etiket rounded-sm border border-[rgba(255,255,255,.4)] px-4 py-2.5 text-[#ffd9c4] transition-colors hover:border-[#fff5ee] hover:text-[#fff5ee]"
            >
              İşletme tarafına geç
            </Link>
          </div>
        </div>
      </section>

      {/* araç */}
      <section className="relative border-b border-cizgi">
        <div className="izgara" />
        <div className="relative mx-auto max-w-4xl px-5 py-14 md:px-8">
          <div className="gir">
            <KarbonHesaplayici />
          </div>
        </div>
      </section>

      {/* haberler */}
      {haberler.length > 0 && (
        <section className="relative">
          <div className="izgara" />
          <div className="relative mx-auto max-w-6xl px-5 py-14 md:px-10">
            <div className="etiket flex items-center gap-2.5 text-terra">
              <span>Gezginler için haberler</span>
              <span className="h-px max-w-[70px] flex-1 bg-current opacity-30" />
            </div>
            <div className="mt-9 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {haberler.map((h) => (
                <div key={h.slug} className="gir">
                  <HaberKarti haber={h} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
