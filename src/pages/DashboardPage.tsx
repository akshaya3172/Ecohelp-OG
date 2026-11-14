import React from 'react';
import { useApp } from '../context/AppContext';
import { SellerDashboard } from './Dashboards/SellerDashboard';
import { BuyerDashboard } from './Dashboards/BuyerDashboard';
import { DistributorDashboard } from './Dashboards/DistributorDashboard';
import { ConsumerDashboard } from './Dashboards/ConsumerDashboard';
import { AdminDashboard } from './Dashboards/AdminDashboard';
import { UserRole } from '../types';
import { Layers } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { currentUser, switchDemoUser } = useApp();

  // Active role dashboard to show
  const activeRole: UserRole = currentUser?.role || 'seller';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Role Navigation Bar for Hackathon Judges & Evaluators */}
      <div className="p-3 rounded-2xl bg-white border border-charcoal/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-2">
          <Layers className="w-4 h-4 text-deepTeal" />
          <span className="text-xs font-bold text-deepTeal uppercase tracking-wider">
            Evaluation Role Previewer:
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { role: 'distributor' as UserRole, label: 'Distributor' },
            { role: 'seller' as UserRole, label: 'Retailer – Seller' },
            { role: 'buyer' as UserRole, label: 'Retailer – Buyer' },
            { role: 'consumer' as UserRole, label: 'Consumer' },
            { role: 'admin' as UserRole, label: 'Admin Desk' },
          ].map((tab) => (
            <button
              key={tab.role}
              onClick={() => switchDemoUser(tab.role)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeRole === tab.role
                  ? 'bg-deepTeal text-warmSand shadow-soft'
                  : 'bg-warmSand/40 hover:bg-warmSand text-charcoal'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Render matching dashboard */}
      {activeRole === 'distributor' && <DistributorDashboard />}
      {activeRole === 'seller' && <SellerDashboard />}
      {activeRole === 'buyer' && <BuyerDashboard />}
      {activeRole === 'consumer' && <ConsumerDashboard />}
      {activeRole === 'admin' && <AdminDashboard />}

    </div>
  );
};
