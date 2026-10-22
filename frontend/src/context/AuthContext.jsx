import React, { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try { return JSON.parse(localStorage.getItem('driveeasy-session')) || { customer: null, token: null }; }
    catch { return { customer: null, token: null }; }
  });
  function signIn(customer, token) {
    const next = { customer, token };
    setSession(next);
    localStorage.setItem('driveeasy-session', JSON.stringify(next));
  }
  function signOut() {
    setSession({ customer: null, token: null });
    localStorage.removeItem('driveeasy-session');
  }
  const value = useMemo(() => ({ ...session, signIn, signOut }), [session]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
