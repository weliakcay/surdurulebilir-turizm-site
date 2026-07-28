import Link from "next/link";
import { tumHaberler, kategoriler } from "@/lib/content";
import { HaberKarti, MansetKarti, AracKarti } from "@/components/haber-karti";
import { Kapilar } from "@/components/kapilar";
import { Hareket } from "@/components/hareket";
import { SahneZoom, SahneCizim, SahneSerit } from "@/components/sahneler";

export default function AnaSayfa() {
  const haberler = tumHaberler();
  const [manset, ...digerleri] = haberler;
  const kats = kategoriler();

  return (
    <>
      <Hareket />

      {/* ── Sahne 01 — açılış ── */}
      <SahneZoom
        varisGorseli="/site/hero-varis.jpg"
        baslik={
          <span className="text-3xl leading-none tracking-tight md:text-5xl">
            Sürdürülebilir
            <br />
            Turizm
          </span>
        }
      />

      {/* ── Perde — iki kapı ── */}
      <Kapilar />

      {/* ── Manşet ── */}
      {manset ? (
        <section className="relative border-b border-cizgi">
          <div className="izgara" />
          <div className="relative mx-auto max-w-6xl px-5 py-14 md:px-10 md:py-16">
            <MansetKarti haber={manset} />
          </div>
        </section>
      ) : (
        <section className="relative border-b border-cizgi">
          <div className="mx-auto max-w-6xl px-5 py-20 md:px-10">
            <p className="text-solgun">
              Henüz haber yayınlanmadı. İlk haberler <code>content/haberler/</code> altına eklenecek.
            </p>
          </div>
        </section>
      )}

      {/* ── Sahne 03 — çizim, dolgu, renk devri ── */}
      <SahneCizim
        etiket="01 — Gri su geri kazanımı"
        cumle={
          <>
            Dünyada işe yarayan bir uygulama,
            <br />
            Türkiye'de hangi koşullarda işler?
          </>
        }
      />

      {/* ── Sahne 05 — araç şeridi ── */}
      <SahneSerit
        ust={
          <>
            <div className="etiket flex items-center gap-2.5 text-terra">
              <span>Araçlar</span>
              <span className="h-px max-w-[70px] flex-1 bg-current opacity-30" />
            </div>
            <h2 className="mt-3 max-w-[20ch] text-3xl leading-none tracking-tight md:text-[2.6rem]">
              Okumakla kalma, kendi sayını gör
            </h2>
          </>
        }
      >
        <AracKarti
          etiket="Gezgin · araç"
          baslik="Seyahatinin karbon ayak izi"
          metin="Dört soru, bir not. DEFRA 2026 katsayılarıyla."
          href="/araclar/karbon-ayak-izi"
          tipi="kadran"
          not="C"
        />
        <AracKarti
          etiket="İşletme · araç"
          baslik="Sertifikaya ne kadar yakınsın?"
          metin="12 maddelik tarama; puanın ve en hızlı kazancın."
          href="/araclar/sertifika-taramasi"
          tipi="cubuklar"
        />
        <AracKarti
          etiket="Haberin içinde"
          baslik="Bu uygulama bende işler mi?"
          metin="Tesisinin rakamlarını gir, geri ödeme süresini gör."
          href={manset ? `/haber/${manset.slug}` : "/isletme"}
          tipi="egri"
        />
        <AracKarti
          etiket="İşletme · bölüm"
          baslik="İşletme tarafına geç"
          metin="Mevzuat, maliyet ve uygulama odaklı her şey bir arada."
          href="/isletme"
          tipi="halka"
        />
        <AracKarti
          etiket="Gezgin · bölüm"
          baslik="Gezgin tarafına geç"
          metin="Ayak izini ölç, seyahatini bırakmadan hafiflet."
          href="/gezgin"
          tipi="kadran"
          not="B"
        />
      </SahneSerit>

      {/* ── Son haberler ── */}
      {digerleri.length > 0 && (
        <section className="relative border-t border-cizgi">
          <div className="izgara" />
          <div className="relative mx-auto max-w-6xl px-5 py-14 md:px-10">
            <div className="etiket flex items-center gap-2.5 text-terra">
              <span>Son haberler</span>
              <span className="h-px max-w-[70px] flex-1 bg-current opacity-30" />
            </div>
            <div className="mt-9 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {digerleri.map((h) => (
                <div key={h.slug} className="gir">
                  <HaberKarti haber={h} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Konular ── */}
      {kats.length > 0 && (
        <section className="relative border-t border-cizgi">
          <div className="relative mx-auto max-w-6xl px-5 py-11 md:px-10">
            <div className="etiket text-solgun">Konular</div>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {kats.map((k) => (
                <Link
                  key={k.slug}
                  href={`/kategori/${k.slug}`}
                  className="rounded-full border border-cizgi px-4 py-1.5 text-sm text-solgun transition-colors hover:border-terra hover:text-cam"
                >
                  {k.ad}
                  <span className="ml-1.5 text-xs opacity-60">{k.adet}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
