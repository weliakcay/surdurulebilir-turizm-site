/**
 * Logo seçenekleri için kontak sayfası üretir (geçici — seçim yapıldıktan sonra silinir).
 *   npx tsx scripts/logo-tasla.ts <cikti.png>
 */
import sharp from "sharp";

const KREM = "#f4eee5";
const CAM = "#1e3d34";
const CAM2 = "#2c5648";
const ADACAYI = "#7c9a83";
const TERRA = "#c0663a";
const YOSUN = "#8fb03f";
const CIZGI = "#ddd2c1";
const SOLGUN = "#6d7d74";
const MUREKKEP = "#23312b";

const SER = "Georgia,'Times New Roman',serif";
const MONO = "Menlo,Monaco,'Courier New',monospace";

/** Her seçenek: verilen kutuya (x,y,boy) çizilen işaret. */
type Cizer = (x: number, y: number, b: number, ters?: boolean) => string;

/** 01 — Katmanlar */
const katmanlar: Cizer = (x, y, b, ters) => {
  const o = (v: number) => (v / 100) * b;
  const d1 = ters ? KREM : CAM;
  const d2 = ters ? ADACAYI : CAM2;
  const d3 = ters ? CAM2 : ADACAYI;
  return `
    <rect x="${x}" y="${y}" width="${b}" height="${b}" rx="${o(4)}" fill="${d1}"/>
    <rect x="${x + o(18)}" y="${y + o(18)}" width="${o(64)}" height="${o(64)}" rx="${o(2)}" fill="${d2}"/>
    <rect x="${x + o(32)}" y="${y + o(32)}" width="${o(36)}" height="${o(36)}" fill="${d3}"/>
    <rect x="${x + o(43)}" y="${y + o(43)}" width="${o(14)}" height="${o(14)}" fill="${YOSUN}"/>`;
};

/** 02 — Köprü */
const kopru: Cizer = (x, y, b, ters) => {
  const o = (v: number) => (v / 100) * b;
  const zemin = ters ? "none" : CAM;
  // Kemer iki durumda da AÇIK kalır: varsayılanda kendi koyu karesinin üstünde,
  // ters sürümde sayfanın koyu zemininin üstünde duruyor.
  const kemer = KREM;
  const kalin = b < 30 ? 11 : b < 46 ? 8 : 7;
  const ayak = b < 30 ? "" : `<path d="M${x + o(34)} ${y + o(45)} L${x + o(34)} ${y + o(74)} M${x + o(66)} ${y + o(45)} L${x + o(66)} ${y + o(74)}" stroke="${ADACAYI}" stroke-width="${o(kalin * 0.8)}" stroke-linecap="round"/>`;
  return `
    <rect x="${x}" y="${y}" width="${b}" height="${b}" rx="${o(4)}" fill="${zemin}"/>
    <path d="M${x + o(14)} ${y + o(54)} Q${x + o(50)} ${y + o(30)} ${x + o(86)} ${y + o(54)}"
          stroke="${kemer}" stroke-width="${o(kalin)}" fill="none" stroke-linecap="round"/>
    ${ayak}
    <path d="M${x + o(14)} ${y + o(82)} L${x + o(86)} ${y + o(82)}"
          stroke="${TERRA}" stroke-width="${o(kalin * 0.9)}" stroke-linecap="round"/>`;
};

/** 03 — Ufuk penceresi */
const ufuk: Cizer = (x, y, b, ters) => {
  const o = (v: number) => (v / 100) * b;
  const cerceve = ters ? KREM : CAM;
  const kalin = b < 30 ? 12 : b < 46 ? 8 : 6;
  const gunes = b < 30 ? "" : `<circle cx="${x + o(67)}" cy="${y + o(33)}" r="${o(6.5)}" fill="${TERRA}"/>`;
  return `
    <rect x="${x + o(11)}" y="${y + o(11)}" width="${o(78)}" height="${o(78)}" rx="${o(3)}"
          fill="none" stroke="${cerceve}" stroke-width="${o(kalin)}"/>
    <path d="M${x + o(11)} ${y + o(62)} L${x + o(89)} ${y + o(62)}" stroke="${ADACAYI}" stroke-width="${o(kalin * 0.85)}"/>
    <path d="M${x + o(31)} ${y + o(62)} A${o(19)} ${o(19)} 0 0 1 ${x + o(69)} ${y + o(62)}" fill="${YOSUN}"/>
    ${gunes}`;
};

/** 04 — Tipografik st. */
const tipo: Cizer = (x, y, b, ters) => {
  const o = (v: number) => (v / 100) * b;
  const zemin = ters ? KREM : CAM;
  const yazi = ters ? CAM : KREM;
  const cetvel = b < 30 ? "" : `<rect x="${x + o(31)}" y="${y + o(75)}" width="${o(38)}" height="${o(4.5)}" fill="${TERRA}"/>`;
  return `
    <rect x="${x}" y="${y}" width="${b}" height="${b}" rx="${o(4)}" fill="${zemin}"/>
    <text x="${x + o(50)}" y="${y + o(b < 30 ? 70 : 64)}" text-anchor="middle"
          font-family="${SER}" font-size="${o(b < 30 ? 64 : 55)}" font-weight="700" fill="${yazi}">st</text>
    ${cetvel}`;
};

const SECENEKLER: { no: string; ad: string; not: string; ciz: Cizer }[] = [
  { no: "01", ad: "Katmanlar", not: "Sitenin açılış sahnesi · en soyut, küçükte en okunur", ciz: katmanlar },
  { no: "02", ad: "Köprü", not: "Konumlandırmanın görseli · en anlatısal", ciz: kopru },
  { no: "03", ad: "Ufuk penceresi", not: "Bir yere bakmak · turizmde çok kullanılmış", ciz: ufuk },
  { no: "04", ad: "Tipografik st.", not: "Yayın markası gibi · en ciddi, en az akılda kalıcı", ciz: tipo },
];

const G = 1400;
const UST = 112;
const SATIR = 218;
const Y = UST + SECENEKLER.length * SATIR + 26;

function satir(s: (typeof SECENEKLER)[number], i: number): string {
  const y = UST + i * SATIR;
  const m = y + 30; // içerik başlangıcı

  return `
  ${i > 0 ? `<line x1="0" y1="${y}" x2="${G}" y2="${y}" stroke="${CIZGI}"/>` : ""}

  <text x="48" y="${m + 16}" font-family="${MONO}" font-size="14" letter-spacing="2.2" fill="${TERRA}">SEÇENEK ${s.no}</text>
  <text x="48" y="${m + 54}" font-family="${SER}" font-size="27" font-weight="700" fill="${MUREKKEP}">${s.ad}</text>
  <text x="48" y="${m + 86}" font-family="${SER}" font-size="15" fill="${SOLGUN}">${s.not}</text>

  <!-- büyük ikon -->
  ${s.ciz(430, m + 8, 104)}
  <text x="482" y="${m + 140}" text-anchor="middle" font-family="${MONO}" font-size="11" letter-spacing="1.4" fill="${SOLGUN}">104 PX</text>

  <!-- küçük boylar -->
  ${s.ciz(590, m + 46, 34)}
  ${s.ciz(646, m + 54, 20)}
  ${s.ciz(684, m + 58, 14)}
  <text x="646" y="${m + 140}" text-anchor="middle" font-family="${MONO}" font-size="11" letter-spacing="1.4" fill="${SOLGUN}">34 · 20 · 14 PX</text>

  <!-- yatay kilit -->
  ${s.ciz(790, m + 34, 42)}
  <text x="846" y="${m + 58}" font-family="${SER}" font-size="22" font-weight="700" fill="${MUREKKEP}">Sürdürülebilir Turizm</text>
  <text x="846" y="${m + 78}" font-family="${MONO}" font-size="10" letter-spacing="2" fill="${SOLGUN}">DÜNYADA İŞE YARAYAN · TÜRKİYE'DE KARŞILIĞI</text>
  <text x="846" y="${m + 140}" font-family="${MONO}" font-size="11" letter-spacing="1.4" fill="${SOLGUN}">YATAY KİLİT</text>

  <!-- koyu zemin -->
  <rect x="1232" y="${m + 6}" width="120" height="108" rx="3" fill="${CAM}"/>
  ${s.ciz(1274, m + 26, 36, true)}
  <text x="1292" y="${m + 140}" text-anchor="middle" font-family="${MONO}" font-size="11" letter-spacing="1.4" fill="${SOLGUN}">KOYU ZEMİN</text>`;
}

async function main() {
  const cikti = process.argv[2] ?? "logolar.png";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${G}" height="${Y}">
  <rect width="${G}" height="${Y}" fill="${KREM}"/>
  ${[200, 400, 600, 800, 1000, 1200].map((x) => `<line x1="${x}" y1="0" x2="${x}" y2="${Y}" stroke="${CIZGI}" stroke-opacity="0.55"/>`).join("\n  ")}

  <text x="48" y="46" font-family="${MONO}" font-size="14" letter-spacing="2.4" fill="${TERRA}">LOGO — DÖRT SEÇENEK</text>
  <text x="48" y="84" font-family="${SER}" font-size="32" font-weight="700" fill="${MUREKKEP}">Sürdürülebilir Turizm</text>
  <line x1="0" y1="${UST}" x2="${G}" y2="${UST}" stroke="${CIZGI}"/>

  ${SECENEKLER.map(satir).join("\n")}
</svg>`;

  await sharp(Buffer.from(svg, "utf8")).png().toFile(cikti);
  console.log(`✓ ${cikti} (${G}x${Y})`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
});
