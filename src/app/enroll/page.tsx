"use client";

import Header from "@/components/Header";
import { useState } from "react";

export default function EnrollPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cnic, setCnic] = useState("");
  const [city, setCity] = useState("Lahore");
  const [primaryArea, setPrimaryArea] = useState("Johar Town");
  const [routeDetails, setRouteDetails] = useState("");
  const [price, setPrice] = useState("240");

  const [cnicFile, setCnicFile] = useState<File | null>(null);
  const [areaProofFile, setAreaProofFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          cnic,
          city,
          primaryArea,
          routeDetails,
          price,
          cnicFilename: cnicFile ? cnicFile.name : "cnic_document.pdf",
          areaProofFilename: areaProofFile ? areaProofFile.name : "area_proof.jpg",
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(data.message);
      } else {
        setError(data.error || "Enrollment failed.");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-col min-h-screen">
      <Header />

      <main className="container mt-8 mb-8" style={{ flex: 1 }}>
        <div className="card" style={{ maxWidth: 750, margin: "0 auto" }}>
          <h1 className="text-center mb-2" style={{ fontSize: "2rem" }}>Enroll as a Verified Gwala</h1>
          <p className="text-center mb-8" style={{ color: "var(--color-dark-slate)" }}>
            Join Punjab's premier trusted milk delivery network. Submit your identity documents for verification.
          </p>

          {message ? (
            <div className="text-center" style={{ padding: "var(--spacing-8)" }}>
              <div style={{ fontSize: "3rem", color: "var(--color-teal)" }}>✓</div>
              <h2 className="mb-4">Application Submitted</h2>
              <p>{message}</p>
              <p style={{ fontSize: "0.9rem", color: "var(--color-dark-slate)", marginTop: "var(--spacing-4)" }}>
                Your application status is currently <strong>PENDING</strong>. It will not appear in public route discovery until an administrator reviews your CNIC and area proof.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className="error-message mb-4" style={{ backgroundColor: "#FFF5F5", padding: "8px 12px", borderRadius: 4 }}>{error}</div>}

              <div className="md:grid md:grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="label">Full Name *</label>
                  <input type="text" className="input" placeholder="e.g. Chaudhry Muhammad Rafiq" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="input-group">
                  <label className="label">Phone Number *</label>
                  <input type="text" className="input" placeholder="03001234567" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
              </div>

              <div className="md:grid md:grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="label">CNIC Number (13 digits) *</label>
                  <input type="text" className="input" placeholder="35202-1234567-1" value={cnic} onChange={(e) => setCnic(e.target.value)} required />
                </div>

                <div className="input-group">
                  <label className="label">Email Address (Optional)</label>
                  <input type="email" className="input" placeholder="rafiq@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="md:grid md:grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="label">Punjab City *</label>
                  <select className="select" value={city} onChange={(e) => setCity(e.target.value)}>
                    <option value="Lahore">Lahore</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Multan">Multan</option>
                    <option value="Faisalabad">Faisalabad</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="label">Primary Service Neighbourhood *</label>
                  <input type="text" className="input" placeholder="e.g. DHA Phase 5" value={primaryArea} onChange={(e) => setPrimaryArea(e.target.value)} required />
                </div>
              </div>

              <div className="md:grid md:grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="label">Milk Price per Litre (PKR) *</label>
                  <input type="number" className="input" placeholder="240" value={price} onChange={(e) => setPrice(e.target.value)} required />
                </div>

                <div className="input-group">
                  <label className="label">Route Description</label>
                  <input type="text" className="input" placeholder="Morning 6 AM delivery round in Sector J & K" value={routeDetails} onChange={(e) => setRouteDetails(e.target.value)} />
                </div>
              </div>

              {/* Secure Document Upload */}
              <h3 style={{ fontSize: "1.1rem", marginTop: "var(--spacing-6)", marginBottom: "var(--spacing-4)" }}>Required Verification Documents (Max 5 MB)</h3>
              
              <div className="md:grid md:grid-cols-2 gap-4">
                <div className="input-group">
                  <label className="label">Upload Front/Back CNIC Document (PDF/JPG/PNG) *</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="input" style={{ paddingTop: 8 }} onChange={(e) => setCnicFile(e.target.files?.[0] || null)} required />
                </div>

                <div className="input-group">
                  <label className="label">Upload Area/Milk Supply Proof *</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="input" style={{ paddingTop: 8 }} onChange={(e) => setAreaProofFile(e.target.files?.[0] || null)} required />
                </div>
              </div>

              <div className="card mt-4 mb-6" style={{ backgroundColor: "var(--color-warm-off-white)", fontSize: "0.85rem", color: "var(--color-dark-slate)" }}>
                🔒 <strong>Security & Compliance:</strong> Your CNIC is stored as a cryptographic SHA-256 hash to prevent duplicates. Identity files are kept in secure protected storage and accessible only by authorized platform admins during verification.
              </div>

              <button type="submit" disabled={submitting} className="btn btn-primary w-full">
                {submitting ? "Submitting Application..." : "Enroll as Gwala"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
