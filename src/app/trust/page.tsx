import Header from "@/components/Header";
import Link from "next/link";

export default function TrustPolicyPage() {
  return (
    <div className="flex-col min-h-screen">
      <Header />

      <main className="container mt-8 mb-12" style={{ flex: 1, maxWidth: 900 }}>
        <div className="text-center mb-8">
          <span className="badge badge-mint mb-2">🛡️ Customer & Vendor Protection</span>
          <h1 style={{ fontSize: "2.5rem", margin: "8px 0" }}>Trust, Purity & Verification Policy</h1>
          <p style={{ color: "var(--color-dark-slate)", fontSize: "1.1rem" }}>
            How Khalis Doodh protects Punjab households through real operational evidence, identity safeguards, and transparent quality reviews.
          </p>
        </div>

        <div className="flex-col gap-6">
          {/* Policy Card 1 */}
          <div className="card" style={{ borderLeft: "6px solid var(--color-teal)" }}>
            <h2 style={{ fontSize: "1.5rem", color: "var(--color-deep-navy)" }}>1. Verification-First Discovery</h2>
            <p style={{ color: "var(--color-dark-slate)", margin: "8px 0" }}>
              Public vendor listings display only gwalas whose identity documents (CNIC) and local milk sourcing have been verified by administrators. Badges such as <strong>"✓ Verified"</strong> are rendered strictly from persisted admin approval status. Paid plans cannot purchase verification badges.
            </p>
          </div>

          {/* Policy Card 2 */}
          <div className="card" style={{ borderLeft: "6px solid var(--color-deep-navy)" }}>
            <h2 style={{ fontSize: "1.5rem", color: "var(--color-deep-navy)" }}>2. Strict Ratings & Zero-Fake Reviews Policy</h2>
            <p style={{ color: "var(--color-dark-slate)", margin: "8px 0" }}>
              Ratings can only be submitted by customers for genuine delivered orders. Undelivered orders cannot be rated. Any vendor whose average rating drops below <strong>3.0 stars</strong> is automatically flagged in the admin escalation queue for quality inspection.
            </p>
          </div>

          {/* Policy Card 3 */}
          <div className="card" style={{ borderLeft: "6px solid #D69E2E" }}>
            <h2 style={{ fontSize: "1.5rem", color: "var(--color-deep-navy)" }}>3. Identity & Address Privacy</h2>
            <p style={{ color: "var(--color-dark-slate)", margin: "8px 0" }}>
              CNIC documents are protected using cryptographic <strong>SHA-256 hashing</strong> to prevent identity theft. Exact house addresses and map pin coordinates are shared strictly with the assigned gwala delivering your accepted route.
            </p>
          </div>

          {/* Policy Card 4 */}
          <div className="card" style={{ borderLeft: "6px solid var(--color-teal)" }}>
            <h2 style={{ fontSize: "1.5rem", color: "var(--color-deep-navy)" }}>4. Honest Platform Limitations</h2>
            <p style={{ color: "var(--color-dark-slate)", margin: "8px 0" }}>
              We do not fabricate government lab purity certifications or health claims. We guarantee a transparent, verification-backed marketplace where quality concerns are investigated and resolved through credit or route suspension.
            </p>
          </div>

          <div className="text-center mt-6">
            <Link href="/subscribe" className="btn btn-primary">Browse Verified Routes</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
