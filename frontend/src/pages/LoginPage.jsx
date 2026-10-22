import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      const response = await fetch(`${API}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Unable to sign in.');
      signIn(data.customer, data.token);
      navigate(location.state?.from || '/fleet', { replace: true });
    } catch (err) { setError(err.message || 'Could not reach DriveEasy. Is the API running?'); }
    finally { setBusy(false); }
  }
  return <main className="auth-layout">
    <section className="auth-story"><div className="story-content"><span className="eyebrow light-eyebrow">YOUR NEXT ADVENTURE STARTS HERE</span><h1>The open road<br/>is calling.</h1><p>Find a car that fits your plans. Book in minutes, pick up nearby, and make the most of every mile.</p><div className="story-stats"><div><b>120+</b><span>cars ready to go</span></div><div><b>24/7</b><span>roadside support</span></div></div></div><span className="story-decoration" aria-hidden="true">D</span></section>
    <section className="auth-panel"><div className="auth-form-wrap"><div className="mobile-brand brand"><span className="brand-mark">D</span> driveeasy<span className="brand-dot">.</span></div><span className="eyebrow">WELCOME BACK</span><h2>Sign in to DriveEasy</h2><p className="muted">Enter your account details to continue.</p>
      <form onSubmit={submit} className="form-stack"><label>Email address<input type="email" autoComplete="email" placeholder="you@example.com" required value={email} onChange={e => setEmail(e.target.value)}/></label><label>Password<input type="password" autoComplete="current-password" placeholder="Your password" required value={password} onChange={e => setPassword(e.target.value)}/></label>
        {error && <p className="notice notice-error" role="alert">{error}</p>}<button className="button button-primary button-wide" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <span aria-hidden="true">→</span></button></form>
      <p className="auth-switch">New to DriveEasy? <Link to="/register">Create an account</Link></p><p className="fine-print">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
    </div></section>
  </main>;
}
