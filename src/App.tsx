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
import { LoginPage } from './pages/LoginPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

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

const AuthGuard = ({ children, requireAdmin = false, requireGuest = false }: { children: React.ReactNode, requireAdmin?: boolean, requireGuest?: boolean }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen bg-[#0c0c0c] flex items-center justify-center text-brand font-bold">Loading...</div>;
  }

  if (requireGuest) {
    if (user) {
      return <Navigate to={user.role === 'admin' ? '/admin' : '/menu'} replace />;
    }
    return <>{children}</>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/menu" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const isLanding = location.pathname === '/';
  const isMenu = location.pathname === '/menu';
  const isLogin = location.pathname === '/login';
  
  const hideNavAndFooter = isAdmin || isLogin;

  return (
    <div className="min-h-screen text-white bg-black">
      {!hideNavAndFooter && <StudentNavbar />}
      <main className={isAdmin || isLanding || isMenu ? "" : "container mx-auto"}>
        <PageWrapper>
          <Routes>
            {/* Guest Route: If logged in, redirects to respective dashboard */}
            <Route path="/" element={<AuthGuard requireGuest><LandingPage /></AuthGuard>} />
            <Route path="/login" element={<AuthGuard requireGuest><LoginPage /></AuthGuard>} />
            
            {/* Protected Routes */}
            <Route path="/menu" element={<AuthGuard><MenuPage /></AuthGuard>} />
            <Route path="/cart" element={<AuthGuard><CartPage /></AuthGuard>} />
            <Route path="/tracking" element={<AuthGuard><TrackingPage /></AuthGuard>} />
            
            {/* Admin Route */}
            <Route path="/admin" element={<AuthGuard requireAdmin><AdminDashboard /></AuthGuard>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageWrapper>
      </main>

      {!hideNavAndFooter && (
        <footer className="py-12 px-6 border-t border-white/5 bg-black/20 text-center">
          <p className="text-neutral-500 text-sm">© 2026 Canteenly. Smart Canteen Management for Modern Campuses.</p>
        </footer>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

