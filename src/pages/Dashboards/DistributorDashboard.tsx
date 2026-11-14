import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Warehouse, 
  PlusCircle, 
  ArrowUpRight 
} from 'lucide-react';

export const DistributorDashboard: React.FC = () => {
  const { 
    currentUser, 
    products, 
    orders, 
    openSellModal, 
    updateOrderStatus 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'bulk-listings' | 'incoming-orders'>('bulk-listings');

  // Distributor products
  const distributorProducts = products.filter(
    (p) => p.sellerId === currentUser?.id || currentUser?.role === 'admin'
  );

  // Incoming wholesale dispatch orders
  const distributorOrders = orders.filter(
    (o) => o.sellerId === currentUser?.id || currentUser?.role === 'admin'
  );

  const totalPalletsAvailable = distributorProducts.reduce((sum, p) => sum + p.quantity, 0);
  const totalVolumeRevenue = distributorOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-deepTeal text-warmSand flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-sageMint/30 text-softTurquoise text-xs font-bold uppercase tracking-wider">
              Distributor & Wholesale Hub
            </span>
            <span className="text-xs text-warmSand/70">{currentUser?.businessName || 'Apex Logistics & FMCG Distributors'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
            Wholesale Logistics Command · {currentUser?.name}
          </h2>
          <p className="text-xs text-warmSand/80 mt-1 max-w-xl">
            Manage bulk master-carton allocations, dispatch temperature-controlled lots, and prevent dead inventory accumulation.
          </p>
        </div>

        <button
          onClick={openSellModal}
          className="self-start md:self-auto px-6 py-3.5 rounded-2xl bg-softTurquoise text-deepTeal font-bold text-xs hover:bg-softTurquoise-hover shadow-soft transition-transform active:scale-95 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>List Bulk Pallet Lot</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Bulk Lots Listed</span>
          <p className="text-2xl sm:text-3xl font-black text-deepTeal">{distributorProducts.length}</p>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <Warehouse className="w-3.5 h-3.5" />
            <span>Across 3 Regional Warehouses</span>
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Available Stock</span>
          <p className="text-2xl sm:text-3xl font-black text-deepTeal">{totalPalletsAvailable.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-charcoal/60 font-semibold">Total wholesale units/crates</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">Wholesale Revenue</span>
          <p className="text-2xl sm:text-3xl font-black text-deepTeal">₹{totalVolumeRevenue.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Recovered working capital</span>
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-2">
          <span className="text-xs font-bold text-charcoal/60 uppercase tracking-wider">FSSAI Batch Compliance</span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-700">100%</p>
          <span className="text-[11px] text-deepTeal font-semibold">Verified Cold-Chain logs</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-charcoal/10 pb-4">
        <button
          onClick={() => setActiveTab('bulk-listings')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bulk-listings'
              ? 'bg-deepTeal text-warmSand shadow-soft'
              : 'bg-white hover:bg-warmSand text-charcoal border border-charcoal/10'
          }`}
        >
          Bulk Pallet Inventory ({distributorProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('incoming-orders')}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'incoming-orders'
              ? 'bg-deepTeal text-warmSand shadow-soft'
              : 'bg-white hover:bg-warmSand text-charcoal border border-charcoal/10'
          }`}
        >
          Incoming Warehouse Orders ({distributorOrders.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'bulk-listings' ? (
        <div className="bg-white rounded-3xl border border-charcoal/10 shadow-card overflow-hidden">
          <div className="p-5 border-b border-charcoal/10 flex items-center justify-between">
            <h3 className="text-sm font-bold text-deepTeal">Warehouse Pallet Lots</h3>
            <span className="text-xs text-charcoal/60">Real-time ERP synchronization</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warmSand/30 text-charcoal/70 uppercase tracking-wider text-[10px] font-bold border-b border-charcoal/10">
                <tr>
                  <th className="py-3 px-4">Lot & Product</th>
                  <th className="py-3 px-4">Storage Protocol</th>
                  <th className="py-3 px-4">Available Qty</th>
                  <th className="py-3 px-4">B2B Price / Unit</th>
                  <th className="py-3 px-4">Expiry Window</th>
                  <th className="py-3 px-4">Depot Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/10">
                {distributorProducts.map((p) => {
                  const days = Math.ceil((new Date(p.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={p.id} className="hover:bg-warmSand/10">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div>
                            <p className="font-bold text-deepTeal">{p.name}</p>
                            <span className="text-[10px] text-charcoal/60">Batch #{p.batchNumber} · {p.brand}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-charcoal/80">
                        <span className="px-2 py-0.5 rounded-md bg-warmSand text-[10px] font-bold">
                          {p.storageType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-deepTeal">
                        {p.quantity} {p.unit}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-deepTeal">₹{p.discountedPrice}</span>
                        <span className="text-[10px] text-charcoal/50 line-through ml-1">₹{p.originalPrice}</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold">
                        <span className={days <= 7 ? 'text-rose-700 font-bold' : 'text-charcoal/80'}>
                          {p.expiryDate} ({days} days)
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-charcoal/70">
                        {p.location}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {distributorOrders.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white border border-charcoal/10 text-xs text-charcoal/60">
              No orders placed for this distributor account yet.
            </div>
          ) : (
            distributorOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-5 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-4"
              >
                <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-deepTeal">{ord.orderNumber}</span>
                    <p className="text-xs text-charcoal/70">Buyer: <strong>{ord.buyerName}</strong> ({ord.buyerPhone})</p>
                  </div>
                  <span className="text-xs font-bold text-deepTeal">₹{ord.total.toLocaleString('en-IN')}</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  {ord.items.map((it, i) => (
                    <div key={i} className="flex justify-between bg-warmSand/20 p-2 rounded-lg">
                      <span>{it.quantity} {it.unit} · {it.productName}</span>
                      <span className="font-bold">₹{it.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  {ord.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'confirmed')}
                      className="px-3 py-1.5 rounded-xl bg-deepTeal text-warmSand font-bold text-xs"
                    >
                      Authorize Dispatch
                    </button>
                  )}
                  {ord.status === 'confirmed' && (
                    <button
                      onClick={() => updateOrderStatus(ord.id, 'completed')}
                      className="px-3 py-1.5 rounded-xl bg-softTurquoise text-deepTeal font-bold text-xs"
                    >
                      Confirm Dispatch Departure
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};
