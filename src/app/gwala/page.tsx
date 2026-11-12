"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function GwalaDashboardPage() {
  const [gwalaData, setGwalaData] = useState<any | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Default sample gwala ID (Rafiq)
  const sampleGwalaId = "sample-gwala-rafiq-id";

  const fetchGwalaDetails = async () => {
    try {
      const res = await fetch(`/api/gwala/deliveries?gwalaId=${sampleGwalaId}`);
      const data = await res.json();
      if (data.success) {
        setSubscriptions(data.subscriptions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGwalaDetails();
  }, []);

  const handleUpdateStatus = async (deliveryId: string, status: string) => {
    try {
      const res = await fetch("/api/gwala/deliveries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliveryId, status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchGwalaDetails();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-col min-h-screen">
      <Header />

      <main className="container mt-8 mb-8" style={{ flex: 1 }}>
        <div className="flex justify-between items-center mb-6" style={{ flexWrap: "wrap", gap: "var(--spacing-4)" }}>
          <div>
            <div className="flex items-center gap-2">
              <h1 style={{ margin: 0 }}>Gwala Route Workspace</h1>
              <span style={{ backgroundColor: "var(--color-pale-mint)", color: "var(--color-teal)", padding: "2px 10px", borderRadius: "var(--radius-pill)", fontWeight: 700, fontSize: "0.85rem" }}>
                ✓ Verified Vendor
              </span>
            </div>
            <p style={{ color: "var(--color-dark-slate)", marginTop: 4 }}>Al-Madina Pure Buffalo Milk — DHA Phase 5 Route</p>
          </div>

          <div className="flex gap-2">
            <Link href="/gwala/stops" className="btn btn-primary">My Exact Stops</Link>
            <Link href="/gwala/earnings" className="btn btn-secondary">Earnings Summary</Link>
          </div>
        </div>

        {/* Live Delivery Checklist */}
        <h2 className="mb-4">Today's Delivery Checklist</h2>

        {loading ? (
          <p>Loading route checklist...</p>
        ) : subscriptions.length === 0 ? (
          <div className="card text-center" style={{ padding: "var(--spacing-8)" }}>
            <h3>No Active Route Stops</h3>
            <p>You have no active accepted customer delivery stops for today.</p>
          </div>
        ) : (
          <div className="flex-col gap-4">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="card">
                <div className="flex justify-between items-center" style={{ flexWrap: "wrap", gap: "var(--spacing-4)" }}>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", margin: 0 }}>{sub.customer?.name}</h3>
                    <p style={{ margin: "4px 0", color: "var(--color-dark-slate)", fontSize: "0.9rem" }}>
                      📞 {sub.customer?.phone} | 🥛 <strong>{sub.litresPerDay} Litres</strong> ({sub.plan})
                    </p>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-teal)", fontWeight: 600 }}>
                      📍 {sub.area}, {sub.city}
                    </p>
                  </div>

                  <div className="flex gap-2 items-center">
                    {sub.deliveryRecords.map((del: any) => (
                      <div key={del.id} className="flex gap-2 items-center">
                        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--color-deep-navy)" }}>Status: {del.status.toUpperCase()}</span>
                        
                        {del.status === "scheduled" && (
                          <>
                            <button onClick={() => handleUpdateStatus(del.id, "out_for_delivery")} className="btn btn-secondary" style={{ minHeight: 36, fontSize: "0.85rem" }}>
                              Out For Delivery
                            </button>
                            <button onClick={() => handleUpdateStatus(del.id, "missed")} className="btn btn-outline" style={{ minHeight: 36, fontSize: "0.85rem", color: "var(--color-error)", borderColor: "var(--color-error)" }}>
                              Mark Missed
                            </button>
                          </>
                        )}

                        {del.status === "out_for_delivery" && (
                          <>
                            <button onClick={() => handleUpdateStatus(del.id, "delivered")} className="btn btn-primary" style={{ minHeight: 36, fontSize: "0.85rem" }}>
                              Mark Delivered
                            </button>
                            <button onClick={() => handleUpdateStatus(del.id, "missed")} className="btn btn-outline" style={{ minHeight: 36, fontSize: "0.85rem", color: "var(--color-error)", borderColor: "var(--color-error)" }}>
                              Mark Missed
                            </button>
                          </>
                        )}
                        
                        {del.status === "delivered" && (
                          <button onClick={() => alert("Payment collected! Notification sent to customer for confirmation.")} className="btn btn-outline" style={{ minHeight: 36, fontSize: "0.85rem", borderColor: "var(--color-teal)", color: "var(--color-teal)" }}>
                            Mark Payment Collected (COD)
                          </button>
                        )}
                      </div>
                    ))}
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
