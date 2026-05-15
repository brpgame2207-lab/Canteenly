/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { StudentNavbar } from './components/StudentNavbar';
import { LandingPage } from './pages/LandingPage';
import { MenuPage } from './pages/MenuPage';
import { CartPage } from './pages/CartPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { TrackingPage } from './pages/TrackingPage';
import { CartProvider } from './context/CartContext';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen text-white">
      {!isAdmin && <StudentNavbar />}
      <main className={isAdmin ? "" : "container mx-auto"}>
        <PageWrapper>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </PageWrapper>
      </main>

      {!isAdmin && (
        <footer className="py-12 px-6 border-t border-white/5 bg-black/20 text-center">
          <p className="text-neutral-500 text-sm">© 2026 Canteenly. Smart Canteen Management for Modern Campuses.</p>
        </footer>
      )}
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

