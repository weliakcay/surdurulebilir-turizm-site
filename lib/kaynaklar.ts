/**
 * Kaynak havuzu — tek kayıt defteri.
 *
 * Hem `npm run kaynak:kontrol` hem `haber-tarama` skill'i buradan okur.
 * İleride yapılacak kaynak panosu da bunu kullanacak.
 *
 * Kural: yeni kaynak eklerken önce `npm run kaynak:kontrol` ile doğrulayın.
 * Çalışmayan besleme listeye "aktif" olarak girmez.
 *
 * Son toplu doğrulama: 2026-07-28
 */

export type KaynakTuru = "besleme" | "tarama";

export type Kaynak = {
  ad: string;
  url: string;
  tur: KaynakTuru;
  dil: "en" | "tr";
  /** Hangi içerik pillerini besliyor → 02-icerik/icerik-pilleri.md */
  piller: ("uygulama" | "isletme" | "mevzuat" | "veri")[];
  /** 1–5. Birincil kurum kaynağı 5, ticari yayın 3, blog 2. */
  guven: 1 | 2 | 3 | 4 | 5;
  /** Bu kadar gün yeni içerik yoksa bayat sayılır. */
  bayatGun: number;
  not?: string;
};

export const KAYNAKLAR: Kaynak[] = [
  // ─────────── Sertifikasyon ve standart kurumları ───────────
  {
    ad: "GSTC",
    url: "https://www.gstcouncil.org/feed/",
    tur: "besleme",
    dil: "en",
    piller: ["isletme", "mevzuat"],
    guven: 5,
    bayatGun: 21,
    not: "İçeriğin çoğu kendi duyurusu (kurs, webinar). Gerçek haber oranı düşük, filtrele.",
  },
  {
    ad: "Green Destinations",
    url: "https://greendestinations.org/feed/",
    tur: "besleme",
    dil: "en",
    piller: ["uygulama", "isletme"],
    guven: 4,
    bayatGun: 30,
  },

  // ─────────── Uluslararası kurumlar ───────────
  {
    ad: "UN Tourism",
    url: "https://www.unwto.org/rss.xml",
    tur: "besleme",
    dil: "en",
    piller: ["mevzuat", "veri"],
    guven: 5,
    bayatGun: 45,
    not: "Besleme seyrek ve çoğu etkinlik duyurusu. Ayda ~1 kullanılabilir içerik.",
  },
  {
    ad: "European Travel Commission",
    url: "https://etc-corporate.org/feed/",
    tur: "besleme",
    dil: "en",
    piller: ["veri", "mevzuat"],
    guven: 4,
    bayatGun: 30,
    not: "AB pazarı verisi — Türkiye'nin en büyük kaynak pazarı olduğu için değerli.",
  },

  // ─────────── STK ve koalisyonlar ───────────
  {
    ad: "Sustainable Hospitality Alliance",
    url: "https://sustainablehospitalityalliance.org/feed/",
    tur: "besleme",
    dil: "en",
    piller: ["uygulama", "isletme"],
    guven: 4,
    bayatGun: 30,
    not: "Büyük otel zincirlerinin ortak girişimi — uygulama örneği için verimli.",
  },
  {
    ad: "Travel Foundation",
    url: "https://www.thetravelfoundation.org.uk/feed/",
    tur: "besleme",
    dil: "en",
    piller: ["uygulama", "veri"],
    guven: 4,
    bayatGun: 30,
  },
  {
    ad: "Sustainable Travel International",
    url: "https://sustainabletravel.org/feed/",
    tur: "besleme",
    dil: "en",
    piller: ["uygulama", "veri"],
    guven: 4,
    bayatGun: 30,
  },

  // ─────────── Sektör basını ───────────
  {
    ad: "Skift — sürdürülebilirlik",
    url: "https://skift.com/tag/sustainability/feed/",
    tur: "besleme",
    dil: "en",
    piller: ["uygulama", "isletme", "veri"],
    guven: 3,
    bayatGun: 14,
    not: "Etiket beslemesi. Genel Skift beslemesi kullanılmaz — içeriğin %95'i alakasız.",
  },
  {
    ad: "Booking.com Newsroom",
    url: "https://news.booking.com/feed/",
    tur: "besleme",
    dil: "en",
    piller: ["veri", "uygulama"],
    guven: 3,
    bayatGun: 21,
    not: "Şirket kaynağı — kendi ürününü tanıtan içerik ayıklanmalı. Yıllık sürdürülebilir seyahat raporu buradan duyuruluyor.",
  },

  {
    ad: "edie",
    url: "https://www.edie.net/rss/",
    tur: "besleme",
    dil: "en",
    piller: ["uygulama", "mevzuat", "veri"],
    guven: 3,
    bayatGun: 7,
    not: "İngiltere merkezli sürdürülebilirlik yayını, günlük akış. Turizm dışı içerik çok ama AB mevzuatı ve kurumsal uygulama örnekleri için en verimli kaynak.",
  },
  {
    ad: "Eco-Business",
    url: "https://www.eco-business.com/feeds/news/",
    tur: "besleme",
    dil: "en",
    piller: ["uygulama", "mevzuat"],
    guven: 3,
    bayatGun: 14,
    not: "Asya-Pasifik odaklı. Besleme ince (tek öğe döndürüyor) — site taraması destekleyebilir.",
  },
  {
    ad: "Hotel Management",
    url: "https://www.hotelmanagement.net/rss.xml",
    tur: "besleme",
    dil: "en",
    piller: ["isletme", "uygulama"],
    guven: 3,
    bayatGun: 21,
    not: "Otel işletmeciliği basını. Sürdürülebilirlik dışı içerik çoğunlukta, filtre gerekir.",
  },

  // ─────────── Türkiye ───────────
  {
    ad: "Turizm Ajansı",
    url: "https://www.turizmajansi.com/rss",
    tur: "besleme",
    dil: "tr",
    piller: ["isletme", "mevzuat"],
    guven: 3,
    bayatGun: 7,
    not: "Türkçe sektör haberi. Sürdürülebilirlik dışı içerik çok — filtre şart. 'Bizde örneği var mı' sorusunun ilk durağı.",
  },
  {
    ad: "Turizm Gazetesi",
    url: "https://www.turizmgazetesi.com/rss",
    tur: "besleme",
    dil: "tr",
    piller: ["isletme", "mevzuat"],
    guven: 3,
    bayatGun: 7,
  },
  {
    ad: "Turizm Günlüğü",
    url: "https://www.turizmgunlugu.com/feed/",
    tur: "besleme",
    dil: "tr",
    piller: ["isletme", "mevzuat"],
    guven: 3,
    bayatGun: 7,
  },
  {
    ad: "Yeşil Ekonomi",
    url: "https://yesilekonomi.com/feed/",
    tur: "besleme",
    dil: "tr",
    piller: ["mevzuat", "veri"],
    guven: 3,
    bayatGun: 14,
    not: "Türkçe yeşil ekonomi yayını. Turizme özel değil ama mevzuat ve karbon tarafında Türkçe karşılık bulmanın en iyi yolu.",
  },

  // ─────────── Beslemesi olmayanlar — elle/tarayarak ───────────
  {
    ad: "Travelife",
    url: "https://www.travelife.info/",
    tur: "tarama",
    dil: "en",
    piller: ["isletme"],
    guven: 5,
    bayatGun: 60,
    not: "Sertifika alan işletme duyuruları. Besleme yok.",
  },
  {
    ad: "Green Key",
    url: "https://www.greenkey.global/news",
    tur: "tarama",
    dil: "en",
    piller: ["isletme"],
    guven: 5,
    bayatGun: 60,
    not: "Besleme yok. Türkiye'de yaygın sertifika — öncü işletme haberi için birincil kaynak.",
  },
  {
    ad: "EarthCheck",
    url: "https://earthcheck.org/news/",
    tur: "tarama",
    dil: "en",
    piller: ["isletme"],
    guven: 4,
    bayatGun: 60,
  },
  {
    ad: "TÜRÇEV — Mavi Bayrak",
    url: "https://www.mavibayrak.org.tr/",
    tur: "tarama",
    dil: "tr",
    piller: ["isletme", "veri"],
    guven: 5,
    bayatGun: 90,
    not: "Türkiye'deki Mavi Bayraklı tesis listesi ve güncellemeleri.",
  },
  {
    ad: "TÜRSAB",
    url: "https://www.tursab.org.tr/haberler",
    tur: "tarama",
    dil: "tr",
    piller: ["mevzuat", "veri"],
    guven: 4,
    bayatGun: 30,
    not: "/rss adresi HTML dönüyor, besleme değil.",
  },
  {
    ad: "Kültür ve Turizm Bakanlığı",
    url: "https://www.ktb.gov.tr/",
    tur: "tarama",
    dil: "tr",
    piller: ["mevzuat"],
    guven: 5,
    bayatGun: 30,
    not: "Türkiye Sürdürülebilir Turizm Programı duyuruları. Besleme yanıt vermiyor.",
  },
  {
    ad: "WTTC",
    url: "https://wttc.org/news",
    tur: "tarama",
    dil: "en",
    piller: ["veri", "mevzuat"],
    guven: 4,
    bayatGun: 30,
    not: "/feed ve /news/rss 404. Basın odası taranacak.",
  },
];

export const beslemeler = () => KAYNAKLAR.filter((k) => k.tur === "besleme");
export const taramalar = () => KAYNAKLAR.filter((k) => k.tur === "tarama");
