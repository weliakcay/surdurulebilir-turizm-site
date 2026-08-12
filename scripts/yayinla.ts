/**
 * Eş zamanlı yayın: site + LinkedIn şirket sayfası.
 *
 *   npm run yayinla <slug>
 *   npm run yayinla <slug> -- --dry        → hiçbir şey yayınlamaz, sadece ne olacağını gösterir
 *   npm run yayinla <slug> -- --atla-git   → git adımlarını atlar (site zaten canlıysa)
 *   npm run yayinla <slug> -- --bicim gorsel  → link kartı yerine tam genişlikte görsel postu
 *
 * Biçim seçimi: --bicim bayrağı > frontmatter linkedinBicim > varsayılan "makale".
 * makale = link kartı, siteye tıklama için iyi. gorsel = büyük görsel, erişim için iyi.
 * Hangisinin daha çok etkileşim aldığı LinkedIn sayfa analitiğinden elle ölçülecek —
 * etkileşim uç noktaları mevcut scope'larla 403 dönüyor.
 *
 * Sıra önemlidir: LinkedIn postundaki link canlı olmadan post atılmaz.
 */
import { config as ortamYukle } from "dotenv";
// .env.local Next.js sözleşmesidir; dotenv varsayılan olarak yalnızca .env okur.
ortamYukle({ path: ".env.local" });
ortamYukle(); // .env varsa o da yüklensin (öncelik .env.local'da)
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";
import { haberBul } from "../lib/content";
import { tokenHazirla } from "../lib/linkedin/token";
import { gorselYukle, gorseliBekle } from "../lib/linkedin/images";
import { videoYukle, videoyuBekle } from "../lib/linkedin/videos";
import {
  makalePostuAt,
  gorselPostuAt,
  videoPostuAt,
  type PostBicimi,
} from "../lib/linkedin/client";

const bayrak = (ad: string) => process.argv.includes(`--${ad}`);
const KURU = bayrak("dry");
const ATLA_GIT = bayrak("atla-git");

/** Biçim: --bicim <deger> > frontmatter linkedinBicim > varsayılan makale */
function bicimSec(frontmatterBicim?: PostBicimi): PostBicimi {
  const i = process.argv.indexOf("--bicim");
  const bayrakDeger = i > -1 ? process.argv[i + 1] : undefined;
  if (bayrakDeger === "gorsel" || bayrakDeger === "makale" || bayrakDeger === "video") {
    return bayrakDeger;
  }
  return frontmatterBicim ?? "makale";
}

const BICIM_ADI: Record<PostBicimi, string> = {
  makale: "MAKALE postu (link kartı)",
  gorsel: "GÖRSEL postu (tam genişlik, link metinde)",
  video: "VİDEO postu (otomatik oynar, link metinde)",
};

function adim(n: number, metin: string) {
  console.log(`\n[${n}/7] ${metin}`);
}
function dur(mesaj: string): never {
  console.error(`\n✗ ${mesaj}\n`);
  process.exit(1);
}

function git(...args: string[]): string {
  return execFileSync("git", args, { encoding: "utf8", cwd: process.cwd() }).trim();
}

/** Yayındaki sayfa 200 dönene kadar bekler — deploy'un canlıya çıktığının kanıtı. */
async function canliyaCikmayiBekle(url: string, azamiSaniye = 300): Promise<void> {
  const bitis = Date.now() + azamiSaniye * 1000;
  let deneme = 0;
  while (Date.now() < bitis) {
    deneme++;
    try {
      const y = await fetch(url, { method: "HEAD", redirect: "follow" });
      if (y.ok) {
        console.log(`  ✓ canlı (${deneme}. denemede): ${url}`);
        return;
      }
      console.log(`  … ${y.status} — bekleniyor (${deneme})`);
    } catch {
      console.log(`  … erişilemedi — bekleniyor (${deneme})`);
    }
    await new Promise((r) => setTimeout(r, 10_000));
  }
  dur(
    `Sayfa ${azamiSaniye} saniye içinde canlıya çıkmadı: ${url}\n` +
      `  Vercel deploy'unu kontrol edin. LinkedIn'e post ATILMADI — güvenli durum.`,
  );
}

async function main() {
  const slug = process.argv[2];
  if (!slug || slug.startsWith("--")) {
    dur("Kullanım: npm run yayinla <slug> [-- --dry] [-- --atla-git]");
  }

  console.log(`\n══ Yayın: ${slug} ${KURU ? "(KURU ÇALIŞMA)" : ""} ══`);

  // ---------- 1. Haberi oku ve doğrula ----------
  adim(1, "Haber okunuyor ve doğrulanıyor");
  const haber = haberBul(slug);
  if (!haber) dur(`content/haberler/${slug}.mdx bulunamadı`);
  if (haber.taslak) dur(`Bu haber taslak (taslak: true). Yayınlamak için alanı kaldırın.`);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (!siteUrl) dur("NEXT_PUBLIC_SITE_URL eksik — LinkedIn postunda kullanılacak link belirsiz.");
  if (!siteUrl.startsWith("https://")) {
    dur(`NEXT_PUBLIC_SITE_URL HTTPS olmalı, gelen: ${siteUrl}`);
  }
  const haberUrl = `${siteUrl}/haber/${slug}`;
  console.log(`  ✓ ${haber.baslik}`);
  console.log(`  · hedef link: ${haberUrl}`);

  // ---------- 2. Çift yayın koruması ----------
  adim(2, "Çift yayın kontrolü");
  if (haber.linkedinPostUrn) {
    console.log(`\n  Bu haber LinkedIn'de zaten yayında:\n  ${haber.linkedinPostUrn}`);
    console.log(`\n  Hiçbir şey yapılmadı. Yeniden yayınlamak gerçekten gerekiyorsa`);
    console.log(`  frontmatter'daki linkedinPostUrn alanını elle temizlemeniz gerekir.\n`);
    process.exit(0);
  }
  console.log("  ✓ daha önce yayınlanmamış");

  // ---------- 3. LinkedIn postu metni ----------
  adim(3, "LinkedIn postu metni");
  let yorum = haber.linkedinYorum?.trim();
  if (!yorum) {
    yorum = haber.ozet;
    console.log(
      `  ⚠ frontmatter'da linkedinYorum yok — özet kullanılacak.\n` +
        `    Daha iyisi: "linkedin-postu" skill'i ile kanca metni üretip frontmatter'a ekleyin.`,
    );
  }
  const bicim = bicimSec(haber.linkedinBicim);

  /*
   * Görsel ve video postunda link kartı OLUŞMAZ — link metnin içinde olmak
   * zorunda, yoksa okurun siteye gidecek hiçbir yolu kalmıyor.
   */
  if (bicim === "gorsel" || bicim === "video") {
    yorum = `${yorum.trimEnd()}\n\n→ ${haberUrl}`;
  }

  if (yorum.length > 2900) dur(`LinkedIn yorumu çok uzun (${yorum.length} karakter, sınır ~3000).`);
  console.log(`  ✓ ${yorum.length} karakter`);
  console.log(`  · biçim: ${BICIM_ADI[bicim]}`);

  // Video biçiminde dosya yayına başlamadan ÖNCE aranır — git adımına
  // girip dosyanın olmadığını sonradan görmek en kötü sıra.
  const videoYolu = haber.video ?? `/haberler/${slug}.mp4`;
  if (bicim === "video") {
    const tam = path.join(process.cwd(), "public", videoYolu.replace(/^\//, ""));
    if (!fs.existsSync(tam)) {
      dur(`Video bulunamadı: ${tam}\n  Önce: npm run video ${slug}`);
    }
    console.log(`  · video: ${videoYolu} (${(fs.statSync(tam).size / 1024 / 1024).toFixed(1)} MB)`);
  }

  // ---------- 4. Token ----------
  adim(4, "LinkedIn token'ı hazırlanıyor");
  if (KURU) {
    console.log("  · kuru çalışma — token kontrolü atlandı");
  } else {
    await tokenHazirla();
    console.log("  ✓ token hazır");
  }

  // ---------- 5. Siteyi yayına al ----------
  adim(5, "Site yayına alınıyor");
  if (KURU || ATLA_GIT) {
    console.log(`  · ${KURU ? "kuru çalışma" : "--atla-git"} — git adımları atlandı`);
  } else {
    const durum = git("status", "--porcelain");
    if (durum) {
      git("add", "-A");
      git("commit", "-m", `haber: ${haber.baslik}`);
      console.log("  ✓ commit atıldı");
    } else {
      console.log("  · commit edilecek değişiklik yok");
    }
    git("push");
    console.log("  ✓ push edildi — Vercel deploy başladı");
  }

  if (!KURU) {
    console.log("  Deploy'un canlıya çıkması bekleniyor…");
    await canliyaCikmayiBekle(haberUrl);
  }

  // ---------- 6. Medyayı LinkedIn'e yükle ----------
  adim(6, bicim === "video" ? "Video LinkedIn'e yükleniyor" : "Görsel LinkedIn'e yükleniyor");
  let gorselUrn = "urn:li:image:KURU_CALISMA";
  let videoUrn = "urn:li:video:KURU_CALISMA";
  if (KURU) {
    console.log(`  · kuru çalışma — ${bicim === "video" ? videoYolu : haber.gorsel} yüklenmedi`);
  } else if (bicim === "video") {
    videoUrn = await videoYukle(videoYolu);
    console.log(`  ✓ ${videoUrn}`);
    await videoyuBekle(videoUrn);
  } else {
    gorselUrn = await gorselYukle(haber.gorsel);
    console.log(`  ✓ ${gorselUrn}`);
    await gorseliBekle(gorselUrn);
  }

  // ---------- 7. Postu at ----------
  adim(7, "LinkedIn şirket sayfasına post atılıyor");
  if (KURU) {
    console.log("  · kuru çalışma — post ATILMADI. Gönderilecek gövde:\n");
    console.log(
      JSON.stringify(
        bicim === "video"
          ? { commentary: yorum, media: { title: haber.baslik, id: videoUrn } }
          : bicim === "gorsel"
          ? { commentary: yorum, media: { altText: haber.baslik, id: gorselUrn } }
          : {
              commentary: yorum,
              article: {
                source: haberUrl,
                title: haber.baslik,
                description: haber.ozet.slice(0, 256),
                thumbnail: gorselUrn,
              },
            },
        null,
        2,
      ),
    );
    console.log("\n══ Kuru çalışma tamamlandı ══\n");
    return;
  }

  const postUrn =
    bicim === "video"
      ? await videoPostuAt({ yorum, videoUrn, baslik: haber.baslik })
      : bicim === "gorsel"
      ? await gorselPostuAt({ yorum, gorselUrn, altMetin: haber.baslik })
      : await makalePostuAt({
          yorum,
          makaleUrl: haberUrl,
          baslik: haber.baslik,
          aciklama: haber.ozet.slice(0, 256),
          gorselUrn,
        });
  console.log(`  ✓ yayınlandı (${bicim}): ${postUrn}`);

  // ---------- URN'i frontmatter'a yaz ----------
  console.log("\nURN frontmatter'a yazılıyor (çift yayın koruması)");
  const dosya = path.join(process.cwd(), "content", "haberler", `${slug}.mdx`);
  const ham = fs.readFileSync(dosya, "utf8");
  const ayristirilmis = matter(ham);
  ayristirilmis.data.linkedinPostUrn = postUrn;
  fs.writeFileSync(dosya, matter.stringify(ayristirilmis.content, ayristirilmis.data));
  console.log("  ✓ yazıldı");

  if (!ATLA_GIT) {
    /*
     * Göreli yol ZORUNLU, mutlak yol değil.
     * Proje yolunda Türkçe karakter var ("sürdürülebilir"). macOS dosya
     * adlarını NFD (ayrık) biçiminde saklarken Node yolu NFC (birleşik)
     * üretiyor; git ikisini eşleştiremeyip "is outside repository" diyor.
     * git zaten cwd içinde çalıştığı için göreli yol bu sorunu tamamen atlar.
     */
    git("add", path.posix.join("content", "haberler", `${slug}.mdx`));
    git("commit", "-m", `linkedin: ${slug} → ${postUrn}`);
    git("push");
    console.log("  ✓ commit + push");
  }

  console.log(`\n══ Tamamlandı ══`);
  console.log(`  Site     : ${haberUrl}`);
  console.log(`  LinkedIn : https://www.linkedin.com/feed/update/${postUrn}/\n`);
}

main().catch((e) => {
  console.error(`\n✗ ${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
