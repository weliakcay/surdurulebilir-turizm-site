/**
 * Kaynak sağlık kontrolü.
 *
 *   npm run kaynak:kontrol            → tüm beslemeleri dener, tabloyu basar
 *   npm run kaynak:kontrol -- --json  → makine okunur çıktı (ileride pano bunu yiyecek)
 *
 * Amaç: kaynak havuzunun sessizce çürümesini engellemek. Bir besleme adres
 * değiştirir ya da bayatlarsa fark etmeden haftalarca boş tarama yapılır.
 */
import { KAYNAKLAR, type Kaynak } from "../lib/kaynaklar";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

type Sonuc = {
  kaynak: Kaynak;
  durum: "saglikli" | "bayat" | "bozuk" | "elle";
  httpKod?: number;
  ogeSayisi?: number;
  enYeni?: string;
  gunOnce?: number;
  hata?: string;
};

/** RSS ve Atom'dan en yeni tarihi çıkarır. */
function enYeniTarih(xml: string): Date | null {
  const alanlar = [...xml.matchAll(/<(pubDate|updated|published|dc:date)>([^<]+)</g)].map((m) => m[2]);
  const tarihler = alanlar.map((t) => new Date(t)).filter((d) => !isNaN(+d));
  if (tarihler.length === 0) return null;
  return new Date(Math.max(...tarihler.map((d) => +d)));
}

async function kontrolEt(k: Kaynak): Promise<Sonuc> {
  if (k.tur === "tarama") return { kaynak: k, durum: "elle" };

  try {
    const kontrolor = AbortSignal.timeout(20_000);
    const yanit = await fetch(k.url, { headers: { "User-Agent": UA }, signal: kontrolor });
    const metin = await yanit.text();

    if (!yanit.ok) {
      return { kaynak: k, durum: "bozuk", httpKod: yanit.status, hata: `HTTP ${yanit.status}` };
    }
    if (!/<rss|<feed|<\?xml/i.test(metin.slice(0, 400))) {
      return { kaynak: k, durum: "bozuk", httpKod: yanit.status, hata: "besleme değil (HTML?)" };
    }

    const ogeSayisi = (metin.match(/<item[\s>]|<entry[\s>]/g) ?? []).length;
    const enYeni = enYeniTarih(metin);
    const gunOnce = enYeni ? Math.floor((Date.now() - +enYeni) / 86_400_000) : undefined;

    const bayat = gunOnce !== undefined && gunOnce > k.bayatGun;
    return {
      kaynak: k,
      durum: bayat ? "bayat" : "saglikli",
      httpKod: yanit.status,
      ogeSayisi,
      enYeni: enYeni?.toISOString().slice(0, 10),
      gunOnce,
    };
  } catch (e) {
    return { kaynak: k, durum: "bozuk", hata: e instanceof Error ? e.message : String(e) };
  }
}

const SIMGE = { saglikli: "✓", bayat: "◐", bozuk: "✗", elle: "·" } as const;

async function main() {
  const jsonCikti = process.argv.includes("--json");

  const sonuclar = await Promise.all(KAYNAKLAR.map(kontrolEt));

  if (jsonCikti) {
    console.log(
      JSON.stringify(
        {
          kontrolTarihi: new Date().toISOString(),
          sonuclar: sonuclar.map((s) => ({
            ad: s.kaynak.ad,
            url: s.kaynak.url,
            tur: s.kaynak.tur,
            dil: s.kaynak.dil,
            guven: s.kaynak.guven,
            piller: s.kaynak.piller,
            durum: s.durum,
            ogeSayisi: s.ogeSayisi,
            enYeni: s.enYeni,
            gunOnce: s.gunOnce,
            hata: s.hata,
          })),
        },
        null,
        2,
      ),
    );
    return;
  }

  console.log("\n═══ Kaynak sağlık kontrolü ═══\n");
  console.log("  D  KAYNAK                          DİL  GÜV  ÖĞE  EN YENİ      DURUM");
  console.log("  " + "─".repeat(78));

  for (const s of sonuclar) {
    const k = s.kaynak;
    const yas =
      s.gunOnce === undefined ? "—" : s.gunOnce === 0 ? "bugün" : `${s.gunOnce} gün önce`;
    const aciklama =
      s.durum === "elle"
        ? "besleme yok — elle taranır"
        : s.durum === "bozuk"
          ? `BOZUK: ${s.hata}`
          : s.durum === "bayat"
            ? `bayat (eşik ${k.bayatGun} gün)`
            : "sağlıklı";

    console.log(
      `  ${SIMGE[s.durum]}  ${k.ad.padEnd(30).slice(0, 30)}  ${k.dil}   ${k.guven}   ` +
        `${String(s.ogeSayisi ?? "—").padStart(3)}  ${(s.enYeni ?? "—").padEnd(11)}  ${aciklama}`,
    );
  }

  const say = (d: Sonuc["durum"]) => sonuclar.filter((s) => s.durum === d).length;
  console.log("\n  " + "─".repeat(78));
  console.log(
    `  sağlıklı ${say("saglikli")} · bayat ${say("bayat")} · bozuk ${say("bozuk")} · elle ${say("elle")}\n`,
  );

  if (say("bozuk") > 0) {
    console.log("  ⚠ Bozuk kaynaklar lib/kaynaklar.ts içinde düzeltilmeli veya çıkarılmalı.\n");
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
});
