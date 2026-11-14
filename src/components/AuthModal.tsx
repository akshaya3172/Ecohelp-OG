import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, Building, User, Phone, MapPin, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalMode, 
    openAuthModal, 
    login, 
    register, 
    switchDemoUser,
    showToast 
  } = useApp();

  // Mode
  const isLogin = authModalMode === 'login';

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('seller');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Independent Grocery & Mart');
  const [contactPerson, setContactPerson] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [location, setLocation] = useState('Bengaluru, Karnataka');
  const [gstNumber, setGstNumber] = useState('');
  const [fssaiNumber, setFssaiNumber] = useState('');

  if (!isAuthModalOpen) return null;

  const isBusinessRole = role === 'distributor' || role === 'seller' || role === 'buyer';

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Please enter your email.');
      return;
    }
    await login(email, password);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      showToast('Please fill in your primary contact information.');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters.');
      return;
    }

    if (isBusinessRole && !businessName.trim()) {
      showToast('Please enter your registered Business Name.');
      return;
    }

    await register({
      name,
      email,
      role,
      phone,
      businessName: isBusinessRole ? businessName : undefined,
      businessType: isBusinessRole ? businessType : undefined,
      contactPerson: isBusinessRole ? (contactPerson || name) : undefined,
      businessAddress: isBusinessRole ? businessAddress : undefined,
      location,
      gstNumber: isBusinessRole ? gstNumber : undefined,
      fssaiNumber: isBusinessRole ? fssaiNumber : undefined,
    }, password);
  };

  const demoAccounts = [
    { role: 'distributor' as UserRole, label: 'Distributor', email: 'distributor@ecohelp.com', company: 'Apex Logistics' },
    { role: 'seller' as UserRole, label: 'Retailer Seller', email: 'seller@ecohelp.com', company: 'FreshBazaar' },
    { role: 'buyer' as UserRole, label: 'Retailer Buyer', email: 'buyer@ecohelp.com', company: 'Urban Corner' },
    { role: 'consumer' as UserRole, label: 'Consumer', email: 'consumer@ecohelp.com', company: 'Household' },
    { role: 'admin' as UserRole, label: 'Platform Admin', email: 'admin@ecohelp.com', company: 'Compliance Desk' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-elevated border border-charcoal/10 overflow-hidden my-8 animate-fade-in">
        
        {/* Header Banner */}
        <div className="bg-deepTeal text-warmSand px-6 py-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-softTurquoise">
              {isLogin ? 'Welcome Back to EcoHelp' : 'Create an Account'}
            </span>
            <h3 className="text-xl font-bold tracking-tight text-white mt-1">
              {isLogin ? 'Sign In to Your Account' : 'Register Your Business or Profile'}
            </h3>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-9 h-9 rounded-full bg-deepTeal-hover flex items-center justify-center text-warmSand/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1-Click Quick Demo Login Pill for Hackathon Judges */}
        <div className="bg-warmSand/50 border-b border-charcoal/10 p-3.5 px-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-charcoal/70 mb-2">
            ⚡ Quick 1-Click Demo Login (For Evaluation):
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.role}
                type="button"
                onClick={() => {
                  switchDemoUser(acc.role);
                  closeAuthModal();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-sageMint/40 border border-charcoal/10 text-left transition-colors text-xs shadow-xs"
              >
                <p className="font-bold text-deepTeal truncate">{acc.label}</p>
                <p className="text-[10px] text-charcoal/60 truncate">{acc.company}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Form Content */}
        <div className="p-6">
          {isLogin ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. seller@ecohelp.com or your email"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-charcoal/20 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal text-sm bg-warmSand/10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-charcoal/20 focus:border-deepTeal focus:ring-1 focus:ring-deepTeal text-sm bg-warmSand/10"
                    defaultValue="demo123"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-softTurquoise text-deepTeal font-bold hover:bg-softTurquoise-hover transition-colors shadow-soft flex items-center justify-center gap-2 mt-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-3 border-t border-charcoal/10 text-xs text-charcoal/70">
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="font-bold text-deepTeal hover:underline"
                >
                  Create one now
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              
              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5">Select Your Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { role: 'distributor' as UserRole, title: 'Distributor', desc: 'Wholesale & bulk pallets' },
                    { role: 'seller' as UserRole, title: 'Retailer – Seller', desc: 'Store & excess stock' },
                    { role: 'buyer' as UserRole, title: 'Retailer – Buyer', desc: 'Discount inventory purchaser' },
                    { role: 'consumer' as UserRole, title: 'Consumer Buyer', desc: 'Household grocery savings' },
                  ].map((item) => (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => setRole(item.role)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        role === item.role
                          ? 'border-deepTeal bg-sageMint/30 text-deepTeal shadow-xs font-semibold'
                          : 'border-charcoal/10 hover:border-charcoal/30 bg-warmSand/10 text-charcoal'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">{item.title}</span>
                        {role === item.role && <CheckCircle2 className="w-4 h-4 text-deepTeal" />}
                      </div>
                      <p className="text-[10px] text-charcoal/60 mt-0.5">{item.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary User Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Your Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-charcoal/40 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ramesh Patel"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-charcoal/20 text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-charcoal/40 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-charcoal/20 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-charcoal/40 absolute left-3 top-3" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-charcoal/20 text-xs"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-charcoal mb-1">Password (Min 6 char) *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-charcoal/40 absolute left-3 top-3" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-charcoal/20 text-xs"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Business Account Details (Conditional based on role) */}
              {isBusinessRole && (
                <div className="p-3.5 rounded-2xl bg-warmSand/30 border border-charcoal/10 space-y-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-deepTeal" />
                    <span className="text-xs font-bold text-deepTeal uppercase tracking-wider">Commercial Business Profile</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal mb-1">Business / Company Name *</label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="e.g. Apex Supplies Pvt Ltd"
                        className="w-full px-3 py-1.5 rounded-lg border border-charcoal/20 text-xs"
                        required={isBusinessRole}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal mb-1">Business Type</label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-charcoal/20 text-xs bg-white"
                      >
                        <option>Regional FMCG Wholesaler</option>
                        <option>Supermarket Chain</option>
                        <option>Independent Grocery Mart</option>
                        <option>Food Manufacturer / Processor</option>
                        <option>Hospitality & Catering Group</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal mb-1">City & State</label>
                      <div className="relative">
                        <MapPin className="w-3.5 h-3.5 text-charcoal/40 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Pune, Maharashtra"
                          className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-charcoal/20 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal mb-1">FSSAI License / Reg. No.</label>
                      <div className="relative">
                        <FileText className="w-3.5 h-3.5 text-charcoal/40 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          value={fssaiNumber}
                          onChange={(e) => setFssaiNumber(e.target.value)}
                          placeholder="e.g. 11521018000452"
                          className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-charcoal/20 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-charcoal mb-1">Registered Business Address</label>
                    <input
                      type="text"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      placeholder="Warehouse / Store address"
                      className="w-full px-3 py-1.5 rounded-lg border border-charcoal/20 text-xs"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-softTurquoise text-deepTeal font-bold hover:bg-softTurquoise-hover transition-colors shadow-soft flex items-center justify-center gap-2 mt-3"
              >
                <span>Register Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2 text-xs text-charcoal/70">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="font-bold text-deepTeal hover:underline"
                >
                  Log In
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
