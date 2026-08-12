/**
 * Haber videosu — LinkedIn için 1080x1080 MP4.
 *
 *   npm run video <slug>
 *   npm run video <slug> -- --sure 14      # toplam saniye
 *
 * MİMARİ KARARI: video AI ile ÜRETİLMİYOR, DERLENİYOR.
 *
 * Görüntü modelleri Türkçe metni bozuyor (ğ ş ı İ) ve bir haber videosunda
 * ekrandaki her sayı doğrulanmış olmak zorunda. Bu yüzden hareketli görüntü
 * haberin kendi fotoğrafından (yavaş kaydırma) üretiliyor, yazılar ise SVG
 * olarak biz basıyoruz. Sonuç: kusursuz Türkçe + haberde ne yazıyorsa o.
 *
 * Kareler sharp ile üretilip ffmpeg (ffmpeg-static) ile H.264'e kodlanıyor.
 * Sessiz bir AAC izi ekleniyor — LinkedIn ses izi olmayan dosyalarda
 * bazen sorun çıkarıyor.
 */
import { config as ortamYukle } from "dotenv";
// .env.local Next.js sözleşmesidir; dotenv varsayılan olarak yalnızca .env okur.
ortamYukle({ path: ".env.local" });
ortamYukle();
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";
import sharp from "sharp";
import ffmpegYolu from "ffmpeg-static";

const BOYUT = 1080;
const FPS = 25;

const KREM = "#f4eee5";
const TERRA = "#c0663a";
const YOSUN = "#8fb03f";
const CAM = "#0d211c";
const SERIF = "Georgia,'Times New Roman',serif";
const MONO = "Menlo,Monaco,'Courier New',monospace";

const VURGU: Record<string, string> = {
  "Uygulama Örnekleri": YOSUN,
  "Öncü İşletmeler": TERRA,
  "Mevzuat ve Sertifikasyon": TERRA,
  "Veri ve Rapor": YOSUN,
};

function bayrakDegeri(ad: string): string | undefined {
  const i = process.argv.indexOf(`--${ad}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

function kacis(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Kaba satır kırma. sharp SVG'de metin ölçemediğimiz için karakter
 * genişliği punto üzerinden tahmin ediliyor; serifte ~0,50, monoda ~0,60.
 */
function satirlaraBol(metin: string, punto: number, genislik: number, oran = 0.5): string[] {
  const azami = Math.max(8, Math.floor(genislik / (punto * oran)));
  const kelimeler = metin.split(/\s+/);
  const satirlar: string[] = [];
  let mevcut = "";
  for (const k of kelimeler) {
    const aday = mevcut ? `${mevcut} ${k}` : k;
    if (aday.length > azami && mevcut) {
      satirlar.push(mevcut);
      mevcut = k;
    } else {
      mevcut = aday;
    }
  }
  if (mevcut) satirlar.push(mevcut);
  return satirlar;
}

function svgKare(icerik: string): Buffer {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${BOYUT}" height="${BOYUT}">${icerik}</svg>`,
    "utf8",
  );
}

/** Çam zemin — tüm yazı kartlarının altlığı. */
async function camZemin(): Promise<Buffer> {
  return sharp({
    create: { width: BOYUT, height: BOYUT, channels: 4, background: CAM },
  })
    .png()
    .toBuffer();
}

/** Bir katmanı kısmi saydamlıkla döndürür (dest-in maskesi). */
async function saydam(kare: Buffer, opaklik: number): Promise<Buffer> {
  if (opaklik >= 1) return kare;
  const maske = await sharp({
    create: {
      width: BOYUT,
      height: BOYUT,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: Math.max(0, opaklik) },
    },
  })
    .png()
    .toBuffer();
  return sharp(kare)
    .ensureAlpha()
    .composite([{ input: maske, blend: "dest-in" }])
    .png()
    .toBuffer();
}

/** Marka altlığı — her kartın altındaki çizgi ve yazı markası. */
function markaAyagi(vurgu: string): string {
  return `
  <rect x="72" y="${BOYUT - 132}" width="86" height="5" fill="${vurgu}"/>
  <text x="72" y="${BOYUT - 86}" font-family="${MONO}" font-size="19" letter-spacing="3"
        fill="${KREM}" fill-opacity="0.92">SÜRDÜRÜLEBİLİR TURİZM</text>`;
}

/** 1. sahne — başlık kartı. */
async function baslikKarti(kategori: string, baslik: string, vurgu: string): Promise<Buffer> {
  const satirlar = satirlaraBol(baslik, 62, BOYUT - 160, 0.5);
  const basY = 400 - (satirlar.length - 1) * 39;
  const metin = satirlar
    .map(
      (s, i) =>
        `<text x="72" y="${basY + i * 78}" font-family="${SERIF}" font-size="62"
               fill="${KREM}">${kacis(s)}</text>`,
    )
    .join("");

  return sharp(await camZemin())
    .composite([
      {
        input: svgKare(`
        <rect x="72" y="148" width="7" height="28" fill="${vurgu}"/>
        <text x="94" y="170" font-family="${MONO}" font-size="19" letter-spacing="3.6"
              fill="${KREM}">${kacis(kategori.toLocaleUpperCase("tr-TR"))}</text>
        ${metin}
        ${markaAyagi(vurgu)}`),
      },
    ])
    .png()
    .toBuffer();
}

/** 3. sahne — tarih şeridi. */
async function tarihKarti(
  ustBaslik: string,
  maddeler: { tarih: string; metin: string }[],
  vurgu: string,
): Promise<Buffer> {
  let y = 330;
  const parcalar: string[] = [];
  for (const m of maddeler) {
    parcalar.push(
      `<text x="72" y="${y}" font-family="${MONO}" font-size="34" letter-spacing="1.5"
             fill="${vurgu}">${kacis(m.tarih)}</text>`,
    );
    const satirlar = satirlaraBol(m.metin, 40, BOYUT - 160, 0.5);
    satirlar.forEach((s, i) => {
      parcalar.push(
        `<text x="72" y="${y + 52 + i * 50}" font-family="${SERIF}" font-size="40"
               fill="${KREM}">${kacis(s)}</text>`,
      );
    });
    y += 62 + satirlar.length * 50 + 34;
  }

  return sharp(await camZemin())
    .composite([
      {
        input: svgKare(`
        <rect x="72" y="148" width="7" height="28" fill="${vurgu}"/>
        <text x="94" y="170" font-family="${MONO}" font-size="19" letter-spacing="3.6"
              fill="${KREM}">${kacis(ustBaslik.toLocaleUpperCase("tr-TR"))}</text>
        ${parcalar.join("")}
        ${markaAyagi(vurgu)}`),
      },
    ])
    .png()
    .toBuffer();
}

/** 4. sahne — kapanış kartı. */
async function kapanisKarti(satir: string, adres: string, vurgu: string): Promise<Buffer> {
  const satirlar = satirlaraBol(satir, 54, BOYUT - 160, 0.5);
  const basY = 440 - (satirlar.length - 1) * 34;
  const metin = satirlar
    .map(
      (s, i) =>
        `<text x="72" y="${basY + i * 68}" font-family="${SERIF}" font-size="54"
               fill="${KREM}">${kacis(s)}</text>`,
    )
    .join("");

  return sharp(await camZemin())
    .composite([
      {
        input: svgKare(`
        ${metin}
        <rect x="72" y="${basY + satirlar.length * 68 + 12}" width="120" height="4" fill="${vurgu}"/>
        <text x="72" y="${basY + satirlar.length * 68 + 84}" font-family="${MONO}"
              font-size="30" fill="${vurgu}">${kacis(adres)}</text>
        ${markaAyagi(vurgu)}`),
      },
    ])
    .png()
    .toBuffer();
}

/** 2. sahne — fotoğraf üzerinde yavaş kaydırma + alt yazı. */
async function fotografKaresi(
  buyukFoto: Buffer,
  buyukEn: number,
  buyukBoy: number,
  ilerleme: number,
  altYaziKatmani: Buffer,
): Promise<Buffer> {
  // Yavaş içeri kaydırma: kırpma penceresi %100'den %86'ya iniyor.
  const olcek = 1 - 0.14 * ilerleme;
  const en = Math.round(buyukEn * olcek);
  const boy = Math.round(buyukBoy * olcek);
  const sol = Math.round((buyukEn - en) / 2);
  // Dikeyde hafif yukarı kayış — rafın üstündeki boşluğu toplar.
  const ust = Math.round((buyukBoy - boy) * (0.35 + 0.3 * ilerleme));

  const kirpik = await sharp(buyukFoto)
    .extract({ left: sol, top: ust, width: en, height: boy })
    .resize(BOYUT, BOYUT, { fit: "cover" })
    .toBuffer();

  return sharp(kirpik).composite([{ input: altYaziKatmani }]).png().toBuffer();
}

async function main() {
  const slug = process.argv.slice(2).find((a) => !a.startsWith("--"));
  if (!slug) {
    console.error("\nKullanım: npm run video <slug> [-- --sure 14]\n");
    process.exit(1);
  }
  if (!ffmpegYolu) {
    console.error("\n✗ ffmpeg-static ikilisi bulunamadı. npm install ile kurun.\n");
    process.exit(1);
  }

  const mdxYolu = path.join(process.cwd(), "content", "haberler", `${slug}.mdx`);
  if (!fs.existsSync(mdxYolu)) {
    console.error(`\n✗ Haber bulunamadı: ${mdxYolu}\n`);
    process.exit(1);
  }
  const on = matter(fs.readFileSync(mdxYolu, "utf8")).data as Record<string, string>;
  const kategori = String(on.kategori ?? "Haber");
  const vurgu = VURGU[kategori] ?? YOSUN;

  // Fotoğrafın markasız hali varsa onu kullan — 2:1 marka katmanı kareye uymuyor.
  const hamYol = path.join(process.cwd(), "public", "haberler", ".ham", `${slug}.png`);
  const kapakYol = path.join(process.cwd(), "public", String(on.gorsel).replace(/^\//, ""));
  const fotoKaynak = fs.existsSync(hamYol) ? hamYol : kapakYol;
  if (!fs.existsSync(fotoKaynak)) {
    console.error(`\n✗ Görsel bulunamadı: ${fotoKaynak}\n  Önce npm run gorsel:ai çalıştırın.\n`);
    process.exit(1);
  }

  const toplamSure = Number(bayrakDegeri("sure") ?? 14);
  const toplamKare = Math.round(toplamSure * FPS);
  const gecis = Math.round(0.4 * FPS);

  // Sahne sınırları (kare cinsinden)
  const s1 = Math.round(3.2 * FPS);
  const s2 = Math.round(8.2 * FPS);
  const s3 = Math.round(11.6 * FPS);

  console.log(`\n══ Haber videosu: ${slug} ══`);
  console.log(`  kategori : ${kategori}`);
  console.log(`  fotoğraf : ${path.relative(process.cwd(), fotoKaynak)}`);
  console.log(`  biçim    : ${BOYUT}x${BOYUT} · ${FPS} fps · ${toplamSure} sn`);

  // ---- sahneleri hazırla ----
  /*
   * Kartta site başlığı değil, varsa videoBaslik kullanılıyor. Haber başlığı
   * arama için yazılıyor ve uzun oluyor; kare kartta 5 satıra taşıp
   * okunmuyor. Ayrıca "dün" gibi göreli zaman ifadeleri videoda yaşlanıyor.
   */
  const kartBasligi = String(on.videoBaslik ?? on.baslik).replace(/\s+/g, " ");
  if (!on.videoBaslik && kartBasligi.length > 90) {
    console.log(`  ⚠ başlık uzun (${kartBasligi.length} krkt) — frontmatter'a videoBaslik ekleyin`);
  }
  const kart1 = await baslikKarti(kategori, kartBasligi, vurgu);

  const kart3 = await tarihKarti(
    "Takvim",
    [
      { tarih: "12 ŞUBAT 2027", metin: "Paket serviste “kendi kabını getir” zorunlu" },
      { tarih: "12 AĞUSTOS 2028", metin: "Ambalaj üzerinde ayrıştırma etiketi zorunlu" },
      { tarih: "1 OCAK 2030", metin: "Ek V biçimleri yasak — otel banyosu dahil" },
    ],
    vurgu,
  );

  /*
   * Adres TAHMİN EDİLMEZ. Kapanış karesindeki alan adı yanlış olursa video
   * okuru var olmayan bir siteye gönderir; sessiz varsayılan bu hatayı
   * fark edilmez kılar. Yoksa üretim durur.
   */
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    console.error(
      "\n✗ NEXT_PUBLIC_SITE_URL eksik — kapanış karesine yazılacak adres bilinmiyor.\n" +
        "  .env.local dosyasına ekleyin.\n",
    );
    process.exit(1);
  }
  const siteAdresi = siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const kart4 = await kapanisKarti("Türkiye açısı ve kaynak künyesi sitede.", siteAdresi, vurgu);

  // Fotoğraf sahnesi için büyük altlık (kırpma payı bırakacak kadar)
  const buyukEn = Math.round(BOYUT * 1.6);
  const buyukBoy = Math.round(BOYUT * 1.6);
  /*
   * Kırpma konumu bayrakla verilebiliyor. "attention" 2:1 bir kareyi kareye
   * indirirken kontrastı yüksek ama konuyla ilgisiz bölgeyi seçebiliyor
   * (ilk denemede bulanık kat görevlisi arabasını seçti, şişeleri değil).
   */
  const konum = bayrakDegeri("konum") ?? "east";
  const buyukFoto = await sharp(fotoKaynak)
    .resize(buyukEn, buyukBoy, { fit: "cover", position: konum })
    .modulate({ saturation: 0.72, brightness: 1.03 })
    .toBuffer();

  const altYazi = svgKare(`
    <defs>
      <linearGradient id="alt" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0%" stop-color="#081713" stop-opacity="0.92"/>
        <stop offset="50%" stop-color="#081713" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#081713" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <rect y="${BOYUT - 430}" width="${BOYUT}" height="430" fill="url(#alt)"/>
    <rect x="72" y="${BOYUT - 300}" width="7" height="28" fill="${vurgu}"/>
    <text x="94" y="${BOYUT - 278}" font-family="${MONO}" font-size="19" letter-spacing="3"
          fill="${KREM}">TÜZÜK (AB) 2025/40</text>
    <text x="72" y="${BOYUT - 205}" font-family="${SERIF}" font-size="46" fill="${KREM}">
      12 Ağustos 2026’dan itibaren</text>
    <text x="72" y="${BOYUT - 150}" font-family="${SERIF}" font-size="46" fill="${KREM}">
      AB’de doğrudan uygulanıyor.</text>
    ${markaAyagi(vurgu)}`);

  // ---- kareleri yaz ----
  const gecici = fs.mkdtempSync(path.join(os.tmpdir(), "st-video-"));
  const zemin = await camZemin();
  console.log(`\n  kareler üretiliyor (${toplamKare})…`);

  // Aynı görüntüyü tekrar tekrar üretmemek için önbellek
  const onbellek = new Map<string, Buffer>();
  const tamKare = async (anahtar: string, uret: () => Promise<Buffer>) => {
    const v = onbellek.get(anahtar);
    if (v) return v;
    const y = await uret();
    onbellek.set(anahtar, y);
    return y;
  };

  for (let k = 0; k < toplamKare; k++) {
    let govde: Buffer;
    let opaklik = 1;

    if (k < s1) {
      govde = await tamKare("k1", async () => kart1);
      if (k < gecis) opaklik = k / gecis;
      else if (k > s1 - gecis) opaklik = (s1 - k) / gecis;
    } else if (k < s2) {
      const ilerleme = (k - s1) / (s2 - s1);
      govde = await fotografKaresi(buyukFoto, buyukEn, buyukBoy, ilerleme, altYazi);
      if (k - s1 < gecis) opaklik = (k - s1) / gecis;
      else if (s2 - k < gecis) opaklik = (s2 - k) / gecis;
    } else if (k < s3) {
      govde = await tamKare("k3", async () => kart3);
      if (k - s2 < gecis) opaklik = (k - s2) / gecis;
      else if (s3 - k < gecis) opaklik = (s3 - k) / gecis;
    } else {
      govde = await tamKare("k4", async () => kart4);
      if (k - s3 < gecis) opaklik = (k - s3) / gecis;
      else if (toplamKare - k < gecis) opaklik = (toplamKare - k) / gecis;
    }

    const kare =
      opaklik >= 1
        ? govde
        : await sharp(zemin)
            .composite([{ input: await saydam(govde, opaklik) }])
            .png()
            .toBuffer();

    await sharp(kare)
      .jpeg({ quality: 94, mozjpeg: true })
      .toFile(path.join(gecici, `f${String(k).padStart(5, "0")}.jpg`));

    if (k % 50 === 0) process.stdout.write(`\r  … ${k}/${toplamKare}`);
  }
  console.log(`\r  ✓ ${toplamKare} kare hazır            `);

  // ---- kodla ----
  const hedef = path.join(process.cwd(), "public", "haberler", `${slug}.mp4`);
  console.log("  ffmpeg ile kodlanıyor…");
  execFileSync(
    ffmpegYolu,
    [
      "-y",
      "-hide_banner",
      "-loglevel", "error",
      "-framerate", String(FPS),
      "-i", path.join(gecici, "f%05d.jpg"),
      // Sessiz ses izi — LinkedIn ses izi olmayan dosyada bazen takılıyor.
      "-f", "lavfi",
      "-i", "anullsrc=channel_layout=stereo:sample_rate=44100",
      "-c:v", "libx264",
      "-preset", "medium",
      "-crf", "20",
      "-pix_fmt", "yuv420p",
      "-profile:v", "high",
      "-c:a", "aac",
      "-b:a", "96k",
      "-shortest",
      "-movflags", "+faststart",
      hedef,
    ],
    { stdio: "inherit" },
  );

  fs.rmSync(gecici, { recursive: true, force: true });

  const mb = (fs.statSync(hedef).size / 1024 / 1024).toFixed(1);
  console.log(`\n✓ ${path.relative(process.cwd(), hedef)}  (${BOYUT}x${BOYUT}, ${mb} MB)`);
  console.log(`  frontmatter: linkedinBicim: video\n`);
}

main().catch((e) => {
  console.error(`\n✗ ${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
