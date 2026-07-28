/**
 * AI haber görseli — kie.ai / GPT Image 2.
 *
 *   npm run gorsel:ai <slug> "Kategori" "görsel tarifi"
 *   npm run gorsel:ai <slug> "Kategori" "tarif" -- --stil foto
 *   npm run gorsel:ai <slug> "Kategori" "tarif" -- --sadece-ham   # marka katmanı ekleme
 *
 * MİMARİ KARARI: AI'ya yazı yazdırmıyoruz.
 * Görüntü modelleri metinde hata yapar (özellikle Türkçe ğ ş ı İ). Bu yüzden
 * istem açıkça "yazısız" diyor; kategori etiketi, marka çizgisi ve yazı markası
 * sonradan vektör olarak bindiriliyor. Zengin görsel + kusursuz Türkçe.
 *
 * ⚠ Her çalıştırma kie.ai bakiyenizden düşer. Yayın scriptine bilerek
 * bağlanmadı — görsel üretimi ayrı ve bilinçli bir adım.
 */
import fs from "node:fs";
import path from "node:path";
import { config as ortamYukle } from "dotenv";
import sharp from "sharp";

ortamYukle({ path: ".env.local" });
ortamYukle();

const TABAN = "https://api.kie.ai/api/v1/jobs";
const MODEL = "gpt-image-2-text-to-image";

const KREM = "#f4eee5";
const TERRA = "#c0663a";
const YOSUN = "#8fb03f";
const MONO = "Menlo,Monaco,'Courier New',monospace";

/** Kategoriye göre vurgu rengi — vektör katmanında kullanılıyor. */
const VURGU: Record<string, string> = {
  "Uygulama Örnekleri": YOSUN,
  "Öncü İşletmeler": TERRA,
  "Mevzuat ve Sertifikasyon": TERRA,
  "Veri ve Rapor": YOSUN,
};

const STILLER = {
  cizim:
    "editorial vector illustration, flat shapes, limited palette of deep pine green, " +
    "sage green, warm cream and terracotta, clean geometric composition, generous negative " +
    "space on the left third, subtle paper grain, calm and documentary in tone",
  foto:
    "documentary editorial photograph, natural daylight, muted earthy colour grading with " +
    "deep green and terracotta tones, real place and real people at work, no posed models, " +
    "shallow depth of field, generous negative space on the left third",
} as const;

function anahtar(): string {
  const k = process.env.KIE_API_KEY;
  if (!k) {
    console.error(
      "\n✗ KIE_API_KEY eksik.\n" +
        "  .env.local dosyasına ekleyin (sohbete yazmayın):\n\n" +
        `  cd 04-site && python3 -c '\n` +
        `import pathlib, getpass\n` +
        `p = pathlib.Path(".env.local")\n` +
        `k = getpass.getpass("KIE_API_KEY: ").strip()\n` +
        `p.write_text(p.read_text().rstrip() + "\\nKIE_API_KEY=" + k + "\\n")'\n`,
    );
    process.exit(1);
  }
  return k;
}

function bayrakDegeri(ad: string): string | undefined {
  const i = process.argv.indexOf(`--${ad}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

async function gorevOlustur(istem: string): Promise<string> {
  const yanit = await fetch(`${TABAN}/createTask`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${anahtar()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      // 2:1 → 1200x630'a en yakın desteklenen oran (2.0 vs 1.905), az kırpma yeter.
      // 2K denendi: iki kez 500 döndü ve belirgin yavaştı. 1K yeterli —
      // hedef zaten 1200 px genişlik, ölçek farkı küçük.
      input: {
        prompt: istem,
        aspect_ratio: bayrakDegeri("oran") ?? "2:1",
        resolution: bayrakDegeri("cozunurluk") ?? "1K",
      },
    }),
  });

  const veri = (await yanit.json()) as { code: number; msg: string; data?: { taskId: string } };
  if (veri.code !== 200 || !veri.data?.taskId) {
    const ipucu =
      veri.code === 401
        ? " → API anahtarı geçersiz"
        : veri.code === 402
          ? " → kie.ai bakiyeniz yetersiz"
          : veri.code === 429
            ? " → hız sınırı, biraz bekleyin"
            : "";
    throw new Error(`Görev oluşturulamadı (${veri.code}): ${veri.msg}${ipucu}`);
  }
  return veri.data.taskId;
}

async function sonucuBekle(taskId: string, azamiSaniye = 300): Promise<string> {
  const bitis = Date.now() + azamiSaniye * 1000;
  let tur = 0;

  while (Date.now() < bitis) {
    tur++;
    const yanit = await fetch(`${TABAN}/recordInfo?taskId=${encodeURIComponent(taskId)}`, {
      headers: { Authorization: `Bearer ${anahtar()}` },
    });
    const veri = (await yanit.json()) as {
      code: number;
      data?: { state: string; resultJson?: string; failMsg?: string; failCode?: string };
    };

    const d = veri.data;
    if (d?.state === "success") {
      const sonuc = JSON.parse(d.resultJson ?? "{}") as { resultUrls?: string[] };
      const url = sonuc.resultUrls?.[0];
      if (!url) throw new Error("Görev başarılı ama resultUrls boş.");
      return url;
    }
    if (d?.state === "fail") {
      throw new Error(`Üretim başarısız (${d.failCode ?? "?"}): ${d.failMsg ?? "sebep yok"}`);
    }

    process.stdout.write(`\r  … üretiliyor (${tur * 5} sn)`);
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error(`${azamiSaniye} saniyede tamamlanmadı. taskId: ${taskId}`);
}

/** Marka katmanı — kategori etiketi, çizgi, yazı markası. Türkçe burada üretiliyor. */
function markaKatmani(kategori: string, vurgu: string): Buffer {
  /*
   * Perdeler cömert: AI görselinin ne çıkacağı önceden bilinmiyor. İlk denemede
   * kategori etiketi açık gökyüzünün üstüne denk geldi ve okunmadı. Sol taraf
   * boyunca dikey bir perde eklendi — yazılar hep sola hizalı olduğu için
   * görsel ne olursa olsun kontrast garanti.
   */
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="solPerde" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#081713" stop-opacity="0.72"/>
      <stop offset="55%" stop-color="#081713" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#081713" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="altPerde" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%" stop-color="#081713" stop-opacity="0.80"/>
      <stop offset="45%" stop-color="#081713" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="#081713" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="ustPerde" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#081713" stop-opacity="0.68"/>
      <stop offset="100%" stop-color="#081713" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="620" height="630" fill="url(#solPerde)"/>
  <rect y="360" width="1200" height="270" fill="url(#altPerde)"/>
  <rect width="1200" height="170" fill="url(#ustPerde)"/>

  <rect x="64" y="56" width="7" height="26" fill="${vurgu}"/>
  <text x="84" y="76" font-family="${MONO}" font-size="17" letter-spacing="3.4"
        fill="${KREM}">${kategori.toLocaleUpperCase("tr-TR").replace(/&/g, "&amp;")}</text>

  <rect x="64" y="514" width="86" height="5" fill="${vurgu}"/>
  <text x="64" y="564" font-family="${MONO}" font-size="15" letter-spacing="2.6"
        fill="${KREM}" fill-opacity="0.92">SÜRDÜRÜLEBİLİR TURİZM</text>
</svg>`;
  return Buffer.from(svg, "utf8");
}

async function main() {
  const argv = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const [slug, kategori, tarif] = argv;
  const stilAdi = (bayrakDegeri("stil") ?? "cizim") as keyof typeof STILLER;
  const sadeceHam = process.argv.includes("--sadece-ham");

  if (!slug || !tarif) {
    console.error(
      '\nKullanım: npm run gorsel:ai <slug> "Kategori" "görsel tarifi" [-- --stil foto]\n' +
        '\nÖrnek:\n  npm run gorsel:ai gri-su "Uygulama Örnekleri" \\\n' +
        '    "a hotel rooftop with a greywater recycling tank and pipes, Mediterranean coast"\n',
    );
    process.exit(1);
  }
  if (!STILLER[stilAdi]) {
    console.error(`\n✗ Bilinmeyen stil: ${stilAdi}. Seçenekler: ${Object.keys(STILLER).join(", ")}\n`);
    process.exit(1);
  }

  const istem =
    `${tarif}. ${STILLER[stilAdi]}. ` +
    // Yazı yasağı — metin hatası riskini kökten kaldırıyor
    "ABSOLUTELY NO text, no words, no letters, no numbers, no captions, no watermark, " +
    "no logo, no signage, no labels of any kind anywhere in the image.";

  const dizin = path.join(process.cwd(), "public", "haberler");
  const hamDizin = path.join(dizin, ".ham");
  fs.mkdirSync(hamDizin, { recursive: true });
  const hamYol = path.join(hamDizin, `${slug}.png`);
  const hedef = path.join(dizin, `${slug}.jpg`);

  const oran = bayrakDegeri("oran") ?? "2:1";
  const cozunurluk = bayrakDegeri("cozunurluk") ?? "1K";

  let ham: Buffer;

  /*
   * --kapla: ham görsel diskte varsa API'ye hiç gitmez, sadece marka katmanını
   * yeniden basar. Perde/etiket ayarı denerken her seferinde kredi yakmamak için.
   */
  if (process.argv.includes("--kapla")) {
    if (!fs.existsSync(hamYol)) {
      console.error(`\n✗ Ham görsel yok: ${hamYol}\n  Önce --kapla olmadan bir kez üretin.\n`);
      process.exit(1);
    }
    ham = fs.readFileSync(hamYol);
    console.log(`\n══ Yeniden kaplama: ${slug} ══`);
    console.log(`  ham görsel diskten okundu — API çağrısı yok, ücret yok\n`);
  } else {
    console.log(`\n══ AI görsel: ${slug} ══`);
    console.log(`  kategori : ${kategori ?? "—"}`);
    console.log(`  stil     : ${stilAdi}`);
    console.log(`  model    : ${MODEL} · ${oran} · ${cozunurluk}`);
    console.log(`  ⚠ bu çalıştırma kie.ai bakiyenizden düşer\n`);

    const taskId = await gorevOlustur(istem);
    console.log(`  görev    : ${taskId}`);

    const url = await sonucuBekle(taskId);
    console.log(`\r  ✓ üretildi                         `);

    ham = Buffer.from(await (await fetch(url)).arrayBuffer());
    fs.writeFileSync(hamYol, ham);
    console.log(`  ham kopya: ${path.relative(process.cwd(), hamYol)} (yeniden kaplama için)`);
  }

  const taban = sharp(ham).resize(1200, 630, { fit: "cover", position: "attention" });

  if (sadeceHam) {
    await taban.jpeg({ quality: 88, mozjpeg: true }).toFile(hedef);
  } else {
    const tabanBuf = await taban.toBuffer();
    await sharp(tabanBuf)
      .composite([{ input: markaKatmani(kategori ?? "HABER", VURGU[kategori ?? ""] ?? YOSUN) }])
      .jpeg({ quality: 88, mozjpeg: true })
      .toFile(hedef);
  }

  const kb = Math.round(fs.statSync(hedef).size / 1024);
  console.log(`\n✓ ${path.relative(process.cwd(), hedef)}  (1200x630, ${kb} KB)`);
  console.log(`  frontmatter: gorsel: "/haberler/${slug}.jpg"\n`);
}

main().catch((e) => {
  console.error(`\n✗ ${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
