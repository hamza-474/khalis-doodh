"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminUnitEconomicsPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/unit-economics")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.unitEconomics);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-col min-h-screen">
      <Header />

      <main className="container mt-8 mb-12" style={{ flex: 1 }}>
        <div className="flex justify-between items-center mb-6" style={{ flexWrap: "wrap", gap: "var(--spacing-4)" }}>
          <div>
            <span className="badge badge-mint mb-2">📊 Unit-Economics & Operations Density</span>
            <h1 style={{ margin: 0 }}>Unit Economics Dashboard</h1>
            <p style={{ color: "var(--color-dark-slate)", marginTop: 4 }}>
              Persisted route performance metrics, order density, and honest cost allocation accounting.
            </p>
          </div>
          <Link href="/admin" className="btn btn-outline">← Admin Overview</Link>
        </div>

        {/* Honest Cost Accounting Notice */}
        <div className="card mb-8" style={{ backgroundColor: "#FEFCBF", border: "1px solid #D69E2E" }}>
          <div className="flex items-center gap-4">
            <span style={{ fontSize: "1.5rem" }}>⚖️</span>
            <div>
              <strong style={{ color: "#744210" }}>Honest Financial Accounting Safeguard:</strong>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#744210" }}>
                Routes are never labeled profitable without persisted logistics and marketing cost entries. Status: <strong>{data?.netContributionStatus || "Loading..."}</strong>
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <p>Calculating unit-economics metrics...</p>
        ) : (
          <div className="md:grid md:grid-cols-3 gap-6 mb-8">
            <div className="card text-center" style={{ borderLeft: "6px solid var(--color-teal)" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>Active Customers</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-deep-navy)", margin: "8px 0" }}>{data?.activeCustomers}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-teal)" }}>{data?.avgLitresPerCustomer} Litres/Customer/Day</div>
            </div>

            <div className="card text-center" style={{ borderLeft: "6px solid var(--color-deep-navy)" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>Verified Route Vendors</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-deep-navy)", margin: "8px 0" }}>{data?.activeGwalas}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-teal)" }}>{data?.routeDensity} Active Subscriptions/Route</div>
            </div>

            <div className="card text-center" style={{ borderLeft: "6px solid #D69E2E" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>Avg Subscription Value</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#D69E2E", margin: "8px 0" }}>PKR {data?.avgSubscriptionValue}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>Per Monthly Cycle</div>
            </div>

            <div className="card text-center" style={{ borderLeft: "6px solid #38A169" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>Delivery Completion Rate</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#38A169", margin: "8px 0" }}>{data?.completionRate}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>Missed Delivery Rate: {data?.missedRate}</div>
            </div>

            <div className="card text-center" style={{ borderLeft: "6px solid var(--color-teal)" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>Average Quality Score</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-teal)", margin: "8px 0" }}>★ {data?.avgRatingScore}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-muted)" }}>{data?.complaintRatePer100} Complaints per 100 Deliveries</div>
            </div>

            <div className="card text-center" style={{ borderLeft: "6px solid var(--color-deep-navy)" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>Expansion Waitlist Demand</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-deep-navy)", margin: "8px 0" }}>{data?.waitlists}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--color-teal)" }}>Unserved Area Requests</div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
