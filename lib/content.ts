import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { slugify } from "./site";

const HABER_DIZINI = path.join(process.cwd(), "content", "haberler");

export type Kaynak = { ad: string; url: string };

export type HaberOnBilgi = {
  baslik: string;
  ozet: string;
  kategori: string;
  etiketler: string[];
  kaynak: Kaynak | Kaynak[];
  gorsel: string;
  tarih: string;
  /** "Türkiye açısı" bölümü var mı — editoryal ilkeler madde 3 gereği zorunlu */
  turkiyeAcisi: boolean;
  /** Yayın sonrası doldurulur. Dolu ise LinkedIn'e tekrar gönderilmez. */
  linkedinPostUrn: string | null;
  /**
   * LinkedIn post biçimi: "makale" (link kartı), "gorsel" (tam genişlikte
   * görsel) veya "video" (derlenmiş haber videosu). Etkileşim karşılaştırması
   * için dönüşümlü kullanılıyor.
   */
  linkedinBicim?: "makale" | "gorsel" | "video";
  /** Video biçimi için MP4 yolu. Verilmezse /haberler/<slug>.mp4 varsayılır. */
  video?: string;
  /** LinkedIn postunun metni. Yoksa özet kullanılır (önerilmez — post kanca olmalı). */
  linkedinYorum?: string;
  /**
   * Kart minyatürü. Verilmezse kategoriden türetilir.
   * Kart görseli fotoğraf DEĞİL — bkz. kararlar-gunlugu 2026-07-27.
   */
  minyatur?: "kadran" | "cubuklar" | "egri" | "halka";
  /** Taslakları listelerden gizler */
  taslak?: boolean;
};

export type Haber = HaberOnBilgi & {
  slug: string;
  icerik: string;
  kategoriSlug: string;
  okumaSuresi: number;
  /** Metne gömülü bir hesaplayıcı var mı — kartta rozet olarak gösterilir. */
  aracVar: boolean;
};

/** Frontmatter'ı doğrular. Eksik alan varsa build'i patlatır — sessizce geçmez. */
function dogrula(slug: string, veri: Record<string, unknown>): HaberOnBilgi {
  const eksik: string[] = [];
  const zorunlu = ["baslik", "ozet", "kategori", "kaynak", "gorsel", "tarih"] as const;
  for (const alan of zorunlu) {
    if (veri[alan] === undefined || veri[alan] === null || veri[alan] === "") eksik.push(alan);
  }
  if (eksik.length > 0) {
    throw new Error(`[içerik] ${slug}.mdx — eksik frontmatter alanı: ${eksik.join(", ")}`);
  }
  if (veri.turkiyeAcisi !== true) {
    throw new Error(
      `[içerik] ${slug}.mdx — "turkiyeAcisi: true" olmalı. ` +
        `Türkiye açısı olmayan haber yayınlanmaz (01-marka/editoryal-ilkeler madde 3).`,
    );
  }
  return {
    baslik: String(veri.baslik),
    ozet: String(veri.ozet),
    kategori: String(veri.kategori),
    etiketler: Array.isArray(veri.etiketler) ? veri.etiketler.map(String) : [],
    kaynak: veri.kaynak as Kaynak | Kaynak[],
    gorsel: String(veri.gorsel),
    tarih: new Date(veri.tarih as string).toISOString(),
    turkiyeAcisi: true,
    linkedinPostUrn: (veri.linkedinPostUrn as string | null) ?? null,
    linkedinYorum: veri.linkedinYorum ? String(veri.linkedinYorum) : undefined,
    linkedinBicim:
      veri.linkedinBicim === "gorsel" || veri.linkedinBicim === "video"
        ? veri.linkedinBicim
        : undefined,
    video: veri.video ? String(veri.video) : undefined,
    minyatur: veri.minyatur as HaberOnBilgi["minyatur"],
    taslak: veri.taslak === true,
  };
}

function okumaSuresiHesapla(icerik: string): number {
  // Türkçe için ~200 kelime/dakika
  return Math.max(1, Math.round(icerik.trim().split(/\s+/).length / 200));
}

export function tumHaberler({ taslaklarDahil = false } = {}): Haber[] {
  if (!fs.existsSync(HABER_DIZINI)) return [];

  const haberler = fs
    .readdirSync(HABER_DIZINI)
    .filter((d) => d.endsWith(".mdx"))
    .map((dosya): Haber => {
      const slug = dosya.replace(/\.mdx$/, "");
      const ham = fs.readFileSync(path.join(HABER_DIZINI, dosya), "utf8");
      const { data, content } = matter(ham);
      const on = dogrula(slug, data);
      return {
        ...on,
        slug,
        icerik: content,
        kategoriSlug: slugify(on.kategori),
        okumaSuresi: okumaSuresiHesapla(content),
        aracVar: /<GeriOdeme[\s/>]/.test(content),
      };
    })
    .filter((h) => taslaklarDahil || !h.taslak)
    .sort((a, b) => +new Date(b.tarih) - +new Date(a.tarih));

  return haberler;
}

export function haberBul(slug: string): Haber | undefined {
  return tumHaberler({ taslaklarDahil: true }).find((h) => h.slug === slug);
}

export function kategoriler(): { ad: string; slug: string; adet: number }[] {
  const sayac = new Map<string, { ad: string; adet: number }>();
  for (const h of tumHaberler()) {
    const mevcut = sayac.get(h.kategoriSlug);
    sayac.set(h.kategoriSlug, { ad: h.kategori, adet: (mevcut?.adet ?? 0) + 1 });
  }
  return [...sayac.entries()]
    .map(([slug, v]) => ({ slug, ...v }))
    .sort((a, b) => b.adet - a.adet);
}

export function kategoriHaberleri(kategoriSlug: string): Haber[] {
  return tumHaberler().filter((h) => h.kategoriSlug === kategoriSlug);
}

export function kaynaklariNormalize(kaynak: Kaynak | Kaynak[]): Kaynak[] {
  return Array.isArray(kaynak) ? kaynak : [kaynak];
}
