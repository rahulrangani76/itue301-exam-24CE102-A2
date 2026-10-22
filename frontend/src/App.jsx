import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navigation from './components/Navigation.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Loading from './components/Loading.jsx';
import { useAuth } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import FleetPage from './pages/FleetPage.jsx';
import MyBookingsPage from './pages/MyBookingsPage.jsx';
const AdminPanel = lazy(() => import('./pages/AdminPanel.jsx'));

function App() {
  const { customer } = useAuth();
  return <><Navigation/><Routes>
    <Route path="/" element={customer ? <Navigate to="/fleet" replace/> : <LoginPage/>}/>
    <Route path="/register" element={customer ? <Navigate to="/fleet" replace/> : <RegisterPage/>}/>
    <Route element={<ProtectedRoute/>}><Route path="/fleet" element={<FleetPage/>}/><Route path="/my-bookings" element={<MyBookingsPage/>}/></Route>
    <Route element={<ProtectedRoute roles={['admin', 'fleetManager']}/> }><Route path="/admin" element={<Suspense fallback={<Loading label="Opening admin panel"/>}><AdminPanel/></Suspense>}/></Route>
    <Route path="*" element={<main className="not-found"><span className="eyebrow">404 · ROUTE NOT FOUND</span><h1>Looks like a wrong turn.</h1><p className="muted">We couldn’t find that page. Let’s get you back on the road.</p><a className="button button-primary" href={customer ? '/fleet' : '/'}>Go to DriveEasy <span aria-hidden="true">→</span></a></main>}/>
  </Routes><footer className="site-footer"><span className="brand"><span className="brand-mark">D</span> driveeasy<span className="brand-dot">.</span></span><span>Good cars. Great trips. © {new Date().getFullYear()} DriveEasy</span><span>Made for the miles ahead <span className="footer-spark">✳</span></span></footer></>;
}
export default App;
