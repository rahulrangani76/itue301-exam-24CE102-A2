import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Loading from '../components/Loading.jsx';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
export default function MyBookingsPage() {
  const { token } = useAuth(); const [bookings, setBookings] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    fetch(`${API}/bookings/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Could not load your bookings.'); return data; })
      .then(data => { if (active) setBookings(data); }).catch(err => { if (active) setError(err.message || 'Could not load bookings.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [token]);
  return <main className="page-shell content-page"><div className="page-title"><span className="eyebrow">YOUR DRIVE EASY ACCOUNT</span><h1>My bookings</h1><p className="muted">All your upcoming and past trips, in one place.</p></div>
    {loading ? <Loading label="Loading your bookings"/> : error ? <p className="notice notice-error">{error}</p> : bookings.length ? <div className="booking-list">{bookings.map(booking => <article className="booking-card" key={booking._id}><div className="booking-date"><span>{new Date(booking.pickupDate).toLocaleDateString('en-IN', { month: 'short' })}</span><b>{new Date(booking.pickupDate).getDate()}</b><small>{new Date(booking.pickupDate).getFullYear()}</small></div><div className="booking-detail"><span className="eyebrow">{booking.vehicleId?.type || 'DRIVEEASY VEHICLE'}</span><h2>{booking.vehicleId?.model || 'Vehicle booking'}</h2><p>{new Date(booking.pickupDate).toLocaleDateString()} – {new Date(booking.returnDate).toLocaleDateString()}</p><small>Booking ref. {booking._id.slice(-8).toUpperCase()}</small></div><span className={`status-pill status-${booking.status}`}>{booking.status}</span></article>)}</div> : <div className="empty-state bookings-empty"><span>⌁</span><h2>No bookings yet</h2><p>Your next great trip is just a car away.</p><a className="button button-primary" href="/fleet">Explore the fleet <span aria-hidden="true">→</span></a></div>}
  </main>;
}
