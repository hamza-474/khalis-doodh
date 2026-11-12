import Header from "@/components/Header";

export default function PrivacyPage() {
  return (
    <div className="flex-col min-h-screen">
      <Header />
      <main className="container mt-8 mb-8" style={{ flex: 1, maxWidth: 800 }}>
        <h1 className="mb-4">Privacy Policy</h1>
        <div className="card flex-col gap-4" style={{ lineHeight: 1.6 }}>
          <p>Your privacy and security are central to <strong>Khalis Doodh</strong>:</p>
          <h3>1. Identity Document Security</h3>
          <p>Vendor CNICs are stored using cryptographic SHA-256 hashing to prevent duplication while obscuring full identity strings. Uploaded document files are stored in protected access storage.</p>
          <h3>2. Exact Address Protection</h3>
          <p>Exact customer house addresses and map pin coordinates are shared strictly with the assigned gwala delivering your route.</p>
        </div>
      </main>
    </div>
  );
}
