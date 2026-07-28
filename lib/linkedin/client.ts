import { tokenHazirla } from "./token";

/**
 * LinkedIn REST istemcisi.
 * Tüm çağrılar Linkedin-Version ve X-Restli-Protocol-Version başlıklarını taşımak zorundadır.
 */

export const API_TABAN = "https://api.linkedin.com/rest";

/** YYYYMM. Ortamdan ezilebilir; LinkedIn eski sürümleri periyodik olarak kapatır. */
export const API_SURUM = process.env.LINKEDIN_API_VERSION ?? "202607";

export async function basliklar(ekstra: Record<string, string> = {}) {
  const token = await tokenHazirla();
  return {
    Authorization: `Bearer ${token}`,
    "LinkedIn-Version": API_SURUM,
    "X-Restli-Protocol-Version": "2.0.0",
    ...ekstra,
  };
}

export class LinkedInHatasi extends Error {
  constructor(
    public durum: number,
    public govde: string,
    islem: string,
  ) {
    super(`LinkedIn ${islem} başarısız (${durum}): ${govde}${LinkedInHatasi.ipucu(durum)}`);
    this.name = "LinkedInHatasi";
  }

  private static ipucu(durum: number): string {
    switch (durum) {
      case 401:
        return "\n  → Token geçersiz veya süresi dolmuş. npm run linkedin:auth";
      case 403:
        return (
          "\n  → İzin yetersiz. Kontrol edin: (a) app'te w_organization_social scope'u aktif mi," +
          "\n     (b) yetkilendiren kişi hedef sayfada ADMINISTRATOR / CONTENT_ADMIN mi."
        );
      case 429:
        return "\n  → Hız sınırı. Bir süre bekleyip tekrar deneyin.";
      default:
        return "";
    }
  }
}

/** Organizasyon URN'i — yayın hedefi. */
export function organizasyonUrn(): string {
  const urn = process.env.LINKEDIN_ORGANIZATION_URN;
  if (!urn) {
    throw new Error(
      "LINKEDIN_ORGANIZATION_URN eksik.\n" +
        "  Bulmak için: npm run linkedin:durum",
    );
  }
  if (!urn.startsWith("urn:li:organization:")) {
    throw new Error(`LINKEDIN_ORGANIZATION_URN "urn:li:organization:123" biçiminde olmalı, gelen: ${urn}`);
  }
  return urn;
}

export type MakalePostu = {
  yorum: string;
  makaleUrl: string;
  baslik: string;
  aciklama: string;
  /** Images API'den dönen urn:li:image:... */
  gorselUrn: string;
};

/**
 * Şirket sayfasına makale (link) postu atar.
 *
 * Not: Posts API URL kazıma (scraping) YAPMAZ. thumbnail, title ve description
 * bizim tarafımızdan verilmek zorundadır — yoksa post çıplak metin olarak görünür.
 */
export async function makalePostuAt(p: MakalePostu): Promise<string> {
  const govde = {
    author: organizasyonUrn(),
    commentary: p.yorum,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    content: {
      article: {
        source: p.makaleUrl,
        title: p.baslik,
        description: p.aciklama,
        thumbnail: p.gorselUrn,
      },
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  const yanit = await fetch(`${API_TABAN}/posts`, {
    method: "POST",
    headers: await basliklar({ "Content-Type": "application/json" }),
    body: JSON.stringify(govde),
  });

  if (!yanit.ok) {
    throw new LinkedInHatasi(yanit.status, await yanit.text(), "post oluşturma");
  }

  // Post ID x-restli-id başlığında döner
  const urn = yanit.headers.get("x-restli-id");
  if (!urn) {
    throw new Error(
      "Post oluşturuldu ama x-restli-id başlığı gelmedi — URN kaydedilemedi. " +
        "Şirket sayfasını elle kontrol edin, çift yayın riski var.",
    );
  }
  return urn;
}

/** Bir postun gerçekten yayında olduğunu doğrular (r_organization_social gerekir). */
export async function postuDogrula(urn: string): Promise<{ durum: string } | null> {
  const yanit = await fetch(`${API_TABAN}/posts/${encodeURIComponent(urn)}?viewContext=AUTHOR`, {
    headers: await basliklar(),
  });
  if (!yanit.ok) return null;
  const veri = (await yanit.json()) as { lifecycleState?: string };
  return { durum: veri.lifecycleState ?? "BİLİNMİYOR" };
}

/** Yetkilendiren kişinin yönetici olduğu sayfaları listeler — organizasyon URN'i bulmak için. */
export async function yonetilenSayfalar(): Promise<string[]> {
  const url =
    `${API_TABAN}/organizationAcls` +
    `?q=roleAssignee&role=ADMINISTRATOR&state=APPROVED&projection=(elements*(organization))`;

  const yanit = await fetch(url, { headers: await basliklar() });
  if (!yanit.ok) {
    throw new LinkedInHatasi(yanit.status, await yanit.text(), "sayfa listesi");
  }
  const veri = (await yanit.json()) as { elements?: { organization: string }[] };
  return (veri.elements ?? []).map((e) => e.organization);
}
