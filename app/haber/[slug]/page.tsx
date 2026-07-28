import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { tumHaberler, haberBul, kaynaklariNormalize } from "@/lib/content";
import { site, tarihFormatla } from "@/lib/site";
import { HaberKarti } from "@/components/haber-karti";
import { Hareket } from "@/components/hareket";
import { GeriOdeme } from "@/components/araclar/geri-odeme";

type Props = { params: Promise<{ slug: string }> };

/**
 * Haber sayfası bilinçli olarak SAKİN: kaydırma koreografisi yok.
 * Koreografi ana sayfa ve araç sayfalarında → kararlar-gunlugu 2026-07-27.
 */

export function generateStaticParams() {
  return tumHaberler().map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const haber = haberBul(slug);
  if (!haber) return {};

  return {
    title: haber.baslik,
    description: haber.ozet,
    alternates: { canonical: `/haber/${haber.slug}` },
    openGraph: {
      type: "article",
      title: haber.baslik,
      description: haber.ozet,
      url: `${site.url}/haber/${haber.slug}`,
      publishedTime: haber.tarih,
      images: [{ url: haber.gorsel, width: 1200, height: 630, alt: haber.baslik }],
    },
    twitter: {
      card: "summary_large_image",
      title: haber.baslik,
      description: haber.ozet,
      images: [haber.gorsel],
    },
  };
}

export default async function HaberSayfasi({ params }: Props) {
  const { slug } = await params;
  const haber = haberBul(slug);
  if (!haber || haber.taslak) notFound();

  const kaynaklar = kaynaklariNormalize(haber.kaynak);
  const ilgili = tumHaberler()
    .filter((h) => h.slug !== haber.slug && h.kategoriSlug === haber.kategoriSlug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: haber.baslik,
    description: haber.ozet,
    image: [`${site.url}${haber.gorsel}`],
    datePublished: haber.tarih,
    dateModified: haber.tarih,
    inLanguage: "tr-TR",
    articleSection: haber.kategori,
    keywords: haber.etiketler.join(", "),
    publisher: { "@type": "Organization", name: site.ad, url: site.url },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${site.url}/haber/${haber.slug}` },
    citation: kaynaklar.map((k) => ({ "@type": "CreativeWork", name: k.ad, url: k.url })),
  };

  return (
    <>
      <Hareket />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="relative">
        <div className="izgara" />
        <div className="relative mx-auto max-w-3xl px-5 py-12 md:px-8">
          <div className="etiket flex flex-wrap items-center gap-x-3.5 gap-y-1 text-solgun">
            <Link href={`/kategori/${haber.kategoriSlug}`} className="text-terra hover:underline">
              {haber.kategori}
            </Link>
            <span aria-hidden>·</span>
            <time dateTime={haber.tarih}>{tarihFormatla(haber.tarih)}</time>
            <span aria-hidden>·</span>
            <span>{haber.okumaSuresi} dk okuma</span>
          </div>

          <h1 className="mt-3.5 text-[2rem] leading-[1.05] tracking-tight md:text-[3.1rem]">
            {haber.baslik}
          </h1>

          <p className="mt-5 border-l-2 border-terra pl-4 text-lg leading-relaxed text-solgun">
            {haber.ozet}
          </p>

          {/* Kapak görseli — kenarlardan taşarak metin sütununu kırar, sayfa nefes alsın */}
          <figure className="relative mt-9 aspect-[1200/630] overflow-hidden rounded-sm bg-kum md:-mx-16">
            <Image
              src={haber.gorsel}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 900px"
              className="object-cover"
            />
          </figure>

          <div className="makale mt-10">
            <MDXRemote source={haber.icerik} components={{ GeriOdeme }} />
          </div>

          {/* Kaynaklar — editoryal ilkeler madde 2: zorunlu ve görünür */}
          <section className="mt-14 rounded-sm border border-cizgi bg-kart p-6">
            <div className="etiket text-solgun">
              {kaynaklar.length > 1 ? "Kaynaklar" : "Kaynak"}
            </div>
            <ul className="mt-3 space-y-2">
              {kaynaklar.map((k) => (
                <li key={k.url}>
                  <a
                    href={k.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-cam underline underline-offset-4 hover:text-terra"
                  >
                    {k.ad}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {haber.etiketler.length > 0 && (
            <div className="mt-7 flex flex-wrap gap-2">
              {haber.etiketler.map((e) => (
                <span
                  key={e}
                  className="etiket rounded-full border border-cizgi px-3 py-1.5 text-solgun"
                >
                  #{e}
                </span>
              ))}
            </div>
          )}

          {ilgili.length > 0 && (
            <section className="mt-16 border-t border-cizgi pt-10">
              <div className="etiket text-terra">İlgili haberler</div>
              <div className="mt-7 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {ilgili.map((h) => (
                  <div key={h.slug} className="gir">
                    <HaberKarti haber={h} />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
