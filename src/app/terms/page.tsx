import Header from "@/components/Header";

export default function TermsPage() {
  return (
    <div className="flex-col min-h-screen">
      <Header />
      <main className="container mt-8 mb-8" style={{ flex: 1, maxWidth: 800 }}>
        <h1 className="mb-4">Terms of Service</h1>
        <div className="card flex-col gap-4" style={{ lineHeight: 1.6 }}>
          <p>Welcome to <strong>Khalis Doodh</strong>. By accessing or using our marketplace platform in Punjab, Pakistan, you agree to comply with the following terms:</p>
          <h3>1. Subscription & Delivery Obligations</h3>
          <p>Khalis Doodh connects verified local gwalas with households. Gwalas are responsible for maintaining milk purity standards and timely morning deliveries according to agreed schedules.</p>
          <h3>2. Payment Policies</h3>
          <p>Payments collected via Cash on Delivery (COD) or approved digital gateways are tracked per billing period. Unpaid invoices may lead to route suspension.</p>
          <h3>3. Verification & Safety</h3>
          <p>Vendors undergo document verification. Fake accounts, false reviews, or tampered milk will result in permanent ban and potential legal report under Punjab Food Authority guidelines.</p>
        </div>
      </main>
    </div>
  );
}
