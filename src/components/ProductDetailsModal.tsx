import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  ShoppingBag, 
  Minus, 
  Plus, 
  Share2
} from 'lucide-react';

interface ProductDetailsModalProps {
  productId: string | null;
  onClose: () => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ productId, onClose }) => {
  const { products, addToCart, openCheckoutModal, showToast } = useApp();
  const [selectedQty, setSelectedQty] = useState(1);

  if (!productId) return null;

  const product = products.find((p) => p.id === productId);
  if (!product) return null;

  const isExpired = new Date(product.expiryDate).getTime() < new Date().setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((new Date(product.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const discountPercent = Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100);
  const unitSavings = product.originalPrice - product.discountedPrice;
  const totalSavings = unitSavings * selectedQty;

  const handleQtyChange = (delta: number) => {
    const next = selectedQty + delta;
    if (next >= 1 && next <= product.quantity) {
      setSelectedQty(next);
    }
  };

  const handleAddToCart = () => {
    if (isExpired) {
      showToast('Safety Policy: Cannot purchase expired items.');
      return;
    }
    const res = addToCart(product, selectedQty);
    if (res.success) {
      onClose();
    }
  };

  const handleBuyNow = () => {
    if (isExpired) {
      showToast('Safety Policy: Cannot purchase expired items.');
      return;
    }
    const res = addToCart(product, selectedQty);
    if (res.success) {
      onClose();
      openCheckoutModal();
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-elevated border border-charcoal/10 overflow-hidden my-6 animate-fade-in">
        
        {/* Top Floating Exit Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-charcoal shadow-soft flex items-center justify-center transition-transform hover:scale-110"
          title="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Product Image & Badges */}
          <div className="relative bg-warmSand/40 p-6 flex flex-col justify-between">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-card border border-charcoal/10">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-deepTeal text-warmSand font-extrabold text-xs shadow-soft tracking-wider">
                {discountPercent}% OFF SURPLUS
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-charcoal/80 text-warmSand text-xs font-semibold backdrop-blur-md">
                  {product.storageType}
                </span>
                <button
                  type="button"
                  onClick={handleShare}
                  className="p-2 rounded-lg bg-white/90 hover:bg-white text-charcoal shadow-xs"
                  title="Share listing"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Statutory Safety Notice Card */}
            <div className="mt-4 p-3.5 rounded-2xl bg-sageMint/30 border border-sageMint text-xs text-deepTeal space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-deepTeal" />
                <span>Verified Business Provenance</span>
              </div>
              <p className="text-[11px] text-charcoal/70 leading-relaxed">
                Listed by {product.sellerName}. Batch {product.batchNumber} sealed and stored under prescribed conditions prior to dispatch.
              </p>
            </div>
          </div>

          {/* Right Column: Information, Pricing & Order Controls */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Category & Expiry Banner */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-lightOceanBlue/40 text-deepTeal text-xs font-bold uppercase tracking-wider">
                  {product.category}
                </span>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  isExpired 
                    ? 'bg-rose-100 text-rose-800 border border-rose-300' 
                    : daysLeft <= 5 
                      ? 'bg-rose-100 text-rose-800 border border-rose-300 animate-pulse' 
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isExpired ? 'Expired' : `Expires in ${daysLeft} days (${product.expiryDate})`}</span>
                </div>
              </div>

              {/* Title & Brand */}
              <div>
                <span className="text-xs font-bold text-charcoal/60 uppercase tracking-widest">{product.brand}</span>
                <h2 className="text-2xl font-extrabold text-deepTeal leading-tight mt-1">{product.name}</h2>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-2xl bg-warmSand/30 border border-charcoal/10 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-2.5">
                    <span className="text-2xl font-black text-deepTeal">
                      ₹{product.discountedPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-charcoal/50 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-xs text-charcoal/60">per {product.unit} (Exclusive of delivery)</span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                    Save ₹{unitSavings.toLocaleString('en-IN')} / unit
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-1">Product Description</h4>
                <p className="text-xs text-charcoal/80 leading-relaxed">{product.description}</p>
              </div>

              {/* Technical & Storage Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-warmSand/20 border border-charcoal/10">
                  <span className="text-charcoal/50 text-[10px] uppercase font-bold block">Batch Number</span>
                  <span className="font-mono font-bold text-deepTeal">{product.batchNumber}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-warmSand/20 border border-charcoal/10">
                  <span className="text-charcoal/50 text-[10px] uppercase font-bold block">Available Surplus Stock</span>
                  <span className="font-bold text-deepTeal">{product.quantity} {product.unit}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-warmSand/20 border border-charcoal/10">
                  <span className="text-charcoal/50 text-[10px] uppercase font-bold block">Storage Conditions</span>
                  <span className="font-semibold text-charcoal truncate block">{product.storageTemperature || product.storageType}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-warmSand/20 border border-charcoal/10">
                  <span className="text-charcoal/50 text-[10px] uppercase font-bold block">FSSAI License / Status</span>
                  <span className="font-semibold text-deepTeal truncate block">{product.fssaiLicense || 'Verified Partner'}</span>
                </div>
              </div>

              {/* Seller Location & Details */}
              <div className="flex items-center gap-2 text-xs text-charcoal/70 pt-2 border-t border-charcoal/10">
                <MapPin className="w-4 h-4 text-deepTeal shrink-0" />
                <span>Warehouse Location: <strong className="text-deepTeal">{product.location}</strong></span>
              </div>

            </div>

            {/* Bottom Actions: Quantity Selector & CTAs */}
            <div className="pt-4 border-t border-charcoal/10 space-y-4">
              
              {isExpired ? (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-center text-xs text-rose-800 font-bold flex items-center justify-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>This product has passed its statutory expiry date and is locked against purchase.</span>
                </div>
              ) : product.quantity <= 0 ? (
                <div className="p-4 rounded-2xl bg-charcoal/10 text-center text-xs text-charcoal/70 font-bold">
                  Surplus batch sold out. Check marketplace for upcoming batches.
                </div>
              ) : (
                <>
                  {/* Quantity Counter */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-charcoal">Select Order Quantity:</span>
                      <p className="text-[11px] text-charcoal/60">Total Estimated Savings: <strong className="text-emerald-700">₹{totalSavings.toLocaleString('en-IN')}</strong></p>
                    </div>

                    <div className="flex items-center gap-3 bg-warmSand/40 px-3 py-1.5 rounded-xl border border-charcoal/10">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(-1)}
                        disabled={selectedQty <= 1}
                        className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-charcoal hover:bg-warmSand-hover disabled:opacity-30"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-10 text-center font-bold text-sm text-deepTeal">{selectedQty}</span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(1)}
                        disabled={selectedQty >= product.quantity}
                        className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-charcoal hover:bg-warmSand-hover disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="py-3 px-4 rounded-xl border-2 border-deepTeal text-deepTeal font-bold hover:bg-deepTeal hover:text-warmSand transition-colors text-xs flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="py-3 px-4 rounded-xl bg-softTurquoise text-deepTeal font-bold hover:bg-softTurquoise-hover transition-colors shadow-soft text-xs flex items-center justify-center gap-2"
                    >
                      <span>Buy Now (₹{(product.discountedPrice * selectedQty).toLocaleString('en-IN')})</span>
                    </button>
                  </div>
                </>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
