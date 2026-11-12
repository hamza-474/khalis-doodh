"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function GwalaStopsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sampleGwalaId = "sample-gwala-rafiq-id";

  useEffect(() => {
    fetch(`/api/gwala/deliveries?gwalaId=${sampleGwalaId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSubscriptions(data.subscriptions);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-col min-h-screen">
      <Header />

      <main className="container mt-8 mb-8" style={{ flex: 1 }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 style={{ margin: 0 }}>My Route Exact Delivery Stops</h1>
            <p style={{ color: "var(--color-dark-slate)", marginTop: 4 }}>
              🔒 Protected View: Showing exact delivery addresses for your active accepted customer subscriptions only.
            </p>
          </div>
          <Link href="/gwala" className="btn btn-outline">← Back to Workspace</Link>
        </div>

        {loading ? (
          <p>Loading stops...</p>
        ) : subscriptions.length === 0 ? (
          <div className="card text-center" style={{ padding: "var(--spacing-8)" }}>
            <h3>No Active Customer Stops</h3>
          </div>
        ) : (
          <div className="flex-col gap-4">
            {subscriptions.map((sub, idx) => (
              <div key={sub.id} className="card" style={{ borderLeft: "6px solid var(--color-deep-navy)" }}>
                <div className="flex justify-between items-start" style={{ flexWrap: "wrap", gap: "var(--spacing-4)" }}>
                  <div>
                    <span style={{ backgroundColor: "var(--color-pale-mint)", color: "var(--color-teal)", padding: "2px 8px", borderRadius: "var(--radius-pill)", fontSize: "0.8rem", fontWeight: 700 }}>
                      Stop #{idx + 1}
                    </span>
                    <h3 style={{ fontSize: "1.25rem", margin: "var(--spacing-2) 0" }}>{sub.customer?.name}</h3>
                    <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--color-deep-navy)", margin: "4px 0" }}>
                      📍 {sub.addressLine}
                    </p>
                    {sub.landmark && (
                      <p style={{ fontSize: "0.9rem", color: "var(--color-dark-slate)", margin: "2px 0" }}>
                        🏢 Landmark: <strong>{sub.landmark}</strong>
                      </p>
                    )}
                    <p style={{ fontSize: "0.85rem", color: "#718096", margin: "4px 0" }}>
                      Area: {sub.area}, {sub.city} | Contact: {sub.customer?.phone}
                    </p>
                  </div>

                  <div className="card text-center" style={{ backgroundColor: "var(--color-warm-off-white)", minWidth: 180 }}>
                    <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-teal)" }}>{sub.litresPerDay} Litres</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--color-dark-slate)" }}>Daily Quantity</div>
                    {sub.mapLatitude && sub.mapLongitude && (
                      <a 
                        href={`https://maps.google.com/?q=${sub.mapLatitude},${sub.mapLongitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-secondary mt-2 w-full"
                        style={{ minHeight: 32, fontSize: "0.75rem" }}
                      >
                        🗺️ Open Map Pin
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
