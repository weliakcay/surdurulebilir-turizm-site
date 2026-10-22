"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { PhoneDemo } from "./phone-demo";
const steps = [
  {
    label: "Formu hazırla",
    title: "Elindeki formdan başla.",
    paragraphs: [
      "Yazı halindeki formunu yapıştır veya desteklenen dosyalarını yükle. AI ile oluşan taslağın maddelerini, alan türlerini ve seçeneklerini gözden geçir.",
      "Formu kontrol noktasına bağlayarak ekibin kullanacağı düzeni oluştur.",
    ],
  },
  {
    label: "QR’dan doldur",
    title: "Doğru nokta. Onaylı erişim.",
    paragraphs: [
      "Personel noktanın QR’ını okutur. Hesabı varsa giriş yapar; yetkisi yoksa kontrol noktası bilgisiyle yönetici onayı ister.",
      "Başka oteldeki mevcut hesap kullanılabilir. Yeni otelde erişim, hedef otelin yöneticisi onaylayınca açılır.",
    ],
  },
  {
    label: "Geçmişi incele",
    title: "Geçmiş kayda, ihtiyaç olduğunda.",
    paragraphs: [
      "Tarih, kontrol noktası ve forma bağlı kayıtları bul. Yönetici geçmişi inceleyebilir ve raporlama akışını kullanabilir.",
      "Pilotta aynı kaydı bulmak için gereken süreyi mevcut yöntemle karşılaştırabiliriz.",
    ],
  },
];
export function ProductFlow() {
  const [selected, setSelected] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <>
      <div role="tablist" aria-label="Greenlog iş akışı" className="tabs">
        {steps.map((s, i) => (
          <button
            key={s.label}
            ref={(el) => {
              buttons.current[i] = el;
            }}
            id={`flow-tab-${i}`}
            type="button"
            role="tab"
            className="tab"
            tabIndex={selected === i ? 0 : -1}
            aria-selected={selected === i}
            aria-controls={`flow-panel-${i}`}
            onClick={() => setSelected(i)}
            onKeyDown={(event) => {
              if (
                !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
              )
                return;
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? steps.length - 1
                    : (i +
                        (event.key === "ArrowRight" ? 1 : -1) +
                        steps.length) %
                      steps.length;
              setSelected(next);
              buttons.current[next]?.focus();
            }}
          >
            {s.label}
          </button>
        ))}
      </div>
      {steps.map((s, i) => (
        <div
          key={s.label}
          className="split"
          id={`flow-panel-${i}`}
          role="tabpanel"
          aria-labelledby={`flow-tab-${i}`}
          hidden={selected !== i}
          tabIndex={0}
          style={selected !== i ? { display: "none" } : undefined}
        >
          <div>
            <h2>{s.title}</h2>
            {s.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          {i === 1 ? (
            <PhoneDemo />
          ) : i === 2 ? (
            <figure className="dashboard-frame">
              <Image
                src="/greenlog/screens/dashboard.webp"
                alt="Greenlog gerçek grafik ekranı, gösterim verileri"
                width={2200}
                height={1600}
              />
              <figcaption className="tiny">
                Gerçek uygulama bileşenleri · Gösterim verisi
              </figcaption>
            </figure>
          ) : (
            <div className="form-map">
              <span>Metin / dosyalar</span>
              <b aria-hidden="true">↓</b>
              <span>AI ile form taslağı</span>
              <b aria-hidden="true">↓</b>
              <span>Maddeleri gözden geçir</span>
              <b aria-hidden="true">↓</b>
              <span>Kontrol noktasına bağla</span>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
