import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Package, 
  TrendingUp, 
  Clock, 
  PlusCircle, 
  CheckCircle2, 
  ArrowUpRight,
  Trash2,
  Eye
} from 'lucide-react';

export const SellerDashboard: React.FC = () => {
  const { 
    currentUser, 
    products, 
    orders, 
    openSellModal, 
    updateOrderStatus, 
    deleteProduct, 
    setCurrentView 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'listings' | 'orders'>('listings');
  const [orderFilter, setOrderFilter] = useState<string>('all');

  // Filter products belonging to this seller
  const sellerProducts = products.filter(
    (p) => p.sellerId === currentUser?.id || currentUser?.role === 'admin'
  );

  // Filter orders belonging to this seller
  const sellerOrders = orders.filter(
    (o) => o.sellerId === currentUser?.id || currentUser?.role === 'admin'
  );

  const activeProducts = sellerProducts.filter((p) => p.status === 'active' && p.quantity > 0);
  const nearingExpiryProducts = sellerProducts.filter((p) => {
    const days = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days <= 7 && days > 0;
  });

  const totalSalesRevenue = sellerOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const filteredOrders = sellerOrders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Dashboard Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-deepTeal text-warmSand flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-sageMint/30 text-softTurquoise text-xs font-bold uppercase tracking-wider">
              Retailer – Seller Operations
            </span>
            <span className="text-xs text-warmSand/70">Store: {currentUser?.businessName || 'FreshBazaar Supermarket'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Welcome back, {currentUser?.name}
          </h2>
          <p className="text-xs text-warmSand/80 mt-1 max-w-xl">
            Monitor real-time surplus clearance rates, accept store dispatch orders, and publish new near-expiry inventory batches.
          </p>
        </div>

        <button
          onClick={openSellModal}
          className="self-start md:self-auto px-6 py-3.5 rounded-2xl bg-softTurquoise text-deepTeal font-bold text-xs hover:bg-softTurquoise-hover shadow-soft transition-transform active:scale-95 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Listings */}
        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Total Listings</span>
            <div className="w-8 h-8 rounded-xl bg-sageMint/40 text-deepTeal flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-deepTeal">{sellerProducts.length}</p>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Active in marketplace</span>
          </span>
        </div>

        {/* Active Products */}
        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Active Inventory</span>
            <div className="w-8 h-8 rounded-xl bg-lightOceanBlue/40 text-deepTeal flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-deepTeal">{activeProducts.length}</p>
          <span className="text-[11px] text-charcoal/60 font-semibold">Available for purchase</span>
        </div>

        {/* Products Nearing Expiry */}
        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Nearing Expiry (≤ 7d)</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-800">{nearingExpiryProducts.length}</p>
          <span className="text-[11px] text-rose-700 font-semibold">Requires flash markdown</span>
        </div>

        {/* Total Sales Overview */}
        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Recovered Value</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-deepTeal">
            ₹{totalSalesRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold">
            {sellerOrders.length} order(s) processed
          </span>
        </div>

      </div>

      {/* Main Tab Controls: Listings vs Orders */}
      <div className="flex items-center gap-2 border-b border-charcoal/10 pb-4">
        <button
          onClick={() => setActiveTab('listings')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'listings'
              ? 'bg-deepTeal text-warmSand shadow-soft'
              : 'bg-white hover:bg-warmSand text-charcoal border border-charcoal/10'
          }`}
        >
          Manage Listings ({sellerProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'orders'
              ? 'bg-deepTeal text-warmSand shadow-soft'
              : 'bg-white hover:bg-warmSand text-charcoal border border-charcoal/10'
          }`}
        >
          Incoming Orders ({sellerOrders.length})
        </button>
      </div>

      {/* Tab 1: Manage Listings Table */}
      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl border border-charcoal/10 shadow-card overflow-hidden">
          <div className="p-5 border-b border-charcoal/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-deepTeal">Product Inventory Overview</h3>
            <span className="text-xs text-charcoal/60">Updated in real-time</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warmSand/30 text-charcoal/70 uppercase tracking-wider text-[10px] font-bold border-b border-charcoal/10">
                <tr>
                  <th className="py-3 px-4">Product & Brand</th>
                  <th className="py-3 px-4">Batch Number</th>
                  <th className="py-3 px-4">Available Stock</th>
                  <th className="py-3 px-4">Pricing</th>
                  <th className="py-3 px-4">Expiry Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/10">
                {sellerProducts.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-xs text-charcoal/60">
                      You haven't listed any surplus items yet. Click "+ Add New Product" to start!
                    </td>
                  </tr>
                ) : (
                  sellerProducts.map((p) => {
                    const days = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <tr key={p.id} className="hover:bg-warmSand/10 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                            <div>
                              <p className="font-bold text-deepTeal">{p.name}</p>
                              <span className="text-[10px] text-charcoal/60">{p.brand} · {p.category}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-charcoal/80">
                          {p.batchNumber}
                        </td>
                        <td className="py-3.5 px-4 font-semibold">
                          {p.quantity} {p.unit}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-deepTeal">₹{p.discountedPrice}</span>
                          <span className="text-[10px] text-charcoal/50 line-through ml-1.5">₹{p.originalPrice}</span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold">
                          <span className={days <= 7 ? 'text-rose-700 font-bold' : 'text-charcoal/80'}>
                            {p.expiryDate} ({days}d)
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            p.quantity <= 0 
                              ? 'bg-charcoal/10 text-charcoal/60'
                              : days <= 7 
                                ? 'bg-rose-100 text-rose-800' 
                                : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.quantity <= 0 ? 'Sold Out' : days <= 7 ? 'Nearing Expiry' : 'Active'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setCurrentView('marketplace', p.id)}
                              className="p-1.5 rounded-lg bg-warmSand hover:bg-warmSand-dark text-deepTeal"
                              title="View listing in marketplace"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 rounded-lg bg-warmSand hover:bg-rose-100 text-rose-600"
                              title="Delete listing"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Incoming Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {/* Order Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {['all', 'pending', 'confirmed', 'processing', 'ready_for_pickup', 'completed', 'cancelled'].map((st) => (
              <button
                key={st}
                onClick={() => setOrderFilter(st)}
                className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-colors ${
                  orderFilter === st
                    ? 'bg-deepTeal text-warmSand'
                    : 'bg-white hover:bg-warmSand text-charcoal border border-charcoal/15'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-white border border-charcoal/10 text-xs text-charcoal/60">
                No orders found under this status.
              </div>
            ) : (
              filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-charcoal/10 pb-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-deepTeal">{ord.orderNumber}</span>
                      <p className="text-xs text-charcoal/70">
                        Buyer: <strong>{ord.buyerName}</strong> ({ord.buyerPhone}) · Role: <span className="capitalize font-semibold">{ord.buyerRole}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        ord.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'cancelled'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                      }`}>
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs font-bold text-deepTeal">₹{ord.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    {ord.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs text-charcoal/80 bg-warmSand/20 p-2.5 rounded-xl">
                        <div className="flex items-center gap-2">
                          <img src={item.imageUrl} alt={item.productName} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <p className="font-bold text-deepTeal">{item.productName}</p>
                            <span className="text-[10px] text-charcoal/60">{item.quantity} {item.unit} @ ₹{item.unitPrice}</span>
                          </div>
                        </div>
                        <span className="font-bold text-deepTeal">₹{item.subtotal.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                  {/* Fulfillment Details */}
                  <div className="text-xs text-charcoal/70 bg-warmSand/30 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <strong>Fulfillment:</strong> {ord.deliveryType === 'delivery' ? `Direct Dispatch to ${ord.deliveryAddress}` : `Pickup at ${ord.pickupLocation} (${ord.pickupTimeSlot})`}
                    </div>
                    {ord.notes && (
                      <div className="text-[11px] italic">Note: "{ord.notes}"</div>
                    )}
                  </div>

                  {/* Seller Status Controls */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    {ord.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'confirmed')}
                          className="px-3.5 py-1.5 rounded-xl bg-deepTeal text-warmSand font-bold text-xs hover:bg-deepTeal-hover"
                        >
                          Accept Order
                        </button>
                        <button
                          onClick={() => updateOrderStatus(ord.id, 'cancelled')}
                          className="px-3.5 py-1.5 rounded-xl bg-rose-100 text-rose-700 font-bold text-xs hover:bg-rose-200"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {ord.status === 'confirmed' && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, ord.deliveryType === 'pickup' ? 'ready_for_pickup' : 'processing')}
                        className="px-3.5 py-1.5 rounded-xl bg-softTurquoise text-deepTeal font-bold text-xs hover:bg-softTurquoise-hover"
                      >
                        Mark as {ord.deliveryType === 'pickup' ? 'Ready for Pickup' : 'Processing Dispatch'}
                      </button>
                    )}

                    {(ord.status === 'processing' || ord.status === 'ready_for_pickup') && (
                      <button
                        onClick={() => updateOrderStatus(ord.id, 'completed')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                      >
                        Mark as Completed & Dispatched
                      </button>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
