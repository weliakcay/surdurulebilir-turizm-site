/**
 * Haber görseli üretici — 1200x630 JPEG.
 *
 *   npm run gorsel <slug> "Başlık" "Kategori"
 *   npm run gorsel <slug> "Başlık" "Kategori" -- --baslikli   # başlığı görsele de bas
 *
 * Görsel hem sitede (haber kapağı + kart) hem OG/LinkedIn küçük resmi olarak kullanılır.
 *
 * Başlık varsayılan olarak görsele BASILMAZ: LinkedIn makale postunda başlık ayrı bir
 * alan olarak gönderiliyor, OG/Twitter'da da meta etiketlerinden geliyor. Görsele de
 * basmak kartlarda başlığı iki kez gösterir. Görselin işi resimlemek.
 *
 * Her kategorinin kendi çizimi ve kendi zemini var — ana sayfada kartlar yan yana
 * geldiğinde renk ritmi oluşsun diye (perde perde renk bloğu dili).
 *
 * Gerçek fotoğraf kullanacaksan bu scripti kullanma; lisansı uygun görseli
 * public/haberler/<slug>.jpg olarak elle koy (editoryal ilkeler md. 1).
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const G = 1200;
const Y = 630;

const KREM = "#f4eee5";
const KUM = "#ece3d6";
const CAM = "#1e3d34";
const ADACAYI = "#7c9a83";
const TERRA = "#c0663a";
const YOSUN = "#8fb03f";

const SER = "Georgia,'Times New Roman',serif";
const MONO = "Menlo,Monaco,'Courier New',monospace";

type Tema = {
  zemin: string;
  cizgi: string; // çizim rengi
  vurgu: string;
  izgara: number; // ızgara çizgisi opaklığı
  /** Kategori etiketi rengi; verilmezse vurgu kullanılır. Düşük kontrastta ezmek için. */
  etiket?: string;
  ciz: (t: Tema) => string;
};

/**
 * Çizimler 560–1100 aralığında kuruluyor (başlık basılacaksa sola yer kalsın diye).
 * Başlık basılmadığında bu kadar sağda durmaları dengesiz görünüyor — ortalıyoruz.
 */
const ORTALA = -220;

const kacir = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ─────────── 01 Uygulama Örnekleri — otel kesiti + su döngüsü ─────────── */
const uygulama = (t: Tema) => `
  <g stroke="${t.cizgi}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M620 470 L620 250 L820 178 L1020 250 L1020 470"/>
    <path d="M672 470 L672 372 L744 372 L744 470"/>
    <rect x="800" y="300" width="70" height="58"/>
    <rect x="906" y="300" width="70" height="58"/>
    <path d="M596 470 L1044 470"/>
  </g>
  <path d="M640 424 C740 402 900 402 1000 424 L1000 452 C900 430 740 430 640 452 Z" fill="${t.vurgu}" opacity="0.92"/>
  <g stroke="${t.vurgu}" stroke-width="3.4" fill="none" stroke-linecap="round">
    <path d="M1076 452 L1076 302"/>
    <path d="M1050 330 L1076 302 L1102 330"/>
    <path d="M566 302 L566 452"/>
    <path d="M540 424 L566 452 L592 424"/>
  </g>`;

/* ─────────── 02 Öncü İşletmeler — bina + sertifika rozeti ─────────── */
const oncu = (t: Tema) => `
  <g stroke="${t.cizgi}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M596 470 L596 268 L760 268 L760 470"/>
    <path d="M760 470 L760 322 L900 322 L900 470"/>
    <path d="M560 470 L1060 470"/>
    <path d="M632 312 L664 312 M632 356 L664 356 M632 400 L664 400
             M700 312 L732 312 M700 356 L732 356 M700 400 L732 400
             M800 366 L832 366 M800 410 L832 410"/>
  </g>
  <circle cx="1000" cy="272" r="74" fill="none" stroke="${t.vurgu}" stroke-width="5"/>
  <circle cx="1000" cy="272" r="56" fill="none" stroke="${t.cizgi}" stroke-width="2" opacity="0.45"/>
  <path d="M968 272 L990 296 L1034 250" stroke="${t.vurgu}" stroke-width="7"
        fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M974 340 L974 400 L1000 380 L1026 400 L1026 340" fill="${t.vurgu}" opacity="0.85"/>`;

/* ─────────── 03 Mevzuat ve Sertifikasyon — belge + damga + zaman çizgisi ─────────── */
const mevzuat = (t: Tema) => `
  <g stroke="${t.cizgi}" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M576 160 L816 160 L872 216 L872 460 L576 460 Z"/>
    <path d="M816 160 L816 216 L872 216"/>
    <path d="M620 268 L828 268 M620 310 L828 310 M620 352 L756 352"/>
  </g>
  <circle cx="960" cy="392" r="64" fill="${t.zemin}" stroke="${t.vurgu}" stroke-width="5"/>
  <text x="960" y="386" text-anchor="middle" font-family="${MONO}" font-size="20"
        letter-spacing="1" fill="${t.vurgu}">2026</text>
  <text x="960" y="412" text-anchor="middle" font-family="${MONO}" font-size="12"
        letter-spacing="2" fill="${t.vurgu}">ZORUNLU</text>
  <g stroke="${t.cizgi}" stroke-width="3" stroke-linecap="round">
    <path d="M1080 176 L1080 500"/>
    <path d="M1062 216 L1098 216 M1062 288 L1098 288 M1062 452 L1098 452"/>
  </g>
  <path d="M1056 368 L1104 368" stroke="${t.vurgu}" stroke-width="7" stroke-linecap="round"/>
  <circle cx="1080" cy="368" r="11" fill="${t.vurgu}"/>`;

/* ─────────── 04 Veri ve Rapor — çubuklar + eğilim eğrisi ─────────── */
const veri = (t: Tema) => {
  const yuk = [110, 176, 138, 232, 190, 268];
  const cubuklar = yuk
    .map((h, i) => {
      const x = 606 + i * 78;
      const dolu = i % 2 === 0 ? 0.32 : 0.68;
      return `<rect x="${x}" y="${470 - h}" width="50" height="${h}" fill="${t.cizgi}" opacity="${dolu}"/>`;
    })
    .join("\n  ");
  return `
  <path d="M576 470 L1080 470" stroke="${t.cizgi}" stroke-width="3.4" stroke-linecap="round"/>
  ${cubuklar}
  <path d="M600 396 C700 372 760 300 860 268 S1000 214 1058 190"
        stroke="${t.vurgu}" stroke-width="5" fill="none" stroke-linecap="round"/>
  <circle cx="860" cy="268" r="12" fill="${t.vurgu}"/>
  <circle cx="860" cy="268" r="22" fill="none" stroke="${t.vurgu}" stroke-width="2.5" opacity="0.55"/>
  <path d="M576 214 L1080 214" stroke="${t.cizgi}" stroke-width="1.5"
        stroke-dasharray="6 8" opacity="0.5"/>`;
};

const TEMALAR: Record<string, Tema> = {
  "Uygulama Örnekleri": { zemin: CAM, cizgi: KREM, vurgu: ADACAYI, izgara: 0.09, ciz: uygulama },
  "Öncü İşletmeler": { zemin: KREM, cizgi: CAM, vurgu: TERRA, izgara: 0.5, ciz: oncu },
  "Mevzuat ve Sertifikasyon": { zemin: KUM, cizgi: CAM, vurgu: TERRA, izgara: 0.45, ciz: mevzuat },
  // Yosun etiket turuncu zeminde okunmuyor — etiket kremle ezildi.
  "Veri ve Rapor": { zemin: TERRA, cizgi: KREM, vurgu: YOSUN, izgara: 0.14, etiket: KREM, ciz: veri },
};
const VARSAYILAN: Tema = { zemin: CAM, cizgi: KREM, vurgu: YOSUN, izgara: 0.09, ciz: uygulama };

function satirla(metin: string, azami = 30, azamiSatir = 3): string[] {
  const out: string[] = [];
  let s = "";
  for (const k of metin.split(/\s+/)) {
    if ((s + " " + k).trim().length <= azami) s = (s + " " + k).trim();
    else {
      if (s) out.push(s);
      s = k;
    }
  }
  if (s) out.push(s);
  if (out.length > azamiSatir) {
    const k = out.slice(0, azamiSatir);
    k[azamiSatir - 1] = k[azamiSatir - 1].replace(/[,.;:]?$/, "…");
    return k;
  }
  return out;
}

async function main() {
  const argv = process.argv.slice(2).filter((a) => a !== "--baslikli");
  const basliklı = process.argv.includes("--baslikli");
  const [slug, baslik, kategori] = argv;

  if (!slug) {
    console.error('\nKullanım: npm run gorsel <slug> "Başlık" "Kategori" [-- --baslikli]\n');
    process.exit(1);
  }

  const t = TEMALAR[kategori ?? ""] ?? VARSAYILAN;
  const kategoriEtiket = (kategori ?? "HABER").toLocaleUpperCase("tr-TR");

  const izgara = [200, 400, 600, 800, 1000]
    .map((x) => `<line x1="${x}" y1="0" x2="${x}" y2="${Y}" stroke="${t.cizgi}" stroke-opacity="${t.izgara}"/>`)
    .join("\n  ");

  const baslikBlok =
    basliklı && baslik
      ? satirla(baslik, 24, 3)
          .map(
            (s, i) =>
              `<text x="64" y="${300 + i * 52}" font-family="${SER}" font-size="42" font-weight="700" fill="${t.cizgi}">${kacir(s)}</text>`,
          )
          .join("\n  ")
      : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${G}" height="${Y}">
  <rect width="${G}" height="${Y}" fill="${t.zemin}"/>
  ${izgara}

  <text x="64" y="76" font-family="${MONO}" font-size="17" letter-spacing="3.4"
        fill="${t.etiket ?? t.vurgu}">${kacir(kategoriEtiket)}</text>

  ${baslikBlok}
  <g transform="translate(${basliklı ? 0 : ORTALA},0)">${t.ciz(t)}</g>

  <rect x="64" y="514" width="86" height="5" fill="${t.vurgu}"/>
  <text x="64" y="564" font-family="${MONO}" font-size="15" letter-spacing="2.6"
        fill="${t.cizgi}" fill-opacity="0.72">SÜRDÜRÜLEBİLİR TURİZM</text>
</svg>`;

  const dizin = path.join(process.cwd(), "public", "haberler");
  fs.mkdirSync(dizin, { recursive: true });
  const hedef = path.join(dizin, `${slug}.jpg`);

  await sharp(Buffer.from(svg, "utf8")).jpeg({ quality: 88, mozjpeg: true }).toFile(hedef);

  const kb = Math.round(fs.statSync(hedef).size / 1024);
  console.log(`\n✓ ${path.relative(process.cwd(), hedef)}  (${G}x${Y}, ${kb} KB)`);
  console.log(`  tema: ${kategori ?? "varsayılan"}${basliklı ? " · başlık basıldı" : ""}`);
  console.log(`  frontmatter: gorsel: "/haberler/${slug}.jpg"\n`);
}

main().catch((e) => {
  console.error(`\n✗ ${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
