import fs from "node:fs";
import path from "node:path";
import { API_TABAN, basliklar, organizasyonUrn, LinkedInHatasi } from "./client";

/**
 * Images API — iki adımlı yükleme.
 * 1) initializeUpload → uploadUrl + image URN
 * 2) uploadUrl'e binary PUT
 *
 * Desteklenen: JPG, PNG, GIF · 36.152.320 pikselden küçük.
 */

const IZINLI = new Set([".jpg", ".jpeg", ".png", ".gif"]);

type BaslatmaYaniti = {
  value: { uploadUrl: string; image: string; uploadUrlExpiresAt: number };
};

/**
 * Yerel bir görseli LinkedIn'e yükler ve `urn:li:image:...` döndürür.
 * @param yerelYol public/ altındaki yol (ör. "/haberler/xxx.jpg")
 */
export async function gorselYukle(yerelYol: string): Promise<string> {
  const uzanti = path.extname(yerelYol).toLowerCase();
  if (!IZINLI.has(uzanti)) {
    throw new Error(
      `LinkedIn bu görsel biçimini kabul etmiyor: ${uzanti}. ` +
        `JPG, PNG veya GIF kullanın (SVG desteklenmez).`,
    );
  }

  const tamYol = path.join(process.cwd(), "public", yerelYol.replace(/^\//, ""));
  if (!fs.existsSync(tamYol)) {
    throw new Error(`Görsel bulunamadı: ${tamYol}`);
  }
  const veri = fs.readFileSync(tamYol);

  // 1) Yüklemeyi başlat
  const baslat = await fetch(`${API_TABAN}/images?action=initializeUpload`, {
    method: "POST",
    headers: await basliklar({ "Content-Type": "application/json" }),
    body: JSON.stringify({ initializeUploadRequest: { owner: organizasyonUrn() } }),
  });

  if (!baslat.ok) {
    throw new LinkedInHatasi(baslat.status, await baslat.text(), "görsel yükleme başlatma");
  }

  const { value } = (await baslat.json()) as BaslatmaYaniti;

  // 2) Binary'yi yükle
  const yukle = await fetch(value.uploadUrl, {
    method: "PUT",
    headers: {
      ...(await basliklar()),
      "Content-Type": uzanti === ".png" ? "image/png" : uzanti === ".gif" ? "image/gif" : "image/jpeg",
    },
    body: new Uint8Array(veri),
  });

  if (!yukle.ok) {
    throw new LinkedInHatasi(yukle.status, await yukle.text(), "görsel yükleme");
  }

  return value.image;
}

/** Görselin işlenmesi bittiyse true. Yüklemeden hemen sonra PROCESSING olabilir. */
export async function gorselHazirMi(gorselUrn: string): Promise<boolean> {
  const yanit = await fetch(`${API_TABAN}/images/${encodeURIComponent(gorselUrn)}`, {
    headers: await basliklar(),
  });
  if (!yanit.ok) return false;
  const veri = (await yanit.json()) as { status?: string };
  return veri.status === "AVAILABLE";
}

/** Görsel AVAILABLE olana kadar bekler. */
export async function gorseliBekle(gorselUrn: string, azamiSaniye = 60): Promise<void> {
  const bitis = Date.now() + azamiSaniye * 1000;
  while (Date.now() < bitis) {
    if (await gorselHazirMi(gorselUrn)) return;
    await new Promise((r) => setTimeout(r, 3000));
  }
  // Engelleyici değil: LinkedIn genelde postu yine kabul eder.
  console.warn(`  ⚠ görsel ${azamiSaniye} sn içinde hazır olmadı, devam ediliyor`);
}
