# Sürdürülebilir Turizm — site

Dünyada işe yarayan sürdürülebilir turizm uygulamalarını aktaran ve her birinin **Türkiye'de hangi koşullarda hayata geçebileceğini** yazan haber sitesi. Her haber tek komutla hem siteye hem LinkedIn şirket sayfasına düşer.

LinkedIn → [linkedin.com/company/surdurulebilir-turizm](https://www.linkedin.com/company/surdurulebilir-turizm/)

## Ayırt edici taraf

Sürdürülebilir turizm üzerine Türkçe içeriğin çoğu ya çeviri haber ya da genel geçer farkındalık metni. Bu yayın **köprü kuruyor**: dünyadaki uygulamayı aktarır, sonra asıl soruyu sorar — bu Türkiye'de nasıl işler, maliyeti ne, engeli ne, kim şimdiden deniyor?

Her haber üç bölümden oluşur: **ne oldu · Türkiye açısı · kim yapıyor**. "Türkiye açısı" bölümü olmayan içerik build'i geçmez — bu kural veri katmanında zorunlu tutulur, yazarın hatırlamasına bırakılmaz.

## Araçlar

Okurun kendi sayısını görebildiği hesaplayıcılar. Hepsi tarayıcıda çalışır; hiçbir veri sunucuya gitmez.

| Araç | Ne yapar | Kaynak |
|---|---|---|
| Karbon ayak izi | Seyahatin kişi başı ayak izi, A–F notu, ağaç karşılığı | DEFRA 2026 |
| Sertifika taraması | 12 maddelik öz-değerlendirme, puan ve en hızlı kazanç | GSTC kriter başlıkları |
| Geri ödeme | Habere gömülür; tesisin rakamlarıyla geri ödeme süresi | Kullanıcı girdisi |

Emisyon katsayıları [`lib/defra.ts`](lib/defra.ts) içinde, her biri kaynak satır künyesiyle. Yuvarlanmamış, tahmin edilmemiş — DEFRA 2026 tablosundan birebir alınmıştır. Otel katsayısının asıl kaynağı Cornell Hotel Sustainability Benchmarking endeksidir ve atıfta belirtilir.

## Teknoloji

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · MDX içerik · Newsreader + JetBrains Mono

Veritabanı yok. Haberler repoda MDX dosyası; her şey versiyonlu, barındırma maliyeti sıfır.

Kaydırmaya bağlı sahneler kütüphane kullanmadan, saf JavaScript ve yalnızca `transform`/`opacity` ile yazıldı. `prefers-reduced-motion` açıkken sahneler sabitlenmeyi bırakır ve içerik düz akar.

## Kurulum

```bash
npm install
cp .env.example .env.local   # doldurun
npm run dev
```

## Komutlar

```bash
npm run dev              # geliştirme sunucusu
npm run build            # üretim derlemesi (frontmatter doğrulaması burada çalışır)
npm run tipler           # tsc --noEmit
npm run gorsel <slug> "Başlık" "Kategori"   # 1200x630 haber görseli üretir
npm run linkedin:durum   # LinkedIn bağlantı teşhisi
npm run linkedin:auth    # LinkedIn yetkilendirme
npm run yayinla <slug>   # site + LinkedIn eş zamanlı yayın
npm run yayinla <slug> -- --dry   # hiçbir şey yayınlamaz, ne gideceğini gösterir
```

## Yayın akışı

`npm run yayinla <slug>` sırayla:

1. Frontmatter'ı doğrular
2. **Çift yayın kontrolü** — `linkedinPostUrn` doluysa durur
3. Token süresini kontrol eder, gerekirse yeniler
4. Commit + push → Vercel deploy
5. Sayfa canlıya çıkana kadar bekler
6. Görseli LinkedIn Images API'ye yükler
7. Şirket sayfasına makale postu atar
8. Dönen URN'i frontmatter'a yazar

5. adım atlanamaz: LinkedIn postundaki link canlı olmadan post atılmaz. LinkedIn Posts API link önizlemesi üretmediği için görsel, başlık ve açıklama 6.–7. adımlarda bizim tarafımızdan gönderilir.

## Editoryal ilkeler

Kaynak her zaman gösterilir · öne çıkarma satılmaz · kanıtsız sürdürülebilirlik iddiası aktarılmaz · hata düzeltilir, silinmez.

## Lisans

Kod ve içerik için ayrı bir lisans belirlenmedi; tüm haklar saklıdır. İçeriklerdeki alıntılar ve görseller ilgili kaynaklara aittir.
