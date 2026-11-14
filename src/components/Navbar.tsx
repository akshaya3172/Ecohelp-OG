import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Bell, 
  PlusCircle, 
  Sparkles, 
  ChevronDown, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck, 
  Check, 
  Menu, 
  X,
  Search,
  ArrowRight
} from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    cartCount, 
    notifications, 
    currentView, 
    setCurrentView, 
    openAuthModal, 
    logout, 
    openCheckoutModal, 
    openSellModal,
    switchDemoUser,
    markNotificationRead,
    markAllNotificationsRead,
    resetDatabase
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  const userNotifs = currentUser 
    ? notifications.filter(n => n.userId === currentUser.id)
    : [];
  const unreadNotifs = userNotifs.filter(n => !n.read);

  const rolesList: { role: UserRole; title: string; desc: string }[] = [
    { role: 'distributor', title: 'Distributor', desc: 'Apex Logistics (Bulk Wholesaler)' },
    { role: 'seller', title: 'Retailer – Seller', desc: 'FreshBazaar Supermarket' },
    { role: 'buyer', title: 'Retailer – Buyer', desc: 'Urban Corner Retail Mart' },
    { role: 'consumer', title: 'Consumer / Household', desc: 'Priya Sharma' },
    { role: 'admin', title: 'Platform Admin', desc: 'Compliance & Verification Desk' },
  ];

  const handleRoleSelect = (role: UserRole) => {
    switchDemoUser(role);
    setIsDemoMenuOpen(false);
  };

  const navigateTo = (view: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
  };

  const handleNavSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearch.trim()) {
      setCurrentView('marketplace');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-warmSand/90 backdrop-blur-md border-b border-charcoal/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity (Matching reference image) */}
          <div 
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-deepTeal flex items-center justify-center text-warmSand shadow-soft group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-softTurquoise" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-deepTeal">EcoHelp</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => navigateTo('landing')}
              className={`text-sm font-semibold transition-all relative py-1 ${
                currentView === 'landing' 
                  ? 'text-deepTeal font-bold' 
                  : 'text-charcoal/80 hover:text-deepTeal'
              }`}
            >
              <span>Home</span>
              {currentView === 'landing' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-softTurquoise-dark rounded-full" />
              )}
            </button>

            <button
              onClick={() => navigateTo('marketplace')}
              className={`text-sm font-semibold transition-all relative py-1 ${
                currentView === 'marketplace' 
                  ? 'text-deepTeal font-bold' 
                  : 'text-charcoal/80 hover:text-deepTeal'
              }`}
            >
              <span>Marketplace</span>
              {currentView === 'marketplace' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-softTurquoise-dark rounded-full" />
              )}
            </button>

            <button
              onClick={() => {
                navigateTo('landing');
                setTimeout(() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-sm font-semibold text-charcoal/80 hover:text-deepTeal transition-colors"
            >
              How It Works
            </button>

            <button
              onClick={() => {
                navigateTo('landing');
                setTimeout(() => {
                  document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="text-sm font-semibold text-charcoal/80 hover:text-deepTeal transition-colors"
            >
              About Us
            </button>
          </nav>

          {/* Search Bar (Matching reference image) */}
          <form 
            onSubmit={handleNavSearchSubmit}
            className="hidden lg:flex items-center relative w-60 xl:w-72"
          >
            <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3" />
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-3 py-2 text-xs rounded-full border border-charcoal/15 bg-white/80 focus:bg-white focus:border-deepTeal focus:ring-1 focus:ring-deepTeal transition-all shadow-xs"
            />
          </form>

          {/* Action Center */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sageMint/40 hover:bg-sageMint/70 text-deepTeal border border-sageMint text-xs font-semibold transition-all shadow-xs"
                title="Switch role for testing"
              >
                <Sparkles className="w-3.5 h-3.5 text-deepTeal" />
                <span className="font-bold capitalize">{currentUser?.role || 'Guest'}</span>
                <ChevronDown className="w-3 h-3 text-deepTeal" />
              </button>

              {isDemoMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-elevated border border-charcoal/10 p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-charcoal/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-deepTeal uppercase tracking-wider">Demo Switcher</p>
                      <p className="text-[10px] text-charcoal/60">Evaluate all 4 roles & Admin</p>
                    </div>
                    <button
                      onClick={resetDatabase}
                      className="text-[10px] text-softTurquoise-dark hover:underline font-semibold"
                    >
                      Reset Data
                    </button>
                  </div>
                  <div className="py-1">
                    {rolesList.map((item) => (
                      <button
                        key={item.role}
                        onClick={() => handleRoleSelect(item.role)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          currentUser?.role === item.role
                            ? 'bg-sageMint/40 text-deepTeal font-bold'
                            : 'hover:bg-warmSand/50 text-charcoal'
                        }`}
                      >
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-[10px] text-charcoal/60">{item.desc}</p>
                        </div>
                        {currentUser?.role === item.role && (
                          <Check className="w-4 h-4 text-deepTeal" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2.5 rounded-full hover:bg-warmSand-hover text-charcoal hover:text-deepTeal transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-softTurquoise animate-pulse" />
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-elevated border border-charcoal/10 p-3 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-charcoal/10 px-2">
                    <h4 className="text-xs font-bold text-deepTeal">Notifications</h4>
                    {unreadNotifs.length > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[10px] text-softTurquoise-dark hover:underline font-semibold"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto py-2 space-y-1.5">
                    {userNotifs.length === 0 ? (
                      <div className="py-4 text-center text-xs text-charcoal/60">
                        No notifications yet.
                      </div>
                    ) : (
                      userNotifs.slice(0, 5).map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markNotificationRead(notif.id)}
                          className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                            notif.read ? 'bg-warmSand/30 text-charcoal/70' : 'bg-lightOceanBlue/20 text-deepTeal font-medium'
                          }`}
                        >
                          <p className="font-bold text-[11px]">{notif.title}</p>
                          <p className="text-[10px] text-charcoal/80 mt-0.5">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <button
              onClick={openCheckoutModal}
              className="relative p-2.5 rounded-full hover:bg-warmSand-hover text-charcoal hover:text-deepTeal transition-colors"
              title="Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-deepTeal text-warmSand text-[9px] font-extrabold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth Buttons / Profile Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-full bg-white hover:bg-warmSand border border-charcoal/15 transition-colors shadow-xs"
                >
                  <div className="w-6 h-6 rounded-full bg-deepTeal text-warmSand font-bold text-xs flex items-center justify-center">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-deepTeal hidden sm:inline max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-charcoal/60" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-elevated border border-charcoal/10 p-2 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-charcoal/10">
                      <p className="text-xs font-bold text-deepTeal">{currentUser.name}</p>
                      <p className="text-[10px] text-charcoal/60 truncate">{currentUser.email}</p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigateTo('dashboard');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-warmSand/60 flex items-center gap-2 font-semibold text-deepTeal"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>
                      
                      {currentUser.role === 'admin' && (
                        <button
                          onClick={() => {
                            navigateTo('admin');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-warmSand/60 flex items-center gap-2 font-semibold text-deepTeal"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Admin Desk</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-semibold mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3 py-2 text-xs font-bold text-deepTeal hover:text-deepTeal-hover transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 text-xs font-bold bg-deepTeal text-warmSand hover:bg-deepTeal-hover rounded-full transition-all shadow-soft flex items-center gap-1.5"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-3.5 h-3.5 text-softTurquoise" />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-charcoal hover:text-deepTeal rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-warmSand border-b border-charcoal/10 px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          <form onSubmit={handleNavSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3" />
            <input
              type="text"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-3 py-2 text-xs rounded-full border border-charcoal/15 bg-white"
            />
          </form>
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => navigateTo('landing')}
              className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-deepTeal hover:bg-sageMint/40"
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('marketplace')}
              className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-deepTeal hover:bg-sageMint/40"
            >
              Marketplace
            </button>
            <button
              onClick={() => navigateTo('dashboard')}
              className="text-left px-3 py-2 rounded-lg text-sm font-semibold text-deepTeal hover:bg-sageMint/40"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                openSellModal();
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded-lg text-sm font-bold text-softTurquoise-dark hover:bg-sageMint/40"
            >
              Sell Here
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
