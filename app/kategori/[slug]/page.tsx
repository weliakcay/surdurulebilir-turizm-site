import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { kategoriler, kategoriHaberleri } from "@/lib/content";
import { HaberKarti } from "@/components/haber-karti";
import { Hareket } from "@/components/hareket";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return kategoriler().map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const kat = kategoriler().find((k) => k.slug === slug);
  if (!kat) return {};

  return {
    title: kat.ad,
    description: `${kat.ad} konusundaki haberler ve Türkiye'de uygulanabilirlik analizleri.`,
    alternates: { canonical: `/kategori/${kat.slug}` },
  };
}

export default async function KategoriSayfasi({ params }: Props) {
  const { slug } = await params;
  const kat = kategoriler().find((k) => k.slug === slug);
  if (!kat) notFound();

  const haberler = kategoriHaberleri(slug);

  return (
    <>
      <Hareket />
      <div className="relative">
        <div className="izgara" />
        <div className="relative mx-auto max-w-6xl px-5 py-12 md:px-10">
          <div className="etiket flex items-center gap-2.5 text-terra">
            <span>Konu</span>
            <span className="h-px max-w-[70px] flex-1 bg-current opacity-30" />
          </div>
          <h1 className="mt-3 text-[2rem] leading-tight tracking-tight md:text-4xl">{kat.ad}</h1>
          <p className="etiket mt-3 text-solgun">{kat.adet} haber</p>

          <div className="mt-11 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {haberler.map((h) => (
              <div key={h.slug} className="gir">
                <HaberKarti haber={h} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
