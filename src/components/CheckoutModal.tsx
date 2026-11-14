import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Truck, 
  Warehouse, 
  MapPin, 
  Trash2, 
  Plus, 
  Minus, 
  CheckCircle2, 
  ArrowRight,
  Leaf
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutModalOpen, 
    closeCheckoutModal, 
    cart, 
    cartTotal, 
    updateCartQuantity, 
    removeFromCart, 
    currentUser, 
    placeOrder, 
    setCurrentView,
    showToast 
  } = useApp();

  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser?.businessAddress || '104 MG Road, Industrial Camp, Bengaluru, Karnataka - 560001'
  );
  const [pickupLocation, setPickupLocation] = useState(
    'Central Depot Hub, Plot 48, Sector 18, Industrial Area'
  );
  const [pickupTimeSlot, setPickupTimeSlot] = useState('Tomorrow, 10:00 AM – 1:00 PM');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any | null>(null);

  if (!isCheckoutModalOpen) return null;

  const deliveryFee = deliveryType === 'delivery' ? 180 : 0;
  const sustainabilityDiscount = Math.round(cartTotal * 0.05); // 5% green bonus
  const tax = Math.round((cartTotal - sustainabilityDiscount) * 0.05);
  const finalTotal = cartTotal + deliveryFee - sustainabilityDiscount + tax;

  const handleConfirmOrder = async () => {
    if (!currentUser) {
      showToast('Please sign in to confirm order.');
      return;
    }

    if (cart.length === 0) {
      showToast('Cart is empty.');
      return;
    }

    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      showToast('Please enter your delivery destination address.');
      return;
    }

    setIsSubmitting(true);
    const res = await placeOrder({
      deliveryType,
      deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : undefined,
      pickupLocation: deliveryType === 'pickup' ? pickupLocation : undefined,
      pickupTimeSlot: deliveryType === 'pickup' ? pickupTimeSlot : undefined,
      notes,
    });

    setIsSubmitting(false);
    if (res.success && res.order) {
      setConfirmedOrder(res.order);
    }
  };

  const handleExitSuccess = () => {
    setConfirmedOrder(null);
    closeCheckoutModal();
    setCurrentView('dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/65 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-elevated border border-charcoal/10 overflow-hidden my-6 animate-fade-in max-h-[92vh] flex flex-col">
        
        {/* ======================================================== */}
        {/* EXPLICIT REQUIREMENT: CLEARLY VISIBLE [X] CLOSE/EXIT BTN */}
        {/* ======================================================== */}
        <button
          type="button"
          onClick={confirmedOrder ? handleExitSuccess : closeCheckoutModal}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-warmSand/80 hover:bg-white text-charcoal border border-charcoal/20 shadow-soft flex items-center justify-center transition-all hover:scale-110"
          title="Exit Checkout (No Purchase Forced)"
          aria-label="Exit Checkout"
        >
          <X className="w-5 h-5 font-bold" />
        </button>

        {confirmedOrder ? (
          /* Confirmation Success Screen */
          <div className="p-8 text-center space-y-6 my-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-soft">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-sageMint/40 text-deepTeal text-xs font-bold uppercase tracking-wider">
                Order Confirmed
              </span>
              <h3 className="text-2xl font-extrabold text-deepTeal mt-2">
                Thank You for Rescuing Surplus!
              </h3>
              <p className="text-xs text-charcoal/70 mt-1 max-w-md mx-auto">
                Order Reference <strong className="font-mono text-deepTeal font-bold">{confirmedOrder.orderNumber}</strong> has been created and sent to the supplier for fulfillment.
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 rounded-2xl bg-warmSand/40 border border-charcoal/10 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-charcoal/60">Fulfillment Method:</span>
                <span className="font-bold text-deepTeal capitalize">{confirmedOrder.deliveryType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/60">Total Amount Paid:</span>
                <span className="font-bold text-deepTeal">₹{confirmedOrder.total.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal/60">Surplus Rescued:</span>
                <span className="font-bold text-emerald-700">{confirmedOrder.items.length} item line(s)</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleExitSuccess}
                className="px-6 py-2.5 rounded-xl bg-deepTeal text-warmSand font-bold text-xs hover:bg-deepTeal-hover transition-colors shadow-soft"
              >
                Track in My Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Main Checkout Experience */
          <>
            {/* Header */}
            <div className="bg-deepTeal text-warmSand px-6 py-5 flex items-center justify-between shrink-0">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-softTurquoise">
                  EcoHelp Sustainable Checkout
                </span>
                <h3 className="text-xl font-bold tracking-tight text-white mt-0.5">
                  Order Summary & Delivery Logistics
                </h3>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Cart Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-charcoal/10 pb-2">
                  <h4 className="text-xs font-bold text-deepTeal uppercase tracking-wider">
                    Selected Surplus Items ({cart.length})
                  </h4>
                  <span className="text-xs text-charcoal/60">Inventory held for checkout</span>
                </div>

                {cart.length === 0 ? (
                  <div className="py-8 text-center text-xs text-charcoal/60">
                    Your cart is empty. Add products from the marketplace.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="p-3 rounded-2xl bg-warmSand/30 border border-charcoal/10 flex items-center justify-between gap-3"
                      >
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-deepTeal truncate">{item.product.name}</h5>
                          <p className="text-[11px] text-charcoal/60">
                            ₹{item.product.discountedPrice} × {item.quantity} {item.product.unit} · {item.product.sellerName}
                          </p>
                        </div>

                        {/* Quantity Adjusters */}
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-md bg-white border border-charcoal/20 flex items-center justify-center hover:bg-warmSand"
                          >
                            <Minus className="w-3 h-3 text-charcoal" />
                          </button>
                          <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-md bg-white border border-charcoal/20 flex items-center justify-center hover:bg-warmSand"
                          >
                            <Plus className="w-3 h-3 text-charcoal" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 text-charcoal/40 hover:text-rose-600 transition-colors ml-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right shrink-0 min-w-[70px]">
                          <span className="text-xs font-bold text-deepTeal">
                            ₹{(item.product.discountedPrice * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Delivery Options: Exactly Two Options */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-deepTeal uppercase tracking-wider border-b border-charcoal/10 pb-2">
                  Select Delivery & Pickup Logistics
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Option 1: Deliver to Your Address */}
                  <div
                    onClick={() => setDeliveryType('delivery')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryType === 'delivery'
                        ? 'border-deepTeal bg-sageMint/30 shadow-xs'
                        : 'border-charcoal/10 hover:border-charcoal/30 bg-warmSand/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Truck className="w-5 h-5 text-deepTeal" />
                        <span className="text-xs font-bold text-deepTeal">1. Deliver to Your Address</span>
                      </div>
                      <span className="text-xs font-bold text-deepTeal">₹180</span>
                    </div>
                    <p className="text-[11px] text-charcoal/70 leading-relaxed">
                      Scheduled temperature-controlled door dispatch. Estimated transit time: 24 to 48 hours.
                    </p>
                  </div>

                  {/* Option 2: Warehouse Pickup */}
                  <div
                    onClick={() => setDeliveryType('pickup')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      deliveryType === 'pickup'
                        ? 'border-deepTeal bg-sageMint/30 shadow-xs'
                        : 'border-charcoal/10 hover:border-charcoal/30 bg-warmSand/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Warehouse className="w-5 h-5 text-deepTeal" />
                        <span className="text-xs font-bold text-deepTeal">2. Warehouse Pickup</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 uppercase">Free</span>
                    </div>
                    <p className="text-[11px] text-charcoal/70 leading-relaxed">
                      Collect directly from the seller's regional fulfillment center. Instant dispatch slot allocation.
                    </p>
                  </div>

                </div>

                {/* Logistics Input Fields */}
                {deliveryType === 'delivery' ? (
                  <div className="p-3.5 rounded-2xl bg-warmSand/30 border border-charcoal/10 space-y-2">
                    <label className="block text-xs font-bold text-charcoal flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-deepTeal" />
                      <span>Delivery Street Address & Pincode</span>
                    </label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs bg-white"
                      placeholder="Enter warehouse, supermarket, or residence address"
                      required
                    />
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-warmSand/30 border border-charcoal/10 space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-charcoal mb-1">Pickup Depot Location</label>
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-charcoal/20 text-xs bg-white font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-charcoal mb-1">Preferred Pickup Window</label>
                      <select
                        value={pickupTimeSlot}
                        onChange={(e) => setPickupTimeSlot(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border border-charcoal/20 text-xs bg-white font-medium"
                      >
                        <option>Tomorrow, 10:00 AM – 1:00 PM</option>
                        <option>Tomorrow, 2:00 PM – 5:00 PM</option>
                        <option>Day after tomorrow, 9:00 AM – 12:00 PM</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Optional Dispatch Notes */}
                <div className="p-3.5 rounded-2xl bg-warmSand/30 border border-charcoal/10">
                  <label className="block text-xs font-bold text-charcoal mb-1">
                    Special Handling / Dispatch Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Call upon arrival, loading dock 4B, temperature-check required"
                    className="w-full px-3 py-1.5 rounded-xl border border-charcoal/20 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="p-4 rounded-2xl bg-warmSand/40 border border-charcoal/10 space-y-2">
                <h5 className="text-xs font-bold text-deepTeal uppercase tracking-wider mb-2">Price Summary</h5>
                <div className="flex justify-between text-xs text-charcoal/80">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} units)</span>
                  <span className="font-semibold">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-charcoal/80">
                  <span>Logistics ({deliveryType === 'delivery' ? 'Direct Transit' : 'Self Collection'})</span>
                  <span className="font-semibold">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-800">
                  <span className="flex items-center gap-1 font-semibold">
                    <Leaf className="w-3 h-3" />
                    <span>EcoHelp Circular Discount (5%)</span>
                  </span>
                  <span className="font-bold">-₹{sustainabilityDiscount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-charcoal/80">
                  <span>Estimated Statutory Tax / GST (5%)</span>
                  <span className="font-semibold">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="pt-2 border-t border-charcoal/15 flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-deepTeal">Final Payable Amount</span>
                  <span className="text-xl font-black text-deepTeal">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>

            {/* Bottom Bar: Exit or Confirm */}
            <div className="p-4 px-6 border-t border-charcoal/10 bg-warmSand/20 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={closeCheckoutModal}
                className="px-4 py-2 text-xs font-bold text-charcoal/70 hover:text-charcoal hover:bg-warmSand rounded-xl transition-colors"
              >
                Exit Checkout
              </button>

              <button
                type="button"
                onClick={handleConfirmOrder}
                disabled={isSubmitting || cart.length === 0}
                className="px-6 py-2.5 rounded-xl bg-softTurquoise text-deepTeal font-bold text-xs hover:bg-softTurquoise-hover transition-all shadow-soft flex items-center gap-2 disabled:opacity-40"
              >
                <span>{isSubmitting ? 'Confirming Order...' : `Confirm Order (₹${finalTotal.toLocaleString('en-IN')})`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
