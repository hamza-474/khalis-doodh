"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminRiskPage() {
  const [riskCases, setRiskCases] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  // New Case Modal Form State
  const [showNewModal, setShowNewModal] = useState(false);
  const [newRiskType, setNewRiskType] = useState("quality");
  const [newSeverity, setNewSeverity] = useState("medium");
  const [newEvidence, setNewEvidence] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newOwner, setNewOwner] = useState("admin_ops");

  // Update Case State
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [resolutionText, setResolutionText] = useState("");
  const [statusValue, setStatusValue] = useState("");

  const fetchRiskData = async () => {
    try {
      const url = filterSeverity === "all" ? "/api/admin/risk" : `/api/admin/risk?severity=${filterSeverity}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setRiskCases(data.riskCases);
        setAuditLogs(data.auditLogs);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRiskData();
  }, [filterSeverity]);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          riskType: newRiskType,
          severity: newSeverity,
          evidenceSummary: newEvidence,
          internalNotes: newNotes,
          owner: newOwner,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowNewModal(false);
        setNewEvidence("");
        setNewNotes("");
        fetchRiskData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;
    try {
      const res = await fetch("/api/admin/risk", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          riskId: selectedCase.id,
          status: statusValue,
          resolution: resolutionText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedCase(null);
        fetchRiskData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case "critical": return "badge badge-navy";
      case "high": return "badge badge-warning";
      case "medium": return "badge badge-mint";
      default: return "badge badge-mint";
    }
  };

  return (
    <div className="flex-col min-h-screen">
      <Header />

      <main className="container mt-8 mb-12" style={{ flex: 1 }}>
        <div className="flex justify-between items-center mb-6" style={{ flexWrap: "wrap", gap: "var(--spacing-4)" }}>
          <div>
            <span className="badge badge-mint mb-2">🛡️ Risk Register & Quality Safeguards</span>
            <h1 style={{ margin: 0 }}>Operational Escalation Command</h1>
            <p style={{ color: "var(--color-dark-slate)", marginTop: 4 }}>
              Database-backed risk register, identity audit queue, and admin audit trail.
            </p>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setShowNewModal(true)} className="btn btn-primary">
              + Log Risk Case
            </button>
            <Link href="/admin" className="btn btn-outline">← Admin Overview</Link>
          </div>
        </div>

        {/* Severity Filter Controls */}
        <div className="flex gap-2 mb-6" style={{ flexWrap: "wrap" }}>
          {["all", "critical", "high", "medium", "low"].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`btn ${filterSeverity === sev ? "btn-primary" : "btn-outline"}`}
              style={{ minHeight: 36, padding: "0 14px", fontSize: "0.85rem" }}
            >
              {sev.toUpperCase()} SEVERITY
            </button>
          ))}
        </div>

        {/* Risk Cases Table */}
        <h2 className="mb-4">Active Risk Register Cases</h2>
        {loading ? (
          <p>Loading operational risk cases...</p>
        ) : riskCases.length === 0 ? (
          <div className="card text-center mb-8 py-8">
            <p style={{ margin: 0, color: "var(--color-muted)" }}>No risk cases found for the selected severity level.</p>
          </div>
        ) : (
          <div className="card mb-8" style={{ padding: 0, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-warm-off-white)", borderBottom: "1px solid var(--color-border)" }}>
                  <th style={{ padding: "12px 16px" }}>Type</th>
                  <th style={{ padding: "12px 16px" }}>Severity</th>
                  <th style={{ padding: "12px 16px" }}>Evidence Summary</th>
                  <th style={{ padding: "12px 16px" }}>Owner</th>
                  <th style={{ padding: "12px 16px" }}>Status</th>
                  <th style={{ padding: "12px 16px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {riskCases.map((rc) => (
                  <tr key={rc.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 700 }}>{rc.riskType.toUpperCase()}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className={getSeverityBadgeClass(rc.severity)}>{rc.severity.toUpperCase()}</span>
                    </td>
                    <td style={{ padding: "12px 16px", maxWidth: 320 }}>
                      <div>{rc.evidenceSummary}</div>
                      {rc.resolution && (
                        <div style={{ fontSize: "0.8rem", color: "var(--color-teal)", marginTop: 4 }}>
                          ✓ Resolution: {rc.resolution}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "12px 16px", fontSize: "0.85rem" }}>{rc.owner}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ 
                        backgroundColor: rc.status === "resolved" ? "var(--color-pale-mint)" : "#FEFCBF",
                        color: rc.status === "resolved" ? "var(--color-teal)" : "#744210",
                        padding: "2px 8px", borderRadius: "var(--radius-pill)", fontSize: "0.75rem", fontWeight: 700 
                      }}>
                        {rc.status.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <button 
                        onClick={() => { setSelectedCase(rc); setStatusValue(rc.status); setResolutionText(rc.resolution || ""); }}
                        className="btn btn-secondary"
                        style={{ minHeight: 30, padding: "0 10px", fontSize: "0.75rem" }}
                      >
                        Review / Resolve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Audit Log Table */}
        <h2 className="mb-4">System Audit Trail</h2>
        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--color-warm-off-white)", borderBottom: "1px solid var(--color-border)" }}>
                <th style={{ padding: "12px 16px" }}>Timestamp</th>
                <th style={{ padding: "12px 16px" }}>Actor</th>
                <th style={{ padding: "12px 16px" }}>Action</th>
                <th style={{ padding: "12px 16px" }}>Entity</th>
                <th style={{ padding: "12px 16px" }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ padding: "12px 16px", fontSize: "0.8rem", color: "var(--color-muted)" }}>
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 600 }}>{log.actorId}</td>
                  <td style={{ padding: "12px 16px", color: "var(--color-deep-navy)", fontWeight: 700 }}>{log.action}</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem" }}>{log.entityType} ({log.entityId.slice(0, 8)}...)</td>
                  <td style={{ padding: "12px 16px", fontSize: "0.85rem", color: "var(--color-dark-slate)" }}>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* New Risk Case Modal */}
      {showNewModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--spacing-4)", zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: 550, width: "100%" }}>
            <h3 className="mb-4">Log Operational Risk Case</h3>
            <form onSubmit={handleCreateCase}>
              <div className="input-group">
                <label className="label">Risk Type</label>
                <select className="select" value={newRiskType} onChange={(e) => setNewRiskType(e.target.value)}>
                  <option value="quality">Milk Adulteration / Quality Concern</option>
                  <option value="cnic">False Identity / CNIC Dispute</option>
                  <option value="rating">Rating Manipulation</option>
                  <option value="delivery">No-Show Delivery / Lateness</option>
                  <option value="payment">Payment Dispute / COD Leakage</option>
                  <option value="privacy">Privacy / Address Protection</option>
                </select>
              </div>

              <div className="input-group">
                <label className="label">Severity Level</label>
                <select className="select" value={newSeverity} onChange={(e) => setNewSeverity(e.target.value)}>
                  <option value="low">Low (Standard review queue)</option>
                  <option value="medium">Medium (Ops review required)</option>
                  <option value="high">High (High priority operational alert)</option>
                  <option value="critical">Critical (Immediate route/vendor pause)</option>
                </select>
              </div>

              <div className="input-group">
                <label className="label">Evidence Summary *</label>
                <textarea className="textarea" rows={3} placeholder="Customer report details, lactometer readings, photo link..." value={newEvidence} onChange={(e) => setNewEvidence(e.target.value)} required />
              </div>

              <div className="input-group">
                <label className="label">Internal Ops Notes</label>
                <input type="text" className="input" placeholder="Assigned auditor or follow-up schedule..." value={newNotes} onChange={(e) => setNewNotes(e.target.value)} />
              </div>

              <div className="flex gap-2 mt-6">
                <button type="button" onClick={() => setShowNewModal(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Log Case</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review / Resolve Modal */}
      {selectedCase && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--spacing-4)", zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: 550, width: "100%" }}>
            <h3 className="mb-2">Review Risk Case #{selectedCase.id.slice(0, 8)}</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--color-dark-slate)", marginBottom: "var(--spacing-4)" }}>
              {selectedCase.evidenceSummary}
            </p>

            <form onSubmit={handleUpdateCase}>
              <div className="input-group">
                <label className="label">Status Action</label>
                <select className="select" value={statusValue} onChange={(e) => setStatusValue(e.target.value)}>
                  <option value="open">Open (Active)</option>
                  <option value="under_review">Under Review (Assigned auditor)</option>
                  <option value="resolved">Resolved (Action taken & documented)</option>
                  <option value="dismissed">Dismissed (False claim / Duplicate)</option>
                </select>
              </div>

              <div className="input-group">
                <label className="label">Resolution Summary & Audit Notes</label>
                <textarea className="textarea" rows={3} placeholder="Document outcome, credit issued, or route unpaused..." value={resolutionText} onChange={(e) => setResolutionText(e.target.value)} required />
              </div>

              <div className="flex gap-2 mt-6">
                <button type="button" onClick={() => setSelectedCase(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Resolution</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
