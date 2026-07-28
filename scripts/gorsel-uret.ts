/**
 * Haber görseli üretici — 1200x630 JPEG.
 *
 *   npm run gorsel <slug> "Başlık" "Kategori"
 *
 * Neden JPEG ve neden bu boyut: LinkedIn Images API SVG kabul etmiyor ve
 * 1200x630 hem OG hem LinkedIn kartı için doğru oran.
 *
 * Gerçek fotoğraf kullanacaksan bu scripti kullanma — lisansı uygun bir
 * görseli public/haberler/<slug>.jpg olarak elle koy (editoryal ilkeler md. 1).
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PALET: Record<string, { zemin1: string; zemin2: string; vurgu: string }> = {
  "Uygulama Örnekleri": { zemin1: "#0b3b39", zemin2: "#1e3d34", vurgu: "#8fb03f" },
  "Öncü İşletmeler": { zemin1: "#14615c", zemin2: "#1e3d34", vurgu: "#8fb03f" },
  "Mevzuat ve Sertifikasyon": { zemin1: "#1e3d34", zemin2: "#2c5648", vurgu: "#c0663a" },
  "Veri ve Rapor": { zemin1: "#a5522f", zemin2: "#c0663a", vurgu: "#f4eee5" },
};
const VARSAYILAN = { zemin1: "#0b3b39", zemin2: "#1e3d34", vurgu: "#8fb03f" };

/** XML'de anlam taşıyan karakterleri kaçır — başlıkta & veya < olabilir. */
function kacir(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Başlığı satırlara böler — SVG'de otomatik sarma yok. */
function satirla(metin: string, azamiKarakter = 26, azamiSatir = 4): string[] {
  const kelimeler = metin.split(/\s+/);
  const satirlar: string[] = [];
  let s = "";
  for (const k of kelimeler) {
    if ((s + " " + k).trim().length <= azamiKarakter) {
      s = (s + " " + k).trim();
    } else {
      if (s) satirlar.push(s);
      s = k;
    }
  }
  if (s) satirlar.push(s);
  if (satirlar.length > azamiSatir) {
    const kirpik = satirlar.slice(0, azamiSatir);
    kirpik[azamiSatir - 1] = kirpik[azamiSatir - 1].replace(/[,.;:]?$/, "…");
    return kirpik;
  }
  return satirlar;
}

async function main() {
  const [slug, baslik, kategori] = process.argv.slice(2);
  if (!slug || !baslik) {
    console.error('\nKullanım: npm run gorsel <slug> "Başlık" "Kategori"\n');
    process.exit(1);
  }

  const p = PALET[kategori ?? ""] ?? VARSAYILAN;
  const satirlar = satirla(baslik);
  const satirYuksek = 62;
  const baslangicY = 330 - ((satirlar.length - 1) * satirYuksek) / 2;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${p.zemin1}"/>
      <stop offset="100%" stop-color="${p.zemin2}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>

  <!-- ızgara çizgileri: sayfanın imzası -->
  ${[200, 400, 600, 800, 1000]
    .map((x) => `<line x1="${x}" y1="0" x2="${x}" y2="630" stroke="#f4eee5" stroke-opacity="0.07"/>`)
    .join("\n  ")}
  <circle cx="1040" cy="110" r="210" fill="${p.vurgu}" opacity="0.12"/>

  <text x="80" y="96" font-family="Helvetica,Arial,sans-serif" font-size="19"
        letter-spacing="3" fill="${p.vurgu}">${kacir((kategori ?? "HABER").toLocaleUpperCase("tr-TR"))}</text>

  ${satirlar
    .map(
      (s, i) =>
        `<text x="80" y="${baslangicY + i * satirYuksek}" font-family="Georgia,'Times New Roman',serif" font-size="54" font-weight="700" fill="#f4eee5">${kacir(s)}</text>`,
    )
    .join("\n  ")}

  <rect x="80" y="500" width="92" height="5" fill="${p.vurgu}"/>
  <text x="80" y="556" font-family="Helvetica,Arial,sans-serif" font-size="21"
        letter-spacing="1" fill="#f4eee5" fill-opacity="0.72">Sürdürülebilir Turizm</text>
</svg>`;

  const hedefDizin = path.join(process.cwd(), "public", "haberler");
  fs.mkdirSync(hedefDizin, { recursive: true });
  const hedef = path.join(hedefDizin, `${slug}.jpg`);

  await sharp(Buffer.from(svg, "utf8")).jpeg({ quality: 88 }).toFile(hedef);

  const kb = Math.round(fs.statSync(hedef).size / 1024);
  console.log(`\n✓ ${path.relative(process.cwd(), hedef)}  (1200x630, ${kb} KB)`);
  console.log(`  frontmatter: gorsel: "/haberler/${slug}.jpg"\n`);
}

main().catch((e) => {
  console.error(`\n✗ ${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
