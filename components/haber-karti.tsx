import Link from "next/link";
import type { Haber } from "@/lib/content";
import { tarihFormatla } from "@/lib/site";
import { Minyatur, type MinyaturTipi } from "@/components/mini";

/**
 * Kategoriye göre minyatür seçimi.
 * Frontmatter'da `minyatur` verilirse o kazanır.
 */
function minyaturSec(haber: Haber): MinyaturTipi {
  if (haber.minyatur) return haber.minyatur;
  const k = haber.kategoriSlug;
  if (k.includes("isletme")) return "cubuklar";
  if (k.includes("mevzuat")) return "egri";
  if (k.includes("veri")) return "halka";
  return "kadran";
}

export function HaberKarti({ haber }: { haber: Haber }) {
  return (
    <article className="group">
      <Link href={`/haber/${haber.slug}`} className="block">
        <div className="grid h-[118px] place-items-center overflow-hidden rounded-sm bg-kum text-cam">
          <Minyatur tipi={minyaturSec(haber)} />
        </div>

        <div className="etiket mt-3.5 flex flex-wrap items-center gap-x-2.5 text-solgun">
          <span className="text-terra">{haber.kategori}</span>
          <span aria-hidden>·</span>
          <time dateTime={haber.tarih}>{tarihFormatla(haber.tarih)}</time>
        </div>

        <h3 className="mt-2 text-xl leading-tight tracking-tight decoration-terra decoration-2 underline-offset-4 group-hover:underline">
          {haber.baslik}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-solgun">{haber.ozet}</p>
      </Link>
    </article>
  );
}

/** Ana sayfa manşeti — başlık ızgaraya dağıtılır. */
export function MansetKarti({ haber }: { haber: Haber }) {
  return (
    <article>
      <div className="etiket flex items-center gap-2.5 text-terra">
        <span>Manşet</span>
        <span className="h-px max-w-[70px] flex-1 bg-current opacity-30" />
        <span className="text-solgun">{haber.kategori}</span>
      </div>

      <Link href={`/haber/${haber.slug}`} className="group mt-5 block">
        <div className="grid items-end gap-5 md:grid-cols-6 md:gap-6">
          <h1 className="gir gir-sol text-4xl leading-[1.02] tracking-tight decoration-terra decoration-2 underline-offset-[6px] group-hover:underline md:col-span-4 md:text-[3.6rem]">
            {haber.baslik}
          </h1>
          <p className="gir gir-sag pb-2 text-[1.02rem] leading-relaxed text-solgun md:col-span-2">
            {haber.ozet}
          </p>
        </div>
      </Link>

      <div className="etiket mt-6 flex flex-wrap gap-4 text-solgun">
        <time dateTime={haber.tarih}>{tarihFormatla(haber.tarih)}</time>
        <span>{haber.okumaSuresi} dk okuma</span>
      </div>
    </article>
  );
}

/** Şerit kartı — sahne 05 içinde kullanılır. */
export function AracKarti({
  etiket,
  baslik,
  metin,
  href,
  tipi,
  not,
}: {
  etiket: string;
  baslik: string;
  metin: string;
  href: string;
  tipi: MinyaturTipi;
  not?: string;
}) {
  return (
    <Link
      href={href}
      className="group w-[300px] flex-none rounded-sm border border-cizgi bg-kart p-4 transition-all duration-200 hover:-translate-y-1 hover:border-cam sm:w-[320px]"
    >
      <div className="grid h-[130px] place-items-center overflow-hidden rounded-sm bg-kum text-cam">
        <Minyatur tipi={tipi} not={not} />
      </div>
      <div className="etiket mt-3.5 text-terra">{etiket}</div>
      <h3 className="mt-1.5 text-xl leading-tight tracking-tight">{baslik}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-solgun">{metin}</p>
      <span className="etiket mt-3 inline-block text-cam transition-transform duration-200 group-hover:translate-x-1">
        Aracı aç →
      </span>
    </Link>
  );
}
