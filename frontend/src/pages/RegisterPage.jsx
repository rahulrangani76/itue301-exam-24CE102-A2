import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', licenseNumber: '', password: '' });
  const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  const { signIn } = useAuth(); const navigate = useNavigate();
  function change(event) { setForm({ ...form, [event.target.name]: event.target.value }); }
  async function submit(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const response = await fetch(`${API}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || data.details?.join(', ') || 'Could not create account.');
      signIn(data.customer, data.token); navigate('/fleet', { replace: true });
    } catch (err) { setError(err.message || 'Could not reach DriveEasy. Is the API running?'); }
    finally { setBusy(false); }
  }
  return <main className="register-layout"><div className="register-card"><Link className="brand" to="/"><span className="brand-mark">D</span> driveeasy<span className="brand-dot">.</span></Link><span className="eyebrow">LET'S GET YOU MOVING</span><h1>Create your account</h1><p className="muted">A few details and you’re ready to book.</p>
    <form onSubmit={submit} className="form-stack register-form"><label>Full name<input name="name" autoComplete="name" required value={form.name} onChange={change}/></label><div className="form-row"><label>Email address<input type="email" name="email" autoComplete="email" required value={form.email} onChange={change}/></label><label>Phone number<input type="tel" name="phone" autoComplete="tel" required value={form.phone} onChange={change}/></label></div><label>Driving license number<input name="licenseNumber" required value={form.licenseNumber} onChange={change}/></label><label>Password<input type="password" name="password" autoComplete="new-password" minLength="8" required value={form.password} onChange={change}/><small>Use at least 8 characters.</small></label>
      {error && <p className="notice notice-error" role="alert">{error}</p>}<button className="button button-primary button-wide" disabled={busy}>{busy ? 'Creating account…' : 'Create account'} <span aria-hidden="true">→</span></button></form>
    <p className="auth-switch">Already have an account? <Link to="/">Sign in</Link></p></div></main>;
}
