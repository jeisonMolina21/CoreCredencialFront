import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './core/contexts/AuthContext';

// Routes imports
import PublicRoutes from './routes/PublicRoutes';
import SystemRoutes from './routes/SystemRoutes';
import CompanyRoutes from './routes/CompanyRoutes';

// Standalone pages
import { AuthPage as Auth, PaymentResultPage as PaymentResult } from './modules/public/auth';

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          {PublicRoutes}

          {/* Auth Route is standalone */}
          <Route path="/login" element={<Auth />} />
          <Route path="/payment-success" element={<PaymentResult />} />

          {/* System Admin Routes */}
          {SystemRoutes}

          {/* Company / Tenant Routes */}
          {CompanyRoutes}
        </Routes>
      </AnimatePresence>
    </AuthProvider>
  );
}

export default App;
