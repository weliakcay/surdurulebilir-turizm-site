"use client";
import { useRef, useState } from "react";
const steps = [
  {
    label: "Formu hazırla",
    title: "Elindeki formdan başla.",
    paragraphs: [
      "Yazı halindeki formunu yapıştır veya desteklenen dosyalarını yükle. AI ile oluşan taslağın maddelerini, alan türlerini ve seçeneklerini gözden geçir.",
      "Formu kontrol noktasına bağlayarak ekibin kullanacağı düzeni oluştur.",
    ],
    rows: [
      ["Kontrol noktası", "Soğuk oda A"],
      ["Form maddeleri", "Kontrol zamanı · Değer · Açıklama"],
      ["Gözden geçirme", "AI taslağı, kullanıcı kontrolünün yerini almaz."],
    ],
  },
  {
    label: "QR’dan doldur",
    title: "Doğru nokta. Onaylı erişim.",
    paragraphs: [
      "Personel noktanın QR’ını okutur. Hesabı varsa giriş yapar; yetkisi yoksa kontrol noktası bilgisiyle yönetici onayı ister.",
      "Başka oteldeki mevcut hesap kullanılabilir. Yeni otelde erişim, hedef otelin yöneticisi onaylayınca açılır.",
    ],
    rows: [
      ["Otel · Mutfak · Soğuk oda A", "Kontrol noktası bilgisi"],
      ["Erişim onayı iste", "Talep hedef otelin yöneticisine gider."],
      ["Başka hesapla giriş yap", "Paylaşılan telefon için hesap değişimi."],
    ],
  },
  {
    label: "Geçmişi incele",
    title: "Geçmiş kayda, ihtiyaç olduğunda.",
    paragraphs: [
      "Tarih, kontrol noktası ve forma bağlı kayıtları bul. Yönetici geçmişi inceleyebilir ve raporlama akışını kullanabilir.",
      "Pilotta aynı kaydı bulmak için gereken süreyi mevcut yöntemle karşılaştırabiliriz.",
    ],
    rows: [
      ["Kontrol noktası", "Mutfak · Soğuk oda A"],
      ["Kayıt bilgisi", "Form · Kullanıcı · Zaman · Yanıtlar"],
      ["Raporlama", "İlgili dönemin kayıtlarını incele"],
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
          <div className="screen">
            <div className="screenbar">
              <strong>Greenlog / Örnek iş akışı</strong>
              <span>Temsili ekran</span>
            </div>
            {s.rows.map(([label, value]) => (
              <div className="screen-row" key={label}>
                <strong>{label}</strong>
                {value}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
