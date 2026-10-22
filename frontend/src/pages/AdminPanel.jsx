import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Loading from '../components/Loading.jsx';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
export default function AdminPanel() {
  const { token } = useAuth(); const [summary, setSummary] = useState(null); const [error, setError] = useState('');
  useEffect(() => { fetch(`${API}/admin/summary`, { headers: { Authorization: `Bearer ${token}` } }).then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Could not load fleet overview.'); return data; }).then(setSummary).catch(err => setError(err.message)); }, [token]);
  return <main className="page-shell content-page"><div className="page-title"><span className="eyebrow">DRIVEEASY OPERATIONS</span><h1>Fleet overview</h1><p className="muted">A quick look at your cars and reservations.</p></div>{error ? <p className="notice notice-error">{error}</p> : !summary ? <Loading label="Loading fleet overview"/> : <div className="summary-grid">{[['Vehicles in fleet', summary.vehicles, 'All registered cars'], ['Available today', summary.available, 'Ready for the next drive'], ['Currently reserved', summary.reserved, 'Not available to book'], ['Total bookings', summary.bookings, 'Across all customers']].map(([label, value, note]) => <article className="summary-card" key={label}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}</div>}<div className="admin-note"><span>✳</span><div><b>Fleet manager tip</b><p>Booking status changes are available through the protected API. Mark a trip completed or cancelled to return its vehicle to the available fleet.</p></div></div></main>;
}
