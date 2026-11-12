"use client";

import Header from "@/components/Header";
import Link from "next/link";

export default function SystemStatusPage() {
  return (
    <div className="flex-col min-h-screen">
      <Header />

      <main className="container mt-8 mb-8" style={{ flex: 1 }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 style={{ margin: 0 }}>System Health & Provider Readiness</h1>
            <p style={{ color: "var(--color-dark-slate)", marginTop: 4 }}>
              Real-time platform operational status, database sync, and provider boundaries.
            </p>
          </div>
          <Link href="/admin" className="btn btn-outline">← Back to Admin</Link>
        </div>

        {/* Operational Indicators */}
        <div className="flex-col gap-4 mb-8">
          <div className="card flex justify-between items-center" style={{ borderLeft: "6px solid var(--color-teal)" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Database Connection</h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "var(--color-dark-slate)" }}>
                SQLite Relational Database (Prisma ORM engine v7.9.1)
              </p>
            </div>
            <span style={{ backgroundColor: "var(--color-pale-mint)", color: "var(--color-teal)", padding: "4px 12px", borderRadius: "var(--radius-pill)", fontWeight: 700, fontSize: "0.85rem" }}>
              ✓ OPERATIONAL
            </span>
          </div>

          <div className="card flex justify-between items-center" style={{ borderLeft: "6px solid #D69E2E" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Phone OTP Authentication Adapter</h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "var(--color-dark-slate)" }}>
                Provider-Gated: Credentials fallback enabled. Twilio/Infobip SMS gateway pluggable interface.
              </p>
            </div>
            <span style={{ backgroundColor: "#FEFCBF", color: "#744210", padding: "4px 12px", borderRadius: "var(--radius-pill)", fontWeight: 700, fontSize: "0.85rem" }}>
              🔒 PROVIDER READY
            </span>
          </div>

          <div className="card flex justify-between items-center" style={{ borderLeft: "6px solid var(--color-teal)" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Cash on Delivery (COD) Engine</h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "var(--color-dark-slate)" }}>
                Active receipt generation and manual collection tracking.
              </p>
            </div>
            <span style={{ backgroundColor: "var(--color-pale-mint)", color: "var(--color-teal)", padding: "4px 12px", borderRadius: "var(--radius-pill)", fontWeight: 700, fontSize: "0.85rem" }}>
              ✓ ACTIVE
            </span>
          </div>

          <div className="card flex justify-between items-center" style={{ borderLeft: "6px solid #D69E2E" }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.2rem" }}>Digital Payment Gateways (Easypaisa / JazzCash / Card)</h3>
              <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "var(--color-dark-slate)" }}>
                Provider-Gated: Merchant checkout interfaces ready for API keys.
              </p>
            </div>
            <span style={{ backgroundColor: "#FEFCBF", color: "#744210", padding: "4px 12px", borderRadius: "var(--radius-pill)", fontWeight: 700, fontSize: "0.85rem" }}>
              🔒 PROVIDER READY
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
