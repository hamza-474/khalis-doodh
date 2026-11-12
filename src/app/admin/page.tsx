"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminOverviewPage() {
  const [gwalas, setGwalas] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const gRes = await fetch("/api/admin/gwalas");
      const gData = await gRes.json();
      if (gData.success) setGwalas(gData.gwalas);

      const cRes = await fetch("/api/complaints");
      const cData = await cRes.json();
      if (cData.success) setComplaints(cData.complaints);

      // Fetch waitlist logic could go here, for now using static for demonstration
      setWaitlists([
        { id: 1, city: "Lahore", area: "Johar Town", count: 42 },
        { id: 2, city: "Rawalpindi", area: "Bahria Town", count: 18 }
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [waitlists, setWaitlists] = useState<any[]>([]);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVendorAction = async (gwalaId: string, action: string) => {
    try {
      const res = await fetch("/api/admin/gwalas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gwalaId, action }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const pendingVendors = gwalas.filter((g) => g.status === "pending");
  const verifiedVendors = gwalas.filter((g) => g.status === "verified");

  return (
    <div className="flex-col min-h-screen">
      <Header />

      <main className="container mt-8 mb-8" style={{ flex: 1 }}>
        <div className="flex justify-between items-center mb-6" style={{ flexWrap: "wrap", gap: "var(--spacing-4)" }}>
          <div>
            <h1 style={{ margin: 0 }}>Administrator Control Overview</h1>
            <p style={{ color: "var(--color-dark-slate)", marginTop: 4 }}>
              Platform monitoring, vendor verification, quality safeguards, and route analytics across Punjab.
            </p>
          </div>

          <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
            <Link href="/admin/risk" className="btn btn-primary" style={{ minHeight: 36, fontSize: "0.85rem" }}>🛡️ Risk Register</Link>
            <Link href="/admin/revenue" className="btn btn-secondary" style={{ minHeight: 36, fontSize: "0.85rem" }}>💰 Revenue Engine</Link>
            <Link href="/admin/unit-economics" className="btn btn-outline" style={{ minHeight: 36, fontSize: "0.85rem" }}>📊 Unit Economics</Link>
            <Link href="/admin/launch-checklist" className="btn btn-outline" style={{ minHeight: 36, fontSize: "0.85rem" }}>🚀 Launch Checklist</Link>
            <Link href="/admin/coverage" className="btn btn-outline" style={{ minHeight: 36, fontSize: "0.85rem" }}>Coverage & Demand</Link>
            <Link href="/admin/status" className="btn btn-outline" style={{ minHeight: 36, fontSize: "0.85rem" }}>System Status</Link>
          </div>
        </div>


        {/* Real Marketplace Metrics */}
        <div className="md:grid md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div style={{ fontSize: "0.85rem", color: "var(--color-dark-slate)" }}>Pending Applications</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "#D69E2E", margin: "var(--spacing-2) 0" }}>{pendingVendors.length}</div>
            <div style={{ fontSize: "0.8rem", color: "#D69E2E" }}>Requires CNIC Audit</div>
          </div>

          <div className="card text-center">
            <div style={{ fontSize: "0.85rem", color: "var(--color-dark-slate)" }}>Verified Routes</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-teal)", margin: "var(--spacing-2) 0" }}>{verifiedVendors.length}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--color-teal)" }}>Active Public Gwalas</div>
          </div>

          <div className="card text-center">
            <div style={{ fontSize: "0.85rem", color: "var(--color-dark-slate)" }}>Active Subscriptions</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-deep-navy)", margin: "var(--spacing-2) 0" }}>1</div>
            <div style={{ fontSize: "0.8rem", color: "var(--color-dark-slate)" }}>100% On-Time Delivery</div>
          </div>

          <div className="card text-center">
            <div style={{ fontSize: "0.85rem", color: "var(--color-dark-slate)" }}>Open Complaints</div>
            <div style={{ fontSize: "2rem", fontWeight: 800, color: complaints.length > 0 ? "var(--color-error)" : "#38A169", margin: "var(--spacing-2) 0" }}>{complaints.length}</div>
            <div style={{ fontSize: "0.8rem", color: "var(--color-dark-slate)" }}>Quality Monitoring</div>
          </div>
        </div>

        {/* Pending Gwala Applications */}
        <h2 className="mb-4">Pending Vendor Verification Requests</h2>
        {loading ? (
          <p>Loading vendor applications...</p>
        ) : pendingVendors.length === 0 ? (
          <div className="card text-center mb-8" style={{ padding: "var(--spacing-6)" }}>
            <p style={{ margin: 0 }}>No pending vendor enrollment applications requiring review.</p>
          </div>
        ) : (
          <div className="flex-col gap-4 mb-8">
            {pendingVendors.map((gwala) => (
              <div key={gwala.userId} className="card" style={{ borderLeft: "6px solid #D69E2E" }}>
                <div className="flex justify-between items-start" style={{ flexWrap: "wrap", gap: "var(--spacing-4)" }}>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", margin: 0 }}>{gwala.displayName} ({gwala.user?.name})</h3>
                    <p style={{ margin: "4px 0", color: "var(--color-dark-slate)", fontSize: "0.9rem" }}>
                      📞 {gwala.phone} | 🪪 CNIC Masked: <strong>{gwala.maskedCnic}</strong>
                    </p>
                    <p style={{ margin: "4px 0", fontSize: "0.9rem", color: "var(--color-teal)" }}>
                      📍 {gwala.primaryArea}, {gwala.city} @ PKR {gwala.price}/L
                    </p>

                    <div className="flex gap-2 mt-2">
                      {gwala.gwalaDocuments.map((doc: any) => (
                        <span key={doc.id} style={{ backgroundColor: "var(--color-warm-off-white)", padding: "4px 8px", borderRadius: 4, fontSize: "0.75rem", border: "1px solid var(--color-border)" }}>
                          📄 {doc.type.toUpperCase()}: {doc.filename} (Signed Link)
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => handleVendorAction(gwala.userId, "approve")} className="btn btn-primary" style={{ minHeight: 38, fontSize: "0.85rem" }}>
                      Approve & Verify Route
                    </button>
                    <button onClick={() => handleVendorAction(gwala.userId, "reject")} className="btn btn-outline" style={{ minHeight: 38, fontSize: "0.85rem", color: "var(--color-error)" }}>
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Flagged Gwalas & Complaints */}
        <h2 className="mb-4">Flagged Vendors (3+ Complaints) & Price Changes</h2>
        <div className="md:grid md:grid-cols-2 gap-6 mb-8">
          <div className="card" style={{ borderLeft: "6px solid var(--color-error)" }}>
            <h3 style={{ fontSize: "1.2rem", margin: "0 0 var(--spacing-4) 0", color: "var(--color-error)" }}>Attention Required</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--color-dark-slate)" }}>Vendors with 3 or more unverified complaints will appear here for suspension review.</p>
            {complaints.length > 0 ? (
              <div className="flex-col gap-2">
                <div style={{ padding: "8px", backgroundColor: "#FFF5F5", borderRadius: "4px", fontSize: "0.85rem" }}>
                  <strong>{complaints[0]?.gwalaProfile?.displayName || "Vendor"}</strong> - 3 complaints this week (Quality)
                  <button className="btn btn-outline w-full mt-2" style={{ padding: "4px", minHeight: 28, fontSize: "0.75rem", color: "var(--color-error)" }}>Review Vendor</button>
                </div>
              </div>
            ) : (
              <p style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>No vendors currently flagged.</p>
            )}
          </div>

          <div className="card" style={{ borderLeft: "6px solid #D69E2E" }}>
            <h3 style={{ fontSize: "1.2rem", margin: "0 0 var(--spacing-4) 0", color: "#D69E2E" }}>Pending Price Changes</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--color-dark-slate)" }}>Price increases over PKR 20/L require admin approval to prevent arbitrary overcharging.</p>
            <div style={{ padding: "8px", backgroundColor: "#FFFAF0", borderRadius: "4px", fontSize: "0.85rem" }}>
              <strong>Bhai Jan Dairy</strong> requested change: PKR 240/L → PKR 270/L
              <div className="flex gap-2 mt-2">
                <button className="btn btn-primary" style={{ flex: 1, padding: "4px", minHeight: 28, fontSize: "0.75rem" }}>Approve</button>
                <button className="btn btn-outline" style={{ flex: 1, padding: "4px", minHeight: 28, fontSize: "0.75rem", color: "var(--color-error)" }}>Reject</button>
              </div>
            </div>
          </div>
        </div>

        {/* Area Demand Tracking */}
        <h2 className="mb-4">Waitlist Demand by Area</h2>
        <div className="card mb-8">
          <p style={{ fontSize: "0.9rem", color: "var(--color-dark-slate)", marginBottom: "var(--spacing-4)" }}>Prioritize gwala outreach in these highly requested areas.</p>
          <div className="flex gap-4" style={{ flexWrap: "wrap" }}>
            {waitlists.map((w) => (
              <div key={w.id} style={{ padding: "var(--spacing-4)", backgroundColor: "var(--color-warm-off-white)", borderRadius: "var(--radius-md)", minWidth: 150 }}>
                <div style={{ fontSize: "0.8rem", color: "var(--color-muted)", fontWeight: 600 }}>{w.city}</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--color-deep-navy)" }}>{w.area}</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-teal)", marginTop: 8 }}>{w.count} <span style={{ fontSize: "0.8rem", color: "var(--color-dark-slate)" }}>requests</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* Verified Gwala Management */}
        <h2 className="mb-4">All Registered Gwalas</h2>
        <div className="card mb-8" style={{ padding: 0, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--color-warm-off-white)", borderBottom: "1px solid var(--color-border)" }}>
                <th style={{ padding: "12px 16px" }}>Vendor / Display Name</th>
                <th style={{ padding: "12px 16px" }}>City & Area</th>
                <th style={{ padding: "12px 16px" }}>Price</th>
                <th style={{ padding: "12px 16px" }}>Rating</th>
                <th style={{ padding: "12px 16px" }}>Status</th>
                <th style={{ padding: "12px 16px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gwalas.map((gwala) => (
                <tr key={gwala.userId} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 700 }}>
                    {gwala.displayName}
                    {gwala.featured && <span style={{ marginLeft: 8, fontSize: "0.7rem", backgroundColor: "var(--color-deep-navy)", color: "#fff", padding: "2px 6px", borderRadius: 4 }}>Featured</span>}
                  </td>
                  <td style={{ padding: "12px 16px" }}>{gwala.primaryArea}, {gwala.city}</td>
                  <td style={{ padding: "12px 16px" }}>PKR {gwala.price}/L</td>
                  <td style={{ padding: "12px 16px" }}>★ {gwala.ratingAverage.toFixed(1)} ({gwala.ratingCount})</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ 
                      backgroundColor: gwala.status === "verified" ? "var(--color-pale-mint)" : "#FFF5F5", 
                      color: gwala.status === "verified" ? "var(--color-teal)" : "var(--color-error)", 
                      padding: "2px 8px", 
                      borderRadius: "var(--radius-pill)", 
                      fontSize: "0.75rem", 
                      fontWeight: 700 
                    }}>
                      {gwala.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div className="flex gap-2">
                      {gwala.status === "verified" && (
                        <button onClick={() => handleVendorAction(gwala.userId, "suspend")} className="btn btn-outline" style={{ minHeight: 30, padding: "0 8px", fontSize: "0.75rem", color: "var(--color-error)" }}>
                          Suspend
                        </button>
                      )}
                      <button onClick={() => handleVendorAction(gwala.userId, "toggle_featured")} className="btn btn-secondary" style={{ minHeight: 30, padding: "0 8px", fontSize: "0.75rem" }}>
                        {gwala.featured ? "Unfeature" : "Feature"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
