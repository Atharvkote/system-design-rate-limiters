/**
 * @file App.jsx
 * @description Root application with routing.
 */

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Landing } from './pages/Landing.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Simulator } from './pages/Simulator.jsx';
import { Docs } from './pages/Docs.jsx';
import { useSocket } from './hooks/useSocket.js';
import Navbar from './components/layout/navbar.jsx';
import Footer from './components/layout/footer.jsx';
import { Helmet } from 'react-helmet-async';

function AppContent() {
  useSocket();
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/simulator" element={<Simulator />} />
      <Route path="/docs" element={<Docs />} />
    </Routes>
  );
}

export default function App() {
  const noNavbarRoutes = ['/'];
  const noFooterRoutes = ['/simulator'];
  const pathname = useLocation().pathname;
  return (
    <>
      <Helmet>
        <title>Rate Limiter | Home</title>

        <meta
          name="description"
          content="Monitor Redis-based distributed rate limiter in real time."
        />
      </Helmet>
      {noNavbarRoutes.includes(pathname) ? null : (<Navbar />)}
      <AppContent />
      {noFooterRoutes.includes(pathname) ? null : (<Footer />)}
    </>
  );
}
