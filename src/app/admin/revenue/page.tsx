"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminRevenuePage() {
  const [config, setConfig] = useState<any | null>(null);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [commissionRate, setCommissionRate] = useState<number>(5.0);
  const [customerServiceFee, setCustomerServiceFee] = useState<number>(50.0);
  const [gwalaPlanPrice, setGwalaPlanPrice] = useState<number>(1500.0);
  const [deliveryConvenienceFee, setDeliveryConvenienceFee] = useState<number>(30.0);
  const [saveMsg, setSaveMsg] = useState<string>("");

  const fetchRevenueData = async () => {
    try {
      const res = await fetch("/api/admin/revenue");
      const data = await res.json();
      if (data.success) {
        setConfig(data.config);
        setMetrics(data.metrics);
        setCommissionRate(data.config.commissionRate);
        setCustomerServiceFee(data.config.customerServiceFee);
        setGwalaPlanPrice(data.config.gwalaPlanPrice);
        setDeliveryConvenienceFee(data.config.deliveryConvenienceFee);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, []);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/revenue", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commissionRate,
          customerServiceFee,
          gwalaPlanPrice,
          deliveryConvenienceFee,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveMsg("Revenue settings updated and logged to audit trail!");
        setTimeout(() => setSaveMsg(""), 3000);
        fetchRevenueData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-col min-h-screen">
      <Header />

      <main className="container mt-8 mb-12" style={{ flex: 1 }}>
        <div className="flex justify-between items-center mb-6" style={{ flexWrap: "wrap", gap: "var(--spacing-4)" }}>
          <div>
            <span className="badge badge-mint mb-2">💰 Multi-Layer Revenue & Fee Engine</span>
            <h1 style={{ margin: 0 }}>Revenue & Pricing Settings</h1>
            <p style={{ color: "var(--color-dark-slate)", marginTop: 4 }}>
              Configurable platform fees, commission rates, and transparent net contribution accounting.
            </p>
          </div>
          <Link href="/admin" className="btn btn-outline">← Admin Overview</Link>
        </div>

        {/* Live Calculation Cards */}
        {metrics && (
          <div className="md:grid md:grid-cols-4 gap-6 mb-8">
            <div className="card text-center" style={{ borderTop: "4px solid var(--color-deep-navy)" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>Gross Milk Value (GMV)</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-deep-navy)", margin: "8px 0" }}>
                PKR {metrics.grossMilkValue.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-teal)" }}>Completed Delivery Volume</div>
            </div>

            <div className="card text-center" style={{ borderTop: "4px solid var(--color-teal)" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>Platform Commission ({config?.commissionRate}%)</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--color-teal)", margin: "8px 0" }}>
                PKR {metrics.platformCommission.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>Deducted Upon Payment Settlement</div>
            </div>

            <div className="card text-center" style={{ borderTop: "4px solid #D69E2E" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>Customer Platform Fees</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#D69E2E", margin: "8px 0" }}>
                PKR {metrics.customerServiceFees.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>{metrics.activeSubscriptions} Active Subscriptions</div>
            </div>

            <div className="card text-center" style={{ borderTop: "4px solid #38A169" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>Estimated Gross Revenue</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#38A169", margin: "8px 0" }}>
                PKR {metrics.grossRevenue.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#38A169", fontWeight: 700 }}>Before Operational Expenses</div>
            </div>
          </div>
        )}

        {/* Config Form */}
        <div className="md:grid md:grid-cols-2 gap-8 mb-8">
          <div className="card">
            <h2 className="mb-4">Fee Structure Configuration</h2>

            {saveMsg && (
              <div className="mb-4" style={{ backgroundColor: "var(--color-pale-mint)", padding: "10px 14px", borderRadius: 8, color: "var(--color-teal)", fontWeight: 700 }}>
                {saveMsg}
              </div>
            )}

            <form onSubmit={handleSaveConfig}>
              <div className="input-group">
                <label className="label">Per-Order Marketplace Commission (%)</label>
                <input type="number" step="0.5" className="input" value={commissionRate} onChange={(e) => setCommissionRate(parseFloat(e.target.value))} required />
                <span style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>Deducted transparently from gwala payouts upon settlement.</span>
              </div>

              <div className="input-group">
                <label className="label">Monthly Customer Platform Fee (PKR)</label>
                <input type="number" className="input" value={customerServiceFee} onChange={(e) => setCustomerServiceFee(parseFloat(e.target.value))} required />
                <span style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>Small fixed platform fee displayed before checkout.</span>
              </div>

              <div className="input-group">
                <label className="label">Gwala Professional Plan (PKR/month)</label>
                <input type="number" className="input" value={gwalaPlanPrice} onChange={(e) => setGwalaPlanPrice(parseFloat(e.target.value))} required />
                <span style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>Optional route tools & analytics plan for vendors. Verification is never dependent on paying.</span>
              </div>

              <div className="input-group">
                <label className="label">Delivery Convenience Fee (PKR/delivery)</label>
                <input type="number" className="input" value={deliveryConvenienceFee} onChange={(e) => setDeliveryConvenienceFee(parseFloat(e.target.value))} required />
              </div>

              <button type="submit" className="btn btn-primary w-full mt-4">
                Save & Update Revenue Settings
              </button>
            </form>
          </div>

          <div className="card" style={{ backgroundColor: "var(--color-dark-trust-blue)", color: "#FFFFFF" }}>
            <h2 className="mb-4" style={{ color: "#FFFFFF" }}>Transparent Revenue Safeguards</h2>

            <div className="flex-col gap-4" style={{ fontSize: "0.9rem", color: "#E2E8F0" }}>
              <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 10 }}>
                <strong style={{ color: "var(--color-pale-mint)" }}>1. Verification Independence</strong>
                <p style={{ margin: "2px 0 0 0" }}>Gwala verification is based strictly on identity & route audits. Paid plans do not grant verification status.</p>
              </div>

              <div style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 10 }}>
                <strong style={{ color: "var(--color-pale-mint)" }}>2. Settled Deduction Only</strong>
                <p style={{ margin: "2px 0 0 0" }}>Marketplace commissions are calculated and deducted only after payment records are marked settled.</p>
              </div>

              <div>
                <strong style={{ color: "var(--color-pale-mint)" }}>3. Multi-Layer Formula Transparency</strong>
                <p style={{ margin: "2px 0 0 0" }}>
                  <code>Net Contribution = Total Revenue - Approved Refunds - Operational Logistics</code>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
