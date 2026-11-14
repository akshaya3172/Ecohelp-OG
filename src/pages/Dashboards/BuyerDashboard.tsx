import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Clock, 
  Truck, 
  Warehouse 
} from 'lucide-react';

export const BuyerDashboard: React.FC = () => {
  const { currentUser, orders, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  // Filter orders where currentUser is buyer
  const buyerOrders = orders.filter(
    (o) => o.buyerId === currentUser?.id || currentUser?.role === 'admin'
  );

  const activeOrders = buyerOrders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  );
  const completedOrders = buyerOrders.filter(
    (o) => o.status === 'completed' || o.status === 'cancelled'
  );

  const totalSpent = buyerOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const totalSaved = buyerOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.sustainabilityDiscount, 0);

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'pending': return 1;
      case 'confirmed': return 2;
      case 'processing':
      case 'ready_for_pickup': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-deepTeal text-warmSand flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-lightOceanBlue/30 text-softTurquoise text-xs font-bold uppercase tracking-wider">
              Retailer – Buyer Procurement
            </span>
            <span className="text-xs text-warmSand/70">{currentUser?.businessName || 'Urban Corner Retail Mart'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Procurement Portal · {currentUser?.name}
          </h2>
          <p className="text-xs text-warmSand/80 mt-1 max-w-xl">
            Track active surplus shipments, review pickup documentation, and discover immediate discount lots for your retail outlets.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('marketplace')}
          className="self-start md:self-auto px-6 py-3.5 rounded-2xl bg-softTurquoise text-deepTeal font-bold text-xs hover:bg-softTurquoise-hover shadow-soft transition-transform active:scale-95 flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Browse Marketplace</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Active Shipments</span>
          <p className="text-2xl sm:text-3xl font-black text-deepTeal">{activeOrders.length}</p>
          <span className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>In transit or ready for pickup</span>
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Total Orders Placed</span>
          <p className="text-2xl sm:text-3xl font-black text-deepTeal">{buyerOrders.length}</p>
          <span className="text-[11px] text-charcoal/60 font-semibold">Lifetime purchases</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Total Procurement</span>
          <p className="text-2xl sm:text-3xl font-black text-deepTeal">₹{totalSpent.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-emerald-700 font-semibold">Recovered surplus spend</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Green Discounts Saved</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700">₹{(totalSaved + Math.round(totalSpent * 0.4)).toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-emerald-800 font-semibold">Below standard wholesale</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-charcoal/10 pb-4">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'active'
              ? 'bg-deepTeal text-warmSand shadow-soft'
              : 'bg-white hover:bg-warmSand text-charcoal border border-charcoal/10'
          }`}
        >
          Active Orders ({activeOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-deepTeal text-warmSand shadow-soft'
              : 'bg-white hover:bg-warmSand text-charcoal border border-charcoal/10'
          }`}
        >
          Order History ({completedOrders.length})
        </button>
      </div>

      {/* Order List */}
      <div className="space-y-4">
        {(activeTab === 'active' ? activeOrders : completedOrders).length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-3">
            <div className="w-12 h-12 rounded-full bg-warmSand text-charcoal/50 mx-auto flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <p className="text-xs text-charcoal/60">
              No orders found in this section.
            </p>
            <button
              onClick={() => setCurrentView('marketplace')}
              className="px-5 py-2.5 rounded-xl bg-softTurquoise text-deepTeal font-bold text-xs"
            >
              Explore Near-Expiry Deals
            </button>
          </div>
        ) : (
          (activeTab === 'active' ? activeOrders : completedOrders).map((ord) => {
            const step = getStatusStep(ord.status);

            return (
              <div
                key={ord.id}
                className="p-6 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-6"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-charcoal/10 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-extrabold text-deepTeal">{ord.orderNumber}</span>
                      <span className="text-xs text-charcoal/50">· Placed on {ord.createdAt.split('T')[0]}</span>
                    </div>
                    <p className="text-xs text-charcoal/70 mt-0.5">
                      Supplier: <strong className="text-deepTeal">{ord.sellerName}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-base font-extrabold text-deepTeal">
                      ₹{ord.total.toLocaleString('en-IN')}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      ord.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : ord.status === 'cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-900 animate-pulse'
                    }`}>
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Tracking Progress Bar */}
                {ord.status !== 'cancelled' && (
                  <div className="py-2">
                    <div className="grid grid-cols-4 text-center text-[11px] font-bold text-charcoal/70 mb-2">
                      <span className={step >= 1 ? 'text-deepTeal' : ''}>1. Order Placed</span>
                      <span className={step >= 2 ? 'text-deepTeal' : ''}>2. Confirmed by Seller</span>
                      <span className={step >= 3 ? 'text-deepTeal' : ''}>
                        {ord.deliveryType === 'pickup' ? '3. Ready for Pickup' : '3. In Dispatch Transit'}
                      </span>
                      <span className={step >= 4 ? 'text-emerald-700' : ''}>4. Completed</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-warmSand overflow-hidden">
                      <div
                        className="h-full rounded-full bg-deepTeal transition-all duration-500"
                        style={{ width: `${(step / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-2">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-warmSand/20 p-3 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl} alt={item.productName} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-deepTeal">{item.productName}</p>
                          <span className="text-[11px] text-charcoal/60">
                            {item.quantity} {item.unit} @ ₹{item.unitPrice} (Orig: ₹{item.originalUnitPrice})
                          </span>
                        </div>
                      </div>
                      <span className="font-bold text-deepTeal">₹{item.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                {/* Logistics & Pickup Details Box */}
                <div className="p-4 rounded-2xl bg-warmSand/40 border border-charcoal/10 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-deepTeal">
                    {ord.deliveryType === 'delivery' ? (
                      <Truck className="w-4 h-4 text-deepTeal" />
                    ) : (
                      <Warehouse className="w-4 h-4 text-deepTeal" />
                    )}
                    <span className="capitalize">{ord.deliveryType} Instructions</span>
                  </div>
                  {ord.deliveryType === 'delivery' ? (
                    <p className="text-charcoal/80 leading-relaxed">
                      Delivery Address: <strong>{ord.deliveryAddress}</strong>. Refrigerated carrier vehicle assigned.
                    </p>
                  ) : (
                    <p className="text-charcoal/80 leading-relaxed">
                      Pickup Location: <strong>{ord.pickupLocation}</strong>. Designated Slot: <strong>{ord.pickupTimeSlot}</strong>. Present order reference <strong className="font-mono">{ord.orderNumber}</strong> at the depot loading dock.
                    </p>
                  )}
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
