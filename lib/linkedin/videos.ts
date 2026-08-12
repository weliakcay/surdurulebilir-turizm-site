import fs from "node:fs";
import path from "node:path";
import { API_TABAN, basliklar, yazarUrn, LinkedInHatasi } from "./client";

/**
 * Videos API — üç adımlı yükleme.
 * 1) initializeUpload → uploadInstructions[] (her biri 4 MB'lık bir parça) + video URN + uploadToken
 * 2) her parçayı kendi uploadUrl'ine PUT et, dönen `etag` başlığını sakla
 * 3) finalizeUpload → parça etag'lerini SIRAYLA gönder
 *
 * Sonra video PROCESSING'den AVAILABLE'a geçene kadar beklenir; post
 * hazır olmayan videoyla açılırsa MEDIA_ASSET_WAITING_UPLOAD hatası döner.
 *
 * LinkedIn sınırları: MP4 · 3 sn – 30 dk · 75 KB – 500 MB.
 */

type BaslatmaYaniti = {
  value: {
    video: string;
    uploadToken: string;
    uploadUrlsExpireAt: number;
    uploadInstructions: { uploadUrl: string; firstByte: number; lastByte: number }[];
  };
};

const EN_KUCUK = 75 * 1024;
const EN_BUYUK = 500 * 1024 * 1024;

/**
 * Yerel bir MP4'ü LinkedIn'e yükler ve `urn:li:video:...` döndürür.
 * @param yerelYol public/ altındaki yol (ör. "/haberler/xxx.mp4")
 */
export async function videoYukle(yerelYol: string): Promise<string> {
  if (path.extname(yerelYol).toLowerCase() !== ".mp4") {
    throw new Error(`LinkedIn yalnızca MP4 kabul ediyor, gelen: ${yerelYol}`);
  }

  const tamYol = path.join(process.cwd(), "public", yerelYol.replace(/^\//, ""));
  if (!fs.existsSync(tamYol)) throw new Error(`Video bulunamadı: ${tamYol}`);

  const veri = fs.readFileSync(tamYol);
  if (veri.length < EN_KUCUK) {
    throw new Error(`Video çok küçük (${veri.length} bayt) — LinkedIn alt sınırı 75 KB.`);
  }
  if (veri.length > EN_BUYUK) {
    throw new Error(`Video çok büyük (${Math.round(veri.length / 1024 / 1024)} MB) — sınır 500 MB.`);
  }

  // 1) Yüklemeyi başlat
  const baslat = await fetch(`${API_TABAN}/videos?action=initializeUpload`, {
    method: "POST",
    headers: await basliklar({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      initializeUploadRequest: {
        // Sahip postun yazarıyla aynı olmak zorunda.
        owner: await yazarUrn(),
        fileSizeBytes: veri.length,
        uploadCaptions: false,
        uploadThumbnail: false,
      },
    }),
  });

  if (!baslat.ok) {
    throw new LinkedInHatasi(baslat.status, await baslat.text(), "video yükleme başlatma");
  }

  const { value } = (await baslat.json()) as BaslatmaYaniti;
  const parcalar = value.uploadInstructions;
  console.log(`  · ${parcalar.length} parça halinde yüklenecek`);

  // 2) Parçaları sırayla yükle, etag'leri topla
  const parcaKimlikleri: string[] = [];
  for (const [i, p] of parcalar.entries()) {
    // lastByte dahil (inclusive), Buffer.subarray ise hariç → +1
    const dilim = veri.subarray(p.firstByte, p.lastByte + 1);

    /*
     * DİKKAT: DMS yükleme adresine Authorization göndermek gerekmiyor
     * (belgedeki curl örneğinde yok). Görsel yüklemede gönderiliyor ve
     * kabul ediliyor; video tarafında bazı bölgelerde reddedildiği için
     * önce başlıksız denenip, hata halinde başlıklı tekrar deneniyor.
     */
    let yukle = await fetch(p.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": "application/octet-stream" },
      body: new Uint8Array(dilim),
    });

    if (!yukle.ok) {
      yukle = await fetch(p.uploadUrl, {
        method: "PUT",
        headers: { ...(await basliklar()), "Content-Type": "application/octet-stream" },
        body: new Uint8Array(dilim),
      });
    }

    if (!yukle.ok) {
      throw new LinkedInHatasi(yukle.status, await yukle.text(), `video parça ${i + 1} yükleme`);
    }

    const etag = yukle.headers.get("etag");
    if (!etag) {
      throw new Error(
        `Parça ${i + 1} yüklendi ama etag başlığı gelmedi — finalizeUpload yapılamaz.`,
      );
    }
    // etag tırnak içinde gelebiliyor; finalize tırnaksız bekliyor.
    parcaKimlikleri.push(etag.replace(/^"|"$/g, ""));
    console.log(`  · parça ${i + 1}/${parcalar.length} yüklendi`);
  }

  // 3) Tamamla
  const bitir = await fetch(`${API_TABAN}/videos?action=finalizeUpload`, {
    method: "POST",
    headers: await basliklar({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      finalizeUploadRequest: {
        video: value.video,
        uploadToken: value.uploadToken,
        uploadedPartIds: parcaKimlikleri,
      },
    }),
  });

  if (!bitir.ok) {
    throw new LinkedInHatasi(bitir.status, await bitir.text(), "video yükleme tamamlama");
  }

  return value.video;
}

/** Video işleme durumu. AVAILABLE olmadan post açılırsa LinkedIn 400 döner. */
export async function videoDurumu(videoUrn: string): Promise<string> {
  const yanit = await fetch(`${API_TABAN}/videos/${encodeURIComponent(videoUrn)}`, {
    headers: await basliklar(),
  });
  if (!yanit.ok) return "BİLİNMİYOR";
  const veri = (await yanit.json()) as { status?: string; processingFailureReason?: string };
  if (veri.status === "PROCESSING_FAILED") {
    throw new Error(`Video işleme başarısız: ${veri.processingFailureReason ?? "sebep verilmedi"}`);
  }
  return veri.status ?? "BİLİNMİYOR";
}

/** Video AVAILABLE olana kadar bekler. */
export async function videoyuBekle(videoUrn: string, azamiSaniye = 300): Promise<void> {
  const bitis = Date.now() + azamiSaniye * 1000;
  let tur = 0;
  while (Date.now() < bitis) {
    const durum = await videoDurumu(videoUrn);
    if (durum === "AVAILABLE") {
      console.log(`\r  ✓ video işlendi (AVAILABLE)                    `);
      return;
    }
    tur++;
    process.stdout.write(`\r  … işleniyor: ${durum} (${tur * 5} sn)`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error(
    `Video ${azamiSaniye} saniyede AVAILABLE olmadı: ${videoUrn}\n` +
      `  Post ATILMADI — güvenli durum. Biraz sonra tekrar deneyin.`,
  );
}
