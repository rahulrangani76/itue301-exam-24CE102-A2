import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import VehicleCard from '../components/VehicleCard.jsx';
import Loading from '../components/Loading.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
const filters = ['All', 'Hatchback', 'Sedan', 'SUV'];
export default function FleetPage() {
  const { token } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({ vehicleId: '', pickupDate: '', returnDate: '' });
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    let active = true;
    async function loadVehicles() {
      setLoading(true); setError('');
      try {
        const response = await fetch(`${API}/vehicles`);
        if (!response.ok) throw new Error('We could not load the fleet right now. Please try again.');
        const data = await response.json(); if (active) setVehicles(data);
      } catch (err) { if (active) setError(err.message || 'Could not reach the fleet. Check that the API is running.'); }
      finally { if (active) setLoading(false); }
    }
    loadVehicles(); return () => { active = false; };
  }, []);
  const visibleVehicles = useMemo(() => vehicles.filter(v => filter === 'All' || v.type === filter), [vehicles, filter]);
  function chooseVehicle(vehicleId) { setForm(current => ({ ...current, vehicleId })); setMessage(''); document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  async function submitBooking(event) {
    event.preventDefault(); setSubmitting(true); setMessage('');
    try {
      const response = await fetch(`${API}/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(form) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'We could not reserve this car.');
      setMessage('Booking confirmed. Your car is reserved!'); setVehicles(current => current.map(v => v._id === form.vehicleId ? { ...v, available: false } : v));
      setForm({ vehicleId: '', pickupDate: '', returnDate: '' });
    } catch (err) { setMessage(err.message || 'Could not reach DriveEasy. Please retry.'); }
    finally { setSubmitting(false); }
  }
  return <main className="page-shell">
    <section className="fleet-hero"><div><span className="eyebrow light-eyebrow">YOUR RIDE, YOUR WAY</span><h1>Find your next<br/>set of wheels.</h1><p>Well-kept cars, transparent prices, and the freedom to go further.</p><a className="button button-white" href="#available-cars">Explore cars <span aria-hidden="true">↓</span></a></div><div className="hero-car" aria-hidden="true">🚙<span className="hero-spark spark-one">✳</span><span className="hero-spark spark-two">✦</span></div><div className="hero-index">01 <span>—</span> 04</div></section>
    <section className="fleet-section" id="available-cars"><div className="section-heading"><div><span className="eyebrow">THE DRIVE EASY COLLECTION</span><h2>Choose your ride</h2><p className="muted">The right car makes the whole trip better.</p></div><div className="filter-row" aria-label="Filter by vehicle type">{filters.map(type => <button key={type} onClick={() => setFilter(type)} className={`filter-chip ${filter === type ? 'active' : ''}`} aria-pressed={filter === type}>{type}</button>)}</div></div>
      {loading ? <Loading label="Finding available cars"/> : error ? <div className="notice notice-error">{error}<button className="text-button" onClick={() => window.location.reload()}>Try again</button></div> : visibleVehicles.length ? <div className="vehicle-grid">{visibleVehicles.map(vehicle => <VehicleCard key={vehicle._id} {...vehicle} onBook={() => chooseVehicle(vehicle._id)}/>)}</div> : <div className="empty-state"><span>⌕</span><h3>No cars in this category yet</h3><p>Try another filter and see what’s ready to go.</p></div>}
    </section>
    <section className="booking-section" id="booking-form"><div className="booking-copy"><span className="eyebrow light-eyebrow">READY WHEN YOU ARE</span><h2>Make it a<br/>real booking.</h2><p>Pick your dates and reserve your car. You can review every trip in My bookings.</p><div className="booking-points"><span>✓ Easy pickup</span><span>✓ No hidden fees</span><span>✓ Flexible plans</span></div></div><form className="booking-form" onSubmit={submitBooking}><span className="form-kicker">BOOK A VEHICLE</span><h3>Plan your next trip</h3><label>Selected vehicle<select required value={form.vehicleId} onChange={e => setForm({ ...form, vehicleId: e.target.value })}><option value="">Choose a car</option>{vehicles.filter(v => v.available).map(v => <option key={v._id} value={v._id}>{v.model} · ₹{Number(v.pricePerDay).toLocaleString('en-IN')}/day</option>)}</select></label><div className="form-row"><label>Pickup date<input type="date" required min={new Date().toISOString().slice(0, 10)} value={form.pickupDate} onChange={e => setForm({ ...form, pickupDate: e.target.value })}/></label><label>Return date<input type="date" required min={form.pickupDate || new Date().toISOString().slice(0, 10)} value={form.returnDate} onChange={e => setForm({ ...form, returnDate: e.target.value })}/></label></div>{form.vehicleId && <p className="selected-summary">Selected: <b>{vehicles.find(v => v._id === form.vehicleId)?.model}</b></p>}{message && <p className={`notice ${message.startsWith('Booking confirmed') ? 'notice-success' : 'notice-error'}`} role="status">{message}</p>}<button className="button button-primary button-wide" disabled={submitting || !vehicles.some(v => v.available)}>{submitting ? 'Reserving…' : 'Reserve this car'} <span aria-hidden="true">→</span></button><small className="form-note">No payment is collected on this demo booking.</small></form></section>
  </main>;
}
