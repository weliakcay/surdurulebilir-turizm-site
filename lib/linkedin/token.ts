import fs from "node:fs";
import path from "node:path";

/**
 * LinkedIn token yönetimi.
 *
 * ÖNEMLİ: Programmatic refresh token LinkedIn'de yalnızca sınırlı sayıda partnere
 * açıktır. App'inizde açık değilse `refresh_token` hiç gelmez ve token süresi
 * dolduğunda tarayıcı üzerinden yeniden yetkilendirme gerekir. Bu modül iki
 * durumu da kaldırır: refresh_token varsa kullanır, yoksa net bir hata verir.
 */

const DEPO = path.join(process.cwd(), ".linkedin-token.json");
const TOKEN_URL = "https://www.linkedin.com/oauth/v2/accessToken";

/** Süresi bu kadar kalınca yenilemeyi dener (5 gün). */
const TAMPON_MS = 5 * 24 * 60 * 60 * 1000;

export type TokenDepo = {
  access_token: string;
  /** epoch ms */
  expires_at: number;
  scope?: string;
  refresh_token?: string;
  /** epoch ms */
  refresh_token_expires_at?: number;
  /** Ne zaman yazıldı — teşhis için */
  yazildi?: string;
};

export function depoOku(): TokenDepo | null {
  if (!fs.existsSync(DEPO)) return null;
  try {
    return JSON.parse(fs.readFileSync(DEPO, "utf8")) as TokenDepo;
  } catch {
    throw new Error(`.linkedin-token.json okunamadı — bozuk JSON. Dosyayı silip yeniden yetkilendirin.`);
  }
}

export function depoYaz(depo: TokenDepo): void {
  fs.writeFileSync(DEPO, JSON.stringify({ ...depo, yazildi: new Date().toISOString() }, null, 2));
  fs.chmodSync(DEPO, 0o600);
}

function ayar(ad: string): string {
  const d = process.env[ad];
  if (!d) throw new Error(`Ortam değişkeni eksik: ${ad} (.env.local dosyasına ekleyin)`);
  return d;
}

type TokenYaniti = {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
  scope?: string;
};

function yanitiDepola(y: TokenYaniti): TokenDepo {
  const simdi = Date.now();
  const depo: TokenDepo = {
    access_token: y.access_token,
    expires_at: simdi + y.expires_in * 1000,
    scope: y.scope,
  };
  if (y.refresh_token) {
    depo.refresh_token = y.refresh_token;
    depo.refresh_token_expires_at = y.refresh_token_expires_in
      ? simdi + y.refresh_token_expires_in * 1000
      : undefined;
  }
  depoYaz(depo);
  return depo;
}

/** Yetkilendirme kodunu access token'a çevirir. */
export async function koduTakasEt(code: string): Promise<TokenDepo> {
  const govde = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    client_id: ayar("LINKEDIN_CLIENT_ID"),
    client_secret: ayar("LINKEDIN_CLIENT_SECRET"),
    redirect_uri: ayar("LINKEDIN_REDIRECT_URI"),
  });

  const yanit = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: govde,
  });

  const metin = await yanit.text();
  if (!yanit.ok) {
    throw new Error(
      `Token takası başarısız (${yanit.status}): ${metin}\n` +
        `İpucu: yetkilendirme kodunun ömrü 30 dakikadır ve tek kullanımlıktır.`,
    );
  }
  return yanitiDepola(JSON.parse(metin) as TokenYaniti);
}

/** Refresh token ile yeniler. App'te bu özellik açık değilse hata verir. */
export async function tokeniYenile(refreshToken: string): Promise<TokenDepo> {
  const govde = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken,
    client_id: ayar("LINKEDIN_CLIENT_ID"),
    client_secret: ayar("LINKEDIN_CLIENT_SECRET"),
  });

  const yanit = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: govde,
  });

  const metin = await yanit.text();
  if (!yanit.ok) {
    throw new Error(`Token yenileme başarısız (${yanit.status}): ${metin}`);
  }
  return yanitiDepola(JSON.parse(metin) as TokenYaniti);
}

export function gunKaldi(epochMs: number): number {
  return Math.floor((epochMs - Date.now()) / 86_400_000);
}

/**
 * Kullanıma hazır bir access token döndürür.
 * Süre dolmaya yakınsa yenilemeyi dener; mümkün değilse ne yapılacağını söyleyerek durur.
 */
export async function tokenHazirla(): Promise<string> {
  // Ortamdan doğrudan token verildiyse (Developer Portal Token Generator yolu)
  if (process.env.LINKEDIN_ACCESS_TOKEN) return process.env.LINKEDIN_ACCESS_TOKEN;

  let depo = depoOku();
  if (!depo) {
    throw new Error(
      "LinkedIn token'ı yok.\n" +
        "  Çözüm: npm run linkedin:auth   (yetkilendirme adımlarını yazdırır)",
    );
  }

  const kalanMs = depo.expires_at - Date.now();

  if (kalanMs > TAMPON_MS) return depo.access_token;

  if (depo.refresh_token) {
    const refreshGecerli =
      !depo.refresh_token_expires_at || depo.refresh_token_expires_at > Date.now();
    if (refreshGecerli) {
      console.log(`  token ${gunKaldi(depo.expires_at)} gün içinde doluyor — yenileniyor…`);
      depo = await tokeniYenile(depo.refresh_token);
      console.log(`  ✓ yenilendi, yeni süre: ${gunKaldi(depo.expires_at)} gün`);
      return depo.access_token;
    }
  }

  if (kalanMs > 0) {
    console.warn(
      `  ⚠ token ${gunKaldi(depo.expires_at)} gün içinde doluyor ve refresh_token yok.\n` +
        `    Süre dolmadan "npm run linkedin:auth" ile yeniden yetkilendirin.`,
    );
    return depo.access_token;
  }

  throw new Error(
    "LinkedIn access token'ının süresi dolmuş ve yenilenemiyor (refresh_token yok).\n" +
      "  Programmatic refresh token LinkedIn'de sadece sınırlı partnerlere açıktır.\n" +
      "  Çözüm: npm run linkedin:auth   (tarayıcıdan yeniden yetkilendirme)",
  );
}
