/**
 * Kanonik yayın adresi.
 *
 * Bilerek sabit: bu bir ortam ayarı değil, marka kararı. Ortam değişkenine
 * bırakıldığında Vercel'de eski değer kalınca sitemap, canonical ve og:url
 * sessizce yanlış domaini gösteriyordu — Google yeni adresi değil eskisini
 * indeksler, arama değeri yanlış adrese birikir.
 *
 * Vercel apex'i www'ye 308 ile yönlendiriyor, o yüzden kanonik olan www.
 * Önizleme dağıtımları da buraya işaret etsin: kopya indekslenmesini önler.
 */
const KANONIK_URL = "https://www.surdurulebilirturizm.site";

function siteUrl(): string {
  if (process.env.NODE_ENV === "production") return KANONIK_URL;
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";
}

export const site = {
  ad: "Sürdürülebilir Turizm",
  kisaAd: "Sürdürülebilir Turizm",
  aciklama:
    "Dünyadan sürdürülebilir turizm uygulamaları ve Türkiye'de nasıl hayata geçirilebilecekleri. Öncü işletmeler, mevzuat ve veriler.",
  url: siteUrl(),
  dil: "tr-TR",
  linkedin: "https://www.linkedin.com/company/surdurulebilir-turizm/",
  eposta: "info@surdurulebilirturizm.site",
} as const;

/** Türkçe karakterleri doğru çeviren slug üretici. */
export function slugify(metin: string): string {
  const harita: Record<string, string> = {
    ç: "c", Ç: "c", ğ: "g", Ğ: "g", ı: "i", İ: "i",
    ö: "o", Ö: "o", ş: "s", Ş: "s", ü: "u", Ü: "u",
  };
  return metin
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (h) => harita[h] ?? h)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function tarihFormatla(iso: string): string {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
