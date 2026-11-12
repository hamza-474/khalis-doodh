"use client";

import Header from "@/components/Header";
import { useState } from "react";

export default function HelpPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex-col min-h-screen">
      <Header />

      <main className="container mt-8 mb-8" style={{ flex: 1 }}>
        <h1 className="text-center mb-2">Help & Support Center</h1>
        <p className="text-center mb-8" style={{ color: "var(--color-dark-slate)" }}>
          Frequently asked questions about milk subscriptions, delivery routes, and vendor quality.
        </p>

        {/* FAQ Accordion Grid */}
        <div className="card mb-8">
          <h2 className="mb-4">Frequently Asked Questions</h2>

          <div className="flex-col gap-4">
            <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: 12 }}>
              <h3 style={{ fontSize: "1.1rem", margin: "0 0 4px 0" }}>How does milk delivery verification work?</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-dark-slate)" }}>
                Every gwala must provide verified CNIC credentials and proof of local milk sourcing. Administrators review each vendor before approving their route in public area search.
              </p>
            </div>

            <div style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: 12 }}>
              <h3 style={{ fontSize: "1.1rem", margin: "0 0 4px 0" }}>What if my milk delivery is delayed or missed?</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-dark-slate)" }}>
                You can view live delivery tracking in your Customer Dashboard (`/account`). If a delivery is missed, you are not charged and can request immediate support.
              </p>
            </div>

            <div style={{ paddingBottom: 4 }}>
              <h3 style={{ fontSize: "1.1rem", margin: "0 0 4px 0" }}>Can I pause my subscription during travel?</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--color-dark-slate)" }}>
                Yes! Navigate to `/account` and click "Pause". Your vendor will be automatically notified not to deliver on paused days.
              </p>
            </div>
          </div>
        </div>

        {/* Support Ticket Form */}
        <div className="card" style={{ maxWidth: 650, margin: "0 auto" }}>
          <h2 className="mb-4">Submit a Support Ticket</h2>
          {submitted ? (
            <div style={{ backgroundColor: "var(--color-pale-mint)", padding: "var(--spacing-4)", borderRadius: "var(--radius-md)", color: "var(--color-teal)" }}>
              ✓ Ticket submitted! Our support representative will contact you via your account phone number within 4 hours.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="label">Issue Subject *</label>
                <input type="text" className="input" placeholder="e.g. Question about delivery timing" value={subject} onChange={(e) => setSubject(e.target.value)} required />
              </div>

              <div className="input-group">
                <label className="label">Message Details *</label>
                <textarea className="textarea" rows={4} placeholder="Describe your question or issue in detail..." value={message} onChange={(e) => setMessage(e.target.value)} required />
              </div>

              <button type="submit" className="btn btn-primary w-full">Submit Ticket</button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
