/**
 * LinkedIn yetkilendirme.
 *
 * Kullanım:
 *   npm run linkedin:auth                  → yetkilendirme bağlantısını yazdırır
 *   npm run linkedin:auth -- --code <kod>  → kodu access token'a çevirir
 *   npm run linkedin:auth -- --token <tkn> → Developer Portal Token Generator'dan alınan
 *                                            token'ı doğrudan kaydeder
 */
import "dotenv/config";
import { koduTakasEt, depoYaz, depoOku, gunKaldi } from "../lib/linkedin/token";

const AUTH_URL = "https://www.linkedin.com/oauth/v2/authorization";

/** Hedefe göre varsayılan scope — LINKEDIN_SCOPE ile ezilebilir. */
function varsayilanScope(): string {
  return process.env.LINKEDIN_HEDEF === "organizasyon"
    ? "w_organization_social r_organization_social"
    : "openid profile w_member_social";
}

function arg(ad: string): string | undefined {
  const i = process.argv.indexOf(`--${ad}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

function zorunlu(ad: string): string {
  const d = process.env[ad];
  if (!d) {
    console.error(`\n✗ Ortam değişkeni eksik: ${ad}`);
    console.error(`  .env.local dosyasını .env.example'a bakarak doldurun.\n`);
    process.exit(1);
  }
  return d;
}

async function main() {
  const kod = arg("code");
  const token = arg("token");

  // --- Elle token kaydı (Developer Portal Token Generator yolu) ---
  if (token) {
    const gun = Number(arg("gun") ?? 60);
    depoYaz({ access_token: token, expires_at: Date.now() + gun * 86_400_000 });
    console.log(`\n✓ Token kaydedildi (.linkedin-token.json), ${gun} gün geçerli sayılıyor.`);
    console.log(`  Doğrulamak için: npm run linkedin:durum\n`);
    return;
  }

  // --- Kodu token'a çevir ---
  if (kod) {
    console.log("\nKod token'a çevriliyor…");
    const depo = await koduTakasEt(kod);
    console.log(`✓ Access token alındı — ${gunKaldi(depo.expires_at)} gün geçerli`);
    if (depo.refresh_token) {
      const r = depo.refresh_token_expires_at
        ? `${gunKaldi(depo.refresh_token_expires_at)} gün`
        : "süre bilgisi yok";
      console.log(`✓ Refresh token da geldi (${r}) — yayın scripti bundan sonra kendi yenileyecek.`);
    } else {
      console.log(
        `⚠ Refresh token GELMEDİ. Programmatic refresh app'inizde açık değil.\n` +
          `  Token dolduğunda bu adımı tekrarlamanız gerekecek.`,
      );
    }
    console.log(`  Verilen scope'lar: ${depo.scope ?? "bilinmiyor"}\n`);
    return;
  }

  // --- Yetkilendirme bağlantısını üret ---
  const clientId = zorunlu("LINKEDIN_CLIENT_ID");
  const redirect = zorunlu("LINKEDIN_REDIRECT_URI");
  const scope = process.env.LINKEDIN_SCOPE ?? varsayilanScope();
  const state = `st${Date.now().toString(36)}`;

  const url =
    `${AUTH_URL}?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirect)}` +
    `&state=${state}` +
    `&scope=${encodeURIComponent(scope)}`;

  const mevcut = depoOku();

  console.log(`
┌─ LinkedIn yetkilendirme ─────────────────────────────────────
│
│ 1. Aşağıdaki bağlantıyı tarayıcıda açın ve izin verin:
│
${url
  .match(/.{1,72}/g)!
  .map((s) => `│    ${s}`)
  .join("\n")}
│
│ 2. Dönüş sayfasında görünen kodu kopyalayın.
│
│ 3. Şu komutu çalıştırın:
│    npm run linkedin:auth -- --code <kod>
│
│ state: ${state}   (dönüşte aynı olmalı)
│ scope: ${scope}
│ redirect: ${redirect}
│
└──────────────────────────────────────────────────────────────

Not: LinkedIn redirect URI'nin HTTPS olmasını şart koşar. ${redirect} adresinin
LinkedIn app'inizin Auth sekmesindeki "Authorized redirect URLs" listesinde
birebir kayıtlı olması gerekir.

Alternatif: Developer Portal'daki Token Generator ile token üretip
  npm run linkedin:auth -- --token <token>
komutuyla doğrudan kaydedebilirsiniz.
`);

  if (mevcut) {
    console.log(
      `Mevcut token: ${gunKaldi(mevcut.expires_at)} gün geçerli` +
        `${mevcut.refresh_token ? " (refresh_token var)" : " (refresh_token yok)"}\n`,
    );
  }
}

main().catch((e) => {
  console.error(`\n✗ ${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
