import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShoppingBag, 
  Leaf, 
  ArrowRight, 
  TrendingDown 
} from 'lucide-react';

export const ConsumerDashboard: React.FC = () => {
  const { currentUser, orders, setCurrentView, products } = useApp();

  const myOrders = orders.filter(
    (o) => o.buyerId === currentUser?.id || o.buyerRole === 'consumer'
  );

  const totalSpent = myOrders.reduce((sum, o) => sum + o.total, 0);
  const totalSaved = Math.round(totalSpent * 0.45); // estimated savings vs retail MRP

  // Recommend 3 flash clearance products for households
  const flashPicks = products.filter(p => p.status !== 'expired' && p.quantity > 0).slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-deepTeal text-warmSand flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-sageMint/30 text-softTurquoise text-xs font-bold uppercase tracking-wider">
              Consumer Household Savings
            </span>
            <span className="text-xs text-warmSand/70">Welcome back!</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Hello, {currentUser?.name || 'Priya'} 👋
          </h2>
          <p className="text-xs text-warmSand/80 mt-1 max-w-xl">
            Enjoy premium branded groceries and household essentials at up to 60% discount while helping rescue safe food from waste.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('marketplace')}
          className="self-start md:self-auto px-6 py-3.5 rounded-2xl bg-softTurquoise text-deepTeal font-bold text-xs hover:bg-softTurquoise-hover shadow-soft transition-transform active:scale-95 flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Shop Today's Flash Deals</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Household Savings</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700">₹{totalSaved.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Saved vs Supermarket MRP</span>
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Completed Purchases</span>
          <p className="text-2xl sm:text-3xl font-black text-deepTeal">{myOrders.length}</p>
          <span className="text-[11px] text-charcoal/60 font-semibold">Total grocery orders</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Food Rescued</span>
          <p className="text-2xl sm:text-3xl font-black text-deepTeal">18.4 kg</p>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <Leaf className="w-3.5 h-3.5" />
            <span>Zero landfill contribution</span>
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">EcoHelp Green Points</span>
          <p className="text-2xl sm:text-3xl font-black text-softTurquoise-dark">420 pts</p>
          <span className="text-[11px] text-charcoal/60 font-semibold">5% extra discount ready</span>
        </div>
      </div>

      {/* Recommended Household Flash Deals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-deepTeal">Recommended Deals for Your Kitchen</h3>
          <button
            onClick={() => setCurrentView('marketplace')}
            className="text-xs font-bold text-deepTeal hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {flashPicks.map((p) => (
            <div
              key={p.id}
              onClick={() => setCurrentView('marketplace', p.id)}
              className="p-4 rounded-3xl bg-white border border-charcoal/10 shadow-card hover:shadow-elevated transition-all cursor-pointer flex items-center gap-3"
            >
              <img src={p.imageUrl} alt={p.name} className="w-16 h-16 rounded-2xl object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase text-softTurquoise-dark">{p.brand}</span>
                <h4 className="text-xs font-bold text-deepTeal truncate">{p.name}</h4>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-black text-deepTeal">₹{p.discountedPrice}</span>
                  <span className="text-[10px] text-charcoal/40 line-through">₹{p.originalPrice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-3xl border border-charcoal/10 shadow-card overflow-hidden">
        <div className="p-5 border-b border-charcoal/10 flex items-center justify-between">
          <h3 className="text-sm font-bold text-deepTeal">Your Grocery Orders</h3>
          <span className="text-xs text-charcoal/60">{myOrders.length} order(s) placed</span>
        </div>

        <div className="p-5 space-y-4">
          {myOrders.length === 0 ? (
            <div className="py-8 text-center text-xs text-charcoal/60">
              No orders yet. Check out the marketplace for discounts!
            </div>
          ) : (
            myOrders.map((ord) => (
              <div key={ord.id} className="p-4 rounded-2xl bg-warmSand/30 border border-charcoal/10 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-deepTeal">{ord.orderNumber}</span>
                    <span className="text-charcoal/50 ml-2">· {ord.createdAt.split('T')[0]}</span>
                  </div>
                  <span className="font-bold text-deepTeal">₹{ord.total.toLocaleString('en-IN')}</span>
                </div>

                <div className="text-xs text-charcoal/70 space-y-1">
                  {ord.items.map((it, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{it.quantity} × {it.productName}</span>
                      <span className="font-semibold">₹{it.subtotal}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-charcoal/10 text-[11px]">
                  <span className="capitalize font-semibold text-charcoal">
                    {ord.deliveryType === 'pickup' ? `Depot Pickup: ${ord.pickupLocation}` : `Address Delivery: ${ord.deliveryAddress}`}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-sageMint/40 text-deepTeal">
                    {ord.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
