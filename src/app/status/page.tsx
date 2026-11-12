import Header from "@/components/Header";

export default function PublicStatusPage() {
  return (
    <div className="flex-col min-h-screen">
      <Header />
      <main className="container mt-8 mb-8" style={{ flex: 1, maxWidth: 800 }}>
        <h1 className="mb-4">System Operational Status</h1>
        <div className="card flex-col gap-4">
          <div className="flex justify-between items-center" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: 12 }}>
            <div>
              <strong>Marketplace Route Discovery (`/subscribe`)</strong>
              <div style={{ fontSize: "0.85rem", color: "var(--color-dark-slate)" }}>Punjab Cities & Verified Vendor Search</div>
            </div>
            <span style={{ color: "var(--color-teal)", fontWeight: 700 }}>✓ Operational</span>
          </div>

          <div className="flex justify-between items-center" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: 12 }}>
            <div>
              <strong>Subscription Ledger & Delivery Tracking</strong>
              <div style={{ fontSize: "0.85rem", color: "var(--color-dark-slate)" }}>Daily delivery status updates & COD receipts</div>
            </div>
            <span style={{ color: "var(--color-teal)", fontWeight: 700 }}>✓ Operational</span>
          </div>

          <div className="flex justify-between items-center" style={{ paddingBottom: 4 }}>
            <div>
              <strong>Gwala Verification & Audit Pipeline</strong>
              <div style={{ fontSize: "0.85rem", color: "var(--color-dark-slate)" }}>CNIC SHA-256 deduplication & Admin review</div>
            </div>
            <span style={{ color: "var(--color-teal)", fontWeight: 700 }}>✓ Operational</span>
          </div>
        </div>
      </main>
    </div>
  );
}
