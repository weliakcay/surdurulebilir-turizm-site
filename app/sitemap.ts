import type { MetadataRoute } from "next";
import { tumHaberler, kategoriler } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const haberler = tumHaberler();

  const sabitler: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    // iki muhatap bölümü
    { url: `${site.url}/isletme`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${site.url}/gezgin`, changeFrequency: "weekly", priority: 0.9 },
    // araçlar — kalıcı, aranan sayfalar
    { url: `${site.url}/araclar/karbon-ayak-izi`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/araclar/sertifika-taramasi`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${site.url}/hakkinda`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${site.url}/iletisim`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/gizlilik-politikasi`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const haberSayfalari: MetadataRoute.Sitemap = haberler.map((h) => ({
    url: `${site.url}/haber/${h.slug}`,
    lastModified: new Date(h.tarih),
    changeFrequency: "monthly",
    priority: 0.8,
    images: [`${site.url}${h.gorsel}`],
  }));

  const kategoriSayfalari: MetadataRoute.Sitemap = kategoriler().map((k) => ({
    url: `${site.url}/kategori/${k.slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...sabitler, ...haberSayfalari, ...kategoriSayfalari];
}
