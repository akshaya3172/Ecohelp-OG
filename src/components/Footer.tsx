import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, HeartHandshake, Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <footer className="bg-deepTeal text-warmSand border-t border-deepTeal-hover/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-softTurquoise text-deepTeal flex items-center justify-center font-bold">
                <Leaf className="w-5 h-5 text-deepTeal" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-warmSand">EcoHelp</span>
                <span className="ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sageMint/20 text-softTurquoise border border-softTurquoise/30">
                  Sustainable Commerce
                </span>
              </div>
            </div>
            
            <p className="text-sm text-warmSand/80 leading-relaxed max-w-sm">
              Connecting manufacturers, distributors, supermarkets, and local businesses to discover near-expiry inventory, recover capital, and prevent unnecessary landfill waste.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-deepTeal-hover border border-softTurquoise/20 text-xs text-softTurquoise">
                <ShieldCheck className="w-4 h-4" />
                <span>FSSAI Compliant Matching</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-deepTeal-hover border border-softTurquoise/20 text-xs text-softTurquoise">
                <HeartHandshake className="w-4 h-4" />
                <span>Zero Landfill Mission</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold uppercase tracking-wider text-softTurquoise">Marketplace</h5>
            <ul className="space-y-2 text-xs text-warmSand/80">
              <li>
                <button onClick={() => setCurrentView('marketplace')} className="hover:text-softTurquoise transition-colors">
                  Browse All Categories
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('marketplace')} className="hover:text-softTurquoise transition-colors">
                  Dairy & Cold-Chain
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('marketplace')} className="hover:text-softTurquoise transition-colors">
                  Packaged Food & Staples
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('marketplace')} className="hover:text-softTurquoise transition-colors">
                  Beverages & Juices
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('marketplace')} className="hover:text-softTurquoise transition-colors">
                  Urgent Clearance (7 Days)
                </button>
              </li>
            </ul>
          </div>

          {/* Business Solutions */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold uppercase tracking-wider text-softTurquoise">Solutions</h5>
            <ul className="space-y-2 text-xs text-warmSand/80">
              <li>
                <button onClick={() => setCurrentView('dashboard')} className="hover:text-softTurquoise transition-colors">
                  Distributor Bulk Dispatch
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('dashboard')} className="hover:text-softTurquoise transition-colors">
                  Supermarket Inventory Recovery
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('dashboard')} className="hover:text-softTurquoise transition-colors">
                  Warehouse Logistics Integration
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('dashboard')} className="hover:text-softTurquoise transition-colors">
                  ESG & Waste Auditing Metrics
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & Regulatory Disclaimer */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold uppercase tracking-wider text-softTurquoise">Compliance Desk</h5>
            <div className="p-3.5 rounded-xl bg-deepTeal-hover border border-sageMint/20 text-[11px] text-warmSand/70 leading-relaxed">
              <p className="font-semibold text-warmSand mb-1">Platform Disclaimer:</p>
              EcoHelp is an independent digital technology platform. EcoHelp is not a statutory certification agency or food authority. Registered businesses are independently responsible for statutory FSSAI compliance, batch integrity, and proper cold-chain handling.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 mt-10 border-t border-warmSand/10 flex flex-col sm:flex-row items-center justify-between text-xs text-warmSand/60 gap-4">
          <p>© 2026 EcoHelp Technologies Ltd. All rights reserved. Connecting Businesses. Creating Value. Reducing Waste.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-warmSand transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-warmSand transition-colors cursor-pointer">Terms of Commercial Service</span>
            <span className="hover:text-warmSand transition-colors cursor-pointer">Food Safety Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
