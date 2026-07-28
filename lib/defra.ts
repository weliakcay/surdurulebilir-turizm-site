/**
 * Emisyon katsayıları — DEFRA 2026
 *
 * Kaynak : UK Government GHG Conversion Factors for Company Reporting, 2026
 *          Yayın 11 Haziran 2026
 *          https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2026
 *          Dosya: ghg-conversion-factors-2026-flat-format.xlsx
 *
 * Aşağıdaki her sayı bu tablodan BİREBİR alınmıştır — yuvarlanmamış, tahmin edilmemiştir.
 * Editoryal ilkeler madde 4 gereği kanıtsız sayı kullanılmaz.
 *
 * Uçuş katsayıları "With RF" (radiative forcing dahil) sürümüdür. Uçuşun iklim
 * etkisi yalnızca CO2 değildir; RF dahil sürüm turizm hesaplayıcılarında kabul
 * gören yaklaşımdır ve sayfada bu tercih belirtilir.
 *
 * Otel katsayısının asıl kaynağı DEFRA değil: Cornell Hotel Sustainability
 * Benchmarking (CHSB) endeksi, Hotel Footprinting Tool üzerinden. Atıfta belirtilir.
 */

export const DEFRA_SURUM = "DEFRA 2026" as const;
export const DEFRA_URL =
  "https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2026";

/** Ulaşım — kg CO2e / yolcu.km (otomobil hariç: kg CO2e / araç.km) */
export const ULASIM = {
  ucusYurtIci: {
    ad: "Uçak — yurt içi",
    katsayi: 0.22928,
    birim: "yolcu.km",
    kaynakSatiri: "Business travel- air · Flights · Domestic · Average passenger · With RF",
  },
  ucusYurtDisi: {
    ad: "Uçak — yurt dışı",
    katsayi: 0.10916,
    birim: "yolcu.km",
    kaynakSatiri:
      "Business travel- air · Flights · International, to/from non-UK · Economy class · With RF",
  },
  otomobilBenzin: {
    ad: "Otomobil — benzinli",
    katsayi: 0.16152,
    birim: "araç.km",
    aracBasina: true,
    kaynakSatiri: "Passenger vehicles · Cars (by size) · Average car · Petrol",
  },
  otomobilDizel: {
    ad: "Otomobil — dizel",
    katsayi: 0.17265,
    birim: "araç.km",
    aracBasina: true,
    kaynakSatiri: "Passenger vehicles · Cars (by size) · Average car · Diesel",
  },
  otomobilHibrit: {
    ad: "Otomobil — hibrit",
    katsayi: 0.12961,
    birim: "araç.km",
    aracBasina: true,
    kaynakSatiri: "Passenger vehicles · Cars (by size) · Average car · Hybrid",
  },
  otobus: {
    ad: "Otobüs",
    katsayi: 0.03948,
    birim: "yolcu.km",
    kaynakSatiri: "Business travel- land · Bus · Coach",
  },
  tren: {
    ad: "Tren",
    katsayi: 0.03092,
    birim: "yolcu.km",
    kaynakSatiri: "Business travel- land · Rail · National rail",
  },
} as const;

export type UlasimAnahtar = keyof typeof ULASIM;

/** Konaklama — kg CO2e / oda / gece */
export const KONAKLAMA = {
  turkiye: {
    ad: "Türkiye",
    katsayi: 32.1,
    kaynakSatiri: "Hotel stay · Turkey · Room per night (satır 29_600_4051_13_1)",
  },
} as const;

/**
 * Not ölçeği. Eşikler DEFRA'dan gelmiyor — bizim editoryal kararımız,
 * kişi başı toplam ayak izine göre. Sayfada "bizim ölçeğimiz" olarak belirtilir.
 */
export const NOTLAR = [
  { esik: 60, not: "A", aciklama: "Çok düşük — örnek alınası" },
  { esik: 150, not: "B", aciklama: "Düşük" },
  { esik: 300, not: "C", aciklama: "Ortalama" },
  { esik: 600, not: "D", aciklama: "Yüksek" },
  { esik: 1200, not: "E", aciklama: "Çok yüksek" },
  { esik: Infinity, not: "F", aciklama: "Ağır — ulaşım tercihi belirleyici" },
] as const;

export function notVer(kgCO2e: number) {
  return NOTLAR.find((n) => kgCO2e < n.esik) ?? NOTLAR[NOTLAR.length - 1];
}

/** Bir ağacın yılda tuttuğu karbon — bağlam cümlesi için. */
export const AGAC_YILLIK_KG = 21;
