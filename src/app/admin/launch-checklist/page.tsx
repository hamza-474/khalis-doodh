"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useState } from "react";

export default function LaunchChecklistPage() {
  const [checklist, setChecklist] = useState([
    { id: 1, category: "Legal & Regulatory", title: "Punjab Food Authority (PFA) Marketplace Compliance", status: "requires_review", note: "Requires human review: Local legal & food safety advisor verification." },
    { id: 2, category: "Tax & Accounting", title: "Commission & Vendor Payout Tax Structure", status: "requires_review", note: "Requires human review: Obtain local accounting advice before final tax filing." },
    { id: 3, category: "Vendor Legal Agreement", title: "Gwala Terms: Delivery Standards, CNIC Use & Fee Schedule", status: "completed", note: "Verified in Gwala Enrollment workflow." },
    { id: 4, category: "Customer Terms", title: "Customer Cancellation, Refund Window & Address Privacy", status: "completed", note: "Published on /terms & /refunds pages." },
    { id: 5, category: "Operations", title: "Incident Response Owner & Escalation Contact", status: "completed", note: "Assigned to Admin Operations Lead." },
    { id: 6, category: "Security & Privacy", title: "CNIC Document Retention & SHA-256 Hashing Audit", status: "completed", note: "Enforced in database engine." },
  ]);

  const toggleCheck = (id: number) => {
    setChecklist(checklist.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === "completed" ? "requires_review" : "completed"
        };
      }
      return item;
    }));
  };

  return (
    <div className="flex-col min-h-screen">
      <Header />

      <main className="container mt-8 mb-12" style={{ flex: 1 }}>
        <div className="flex justify-between items-center mb-6" style={{ flexWrap: "wrap", gap: "var(--spacing-4)" }}>
          <div>
            <span className="badge badge-mint mb-2">🚀 Geofence & City Expansion Tooling</span>
            <h1 style={{ margin: 0 }}>City Expansion Launch Readiness Checklist</h1>
            <p style={{ color: "var(--color-dark-slate)", marginTop: 4 }}>
              Mandatory operational safeguards before opening public marketplace routes in new Punjab districts.
            </p>
          </div>
          <Link href="/admin" className="btn btn-outline">← Admin Overview</Link>
        </div>

        <div className="flex-col gap-4 mb-8">
          {checklist.map((item) => (
            <div key={item.id} className="card flex justify-between items-center" style={{ borderLeft: `6px solid ${item.status === "completed" ? "var(--color-teal)" : "#D69E2E"}` }}>
              <div>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--color-muted)" }}>{item.category.toUpperCase()}</span>
                <h3 style={{ fontSize: "1.2rem", margin: "2px 0 4px 0" }}>{item.title}</h3>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--color-dark-slate)" }}>{item.note}</p>
              </div>

              <button 
                onClick={() => toggleCheck(item.id)}
                className={`btn ${item.status === "completed" ? "btn-secondary" : "btn-outline"}`}
                style={{ minHeight: 38, fontSize: "0.85rem", whiteSpace: "nowrap" }}
              >
                {item.status === "completed" ? "✓ PASSED AUDIT" : "⚠️ REQUIRES HUMAN REVIEW"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
