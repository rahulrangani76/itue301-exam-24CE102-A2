import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navigation() {
  const { customer, signOut } = useAuth();
  const navigate = useNavigate();
  function logout() { signOut(); navigate('/'); }
  return <header className="topbar"><NavLink className="brand" to={customer ? '/fleet' : '/'}><span className="brand-mark">D</span> driveeasy<span className="brand-dot">.</span></NavLink>
    <nav aria-label="Main navigation">
      <NavLink to="/">{customer ? 'Home' : 'Sign in'}</NavLink>
      <NavLink to="/fleet">Fleet</NavLink><NavLink to="/my-bookings">My bookings</NavLink><NavLink to="/admin">Admin</NavLink>
      {customer ? <><span className="nav-user">{customer.name}</span><button className="button button-small button-outline" onClick={logout}>Sign out</button></> : <NavLink to="/register">Create account</NavLink>}
    </nav>
  </header>;
}
