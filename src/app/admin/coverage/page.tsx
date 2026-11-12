"use client";

import Header from "@/components/Header";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminCoveragePage() {
  const [cities, setCities] = useState<any[]>([]);
  const [waitlists, setWaitlists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [newCityName, setNewCityName] = useState("");
  const [newAreaName, setNewAreaName] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");

  const fetchCoverage = async () => {
    try {
      const res = await fetch("/api/admin/coverage");
      const data = await res.json();
      if (data.success) {
        setCities(data.cities);
        setWaitlists(data.waitlists);
        if (data.cities.length > 0) setSelectedCityId(data.cities[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoverage();
  }, []);

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;
    try {
      const res = await fetch("/api/admin/coverage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "add_city", cityName: newCityName }),
      });
      const data = await res.json();
      if (data.success) {
        setNewCityName("");
        fetchCoverage();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAreaName.trim() || !selectedCityId) return;
    try {
      const res = await fetch("/api/admin/coverage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "add_area", areaName: newAreaName, cityId: selectedCityId }),
      });
      const data = await res.json();
      if (data.success) {
        setNewAreaName("");
        fetchCoverage();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-col min-h-screen">
      <Header />

      <main className="container mt-8 mb-8" style={{ flex: 1 }}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 style={{ margin: 0 }}>Coverage & Waitlist Demand Analytics</h1>
            <p style={{ color: "var(--color-dark-slate)", marginTop: 4 }}>
              Manage active Punjab cities, neighbourhood routes, and customer waitlist requests.
            </p>
          </div>
          <Link href="/admin" className="btn btn-outline">← Back to Admin</Link>
        </div>

        {/* Add City & Area Card */}
        <div className="md:grid md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="mb-4">Add Punjab City</h3>
            <form onSubmit={handleAddCity} className="flex gap-2">
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. Gujranwala" 
                value={newCityName} 
                onChange={(e) => setNewCityName(e.target.value)} 
                required 
              />
              <button type="submit" className="btn btn-primary">Add City</button>
            </form>
          </div>

          <div className="card">
            <h3 className="mb-4">Add Neighbourhood Route</h3>
            <form onSubmit={handleAddArea} className="flex gap-2">
              <select className="select" style={{ width: 140 }} value={selectedCityId} onChange={(e) => setSelectedCityId(e.target.value)}>
                {cities.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. Model Town Block B" 
                value={newAreaName} 
                onChange={(e) => setNewAreaName(e.target.value)} 
                required 
              />
              <button type="submit" className="btn btn-secondary">Add Area</button>
            </form>
          </div>
        </div>

        {/* Existing Coverage */}
        <h2 className="mb-4">Active Cities & Service Areas</h2>
        <div className="md:grid md:grid-cols-3 gap-6 mb-8">
          {cities.map((city) => (
            <div key={city.id} className="card">
              <h3 style={{ fontSize: "1.25rem", color: "var(--color-deep-navy)" }}>{city.name}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--color-dark-slate)", marginBottom: "var(--spacing-3)" }}>
                Active Areas ({city.serviceAreas?.length || 0})
              </p>

              <div className="flex-col gap-1">
                {city.serviceAreas?.map((area: any) => (
                  <div key={area.id} style={{ backgroundColor: "var(--color-warm-off-white)", padding: "6px 10px", borderRadius: 4, fontSize: "0.85rem", display: "flex", justifyContent: "space-between" }}>
                    <span>📍 {area.name}</span>
                    <span style={{ color: "var(--color-teal)", fontWeight: 600 }}>Active</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Waitlist Demand Table */}
        <h2 className="mb-4">Area Waitlist & Customer Expansion Demand</h2>
        <div className="card" style={{ padding: 0, overflowX: "auto" }}>
          {waitlists.length === 0 ? (
            <p style={{ padding: "var(--spacing-6)", margin: 0, textAlign: "center" }}>No customer waitlist entries submitted yet.</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-warm-off-white)", borderBottom: "1px solid var(--color-border)" }}>
                  <th style={{ padding: "12px 16px" }}>Requested City</th>
                  <th style={{ padding: "12px 16px" }}>Requested Area</th>
                  <th style={{ padding: "12px 16px" }}>Contact Details</th>
                  <th style={{ padding: "12px 16px" }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {waitlists.map((w) => (
                  <tr key={w.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 700 }}>{w.city}</td>
                    <td style={{ padding: "12px 16px" }}>{w.area}</td>
                    <td style={{ padding: "12px 16px" }}>{w.contactDetails}</td>
                    <td style={{ padding: "12px 16px" }}>{new Date(w.timestamp).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
