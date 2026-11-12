"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const [lang, setLang] = useState<"en" | "ur">("en");
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "ur" : "en";
    setLang(nextLang);
    document.documentElement.lang = nextLang;
    document.documentElement.dir = nextLang === "ur" ? "rtl" : "ltr";
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="header-glass">
      <div className="container flex items-center justify-between" style={{ height: 72 }}>
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2" style={{ textDecoration: "none" }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: "var(--radius-pill)",
            background: "linear-gradient(135deg, #147A67 0%, #0D4E7B 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#FFF",
            fontSize: "1.2rem",
            boxShadow: "0 2px 8px rgba(20, 122, 103, 0.3)"
          }}>
            🥛
          </div>
          <div className="flex-col">
            <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--color-deep-navy)", lineHeight: 1 }}>
              Khalis Doodh
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--color-teal)", fontWeight: 700, letterSpacing: "0.05em" }}>
              PUNJAB MARKETPLACE
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2" style={{ flexWrap: "wrap" }}>
          <Link 
            href="/subscribe" 
            className="btn" 
            style={{ 
              backgroundColor: isActive("/subscribe") ? "var(--color-pale-mint)" : "transparent",
              color: isActive("/subscribe") ? "var(--color-teal)" : "var(--color-dark-slate)",
              fontSize: "0.9rem",
              minHeight: 38,
              padding: "0 14px"
            }}
          >
            📍 {lang === "en" ? "Find Route" : "روٹ تلاش کریں"}
          </Link>

          <Link 
            href="/account" 
            className="btn" 
            style={{ 
              backgroundColor: isActive("/account") ? "var(--color-pale-mint)" : "transparent",
              color: isActive("/account") ? "var(--color-teal)" : "var(--color-dark-slate)",
              fontSize: "0.9rem",
              minHeight: 38,
              padding: "0 14px"
            }}
          >
            👤 {lang === "en" ? "Customer" : "گاہک"}
          </Link>

          <Link 
            href="/gwala" 
            className="btn" 
            style={{ 
              backgroundColor: isActive("/gwala") ? "var(--color-pale-mint)" : "transparent",
              color: isActive("/gwala") ? "var(--color-teal)" : "var(--color-dark-slate)",
              fontSize: "0.9rem",
              minHeight: 38,
              padding: "0 14px"
            }}
          >
            🚜 {lang === "en" ? "Gwala Portal" : "گوالا پورٹل"}
          </Link>

          <Link 
            href="/trust" 
            className="btn" 
            style={{ 
              backgroundColor: isActive("/trust") ? "var(--color-pale-mint)" : "transparent",
              color: isActive("/trust") ? "var(--color-teal)" : "var(--color-dark-slate)",
              fontSize: "0.9rem",
              minHeight: 38,
              padding: "0 14px"
            }}
          >
            🛡️ {lang === "en" ? "Trust Policy" : "اعتماد کی پالیسی"}
          </Link>

          <Link 
            href="/admin" 
            className="btn" 
            style={{ 
              backgroundColor: isActive("/admin") ? "var(--color-pale-mint)" : "transparent",
              color: isActive("/admin") ? "var(--color-teal)" : "var(--color-dark-slate)",
              fontSize: "0.9rem",
              minHeight: 38,
              padding: "0 14px"
            }}
          >
            ⚙️ {lang === "en" ? "Admin" : "ایڈمن"}
          </Link>


          <button 
            onClick={toggleLanguage} 
            className="btn btn-outline" 
            style={{ minHeight: 36, padding: "0 10px", fontSize: "0.8rem", borderRadius: "var(--radius-pill)" }}
          >
            🌐 {lang === "en" ? "اردو" : "English"}
          </button>

          {/* Action CTAs */}
          <div className="flex gap-2" style={{ marginLeft: 8 }}>
            <Link href="/subscribe" className="btn btn-primary" style={{ minHeight: 38, padding: "0 16px", fontSize: "0.875rem" }}>
              Subscribe Now
            </Link>
            <Link href="/enroll" className="btn btn-secondary" style={{ minHeight: 38, padding: "0 16px", fontSize: "0.875rem" }}>
              Enroll Gwala
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
