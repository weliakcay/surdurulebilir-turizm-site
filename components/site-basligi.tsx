"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const pages = [
  ["Greenlog", "/greenlog"],
  ["COP31", "/cop31"],
  ["Haberler", "/haberler"],
  ["Topluluk", "/topluluk"],
  ["Hakkımızda", "/hakkinda"],
];
export function SiteBasligi() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <div className="portal">
      <header>
        <div className="wrap nav">
          <Link className="wordmark" href="/" onClick={() => setOpen(false)}>
            Sürdürülebilir<span>Turizm.</span>
          </Link>
          <button
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="site-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? "Menüyü kapat" : "Menü"}
          </button>
          <nav
            id="site-navigation"
            aria-label="Ana menü"
            className={open ? "open" : undefined}
          >
            {pages.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={
                  pathname === href || pathname.startsWith(`${href}/`)
                    ? "page"
                    : undefined
                }
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link className="btn" href="/greenlog/nasil-calisir">
            Greenlog nasıl çalışır?
          </Link>
        </div>
      </header>
    </div>
  );
}
