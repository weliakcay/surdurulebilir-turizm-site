/**
 * LinkedIn bağlantı teşhisi — Aşama 0 aracı.
 * Ortam ayarlarını, token durumunu ve yönetici olduğunuz sayfaları raporlar.
 *
 *   npm run linkedin:durum
 */
import "dotenv/config";
import { depoOku, gunKaldi } from "../lib/linkedin/token";
import { yonetilenSayfalar, API_SURUM, organizasyonUrn } from "../lib/linkedin/client";

const isaret = (v: unknown) => (v ? "✓" : "✗");

async function main() {
  console.log("\n═══ LinkedIn durum raporu ═══\n");

  console.log("Ortam ayarları (.env.local)");
  const ayarlar = [
    "LINKEDIN_CLIENT_ID",
    "LINKEDIN_CLIENT_SECRET",
    "LINKEDIN_REDIRECT_URI",
    "LINKEDIN_ORGANIZATION_URN",
    "NEXT_PUBLIC_SITE_URL",
  ] as const;
  for (const a of ayarlar) {
    const v = process.env[a];
    const goster = a === "LINKEDIN_CLIENT_SECRET" && v ? "••••••" : (v ?? "—");
    console.log(`  ${isaret(v)} ${a.padEnd(26)} ${goster}`);
  }
  console.log(`  · API sürümü               ${API_SURUM}`);

  console.log("\nToken");
  const depo = depoOku();
  if (process.env.LINKEDIN_ACCESS_TOKEN) {
    console.log("  ✓ LINKEDIN_ACCESS_TOKEN ortamdan geliyor (depo yok sayılır)");
  } else if (!depo) {
    console.log("  ✗ token yok → npm run linkedin:auth");
  } else {
    const gun = gunKaldi(depo.expires_at);
    console.log(`  ${gun > 0 ? "✓" : "✗"} access token: ${gun > 0 ? `${gun} gün kaldı` : "SÜRESİ DOLMUŞ"}`);
    if (depo.refresh_token) {
      const rg = depo.refresh_token_expires_at ? `${gunKaldi(depo.refresh_token_expires_at)} gün` : "süre bilgisi yok";
      console.log(`  ✓ refresh token var (${rg}) — otomatik yenileme mümkün`);
    } else {
      console.log("  ⚠ refresh token YOK — süre dolunca elle yeniden yetkilendirme gerekir");
    }
    console.log(`  · scope: ${depo.scope ?? "bilinmiyor"}`);
  }

  console.log("\nYönetici olduğunuz sayfalar");
  try {
    const sayfalar = await yonetilenSayfalar();
    if (sayfalar.length === 0) {
      console.log("  ✗ Hiç sayfa dönmedi.");
      console.log("    → Bu hesap hedef sayfada ADMINISTRATOR olmayabilir,");
      console.log("      ya da r_organization_social / rw_organization_admin scope'u eksik.");
    } else {
      let hedef: string | null = null;
      try {
        hedef = organizasyonUrn();
      } catch {
        /* ayarlı değil */
      }
      for (const s of sayfalar) {
        console.log(`  ✓ ${s}${s === hedef ? "   ← LINKEDIN_ORGANIZATION_URN olarak ayarlı" : ""}`);
      }
      if (!hedef) {
        console.log("\n  Yukarıdakilerden hedef sayfayı .env.local içine yazın:");
        console.log(`    LINKEDIN_ORGANIZATION_URN=${sayfalar[0]}`);
      } else if (!sayfalar.includes(hedef)) {
        console.log(`\n  ⚠ Ayarlı URN (${hedef}) bu listede yok — post atma 403 dönecek.`);
      }
    }
  } catch (e) {
    console.log(`  ✗ ${e instanceof Error ? e.message : String(e)}`);
  }

  console.log("\n═════════════════════════════\n");
}

main().catch((e) => {
  console.error(`\n✗ ${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
