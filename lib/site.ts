export const site = {
  ad: "Sürdürülebilir Turizm",
  kisaAd: "Sürdürülebilir Turizm",
  aciklama:
    "Dünyadan sürdürülebilir turizm uygulamaları ve Türkiye'de nasıl hayata geçirilebilecekleri. Öncü işletmeler, mevzuat ve veriler.",
  // Vercel deploy sonrası NEXT_PUBLIC_SITE_URL ile ezilir
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000",
  dil: "tr-TR",
  linkedin: "https://www.linkedin.com/company/surdurulebilir-turizm/",
  eposta: "iletisim@example.com", // ❓ gerçek adresle değiştirilecek
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
