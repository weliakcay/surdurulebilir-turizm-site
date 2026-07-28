import type { Metadata } from "next";
import Link from "next/link";
import { tumHaberler } from "@/lib/content";
import { HaberKarti } from "@/components/haber-karti";
import { Hareket } from "@/components/hareket";
import { TaramaTesti } from "@/components/araclar/tarama-testi";

export const metadata: Metadata = {
  title: "İşletmeyim",
  description:
    "Otel, pansiyon ve tur operatörleri için: mevzuat, maliyet, geri ödeme ve uygulanabilir örnekler.",
  alternates: { canonical: "/isletme" },
};

export default function Sayfa() {
  const haberler = tumHaberler().slice(0, 6);

  return (
    <>
      <Hareket />

      {/* giriş — derin çam, işletme rengi */}
      <section className="relative bg-cam text-[#eef3ee]">
        <div className="izgara izgara-koyu" />
        <div className="relative mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-16">
          <div className="etiket flex items-center gap-2.5 text-yosun">
            <span>İşletme</span>
            <span className="h-px max-w-[70px] flex-1 bg-current opacity-30" />
          </div>

          <div className="mt-5 grid items-end gap-5 md:grid-cols-6 md:gap-6">
            <h1 className="gir gir-sol text-[2.2rem] leading-[1.02] tracking-tight md:col-span-4 md:text-[3.4rem]">
              Pazartesi sabahı ne yapacağınızı yazıyoruz
            </h1>
            <p className="gir gir-sag pb-2 leading-relaxed text-[#9db3a7] md:col-span-2">
              Farkındalık metni değil: maliyet, geri ödeme süresi, mevzuat takvimi ve
              Türkiye'de gerçekten uygulanmış örnekler.
            </p>
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/araclar/sertifika-taramasi"
              className="etiket rounded-sm bg-yosun px-4 py-2.5 text-cam transition-opacity hover:opacity-90"
            >
              Sertifika taramasını yap
            </Link>
            <Link
              href="/gezgin"
              className="etiket rounded-sm border border-cam2 px-4 py-2.5 text-[#9db3a7] transition-colors hover:border-yosun hover:text-[#eef3ee]"
            >
              Gezgin tarafına geç
            </Link>
          </div>
        </div>
      </section>

      {/* araç */}
      <section className="relative border-b border-cizgi">
        <div className="izgara" />
        <div className="relative mx-auto max-w-4xl px-5 py-14 md:px-8">
          <div className="gir">
            <TaramaTesti />
          </div>
        </div>
      </section>

      {/* haberler */}
      {haberler.length > 0 && (
        <section className="relative">
          <div className="izgara" />
          <div className="relative mx-auto max-w-6xl px-5 py-14 md:px-10">
            <div className="etiket flex items-center gap-2.5 text-terra">
              <span>İşletmeler için haberler</span>
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
