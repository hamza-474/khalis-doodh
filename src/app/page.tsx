"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState("Lahore");
  const [selectedArea, setSelectedArea] = useState("DHA Phase 5");

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/subscribe?city=${encodeURIComponent(selectedCity)}&area=${encodeURIComponent(selectedArea)}`);
  };

  return (
    <div className="flex-col min-h-screen">
      <Header />

      <main className="container mt-6 mb-12" style={{ flex: 1 }}>
        {/* Hero Section */}
        <section className="hero-gradient text-center mb-12">
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <span className="badge badge-mint mb-4" style={{ display: "inline-flex", fontSize: "0.85rem" }}>
              ✨ Punjab's #1 Verified Milk Subscription Network
            </span>

            <h1 style={{ color: "#FFFFFF", fontSize: "2.75rem", fontWeight: 800, lineHeight: 1.15, marginBottom: "var(--spacing-4)" }}>
              Pure Milk Starts With A Route You Can Trust.
            </h1>

            <p style={{ fontSize: "1.15rem", color: "#E2E8F0", marginBottom: "var(--spacing-8)", fontWeight: 500 }}>
              Discover CNIC-verified local gwalas in Lahore, Rawalpindi, Multan & Faisalabad. Subscribe to daily morning milk delivery with full transparency.
            </p>

            {/* Embedded Quick Search Card */}
            <form onSubmit={handleQuickSearch} className="card" style={{ backgroundColor: "#FFFFFF", color: "var(--color-dark-slate)", padding: "var(--spacing-5)", boxShadow: "0 16px 32px rgba(0,0,0,0.2)", borderRadius: "var(--radius-lg)" }}>
              <div className="md:grid md:grid-cols-3 gap-4 items-center">
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="label">Choose City</label>
                  <select className="select" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                    <option value="Lahore">Lahore</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Multan">Multan</option>
                    <option value="Faisalabad">Faisalabad</option>
                  </select>
                </div>

                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label className="label">Select Neighbourhood</label>
                  <select className="select" value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
                    {selectedCity === "Lahore" && (
                      <>
                        <option value="DHA Phase 5">DHA Phase 5</option>
                        <option value="Gulberg III">Gulberg III</option>
                        <option value="Johar Town">Johar Town</option>
                        <option value="Model Town">Model Town</option>
                      </>
                    )}
                    {selectedCity === "Rawalpindi" && (
                      <>
                        <option value="Bahria Town Phase 4">Bahria Town Phase 4</option>
                        <option value="Saddar">Saddar</option>
                        <option value="Adiala Road">Adiala Road</option>
                      </>
                    )}
                    {selectedCity === "Multan" && (
                      <>
                        <option value="Bosan Road">Bosan Road</option>
                        <option value="Cantt">Cantt</option>
                      </>
                    )}
                    {selectedCity === "Faisalabad" && (
                      <>
                        <option value="Canal Express">Canal Express</option>
                        <option value="Peoples Colony 1">Peoples Colony 1</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="mt-4 md:mt-0">
                  <button type="submit" className="btn btn-primary w-full" style={{ minHeight: 48, fontSize: "1rem" }}>
                    🔍 Find Verified Gwalas
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* Quick Role Gateway Cards */}
        <section className="mb-12">
          <h2 className="text-center mb-6">Choose How You Want To Use Khalis Doodh</h2>

          <div className="md:grid md:grid-cols-2 gap-8">
            {/* Household Buyer Card */}
            <div className="card flex-col justify-between" style={{ borderLeft: "6px solid var(--color-teal)" }}>
              <div>
                <span className="badge badge-mint mb-3">🏡 For Households & Families</span>
                <h3 style={{ fontSize: "1.5rem" }}>Subscribe to Daily Pure Milk</h3>
                <p style={{ color: "var(--color-dark-slate)" }}>
                  Browse verified gwalas in your area, pick custom delivery days, pause anytime when traveling, and pay directly via Cash on Delivery.
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                <Link href="/subscribe" className="btn btn-primary" style={{ flex: 1 }}>
                  Browse Routes & Subscribe
                </Link>
                <Link href="/account" className="btn btn-outline">
                  My Account
                </Link>
              </div>
            </div>

            {/* Gwala / Vendor Card */}
            <div className="card flex-col justify-between" style={{ borderLeft: "6px solid var(--color-deep-navy)" }}>
              <div>
                <span className="badge badge-navy mb-3">🚜 For Milk Vendors & Farmers</span>
                <h3 style={{ fontSize: "1.5rem" }}>Enroll Your Delivery Route</h3>
                <p style={{ color: "var(--color-dark-slate)" }}>
                  Expand your household customer base in Punjab. Submit CNIC credentials for admin verification and manage daily route stops.
                </p>
              </div>

              <div className="flex gap-3 mt-4">
                <Link href="/enroll" className="btn btn-secondary" style={{ flex: 1 }}>
                  Enroll as Gwala
                </Link>
                <Link href="/gwala" className="btn btn-outline">
                  Gwala Route Portal
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="card mb-12" style={{ backgroundColor: "var(--color-white)", padding: "var(--spacing-8)" }}>
          <h2 className="text-center mb-2">How Khalis Doodh Works</h2>
          <p className="text-center mb-8" style={{ color: "var(--color-dark-slate)" }}>Simple 3-step route subscription for Punjab households</p>

          <div className="md:grid md:grid-cols-3 gap-8">
            <div className="card text-center" style={{ backgroundColor: "var(--color-warm-off-white)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "var(--color-deep-navy)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--spacing-3)", fontSize: "1.2rem", fontWeight: 800 }}>
                1
              </div>
              <h3>Search Neighbourhood</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--color-dark-slate)", margin: 0 }}>
                Enter your Punjab city and neighbourhood to view active milk routes operating in your street.
              </p>
            </div>

            <div className="card text-center" style={{ backgroundColor: "var(--color-warm-off-white)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "var(--color-teal)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--spacing-3)", fontSize: "1.2rem", fontWeight: 800 }}>
                2
              </div>
              <h3>Select Verified Gwala</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--color-dark-slate)", margin: 0 }}>
                Compare prices per litre, customer ratings, lactometer checks, and route delivery timings.
              </p>
            </div>

            <div className="card text-center" style={{ backgroundColor: "var(--color-warm-off-white)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "var(--color-deep-navy)", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--spacing-3)", fontSize: "1.2rem", fontWeight: 800 }}>
                3
              </div>
              <h3>Fresh Morning Delivery</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--color-dark-slate)", margin: 0 }}>
                Receive pure milk every morning at your doorstep. Track deliveries and pay via COD or online.
              </p>
            </div>
          </div>
        </section>

        {/* Trust & Safety Highlights */}
        <section className="card mb-12" style={{ backgroundColor: "var(--color-dark-trust-blue)", color: "#FFFFFF", padding: "var(--spacing-8)" }}>
          <h2 className="text-center mb-8" style={{ color: "#FFFFFF" }}>Our Trust & Purity Commitment</h2>

          <div className="md:grid md:grid-cols-3 gap-6">
            <div className="card text-center" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "#FFFFFF", borderColor: "rgba(255,255,255,0.1)" }}>
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>🛡️</div>
              <h3 style={{ color: "var(--color-pale-mint)", fontSize: "1.1rem" }}>CNIC Document Audits</h3>
              <p style={{ fontSize: "0.85rem", color: "#CBD5E1", margin: 0 }}>
                Every vendor application is audited by administrators. CNICs are hashed with SHA-256 to prevent unauthorized duplicates.
              </p>
            </div>

            <div className="card text-center" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "#FFFFFF", borderColor: "rgba(255,255,255,0.1)" }}>
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>🧪</div>
              <h3 style={{ color: "var(--color-pale-mint)", fontSize: "1.1rem" }}>Density & Quality Checks</h3>
              <p style={{ fontSize: "0.85rem", color: "#CBD5E1", margin: 0 }}>
                Automatic quality safeguards flag any vendor whose customer rating falls below 3.0 stars for mandatory inspection.
              </p>
            </div>

            <div className="card text-center" style={{ backgroundColor: "rgba(255,255,255,0.08)", color: "#FFFFFF", borderColor: "rgba(255,255,255,0.1)" }}>
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>📍</div>
              <h3 style={{ color: "var(--color-pale-mint)", fontSize: "1.1rem" }}>Address Privacy</h3>
              <p style={{ fontSize: "0.85rem", color: "#CBD5E1", margin: 0 }}>
                Your exact delivery house address and map pins are kept strictly private and accessible only to your assigned gwala.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: "var(--color-white)", borderTop: "1px solid var(--color-border)", padding: "var(--spacing-8) 0" }}>
        <div className="container flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: "1.2rem" }}>🥛</span>
            <span style={{ fontWeight: 800, color: "var(--color-deep-navy)" }}>Khalis Doodh</span>
            <span style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>© 2026 Punjab Local Milk Marketplace</span>
          </div>

          <div className="flex gap-6" style={{ fontSize: "0.9rem", flexWrap: "wrap" }}>
            <Link href="/help">Help & Support</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/refunds">Refund Policy</Link>
            <Link href="/status">System Status</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}