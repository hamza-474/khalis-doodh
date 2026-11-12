import Header from "@/components/Header";

export default function RefundsPage() {
  return (
    <div className="flex-col min-h-screen">
      <Header />
      <main className="container mt-8 mb-8" style={{ flex: 1, maxWidth: 800 }}>
        <h1 className="mb-4">Refund & Resolution Policy</h1>
        <div className="card flex-col gap-4" style={{ lineHeight: 1.6 }}>
          <p><strong>Khalis Doodh</strong> ensures 100% satisfaction for fresh milk delivery:</p>
          <h3>1. Missed or Delayed Deliveries</h3>
          <p>If a delivery is marked missed or not received during your morning route window, your subscription ledger is automatically credited or discounted on your next payment receipt.</p>
          <h3>2. Quality Concerns</h3>
          <p>If milk quality fails lactometer density or freshness checks, you can report a complaint in `/account`. Serious complaints trigger immediate admin review.</p>
        </div>
      </main>
    </div>
  );
}
