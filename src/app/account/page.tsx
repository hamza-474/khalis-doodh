"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AccountPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ratingModal, setRatingModal] = useState<any | null>(null);
  const [ratingScore, setRatingScore] = useState<number>(5);
  const [ratingComment, setRatingComment] = useState<string>("");
  const [ratingMsg, setRatingMsg] = useState<string>("");

  const [complaintModal, setComplaintModal] = useState<any | null>(null);
  const [complaintCategory, setComplaintCategory] = useState<string>("quality");
  const [complaintDetails, setComplaintDetails] = useState<string>("");
  const [complaintMsg, setComplaintMsg] = useState<string>("");

  const [cancelModal, setCancelModal] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState<string>("price");

  const loadSubscriptions = async () => {
    try {
      const res = await fetch("/api/subscriptions?customerId=sample-customer-hassan");
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
    loadSubscriptions();
  }, []);

  const handleStatusChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelModal) return;
    try {
      const res = await fetch("/api/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          subscriptionId: cancelModal.subscriptionId, 
          action: cancelModal.action,
          cancelReason: cancelReason
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCancelModal(null);
        loadSubscriptions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintModal) return;

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryId: complaintModal.deliveryId,
          customerId: "sample-customer-hassan",
          gwalaId: complaintModal.gwalaId,
          category: complaintCategory,
          details: complaintDetails,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setComplaintMsg(data.message || "Complaint submitted");
        setTimeout(() => {
          setComplaintModal(null);
          setComplaintMsg("");
          loadSubscriptions();
        }, 1500);
      } else {
        setComplaintMsg(data.error);
      }
    } catch (err: any) {
      setComplaintMsg(err.message || "Failed to submit complaint");
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingModal) return;

    try {
      const res = await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deliveryId: ratingModal.deliveryId,
          customerId: "sample-customer-hassan",
          gwalaId: ratingModal.gwalaId,
          score: ratingScore,
          comment: ratingComment,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRatingMsg(data.message);
        setTimeout(() => {
          setRatingModal(null);
          setRatingMsg("");
          loadSubscriptions();
        }, 1500);
      } else {
        setRatingMsg(data.error);
      }
    } catch (err: any) {
      setRatingMsg(err.message || "Failed to submit rating");
    }
  };

  return (
    <div className="flex-col min-h-screen">
      <Header />

      <main className="container mt-8 mb-8" style={{ flex: 1 }}>
        <h1 className="mb-2">My Account Workspace</h1>
        <p className="mb-8" style={{ color: "var(--color-dark-slate)" }}>Manage your milk subscriptions, schedule, ratings, and account settings.</p>

        {/* Provider Boundary Explicit Alert */}
        <div className="card mb-8" style={{ backgroundColor: "var(--color-pale-mint)", border: "1px solid var(--color-teal)" }}>
          <div className="flex items-center gap-4">
            <span style={{ fontSize: "1.5rem" }}>📱</span>
            <div>
              <strong style={{ color: "var(--color-deep-navy)" }}>Phone OTP Security Boundary:</strong>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-dark-slate)" }}>
                Phone-number OTP authentication is provider-gated. It will activate seamlessly once an approved SMS provider adapter (Twilio, Infobip, or local gateway) is connected with real credentials.
              </p>
            </div>
          </div>
        </div>

        {/* Referral Program Card */}
        <div className="card mb-8 flex justify-between items-center" style={{ backgroundColor: "var(--color-deep-navy)", color: "var(--color-white)" }}>
          <div>
            <h3 style={{ color: "var(--color-pale-mint)", margin: 0 }}>Your Referral Code: HASSAN786</h3>
            <p style={{ margin: "4px 0 0 0", fontSize: "0.9rem", color: "#E2E8F0" }}>
              Share with neighbors in your area to earn PKR 200 delivery credit when they subscribe!
            </p>
          </div>
          <button className="btn btn-secondary" onClick={() => navigator.clipboard.writeText("HASSAN786")}>Copy Code</button>
        </div>

        {/* Active Subscriptions Section */}
        <h2 className="mb-4">Active Subscriptions</h2>

        {loading ? (
          <p>Loading your subscription workspace...</p>
        ) : subscriptions.length === 0 ? (
          <div className="card text-center" style={{ padding: "var(--spacing-8)" }}>
            <h3>No Active Subscriptions Yet</h3>
            <p className="mt-2 mb-4">Browse verified gwalas in your neighbourhood to get started with daily milk deliveries.</p>
            <Link href="/subscribe" className="btn btn-primary">Subscribe Now</Link>
          </div>
        ) : (
          <div className="flex-col gap-6 mb-8">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="card" style={{ borderLeft: `6px solid ${sub.lifecycleStatus === "active" ? "var(--color-teal)" : "#E53E3E"}` }}>
                <div className="flex justify-between items-center" style={{ flexWrap: "wrap", gap: "var(--spacing-4)" }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 style={{ margin: 0 }}>{sub.gwalaProfile?.displayName}</h3>
                      <span style={{ 
                        backgroundColor: sub.lifecycleStatus === "active" ? "var(--color-pale-mint)" : "#FFF5F5", 
                        color: sub.lifecycleStatus === "active" ? "var(--color-teal)" : "var(--color-error)", 
                        padding: "2px 8px", 
                        borderRadius: "var(--radius-pill)", 
                        fontSize: "0.75rem", 
                        fontWeight: 700 
                      }}>
                        {sub.lifecycleStatus.toUpperCase()}
                      </span>
                    </div>

                    <p style={{ margin: "var(--spacing-2) 0", color: "var(--color-dark-slate)" }}>
                      📍 {sub.addressLine}, {sub.area}, {sub.city}
                    </p>

                    <div className="flex gap-4" style={{ fontSize: "0.9rem" }}>
                      <span><strong>Plan:</strong> {sub.plan} ({sub.litresPerDay}L/day)</span>
                      <span><strong>Pricing:</strong> PKR {sub.pricing}/L</span>
                      <span><strong>Payment:</strong> {sub.paymentMethod.toUpperCase()} ({sub.paymentStatus})</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {sub.lifecycleStatus === "active" ? (
                      <button onClick={() => setCancelModal({ subscriptionId: sub.id, action: "pause" })} className="btn btn-outline" style={{ minHeight: 38, fontSize: "0.85rem" }}>Pause</button>
                    ) : (
                      <button onClick={() => setCancelModal({ subscriptionId: sub.id, action: "resume" })} className="btn btn-secondary" style={{ minHeight: 38, fontSize: "0.85rem" }}>Resume</button>
                    )}
                    <button onClick={() => setCancelModal({ subscriptionId: sub.id, action: "cancel" })} className="btn btn-outline" style={{ minHeight: 38, fontSize: "0.85rem", color: "var(--color-error)" }}>Cancel</button>
                  </div>
                </div>

                {/* Recent Delivery Schedule */}
                <h4 style={{ marginTop: "var(--spacing-6)", marginBottom: "var(--spacing-2)", fontSize: "1rem" }}>Delivery Schedule & Rating</h4>
                <div className="card" style={{ backgroundColor: "var(--color-warm-off-white)", padding: "var(--spacing-4)" }}>
                  {sub.deliveryRecords.length === 0 ? (
                    <p style={{ fontSize: "0.85rem", margin: 0 }}>No delivery records created yet.</p>
                  ) : (
                    <div className="flex-col gap-2">
                      {sub.deliveryRecords.map((del: any) => (
                        <div key={del.id} className="flex justify-between items-center" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: 8 }}>
                          <div>
                            <span style={{ fontWeight: 600 }}>{new Date(del.date).toLocaleDateString()}</span> - <span style={{ color: del.status === "delivered" ? "var(--color-teal)" : "var(--color-deep-navy)" }}>{del.status.toUpperCase()}</span>
                          </div>

                          {del.status === "delivered" && (
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setRatingModal({ deliveryId: del.id, gwalaId: sub.gwalaId })} 
                                className="btn btn-secondary" 
                                style={{ minHeight: 32, padding: "0 10px", fontSize: "0.8rem" }}
                              >
                                ★ Rate Delivery
                              </button>
                              <button 
                                onClick={() => setComplaintModal({ deliveryId: del.id, gwalaId: sub.gwalaId })} 
                                className="btn btn-outline" 
                                style={{ minHeight: 32, padding: "0 10px", fontSize: "0.8rem", color: "var(--color-error)", borderColor: "var(--color-error)" }}
                              >
                                File Complaint
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Rating Modal */}
      {ratingModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--spacing-4)", zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: 450, width: "100%" }}>
            <h3 className="mb-4">Rate Your Delivered Order</h3>
            
            {ratingMsg && <div className="mb-4" style={{ color: "var(--color-teal)", fontWeight: 600 }}>{ratingMsg}</div>}

            <form onSubmit={handleSubmitRating}>
              <div className="input-group">
                <label className="label">Rating Stars</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRatingScore(star)} style={{ fontSize: "1.5rem", background: "none", border: "none", cursor: "pointer", color: star <= ratingScore ? "#D69E2E" : "#CBD5E0" }}>
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="input-group">
                <label className="label">Comments (Optional)</label>
                <textarea className="textarea" rows={3} placeholder="Freshness, temperature, punctuality..." value={ratingComment} onChange={(e) => setRatingComment(e.target.value)} />
              </div>

              <div className="flex gap-2 justify-between mt-6">
                <button type="button" onClick={() => setRatingModal(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Submit Rating</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Complaint Modal */}
      {complaintModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--spacing-4)", zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: 450, width: "100%" }}>
            <h3 className="mb-4" style={{ color: "var(--color-error)" }}>File Delivery Complaint</h3>
            
            {complaintMsg && <div className="mb-4" style={{ color: "var(--color-teal)", fontWeight: 600 }}>{complaintMsg}</div>}

            <form onSubmit={handleSubmitComplaint}>
              <div className="input-group">
                <label className="label">Issue Category</label>
                <select className="select" value={complaintCategory} onChange={(e) => setComplaintCategory(e.target.value)}>
                  <option value="quality">Quality / Freshness Issue</option>
                  <option value="missed">Missed Delivery</option>
                  <option value="quantity">Wrong Quantity / Less Milk</option>
                  <option value="behavior">Gwala Behavior</option>
                </select>
              </div>

              <div className="input-group">
                <label className="label">Details & Evidence (Optional)</label>
                <textarea className="textarea" rows={4} placeholder="Please provide details about the issue..." value={complaintDetails} onChange={(e) => setComplaintDetails(e.target.value)} />
              </div>

              <div className="flex gap-2 justify-between mt-6">
                <button type="button" onClick={() => setComplaintModal(null)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: "var(--color-error)", borderColor: "var(--color-error)" }}>Submit Complaint</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel/Pause Modal */}
      {cancelModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--spacing-4)", zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: 450, width: "100%" }}>
            <h3 className="mb-4">Confirm {cancelModal.action === "pause" ? "Pause" : cancelModal.action === "cancel" ? "Cancellation" : "Action"}</h3>
            
            <form onSubmit={handleStatusChange}>
              {(cancelModal.action === "cancel" || cancelModal.action === "pause") && (
                <div className="input-group">
                  <label className="label">Reason for {cancelModal.action}</label>
                  <select className="select" value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} required>
                    <option value="price">Price is too high</option>
                    <option value="quality">Quality / Hygiene issues</option>
                    <option value="moved">Moved to a different area</option>
                    <option value="service">Service / Punctuality issues</option>
                    <option value="travel">Traveling (Pause)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}

              <p style={{ fontSize: "0.9rem", color: "var(--color-dark-slate)", marginBottom: "var(--spacing-4)" }}>
                {cancelModal.action === "pause" ? "Your subscription will be paused and no deliveries will be scheduled until you resume." : "Are you sure you want to proceed?"}
              </p>

              <div className="flex gap-2 justify-between mt-6">
                <button type="button" onClick={() => setCancelModal(null)} className="btn btn-outline" style={{ flex: 1 }}>Go Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
