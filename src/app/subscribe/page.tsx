"use client";

import Header from "@/components/Header";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SubscribeContent() {
  const searchParams = useSearchParams();
  const initialCityParam = searchParams.get("city");
  const initialAreaParam = searchParams.get("area");

  const [cities, setCities] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>(initialCityParam || "Lahore");
  const [selectedArea, setSelectedArea] = useState<string>(initialAreaParam || "");
  const [availableAreas, setAvailableAreas] = useState<any[]>([]);
  
  const [gwalas, setGwalas] = useState<any[]>([]);
  const [loadingGwalas, setLoadingGwalas] = useState<boolean>(false);
  const [searched, setSearched] = useState<boolean>(false);

  // Subscription Modal State
  const [selectedGwala, setSelectedGwala] = useState<any | null>(null);
  const [plan, setPlan] = useState<string>("monthly");
  const [litresPerDay, setLitresPerDay] = useState<number>(2);
  const [deliveryDays, setDeliveryDays] = useState<string[]>(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]);
  const [startDate, setStartDate] = useState<string>(new Date().toISOString().split("T")[0]);
  
  // Address Fields
  const [addressLine, setAddressLine] = useState<string>("");
  const [landmark, setLandmark] = useState<string>("");
  const [mapLatitude, setMapLatitude] = useState<string>("");
  const [mapLongitude, setMapLongitude] = useState<string>("");

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Waitlist Form State
  const [waitlistContact, setWaitlistContact] = useState<string>("");
  const [waitlistSuccess, setWaitlistSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/locations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.cities.length > 0) {
          setCities(data.cities);
          
          const cityToUse = initialCityParam || data.cities[0].name;
          setSelectedCity(cityToUse);

          const foundCity = data.cities.find((c: any) => c.name === cityToUse) || data.cities[0];
          const areas = foundCity.serviceAreas || [];
          setAvailableAreas(areas);

          const areaToUse = initialAreaParam || (areas.length > 0 ? areas[0].name : "");
          setSelectedArea(areaToUse);

          // Auto-trigger search if params passed
          if (cityToUse && areaToUse) {
            fetchGwalas(cityToUse, areaToUse);
          }
        }
      })
      .catch((err) => console.error("Failed to load locations", err));
  }, []);

  const fetchGwalas = async (cityName: string, areaName: string) => {
    if (!cityName || !areaName) return;
    setLoadingGwalas(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/gwalas?city=${encodeURIComponent(cityName)}&area=${encodeURIComponent(areaName)}`);
      const data = await res.json();
      if (data.success) {
        setGwalas(data.gwalas);
      } else {
        setGwalas([]);
      }
    } catch (err) {
      console.error(err);
      setGwalas([]);
    } finally {
      setLoadingGwalas(false);
    }
  };

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    const foundCity = cities.find((c) => c.name === cityName);
    if (foundCity) {
      const areas = foundCity.serviceAreas || [];
      setAvailableAreas(areas);
      if (areas.length > 0) {
        setSelectedArea(areas[0].name);
      } else {
        setSelectedArea("");
      }
    }
  };

  const handleSearchClick = () => {
    fetchGwalas(selectedCity, selectedArea);
  };

  const handleDayToggle = (day: string) => {
    if (deliveryDays.includes(day)) {
      if (deliveryDays.length === 1) return;
      setDeliveryDays(deliveryDays.filter((d) => d !== day));
    } else {
      setDeliveryDays([...deliveryDays, day]);
    }
  };

  const calculateEstimatedTotal = () => {
    if (!selectedGwala) return 0;
    const daysCount = plan === "monthly" ? Math.round((deliveryDays.length / 7) * 30) : deliveryDays.length;
    return litresPerDay * daysCount * selectedGwala.price;
  };

  const handleConfirmSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressLine.trim()) {
      setErrorMsg("Please enter your exact house/street address.");
      return;
    }
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: "sample-customer-hassan",
          gwalaId: selectedGwala.userId,
          city: selectedCity,
          area: selectedArea,
          addressLine,
          landmark,
          mapLatitude,
          mapLongitude,
          plan,
          litresPerDay,
          deliveryDays,
          startDate,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setConfirmation(data);
      } else {
        setErrorMsg(data.error || "Failed to submit subscription.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistContact) return;
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: selectedCity,
          area: selectedArea,
          contactDetails: waitlistContact,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setWaitlistSuccess(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="container mt-8 mb-12" style={{ flex: 1 }}>
      {/* Page Header */}
      <div className="text-center mb-8">
        <span className="badge badge-mint mb-2">📍 Route Discovery & Subscription</span>
        <h1 style={{ fontSize: "2.25rem", margin: "var(--spacing-2) 0" }}>Find Verified Gwalas In Punjab</h1>
        <p style={{ color: "var(--color-dark-slate)", fontSize: "1.05rem" }}>
          Select your city and neighbourhood to discover gwalas with active daily morning routes.
        </p>
      </div>

      {/* Clean Filter Control Bar */}
      <div className="card mb-10" style={{ maxWidth: 850, margin: "0 auto var(--spacing-10)", backgroundColor: "var(--color-white)", border: "1px solid var(--color-border)" }}>
        <div className="md:grid md:grid-cols-3 gap-4 items-center">
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="label">1. Punjab City</label>
            <select 
              className="select"
              value={selectedCity} 
              onChange={(e) => handleCityChange(e.target.value)}
            >
              {cities.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="label">2. Neighbourhood / Area</label>
            <select 
              className="select"
              value={selectedArea} 
              onChange={(e) => setSelectedArea(e.target.value)}
            >
              {availableAreas.map((a) => (
                <option key={a.id} value={a.name}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className="mt-4 md:mt-0">
            <button 
              onClick={handleSearchClick} 
              className="btn btn-primary w-full"
              style={{ minHeight: 48, fontSize: "1rem" }}
            >
              🔍 View Gwalas
            </button>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loadingGwalas && (
        <div className="text-center py-12" style={{ padding: "var(--spacing-10)" }}>
          <p style={{ fontSize: "1.1rem", color: "var(--color-teal)", fontWeight: 600 }}>
            Searching verified milk routes in {selectedArea}, {selectedCity}...
          </p>
        </div>
      )}

      {/* Empty State with Waitlist */}
      {searched && !loadingGwalas && gwalas.length === 0 && (
        <div className="card text-center" style={{ maxWidth: 650, margin: "0 auto", padding: "var(--spacing-8)" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🚜</div>
          <h3 style={{ color: "var(--color-deep-navy)" }}>No Active Route Verified in {selectedArea} Yet</h3>
          <p className="mt-2 mb-6" style={{ color: "var(--color-dark-slate)" }}>
            We are onboarding local milk vendors in {selectedArea}, {selectedCity}. Leave your contact to get notified first when a route opens!
          </p>
          
          {waitlistSuccess ? (
            <div style={{ backgroundColor: "var(--color-pale-mint)", padding: "var(--spacing-4)", borderRadius: "var(--radius-md)", color: "var(--color-teal)", fontWeight: 700 }}>
              ✓ Added to waitlist for {selectedArea}! We will notify you when a route opens.
            </div>
          ) : (
            <form onSubmit={handleWaitlistSubmit} className="flex gap-2">
              <input 
                type="text"
                placeholder="Your Phone Number or Email"
                className="input"
                style={{ flex: 1 }}
                value={waitlistContact}
                onChange={(e) => setWaitlistContact(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary">Join Waitlist</button>
            </form>
          )}
        </div>
      )}

      {/* Verified Vendor Cards Grid */}
      <div className="md:grid md:grid-cols-3 gap-6">
        {gwalas.map((gwala) => (
          <div key={gwala.userId} className="card flex-col justify-between" style={{ border: gwala.featured ? "2px solid var(--color-teal)" : "1px solid var(--color-border)" }}>
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="badge badge-mint">✓ Admin Verified</span>
                {gwala.featured && (
                  <span className="badge badge-navy">Top Featured</span>
                )}
              </div>

              <h3 style={{ fontSize: "1.3rem", margin: "var(--spacing-1) 0 var(--spacing-2) 0" }}>{gwala.displayName}</h3>
              
              <p style={{ color: "var(--color-teal)", fontWeight: 700, fontSize: "0.9rem", marginBottom: "var(--spacing-2)" }}>
                📍 {gwala.primaryArea}, {gwala.city}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <span style={{ color: "#D69E2E", fontWeight: 800, fontSize: "1.1rem" }}>
                  ★ {gwala.ratingAverage > 0 ? gwala.ratingAverage.toFixed(1) : "New"}
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>
                  ({gwala.ratingCount} reviews)
                </span>
              </div>

              <p style={{ fontSize: "0.875rem", color: "var(--color-dark-slate)", backgroundColor: "var(--color-warm-off-white)", padding: "var(--spacing-3)", borderRadius: "var(--radius-sm)", marginBottom: "var(--spacing-4)" }}>
                "{gwala.routeDetails}"
              </p>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4" style={{ borderTop: "1px solid var(--color-border)", paddingTop: 12 }}>
                <span style={{ fontSize: "0.875rem", color: "var(--color-muted)" }}>Milk Price</span>
                <span style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--color-deep-navy)" }}>PKR {gwala.price}/L</span>
              </div>

              <button 
                onClick={() => setSelectedGwala(gwala)} 
                className="btn btn-primary w-full"
              >
                Subscribe To Route
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Subscription Modal / Drawer */}
      {selectedGwala && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(10, 50, 80, 0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--spacing-4)", zIndex: 1000 }}>
          <div className="card" style={{ maxWidth: 650, width: "100%", maxHeight: "92vh", overflowY: "auto", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
            
            {confirmation ? (
              <div className="text-center" style={{ padding: "var(--spacing-4) 0" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", backgroundColor: "var(--color-pale-mint)", color: "var(--color-teal)", fontSize: "2rem", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--spacing-4)" }}>
                  ✓
                </div>
                <h2>Subscription Confirmed!</h2>
                <p style={{ fontSize: "1.1rem" }}>Reference Code: <strong>{confirmation.receiptCode}</strong></p>
                <p style={{ fontSize: "0.95rem", color: "var(--color-dark-slate)" }}>
                  {selectedGwala.displayName} has received your delivery stop request and will verify morning timings.
                </p>
                
                <div className="card mt-6 mb-6" style={{ backgroundColor: "var(--color-warm-off-white)", textAlign: "left" }}>
                  <p style={{ margin: "4px 0" }}><strong>Gwala:</strong> {selectedGwala.displayName}</p>
                  <p style={{ margin: "4px 0" }}><strong>Plan:</strong> {plan.toUpperCase()} ({litresPerDay}L/day)</p>
                  <p style={{ margin: "4px 0" }}><strong>Days:</strong> {deliveryDays.join(", ")}</p>
                  <p style={{ margin: "4px 0" }}><strong>Address:</strong> {addressLine}, {selectedArea}</p>
                  <p style={{ margin: "4px 0", fontSize: "1.1rem", color: "var(--color-deep-navy)" }}><strong>Total Estimated:</strong> PKR {calculateEstimatedTotal()}</p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Link href="/account" className="btn btn-primary">Go to My Account</Link>
                  <button onClick={() => { setSelectedGwala(null); setConfirmation(null); }} className="btn btn-outline">Close</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmSubscription}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="badge badge-mint">Step 2 of 2 — Subscription Details</span>
                    <h2 style={{ fontSize: "1.4rem", margin: "4px 0 0 0" }}>Subscribe to {selectedGwala.displayName}</h2>
                  </div>
                  <button type="button" onClick={() => setSelectedGwala(null)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--color-muted)" }}>✕</button>
                </div>

                {errorMsg && <div className="error-message mb-4" style={{ backgroundColor: "#FFF5F5", padding: "10px 14px", borderRadius: 8, color: "var(--color-error)" }}>{errorMsg}</div>}

                {/* Plan Selection */}
                <div className="input-group">
                  <label className="label">Select Subscription Plan</label>
                  <div className="flex gap-3">
                    <button type="button" className={`btn ${plan === "monthly" ? "btn-primary" : "btn-outline"}`} style={{ flex: 1 }} onClick={() => setPlan("monthly")}>Monthly Plan (30 Days)</button>
                    <button type="button" className={`btn ${plan === "weekly" ? "btn-primary" : "btn-outline"}`} style={{ flex: 1 }} onClick={() => setPlan("weekly")}>Weekly Plan (7 Days)</button>
                  </div>
                </div>

                {/* Litres per Day */}
                <div className="input-group">
                  <label className="label">Litres per Delivery (Day)</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button 
                        key={num} 
                        type="button" 
                        className={`btn ${litresPerDay === num ? "btn-primary" : "btn-outline"}`} 
                        style={{ flex: 1, minWidth: 44 }}
                        onClick={() => setLitresPerDay(num)}
                      >
                        {num} Litre{num > 1 ? "s" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Selected Days */}
                <div className="input-group">
                  <label className="label">Delivery Days</label>
                  <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <button 
                        key={day} 
                        type="button" 
                        onClick={() => handleDayToggle(day)}
                        className={`btn ${deliveryDays.includes(day) ? "btn-secondary" : "btn-outline"}`}
                        style={{ minHeight: 36, padding: "0 12px", fontSize: "0.85rem" }}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Date */}
                <div className="input-group">
                  <label className="label">Delivery Start Date</label>
                  <input type="date" className="input" value={startDate} min={new Date().toISOString().split("T")[0]} onChange={(e) => setStartDate(e.target.value)} required />
                </div>

                {/* Structured Delivery Address */}
                <h4 style={{ marginTop: "var(--spacing-6)", marginBottom: "var(--spacing-3)", borderTop: "1px solid var(--color-border)", paddingTop: 16 }}>Exact House Delivery Address</h4>
                <div className="input-group">
                  <label className="label">House / Street / Block *</label>
                  <input type="text" className="input" placeholder="e.g. House 142, Street 8, Sector J" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} required />
                </div>

                <div className="input-group">
                  <label className="label">Landmark (Optional)</label>
                  <input type="text" className="input" placeholder="e.g. Near Jalal Sons / Opposite Park" value={landmark} onChange={(e) => setLandmark(e.target.value)} />
                </div>

                {/* Payment Method Selection */}
                <h4 style={{ marginTop: "var(--spacing-6)", marginBottom: "var(--spacing-3)", borderTop: "1px solid var(--color-border)", paddingTop: 16 }}>Payment Method</h4>
                <div className="input-group">
                  <select className="select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="cod">Cash on Delivery (COD) - Pay Gwala Directly</option>
                    <option value="bank_transfer">Manual Bank Transfer</option>
                    <option value="easypaisa">Easypaisa (Provider Ready)</option>
                    <option value="jazzcash">JazzCash (Provider Ready)</option>
                    <option value="card">Credit/Debit Card (Provider Ready)</option>
                  </select>
                </div>

                {/* Summary & Price */}
                <div className="card mt-6 mb-6" style={{ backgroundColor: "var(--color-pale-mint)", border: "1px solid var(--color-teal)" }}>
                  <div className="flex justify-between items-center">
                    <div>
                      <strong style={{ color: "var(--color-deep-navy)" }}>Total Estimated Amount:</strong>
                      <div style={{ fontSize: "0.85rem", color: "var(--color-dark-slate)" }}>
                        {litresPerDay}L/day × {plan === "monthly" ? Math.round((deliveryDays.length / 7) * 30) : deliveryDays.length} days @ PKR {selectedGwala.price}/L
                      </div>
                    </div>
                    <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--color-deep-navy)" }}>
                      PKR {calculateEstimatedTotal()}
                    </span>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full" style={{ minHeight: 48, fontSize: "1.05rem" }}>
                  {isSubmitting ? "Submitting Subscription..." : "Confirm & Order Delivery"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default function SubscribePage() {
  return (
    <div className="flex-col min-h-screen">
      <Header />
      <Suspense fallback={<div className="container py-12 text-center">Loading discovery page...</div>}>
        <SubscribeContent />
      </Suspense>
    </div>
  );
}
