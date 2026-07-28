/**
 * Eş zamanlı yayın: site + LinkedIn şirket sayfası.
 *
 *   npm run yayinla <slug>
 *   npm run yayinla <slug> -- --dry        → hiçbir şey yayınlamaz, sadece ne olacağını gösterir
 *   npm run yayinla <slug> -- --atla-git   → git adımlarını atlar (site zaten canlıysa)
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
import { makalePostuAt } from "../lib/linkedin/client";

const bayrak = (ad: string) => process.argv.includes(`--${ad}`);
const KURU = bayrak("dry");
const ATLA_GIT = bayrak("atla-git");

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
  if (yorum.length > 2900) dur(`LinkedIn yorumu çok uzun (${yorum.length} karakter, sınır ~3000).`);
  console.log(`  ✓ ${yorum.length} karakter`);

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

  // ---------- 6. Görseli LinkedIn'e yükle ----------
  adim(6, "Görsel LinkedIn'e yükleniyor");
  let gorselUrn = "urn:li:image:KURU_CALISMA";
  if (KURU) {
    console.log(`  · kuru çalışma — ${haber.gorsel} yüklenmedi`);
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
        {
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

  const postUrn = await makalePostuAt({
    yorum,
    makaleUrl: haberUrl,
    baslik: haber.baslik,
    aciklama: haber.ozet.slice(0, 256),
    gorselUrn,
  });
  console.log(`  ✓ yayınlandı: ${postUrn}`);

  // ---------- URN'i frontmatter'a yaz ----------
  console.log("\nURN frontmatter'a yazılıyor (çift yayın koruması)");
  const dosya = path.join(process.cwd(), "content", "haberler", `${slug}.mdx`);
  const ham = fs.readFileSync(dosya, "utf8");
  const ayristirilmis = matter(ham);
  ayristirilmis.data.linkedinPostUrn = postUrn;
  fs.writeFileSync(dosya, matter.stringify(ayristirilmis.content, ayristirilmis.data));
  console.log("  ✓ yazıldı");

  if (!ATLA_GIT) {
    git("add", dosya);
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
