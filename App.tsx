import React, { lazy, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { AuthModal } from './components/AuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { SellProductModal } from './components/SellProductModal';

const LandingPage = lazy(() => import('./pages/LandingPage').then((module) => ({ default: module.LandingPage })));
const MarketplacePage = lazy(() => import('./pages/MarketplacePage').then((module) => ({ default: module.MarketplacePage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((module) => ({ default: module.DashboardPage })));
const AdminDashboard = lazy(() => import('./pages/Dashboards/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));


const MainLayout: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-warmSand text-charcoal">
      {/* Top Brand Navbar */}
      <Navbar />

      {/* Dynamic View Router */}
      <main className="flex-1">
        <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center text-deepTeal" role="status">Loading EcoHelp…</div>}>
          {currentView === 'landing' && <LandingPage />}
          {currentView === 'marketplace' && <MarketplacePage />}
          {currentView === 'dashboard' && <DashboardPage />}
          {currentView === 'admin' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <AdminDashboard />
            </div>
          )}
        </Suspense>
      </main>

      {/* Global Modals & Notifications */}
      <AuthModal />
      <CheckoutModal />
      <SellProductModal />
      <Toast />

      {/* Brand Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
