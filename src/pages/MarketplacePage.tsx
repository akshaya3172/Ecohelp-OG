import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailsModal } from '../components/ProductDetailsModal';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ArrowUpDown, 
  RotateCcw, 
  ShieldCheck, 
  PackageX 
} from 'lucide-react';

export const MarketplacePage: React.FC = () => {
  const { products, selectedProductId, openSellModal } = useApp();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all'); // 'all' | '7days' | '15days' | '30days'
  const [selectedDiscount, setSelectedDiscount] = useState<number>(0);
  const [selectedStorage, setSelectedStorage] = useState<string>('All');
  const [selectedSeller, setSelectedSeller] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(6000);
  const [sortBy, setSortBy] = useState<string>('expiry_soonest'); // 'expiry_soonest' | 'price_low' | 'price_high' | 'discount_high' | 'latest'
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Local details modal state
  const [activeModalProductId, setActiveModalProductId] = useState<string | null>(selectedProductId);

  // Extract unique sellers from live products
  const uniqueSellers = useMemo(() => {
    const list = Array.from(new Set(products.map((p) => p.sellerName)));
    return ['All', ...list];
  }, [products]);

  // Categories list
  const categoriesList: { id: string; label: string }[] = [
    { id: 'All', label: 'All Categories' },
    { id: 'Dairy', label: 'Dairy & Cold' },
    { id: 'Beverages', label: 'Beverages & Juices' },
    { id: 'Packaged Food', label: 'Packaged Food' },
    { id: 'Personal Care', label: 'Personal Care' },
    { id: 'Bakery & Confectionery', label: 'Bakery' },
    { id: 'Fresh Produce', label: 'Produce' },
    { id: 'Grains & Staples', label: 'Grains & Staples' },
  ];

  // Filtering & Sorting Pipeline
  const filteredProducts = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);

    return products.filter((p) => {
      // Exclude expired products from primary marketplace view for safety
      const expTime = new Date(p.expiryDate).getTime();
      if (expTime < today) return false;

      // Search Query (matches name, brand, or description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesBatch = p.batchNumber.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesBatch) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Expiry Urgency filter
      const daysLeft = Math.ceil((expTime - today) / (1000 * 60 * 60 * 24));
      if (selectedUrgency === '7days' && daysLeft > 7) return false;
      if (selectedUrgency === '15days' && daysLeft > 15) return false;
      if (selectedUrgency === '30days' && daysLeft > 30) return false;

      // Discount filter
      const discountPercent = Math.round(((p.originalPrice - p.discountedPrice) / p.originalPrice) * 100);
      if (discountPercent < selectedDiscount) return false;

      // Price filter
      if (p.discountedPrice > maxPrice) return false;

      // Storage filter
      if (selectedStorage !== 'All' && p.storageType !== selectedStorage) return false;

      // Seller filter
      if (selectedSeller !== 'All' && p.sellerName !== selectedSeller) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'expiry_soonest') {
        return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
      }
      if (sortBy === 'price_low') {
        return a.discountedPrice - b.discountedPrice;
      }
      if (sortBy === 'price_high') {
        return b.discountedPrice - a.discountedPrice;
      }
      if (sortBy === 'discount_high') {
        const discA = (a.originalPrice - a.discountedPrice) / a.originalPrice;
        const discB = (b.originalPrice - b.discountedPrice) / b.originalPrice;
        return discB - discA;
      }
      if (sortBy === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  }, [
    products, 
    searchQuery, 
    selectedCategory, 
    selectedUrgency, 
    selectedDiscount, 
    maxPrice, 
    selectedStorage, 
    selectedSeller, 
    sortBy
  ]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedUrgency('all');
    setSelectedDiscount(0);
    setSelectedStorage('All');
    setSelectedSeller('All');
    setMaxPrice(6000);
    setSortBy('expiry_soonest');
  };

  const handleSelectProduct = (id: string) => {
    setActiveModalProductId(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header & Sub-banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-charcoal/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-sageMint/40 text-deepTeal text-xs font-bold uppercase tracking-wider">
              Live B2B Catalog
            </span>
            <span className="text-xs text-charcoal/60 font-semibold">
              {filteredProducts.length} verified surplus lot(s) available
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-deepTeal mt-1">
            Near-Expiry Inventory Marketplace
          </h1>
          <p className="text-xs text-charcoal/70 mt-1">
            Browse discounted inventory directly from manufacturers, certified wholesalers, and supermarket depots.
          </p>
        </div>

        <button
          onClick={openSellModal}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-deepTeal hover:bg-deepTeal-hover text-warmSand font-bold text-xs shadow-soft transition-colors flex items-center gap-2"
        >
          <span>+ List Your Surplus</span>
        </button>
      </div>

      {/* Search Bar & Primary Filter Controls */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name, brand (e.g. Amul, Tata, Raw Pressery), or batch number..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-charcoal/20 bg-white text-xs font-medium shadow-xs focus:border-deepTeal focus:ring-1 focus:ring-deepTeal"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-xs text-charcoal/40 hover:text-charcoal"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-56 px-3.5 py-2.5 rounded-2xl border border-charcoal/20 bg-white text-xs font-semibold text-deepTeal shadow-xs appearance-none pr-8 cursor-pointer"
              >
                <option value="expiry_soonest">Sort: Expiry Date (Soonest)</option>
                <option value="price_low">Sort: Price (Low to High)</option>
                <option value="price_high">Sort: Price (High to Low)</option>
                <option value="discount_high">Sort: Discount % (Highest)</option>
                <option value="latest">Sort: Latest Listed</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-charcoal/50 absolute right-3 top-3.5 pointer-events-none" />
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
              className="sm:hidden px-3.5 py-2.5 rounded-2xl bg-white border border-charcoal/20 text-xs font-bold text-deepTeal flex items-center gap-1.5 shadow-xs"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

        </div>

        {/* Category Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                selectedCategory === cat.id
                  ? 'bg-deepTeal text-warmSand shadow-soft'
                  : 'bg-white hover:bg-warmSand text-charcoal border border-charcoal/15'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <aside className={`lg:block ${isFilterDrawerOpen ? 'block' : 'hidden'} p-6 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-6`}>
          <div className="flex items-center justify-between pb-3 border-b border-charcoal/10">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-deepTeal" />
              <h3 className="text-xs font-bold text-deepTeal uppercase tracking-wider">Filter Marketplace</h3>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-[11px] text-softTurquoise-dark hover:underline font-bold flex items-center gap-1"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Expiry Urgency Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-charcoal">Expiry Shelf-Life</label>
            <div className="space-y-1.5">
              {[
                { id: 'all', label: 'All Active Batches' },
                { id: '7days', label: '🔥 Urgent: Within 7 Days' },
                { id: '15days', label: '⚡ Clearance: Within 15 Days' },
                { id: '30days', label: '📦 Standard: Within 30 Days' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedUrgency(opt.id)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    selectedUrgency === opt.id
                      ? 'bg-sageMint/40 text-deepTeal font-bold border border-sageMint'
                      : 'hover:bg-warmSand/40 text-charcoal/80'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Discount Percentage Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-charcoal">Minimum Discount %</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[0, 25, 40, 50].map((disc) => (
                <button
                  key={disc}
                  onClick={() => setSelectedDiscount(disc)}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    selectedDiscount === disc
                      ? 'bg-deepTeal text-warmSand'
                      : 'bg-warmSand/40 text-charcoal hover:bg-warmSand'
                  }`}
                >
                  {disc === 0 ? 'Any' : `${disc}%+`}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <label className="font-bold text-charcoal">Max Price (₹)</label>
              <span className="font-bold text-deepTeal">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="200"
              max="6000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-deepTeal"
            />
            <div className="flex justify-between text-[10px] text-charcoal/50">
              <span>₹200</span>
              <span>₹6,000</span>
            </div>
          </div>

          {/* Storage Condition Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-charcoal">Storage Type</label>
            <select
              value={selectedStorage}
              onChange={(e) => setSelectedStorage(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs bg-white font-medium"
            >
              <option value="All">All Storage Specs</option>
              <option value="Ambient / Room Temp">Ambient / Room Temp</option>
              <option value="Refrigerated (2°C - 8°C)">Refrigerated (2°C - 8°C)</option>
              <option value="Frozen (-18°C)">Frozen (-18°C)</option>
              <option value="Cool & Dry (15°C - 20°C)">Cool & Dry (15°C - 20°C)</option>
            </select>
          </div>

          {/* Seller / Supplier Filter */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-charcoal">Supplier / Business</label>
            <select
              value={selectedSeller}
              onChange={(e) => setSelectedSeller(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs bg-white font-medium"
            >
              {uniqueSellers.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Statutory Verification Badge */}
          <div className="p-3.5 rounded-2xl bg-sageMint/30 border border-sageMint/50 text-[11px] text-charcoal/70 space-y-1">
            <div className="flex items-center gap-1 font-bold text-deepTeal">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>FSSAI Partner Listings</span>
            </div>
            <p className="leading-relaxed">
              All suppliers comply with mandatory packaging label and storage standards.
            </p>
          </div>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-4">
              <div className="w-16 h-16 rounded-full bg-warmSand text-charcoal/50 mx-auto flex items-center justify-center">
                <PackageX className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-deepTeal">No Surplus Lots Match Your Filters</h3>
              <p className="text-xs text-charcoal/60 max-w-sm mx-auto leading-relaxed">
                Try widening your search terms, raising the price cap, or clearing filters to view all available listings.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-softTurquoise text-deepTeal font-bold text-xs hover:bg-softTurquoise-hover shadow-soft"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelect={handleSelectProduct}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Product Details Modal */}
      {activeModalProductId && (
        <ProductDetailsModal
          productId={activeModalProductId}
          onClose={() => setActiveModalProductId(null)}
        />
      )}

    </div>
  );
};
