import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Clock, MapPin, Plus, Check, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, cart } = useApp();

  const isExpired = new Date(product.expiryDate).getTime() < new Date().setHours(0, 0, 0, 0);
  const daysLeft = Math.ceil((new Date(product.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const discountPercent = Math.round(((product.originalPrice - product.discountedPrice) / product.originalPrice) * 100);

  const isInCart = cart.some((item) => item.product.id === product.id);

  // Expiry badge color logic
  let expiryBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  let expiryText = `Expires in ${daysLeft} days`;

  if (isExpired) {
    expiryBadgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
    expiryText = 'EXPIRED — NOT SALEABLE';
  } else if (daysLeft <= 4) {
    expiryBadgeClass = 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse';
    expiryText = `Urgent: ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'} left`;
  } else if (daysLeft <= 10) {
    expiryBadgeClass = 'bg-amber-100 text-amber-900 border-amber-300';
    expiryText = `Clearing: ${daysLeft} days left`;
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isExpired || product.quantity <= 0) return;
    addToCart(product, 1);
  };

  return (
    <div 
      onClick={() => onSelect(product.id)}
      className="group relative flex flex-col bg-white rounded-3xl border border-charcoal/10 hover:border-deepTeal/30 shadow-card hover:shadow-elevated transition-all duration-300 overflow-hidden cursor-pointer select-none"
    >
      
      {/* Product Image Area */}
      <div className="relative aspect-4/3 w-full bg-warmSand/30 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-deepTeal text-warmSand font-extrabold text-xs shadow-soft tracking-wider flex items-center gap-1">
          <span>{discountPercent}% OFF</span>
        </div>

        {/* Expiry Urgency Badge */}
        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold border shadow-xs flex items-center gap-1 backdrop-blur-sm ${expiryBadgeClass}`}>
          <Clock className="w-3 h-3" />
          <span>{expiryText}</span>
        </div>

        {/* Storage Condition Overlay Pill */}
        <div className="absolute bottom-2.5 left-3 px-2.5 py-1 rounded-lg bg-charcoal/80 text-warmSand text-[10px] font-semibold backdrop-blur-md">
          {product.storageType}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Brand & Verification */}
          <div className="flex items-center justify-between text-xs text-charcoal/70 mb-1.5">
            <span className="font-semibold uppercase tracking-wider text-charcoal/80 text-[11px]">{product.brand}</span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-deepTeal" title={product.sellerVerified ? "FSSAI Verified Business" : "Registered Business"}>
              <ShieldCheck className="w-3.5 h-3.5 text-softTurquoise-dark" />
              <span className="truncate max-w-[110px]">{product.sellerName}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-base font-bold text-deepTeal leading-snug line-clamp-2 group-hover:text-softTurquoise-dark transition-colors">
            {product.name}
          </h3>

          {/* Location & Quantity info */}
          <div className="flex items-center justify-between text-xs text-charcoal/70 mt-2.5 pt-2.5 border-t border-charcoal/5">
            <span className="flex items-center gap-1 text-[11px]">
              <MapPin className="w-3 h-3 text-charcoal/50" />
              <span className="truncate max-w-[130px]">{product.location}</span>
            </span>
            <span className="font-bold text-charcoal text-[11px] bg-sageMint/30 px-2 py-0.5 rounded-md">
              {product.quantity} {product.unit} left
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="flex items-center justify-between pt-3 border-t border-charcoal/10 gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg sm:text-xl font-extrabold text-deepTeal">
                ₹{product.discountedPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-charcoal/50 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[10px] text-charcoal/60 block">per {product.unit.replace(/s$/, '')}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onSelect(product.id)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-warmSand text-deepTeal hover:bg-sageMint/50 transition-colors flex items-center gap-1"
            >
              <span>View</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isExpired || product.quantity <= 0}
              className={`p-2 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                isExpired || product.quantity <= 0
                  ? 'bg-charcoal/10 text-charcoal/30 cursor-not-allowed'
                  : isInCart
                    ? 'bg-sageMint text-deepTeal hover:bg-sageMint-hover'
                    : 'bg-softTurquoise text-deepTeal hover:bg-softTurquoise-hover shadow-soft active:scale-95'
              }`}
              title={isInCart ? 'In Cart' : 'Add to Cart'}
            >
              {isInCart ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
