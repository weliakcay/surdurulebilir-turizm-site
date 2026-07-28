import Link from "next/link";
import Image from "next/image";
import type { Haber } from "@/lib/content";
import { tarihFormatla } from "@/lib/site";
import { Minyatur, type MinyaturTipi } from "@/components/mini";

/**
 * Kart görseli, `npm run gorsel` ile üretilen kategori çizimidir — stok fotoğraf değil.
 * Hesaplayıcı içeren haberler ayrıca rozetle işaretlenir; okur için gerçek bir sinyal.
 */

/**
 * Sağ üstte durur: görselin kendi kategori etiketi sol üstte olduğu için
 * sola konduğunda üst üste biniyor.
 */
function AracRozeti() {
  return (
    <span className="etiket absolute right-2.5 top-2.5 z-10 rounded-sm bg-krem/92 px-2 py-1 text-cam">
      Hesaplayıcı var
    </span>
  );
}

export function HaberKarti({ haber }: { haber: Haber }) {
  return (
    <article className="group">
      <Link href={`/haber/${haber.slug}`} className="block">
        <div className="relative aspect-[1200/630] overflow-hidden rounded-sm bg-kum">
          {haber.aracVar && <AracRozeti />}
          <Image
            src={haber.gorsel}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
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

/** Ana sayfa manşeti — görsel solda, başlık ızgaraya dağıtılmış hâlde sağda. */
export function MansetKarti({ haber }: { haber: Haber }) {
  return (
    <article>
      <div className="etiket flex items-center gap-2.5 text-terra">
        <span>Manşet</span>
        <span className="h-px max-w-[70px] flex-1 bg-current opacity-30" />
        <span className="text-solgun">{haber.kategori}</span>
      </div>

      <Link href={`/haber/${haber.slug}`} className="group mt-5 block">
        <div className="grid gap-7 md:grid-cols-12 md:gap-8">
          <div className="gir gir-sol relative aspect-[1200/630] overflow-hidden rounded-sm bg-kum md:col-span-7">
            {haber.aracVar && <AracRozeti />}
            <Image
              src={haber.gorsel}
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 100vw, 58vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>

          <div className="gir gir-sag flex flex-col justify-center md:col-span-5">
            <h1 className="text-[2rem] leading-[1.05] tracking-tight decoration-terra decoration-2 underline-offset-[6px] group-hover:underline md:text-[2.6rem]">
              {haber.baslik}
            </h1>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-solgun">{haber.ozet}</p>
            <div className="etiket mt-5 flex flex-wrap gap-4 text-solgun">
              <time dateTime={haber.tarih}>{tarihFormatla(haber.tarih)}</time>
              <span>{haber.okumaSuresi} dk okuma</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

/** Şerit kartı — sahne 05 içinde. Araçların kendisi canlı minyatürle temsil edilir. */
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
