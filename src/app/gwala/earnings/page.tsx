"use client";

import Header from "@/components/Header";
import Link from "next/link";

export default function GwalaEarningsPage() {
  return (
    <div className="flex-col min-h-screen">
      <Header />

      <main className="container mt-8 mb-8" style={{ flex: 1 }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 style={{ margin: 0 }}>Gwala Earnings & Payments</h1>
            <p style={{ color: "var(--color-dark-slate)", marginTop: 4 }}>
              Al-Madina Pure Buffalo Milk — Delivery Accounting Summary
            </p>
          </div>
          <Link href="/gwala" className="btn btn-outline">← Back to Workspace</Link>
        </div>

        {/* Payout Provider Boundary Notice */}
        <div className="card mb-8" style={{ backgroundColor: "var(--color-pale-mint)", border: "1px solid var(--color-teal)" }}>
          <div className="flex items-center gap-4">
            <span style={{ fontSize: "1.5rem" }}>🏦</span>
            <div>
              <strong style={{ color: "var(--color-deep-navy)" }}>Digital Payout Provider Boundary:</strong>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-dark-slate)" }}>
                Direct bank/wallet payouts are provider-gated. Cash on Delivery (COD) payments are marked paid by you upon delivery. Automated payout gateway integration activates when provider credentials are added.
              </p>
            </div>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="md:grid md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center" style={{ borderTop: "4px solid var(--color-teal)" }}>
            <div style={{ fontSize: "0.9rem", color: "var(--color-dark-slate)" }}>Expected Monthly Revenue</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-deep-navy)", margin: "var(--spacing-2) 0" }}>PKR 14,400</div>
            <div style={{ fontSize: "0.8rem", color: "var(--color-teal)" }}>Active Subscriptions: 1</div>
          </div>

          <div className="card text-center" style={{ borderTop: "4px solid #D69E2E" }}>
            <div style={{ fontSize: "0.9rem", color: "var(--color-dark-slate)" }}>Pending COD Collection</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#D69E2E", margin: "var(--spacing-2) 0" }}>PKR 14,400</div>
            <div style={{ fontSize: "0.8rem", color: "var(--color-dark-slate)" }}>1 Pending Receipt</div>
          </div>

          <div className="card text-center" style={{ borderTop: "4px solid #38A169" }}>
            <div style={{ fontSize: "0.9rem", color: "var(--color-dark-slate)" }}>Collected Payments (This Month)</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#38A169", margin: "var(--spacing-2) 0" }}>PKR 0</div>
            <div style={{ fontSize: "0.8rem", color: "var(--color-dark-slate)" }}>0 Paid Receipts</div>
          </div>
        </div>

        {/* Accounting Table */}
        <h2 className="mb-4">Payment Receipts</h2>
        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--color-warm-off-white)", borderBottom: "1px solid var(--color-border)" }}>
                <th style={{ padding: "12px 16px" }}>Receipt Code</th>
                <th style={{ padding: "12px 16px" }}>Customer</th>
                <th style={{ padding: "12px 16px" }}>Amount</th>
                <th style={{ padding: "12px 16px" }}>Method</th>
                <th style={{ padding: "12px 16px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td style={{ padding: "12px 16px", fontWeight: 700 }}>REC-20260824-001</td>
                <td style={{ padding: "12px 16px" }}>Hassan Ali (DHA Phase 5)</td>
                <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--color-deep-navy)" }}>PKR 14,400</td>
                <td style={{ padding: "12px 16px" }}>Cash on Delivery</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ backgroundColor: "#FEFCBF", color: "#744210", padding: "2px 8px", borderRadius: "var(--radius-pill)", fontSize: "0.75rem", fontWeight: 700 }}>
                    PENDING COLLECTION
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
