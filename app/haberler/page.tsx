import Link from "next/link";
import { Portal, Heading, NewsGrid } from "@/components/portal";
import { tumHaberler, kategoriler } from "@/lib/content";
import { pageMetadata } from "@/lib/portal";
import type { Metadata } from "next";
type Props = { searchParams: Promise<{ q?: string; kategori?: string }> };
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const query = await searchParams;
  return {
    ...pageMetadata(
      "Sürdürülebilir Turizm Haberleri ve Uygulama Örnekleri",
      "Kaynaklı sürdürülebilir turizm haberleri, Türkiye uygulanabilirlik analizleri ve öncü işletmeler. Haber arşivinde ara.",
      "/haberler",
    ),
    ...(query.q || query.kategori
      ? { robots: { index: false, follow: true } }
      : {}),
  };
}
export default async function Page({ searchParams }: Props) {
  const query = await searchParams;
  const q = (typeof query.q === "string" ? query.q : "").slice(0, 120).trim();
  const category = typeof query.kategori === "string" ? query.kategori : "";
  const needle = q.toLocaleLowerCase("tr");
  const news = tumHaberler().filter(
    (h) =>
      (!category || h.kategoriSlug === category) &&
      (!needle ||
        `${h.baslik} ${h.ozet} ${h.etiketler.join(" ")}`
          .toLocaleLowerCase("tr")
          .includes(needle)),
  );
  return (
    <Portal>
      <Heading
        title="Dünyada ne oldu? Türkiye’de nasıl işler?"
        description="Her haberin yanında kaynak, uygulanabilirlik sorusu ve somut bir örnek."
      />
      <section className="section">
        <div className="wrap">
          <form action="/haberler" method="get" className="filter-form">
            <label htmlFor="news-search">
              Haberlerde ara
              <input
                id="news-search"
                name="q"
                type="search"
                defaultValue={q}
                maxLength={120}
                placeholder="Örn. otel, mutfak, su"
              />
            </label>
            {category && (
              <input type="hidden" name="kategori" value={category} />
            )}
            <button className="btn" type="submit">
              Ara
            </button>
          </form>
          <div className="all-topics">
            <Link
              className="topic-link"
              href="/haberler"
              aria-current={!category ? "page" : undefined}
            >
              Tüm konular
            </Link>
            {kategoriler().map((k) => (
              <Link
                className="topic-link"
                key={k.slug}
                href={`/haberler?kategori=${encodeURIComponent(k.slug)}`}
                aria-current={category === k.slug ? "page" : undefined}
              >
                {k.ad} ({k.adet})
              </Link>
            ))}
          </div>
          <p className="tiny">
            {news.length} haber{q ? ` · Arama: ${q}` : ""}
          </p>
          {news.length ? (
            <NewsGrid items={news} all />
          ) : (
            <div className="disclosure">
              <p>
                Bu arama için haber bulunamadı. Daha kısa bir sözcük deneyebilir
                veya tüm konulara dönebilirsin.
              </p>
              <Link className="textlink" href="/haberler">
                Tüm haberleri göster
              </Link>
            </div>
          )}
        </div>
      </section>
    </Portal>
  );
}
