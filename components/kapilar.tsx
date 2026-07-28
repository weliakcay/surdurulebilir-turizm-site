import Link from "next/link";

/**
 * İki kapı — ana sayfanın ilk perdesi.
 * İşletme derin çam, gezgin terrakota. Seçim kilitlemez; her an diğerine geçilir.
 */
export function Kapilar() {
  return (
    <section className="relative border-b border-cizgi">
      <div className="grid md:grid-cols-2">
        <Kapi
          no="01"
          baslik="İşletmeyim"
          metin="Otel, pansiyon, tur operatörü. Maliyet, mevzuat ve geri ödeme odaklı araçlar."
          href="/isletme"
          tur="isletme"
        />
        <Kapi
          no="02"
          baslik="Gezginim"
          metin="Kendi ayak izini ölç, seyahatini hafiflet, nereye gideceğine bilerek karar ver."
          href="/gezgin"
          tur="gezgin"
        />
      </div>
    </section>
  );
}

function Kapi({
  no,
  baslik,
  metin,
  href,
  tur,
}: {
  no: string;
  baslik: string;
  metin: string;
  href: string;
  tur: "isletme" | "gezgin";
}) {
  const isletme = tur === "isletme";
  return (
    <Link
      href={href}
      className={[
        "group relative block overflow-hidden px-5 py-12 transition-colors duration-300 md:px-10 md:py-14",
        isletme
          ? "border-b border-cizgi hover:bg-cam md:border-b-0 md:border-r"
          : "hover:bg-terra",
      ].join(" ")}
    >
      <div
        className={[
          "etiket transition-colors",
          isletme
            ? "text-solgun group-hover:text-adacayi"
            : "text-solgun group-hover:text-[#ffd9c4]",
        ].join(" ")}
      >
        {no} — Kapı
      </div>

      <h2
        className={[
          "mt-2.5 text-3xl leading-none tracking-tight transition-colors md:text-[2.4rem]",
          isletme ? "group-hover:text-krem" : "group-hover:text-[#fff5ee]",
        ].join(" ")}
      >
        {baslik}
      </h2>

      <p
        className={[
          "mt-2.5 max-w-[34ch] text-[0.95rem] leading-relaxed transition-colors",
          isletme
            ? "text-solgun group-hover:text-adacayi"
            : "text-solgun group-hover:text-[#ffd9c4]",
        ].join(" ")}
      >
        {metin}
      </p>

      <span
        className={[
          "etiket mt-5 inline-block transition-all duration-300 group-hover:translate-x-1.5",
          isletme ? "group-hover:text-krem" : "group-hover:text-[#fff5ee]",
        ].join(" ")}
      >
        Devam et →
      </span>
    </Link>
  );
}
