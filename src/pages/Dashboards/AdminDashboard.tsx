import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Check, 
  Trash2, 
  RotateCcw, 
  AlertCircle 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, 
    users, 
    products, 
    orders, 
    verifyBusinessUser, 
    deleteProduct, 
    resetDatabase,
    openAuthModal
  } = useApp();

  const [activeTab, setActiveTab] = useState<'verification' | 'products' | 'users' | 'orders'>('verification');

  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto p-12 text-center bg-white rounded-3xl border border-charcoal/10 shadow-card space-y-4 my-12 animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-700 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-deepTeal">Restricted Access</h3>
        <p className="text-xs text-charcoal/70 leading-relaxed">
          The Administrative Control Center is restricted to authorized platform compliance personnel.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-5 py-2.5 rounded-xl bg-deepTeal text-warmSand text-xs font-bold"
        >
          Sign In as Administrator
        </button>
      </div>
    );
  }

  const businessUsers = users.filter((u) => u.role !== 'consumer' && u.role !== 'admin');
  const pendingVerifications = businessUsers.filter((u) => !u.verified);
  const totalVolume = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-deepTeal text-warmSand flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-softTurquoise/30 text-softTurquoise text-xs font-bold uppercase tracking-wider">
              Platform Administration
            </span>
            <span className="text-xs text-warmSand/70">Compliance & Trust Desk</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            EcoHelp Regulatory Center
          </h2>
          <p className="text-xs text-warmSand/80 mt-1 max-w-xl">
            Audit FSSAI statutory licenses, approve newly registered distributor accounts, monitor gross marketplace merchandise volume, and moderate surplus catalog integrity.
          </p>
        </div>

        <button
          onClick={resetDatabase}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-400/40 text-xs font-bold flex items-center gap-2 transition-colors"
          title="Reset database to fresh seed state"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo Seed Data</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Total Ecosystem Users</span>
          <p className="text-2xl sm:text-3xl font-black text-deepTeal">{users.length}</p>
          <span className="text-[11px] text-charcoal/60 font-semibold">{businessUsers.length} commercial businesses</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Pending Verifications</span>
          <p className="text-2xl sm:text-3xl font-black text-amber-700">{pendingVerifications.length}</p>
          <span className="text-[11px] text-amber-800 font-semibold">Requires FSSAI check</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Live Catalog Batches</span>
          <p className="text-2xl sm:text-3xl font-black text-deepTeal">{products.length}</p>
          <span className="text-[11px] text-emerald-700 font-semibold">Active surplus inventory</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Gross Platform Volume</span>
          <p className="text-2xl sm:text-3xl font-black text-deepTeal">₹{totalVolume.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-emerald-700 font-semibold">{orders.length} total orders routed</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-charcoal/10 pb-4">
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'verification'
              ? 'bg-deepTeal text-warmSand shadow-soft'
              : 'bg-white hover:bg-warmSand text-charcoal border border-charcoal/10'
          }`}
        >
          Business Verification Queue ({businessUsers.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'products'
              ? 'bg-deepTeal text-warmSand shadow-soft'
              : 'bg-white hover:bg-warmSand text-charcoal border border-charcoal/10'
          }`}
        >
          Catalog Moderation ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-deepTeal text-warmSand shadow-soft'
              : 'bg-white hover:bg-warmSand text-charcoal border border-charcoal/10'
          }`}
        >
          Platform Orders ({orders.length})
        </button>
      </div>

      {/* Tab 1: Verification Queue */}
      {activeTab === 'verification' && (
        <div className="bg-white rounded-3xl border border-charcoal/10 shadow-card overflow-hidden">
          <div className="p-5 border-b border-charcoal/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-deepTeal">Commercial Accounts & Statutory Licenses</h3>
            <span className="text-xs text-charcoal/60">FSSAI / GST registry sync</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warmSand/30 text-charcoal/70 uppercase tracking-wider text-[10px] font-bold border-b border-charcoal/10">
                <tr>
                  <th className="py-3 px-4">Business & Contact Person</th>
                  <th className="py-3 px-4">Account Role</th>
                  <th className="py-3 px-4">FSSAI License / GST</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/10">
                {businessUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-warmSand/10">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-deepTeal">{u.businessName || u.name}</p>
                      <span className="text-[10px] text-charcoal/60">{u.contactPerson || u.name} · {u.email}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold capitalize text-charcoal">
                      {u.role}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-charcoal/80">
                      <div>FSSAI: {u.fssaiNumber || '11521018000452'}</div>
                      {u.gstNumber && <div className="text-[10px] text-charcoal/50">GST: {u.gstNumber}</div>}
                    </td>
                    <td className="py-3.5 px-4 text-charcoal/70">
                      {u.location || 'India'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        u.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {u.verified ? 'Verified Business' : 'Pending Verification'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.verified ? (
                        <button
                          onClick={() => verifyBusinessUser(u.id, false)}
                          className="px-3 py-1 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 text-[11px] font-bold"
                        >
                          Revoke Badge
                        </button>
                      ) : (
                        <button
                          onClick={() => verifyBusinessUser(u.id, true)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-bold flex items-center gap-1 ml-auto"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve & Verify</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Products Catalog Moderation */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-charcoal/10 shadow-card overflow-hidden">
          <div className="p-5 border-b border-charcoal/10">
            <h3 className="text-sm font-bold text-deepTeal">Platform Surplus Catalog Moderation</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warmSand/30 text-charcoal/70 uppercase tracking-wider text-[10px] font-bold border-b border-charcoal/10">
                <tr>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Seller</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Quantity</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/10">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-warmSand/10">
                    <td className="py-3 px-4 font-bold text-deepTeal">{p.name}</td>
                    <td className="py-3 px-4 text-charcoal/70">{p.sellerName}</td>
                    <td className="py-3 px-4 font-bold">₹{p.discountedPrice}</td>
                    <td className="py-3 px-4 font-semibold">{p.quantity} {p.unit}</td>
                    <td className="py-3 px-4 font-mono">{p.expiryDate}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Remove listing from marketplace"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Platform Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-charcoal/10 shadow-card overflow-hidden">
          <div className="p-5 border-b border-charcoal/10">
            <h3 className="text-sm font-bold text-deepTeal">Platform Transaction Log</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warmSand/30 text-charcoal/70 uppercase tracking-wider text-[10px] font-bold border-b border-charcoal/10">
                <tr>
                  <th className="py-3 px-4">Order Ref</th>
                  <th className="py-3 px-4">Buyer</th>
                  <th className="py-3 px-4">Seller</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/10">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-warmSand/10">
                    <td className="py-3 px-4 font-mono font-bold text-deepTeal">{ord.orderNumber}</td>
                    <td className="py-3 px-4">{ord.buyerName}</td>
                    <td className="py-3 px-4">{ord.sellerName}</td>
                    <td className="py-3 px-4 font-bold">₹{ord.total.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-warmSand">
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-charcoal/60">{ord.createdAt.split('T')[0]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
