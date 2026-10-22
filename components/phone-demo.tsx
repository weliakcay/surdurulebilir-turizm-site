"use client";
import Image from "next/image";
import { useState } from "react";
const screens = [
  {
    id: "login",
    label: "QR ile giriş",
    title: "Noktayı aç. Hesabınla devam et.",
    text: "QR, personeli ilgili kontrol noktasına götürür. İlk kullanımda yönetici onayı istenebilir.",
  },
  {
    id: "form",
    label: "Kontrol formu",
    title: "Kontrolü yaptığın yerde kaydet.",
    text: "Sıcaklık, seçim ve açıklama gibi alanlar formda bir arada. Yanıtlar kontrol noktası ve kayıt zamanıyla ilişkilendirilir.",
  },
  {
    id: "points",
    label: "Yönetici görünümü",
    title: "Eksik kontrolün olduğu noktaya dön.",
    text: "Departman ekranı yapıldı, bekliyor ve gecikti durumlarını bir arada gösterir. Zorunlu ve gecikmiş kontrol, acil olarak işaretlenir.",
  },
];
export function PhoneDemo() {
  const [active, setActive] = useState(1);
  return (
    <div className="phone-demo">
      <div className="phone-copy">
        <p className="demo-label">Greenlog’u ekranlarıyla tanı</p>
        <h2 aria-live="polite">{screens[active].title}</h2>
        <p>{screens[active].text}</p>
        <div
          className="demo-controls"
          aria-label="Gösterilecek uygulama ekranı"
        >
          {screens.map((s, i) => (
            <button
              key={s.id}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <a className="textlink" href={`/greenlog/screens/${screens[active].id}.webp`} target="_blank" rel="noreferrer">Ekranı büyük aç</a>
        <p className="tiny">
          Gerçek Greenlog arayüzü · Gösterim verisi
          <br />
          Ekran düğmeleriyle görüntüyü değiştir. Bu vitrin kayıt oluşturmaz.
        </p>
      </div>
      <div className="phone-stage">
        <span className="orbit-label orbit-one">Kontrol noktası</span>
        <span className="orbit-label orbit-two">Form + zaman + yanıt</span>
        <div className="phone-shell">
          <div className="phone-speaker" aria-hidden="true" />
          <div className="phone-viewport">
            <Image
              key={screens[active].id}
              src={`/greenlog/screens/${screens[active].id}.webp`}
              alt={`Greenlog gerçek uygulama ekranı: ${screens[active].label}. Gösterim Oteli verileri.`}
              width={780}
              height={1688}
              sizes="320px"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
