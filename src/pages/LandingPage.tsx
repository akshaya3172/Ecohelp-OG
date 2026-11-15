import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailsModal } from '../components/ProductDetailsModal';
import { 
  ArrowRight, 
  ShoppingCart, 
  Search, 
  Leaf, 
  RefreshCw, 
  Globe2, 
  Building2, 
  Package, 
  Store, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Truck, 
  BarChart3, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, openSellModal, products } = useApp();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Filter 4 featured near-expiry products
  const featuredProducts = products
    .filter(p => p.status !== 'expired' && p.quantity > 0)
    .slice(0, 4);

  const faqs = [
    {
      q: 'What is EcoHelp and who can use the platform?',
      a: 'EcoHelp is a B2B near-expiry product marketplace connecting manufacturers, national distributors, supermarket chains, independent retailers, and buyers. Businesses with excess or near-expiry inventory list products at transparent discounted prices to recover commercial value before expiry, while buyers access quality stock at reduced cost.'
    },
    {
      q: 'How does EcoHelp prevent the sale of expired products?',
      a: 'EcoHelp enforces strict automated date checks: products with past statutory expiry dates are rejected at listing and instantly locked from purchase in the marketplace. Listings clearly show remaining shelf-life in days, batch numbers, and recommended storage temperatures.'
    },
    {
      q: 'Does EcoHelp certify food products or guarantee safety?',
      a: 'No. EcoHelp is an independent technology marketplace, not a government regulatory authority or testing lab. All registered businesses are independently required to maintain statutory compliance with FSSAI regulations, proper packaging seals, and temperature-controlled storage.'
    },
    {
      q: 'What fulfillment and delivery options are available?',
      a: 'EcoHelp supports two flexible fulfillment channels: (1) Temperature-controlled Direct Address Delivery with scheduled logistics transit, and (2) Zero-fee Regional Warehouse Pickup where buyers collect directly from the supplier depot.'
    },
    {
      q: 'How does this help my company with ESG and sustainability?',
      a: 'By preventing edible food and commercial inventory from reaching landfills, EcoHelp generates verified metrics on diverted carbon emissions, kilograms of rescued food, and recovered capital that integrate directly into corporate sustainability reports.'
    }
  ];

  return (
    <div className="space-y-20 md:space-y-28 overflow-hidden">
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION (Apple-Inspired Visual Storytelling)       */}
      {/* ======================================================== */}
      <section className="relative pt-6 pb-16 md:pt-14 md:pb-24">
        
        {/* Soft atmospheric gradient backdrops */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[550px] h-[350px] bg-sageMint/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[350px] bg-lightOceanBlue/25 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Side: Headline, Description & CTAs */}
            <div className="lg:col-span-6 space-y-7 text-left">
              
              {/* Main Headline */}
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-6xl xl:text-[68px] font-extrabold text-deepTeal tracking-tight leading-[1.08]">
                  Give Products <br />
                  <span className="text-deepTeal">a Second Chance.</span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg text-charcoal/80 font-normal leading-relaxed max-w-xl">
                Sell or buy near-expiry products at better prices. EcoHelp connects distributors, retailers and buyers through smarter, more sustainable commerce.
              </p>

              {/* Two Prominent Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                {/* 1. Sell Here Button */}
                <button
                  type="button"
                  onClick={openSellModal}
                  className="px-7 py-3.5 rounded-full bg-deepTeal hover:bg-deepTeal-hover text-warmSand font-bold text-sm shadow-soft transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 group"
                >
                  <ShoppingCart className="w-4 h-4 text-softTurquoise" />
                  <span>Sell Here</span>
                  <ArrowRight className="w-4 h-4 text-softTurquoise group-hover:translate-x-1 transition-transform" />
                </button>

                {/* 2. Buy Now Button */}
                <button
                  type="button"
                  onClick={() => setCurrentView('marketplace')}
                  className="px-7 py-3.5 rounded-full bg-white/80 hover:bg-white text-deepTeal border border-deepTeal/20 hover:border-deepTeal font-bold text-sm shadow-xs transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                >
                  <Search className="w-4 h-4 text-deepTeal" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* 3 Trust Badges (Matching Reference Image) */}
              <div className="pt-4 flex flex-wrap items-center gap-6 sm:gap-8 text-xs font-semibold text-charcoal/80 border-t border-charcoal/10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-softTurquoise/20 flex items-center justify-center text-deepTeal">
                    <Leaf className="w-3.5 h-3.5 text-deepTeal" />
                  </div>
                  <span>Reduce Waste</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-sageMint/40 flex items-center justify-center text-deepTeal">
                    <RefreshCw className="w-3.5 h-3.5 text-deepTeal" />
                  </div>
                  <span>Support Businesses</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-lightOceanBlue/40 flex items-center justify-center text-deepTeal">
                    <Globe2 className="w-3.5 h-3.5 text-deepTeal" />
                  </div>
                  <span>Build a Greener Future</span>
                </div>
              </div>

            </div>

            {/* Right Side: Recreating the 3D Reference Illustration Scene */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                
                {/* Centerpiece 3D Illustration Frame */}
                <div className="relative rounded-3xl overflow-hidden shadow-elevated border border-charcoal/10 bg-white/60 backdrop-blur-sm group">
                  <img
                    src="/hero-3d.webp"
                    alt="EcoHelp 3D Business Model Architecture — Connecting Businesses, Digital Marketplace, Buyers, and Sustainable Circulation"
                    className="w-full h-auto object-cover transform group-hover:scale-[1.02] transition-transform duration-700"
                  />
                  
                  {/* Subtle lighting overlay for extra depth */}
                  <div className="absolute inset-0 bg-linear-to-tr from-deepTeal/10 via-transparent to-softTurquoise/10 pointer-events-none" />
                </div>

                {/* Floating Interactive Glass Cards for 3D depth */}
                {/* 1. Businesses List & Sell Card (Top Left) */}
                <div 
                  onClick={openSellModal}
                  className="absolute -top-4 -left-4 sm:-left-6 p-2.5 sm:p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-card border border-charcoal/10 flex items-center gap-2.5 animate-float-gentle cursor-pointer hover:shadow-elevated transition-shadow"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-800 shadow-xs">
                    <Building2 className="w-5 h-5 text-amber-700" />
                  </div>
                  <div className="text-left pr-1">
                    <p className="text-xs font-bold text-deepTeal leading-tight">Businesses</p>
                    <p className="text-[10px] text-charcoal/60 leading-none mt-0.5">List & Sell</p>
                  </div>
                </div>

                {/* 2. Buyers Discover Deals Card (Bottom Left) */}
                <div 
                  onClick={() => setCurrentView('marketplace')}
                  className="absolute -bottom-4 -left-2 sm:-left-4 p-2.5 sm:p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-card border border-charcoal/10 flex items-center gap-2.5 animate-float-delayed cursor-pointer hover:shadow-elevated transition-shadow"
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-100/70 border border-amber-300/80 flex items-center justify-center text-amber-900 shadow-xs">
                    <Package className="w-5 h-5 text-amber-800" />
                  </div>
                  <div className="text-left pr-1">
                    <p className="text-xs font-bold text-deepTeal leading-tight">Buyers</p>
                    <p className="text-[10px] text-charcoal/60 leading-none mt-0.5">Discover Deals</p>
                  </div>
                </div>

                {/* 3. Sustainable Tomorrow Badge (Bottom Right) */}
                <div className="absolute -bottom-3 -right-2 sm:-right-4 p-2.5 sm:p-3 rounded-2xl bg-white/95 backdrop-blur-md shadow-card border border-charcoal/10 flex items-center gap-2.5 animate-float-gentle hidden sm:flex">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                    <Leaf className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="text-left pr-1">
                    <p className="text-xs font-bold text-emerald-800 leading-tight">A Sustainable</p>
                    <p className="text-[10px] text-charcoal/60 leading-none mt-0.5">Tomorrow</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. SELLER AND BUYER CLARITY (SECTION 3 INSTRUCTIONS)      */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Want to Sell? Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-charcoal/10 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between space-y-6 text-left relative overflow-hidden group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-deepTeal text-warmSand flex items-center justify-center shadow-soft">
                <Store className="w-6 h-6 text-softTurquoise" />
              </div>
              <h3 className="text-2xl font-bold text-deepTeal">Want to Sell?</h3>
              <p className="text-sm text-charcoal/80 leading-relaxed max-w-md">
                Distributors and retailers can list their near-expiry products and connect with interested buyers.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={openSellModal}
                className="px-6 py-3 rounded-full bg-deepTeal text-warmSand font-bold text-xs hover:bg-deepTeal-hover transition-colors shadow-soft flex items-center gap-2"
              >
                <span>Sell Here</span>
                <ArrowRight className="w-4 h-4 text-softTurquoise" />
              </button>
            </div>
          </div>

          {/* Want to Buy? Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-lightOceanBlue/20 border border-lightOceanBlue/50 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between space-y-6 text-left relative overflow-hidden group">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-softTurquoise text-deepTeal flex items-center justify-center shadow-soft">
                <Users className="w-6 h-6 text-deepTeal" />
              </div>
              <h3 className="text-2xl font-bold text-deepTeal">Want to Buy?</h3>
              <p className="text-sm text-charcoal/80 leading-relaxed max-w-md">
                Retailers and consumers can discover available near-expiry products at discounted prices.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentView('marketplace')}
                className="px-6 py-3 rounded-full bg-softTurquoise text-deepTeal font-bold text-xs hover:bg-softTurquoise-hover transition-colors shadow-soft flex items-center gap-2"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4 text-deepTeal" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. HOW IT WORKS (SECTION 4 INSTRUCTIONS)                  */}
      {/* ======================================================== */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
        
        <div className="space-y-2 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-deepTeal">
            How EcoHelp Works?
          </h2>
          <p className="text-sm text-charcoal/70">
            A simple and smart way to turn near-expiry inventory into value.
          </p>
        </div>

        {/* 4 Connected Visual Steps Matching Reference Image */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative">
          {[
            {
              num: 1,
              title: 'List Your Products',
              desc: 'Add near-expiry inventory in minutes.',
              icon: Building2,
            },
            {
              num: 2,
              title: 'Connect with Buyers',
              desc: 'Reach verified businesses and customers.',
              icon: Users,
            },
            {
              num: 3,
              title: 'Complete the Sale',
              desc: 'Sell easily and recover value.',
              icon: ShoppingCart,
            },
            {
              num: 4,
              title: 'Build a Greener Future',
              desc: 'Reduce food waste together.',
              icon: Leaf,
            },
          ].map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white/90 backdrop-blur-sm border border-charcoal/10 shadow-card hover:shadow-elevated transition-all flex flex-col justify-between text-left space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-deepTeal text-warmSand font-bold text-sm flex items-center justify-center font-mono">
                    {step.num}
                  </div>
                  <div className="w-8 h-8 rounded-xl bg-sageMint/40 text-deepTeal flex items-center justify-center">
                    <Icon className="w-4 h-4 text-deepTeal" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-deepTeal mb-1">{step.title}</h3>
                  <p className="text-xs text-charcoal/70 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. FEATURED NEAR-EXPIRY PRODUCTS (SECTION 5 INSTRUCTIONS) */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-deepTeal">
              Featured Products
            </h2>
            <p className="text-xs text-charcoal/70 mt-1">
              Freshly added near-expiry products available for immediate purchase.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('marketplace')}
            className="text-xs font-bold text-deepTeal hover:text-softTurquoise-dark flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={(id) => setSelectedProductId(id)}
            />
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. WHY CHOOSE ECOHELP? (SECTION 6 INSTRUCTIONS)          */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-deepTeal text-warmSand shadow-elevated">
          
          <div className="max-w-3xl space-y-3 mb-12 text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-softTurquoise">
              Commercial Advantage
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Why Businesses Rely on EcoHelp
            </h2>
            <p className="text-sm text-warmSand/80 leading-relaxed">
              Traditional inventory clearance is slow and leaks up to 80% of product value. EcoHelp delivers a digital marketplace engineered for speed, trust, and compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              {
                title: 'Recover Real Capital',
                desc: 'Turn potential product write-offs into recovered working capital with automated tiered markdowns.',
                icon: TrendingUp,
              },
              {
                title: 'Strict Date Safeguards',
                desc: 'Zero expired products policy. Automated shelf-life counters guarantee that only safe, valid batches are transacted.',
                icon: ShieldCheck,
              },
              {
                title: 'Dual Logistics Options',
                desc: 'Select temperature-monitored carrier transit or instant warehouse depot pickup to meet urgent schedules.',
                icon: Truck,
              },
              {
                title: 'FSSAI Provenance',
                desc: 'Every business account undergoes statutory verification, establishing trust and batch accountability.',
                icon: CheckCircle2,
              },
              {
                title: 'ESG & Audit Reports',
                desc: 'Automated reporting dashboards calculate total food waste diverted, aiding corporate sustainability compliance.',
                icon: BarChart3,
              },
              {
                title: 'Connected Community',
                desc: 'Direct bridge between national distributors, regional supermarkets, independent marts, and buyers.',
                icon: Users,
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-deepTeal-hover border border-softTurquoise/20 space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-softTurquoise/20 text-softTurquoise flex items-center justify-center">
                    <Icon className="w-5 h-5 text-softTurquoise" />
                  </div>
                  <h4 className="text-base font-bold text-white">{feature.title}</h4>
                  <p className="text-xs text-warmSand/70 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. BENEFITS FOR SELLERS & BUYERS                          */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          
          {/* Seller Benefits Card */}
          <div className="p-8 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-sageMint/40 text-deepTeal flex items-center justify-center">
                <Store className="w-6 h-6 text-deepTeal" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-deepTeal">Benefits for Sellers</h3>
                <p className="text-xs text-charcoal/60">Manufacturers, Wholesalers & Supermarkets</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-charcoal/80">
              {[
                'Recover up to 60-70% of inventory value before products expire',
                'Instantly free valuable warehouse racking space and cold storage',
                'Reach verified buyers without dedicated sales overhead',
                'Avoid expensive landfill disposal charges and write-offs',
                'Generate verifiable ESG data on food waste reduction',
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-deepTeal shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={openSellModal}
              className="w-full py-3 rounded-full bg-deepTeal text-warmSand text-xs font-bold hover:bg-deepTeal-hover transition-colors shadow-soft"
            >
              Start Selling Today
            </button>
          </div>

          {/* Buyer Benefits Card */}
          <div className="p-8 rounded-3xl bg-white border border-charcoal/10 shadow-card space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-lightOceanBlue/40 text-deepTeal flex items-center justify-center">
                <Users className="w-6 h-6 text-deepTeal" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-deepTeal">Benefits for Buyers</h3>
                <p className="text-xs text-charcoal/60">Retailers, Marts, Caterers & Consumers</p>
              </div>
            </div>

            <ul className="space-y-3 text-xs text-charcoal/80">
              {[
                'Procure branded FMCG, dairy, and grocery staples at 25% to 60% discounts',
                'Strict food safety: zero expired products allowed on platform',
                'Clear shelf-life countdowns, batch numbers, and storage temperatures',
                'Order in master crates, retail boxes, or individual trial units',
                'Choose convenient door dispatch or free depot pickup',
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-softTurquoise-dark shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{text}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => setCurrentView('marketplace')}
              className="w-full py-3 rounded-full bg-softTurquoise text-deepTeal text-xs font-bold hover:bg-softTurquoise-hover transition-colors shadow-soft"
            >
              Explore Near-Expiry Deals
            </button>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. SUSTAINABILITY IMPACT                                  */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-white/70 backdrop-blur-md border border-charcoal/10 shadow-card text-center space-y-8">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-softTurquoise-dark">
              Environmental Impact
            </span>
            <h2 className="text-3xl font-extrabold text-deepTeal">
              Real Impact Through Smarter Commerce
            </h2>
            <p className="text-xs text-charcoal/70">
              Every near-expiry product redirected prevents wasted resources and reduces methane emissions from landfills.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-warmSand/50 border border-charcoal/10 space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-deepTeal">24,580 kg</span>
              <p className="text-xs text-charcoal/70 font-semibold">Food Rescued</p>
            </div>
            <div className="p-5 rounded-2xl bg-warmSand/50 border border-charcoal/10 space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-deepTeal">₹1.82 Cr</span>
              <p className="text-xs text-charcoal/70 font-semibold">Value Recovered</p>
            </div>
            <div className="p-5 rounded-2xl bg-warmSand/50 border border-charcoal/10 space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-deepTeal">48.2 Tons</span>
              <p className="text-xs text-charcoal/70 font-semibold">CO₂ Diverted</p>
            </div>
            <div className="p-5 rounded-2xl bg-warmSand/50 border border-charcoal/10 space-y-1">
              <span className="text-2xl sm:text-3xl font-black text-deepTeal">340+</span>
              <p className="text-xs text-charcoal/70 font-semibold">Verified Businesses</p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. FREQUENTLY ASKED QUESTIONS (FAQ)                       */}
      {/* ======================================================== */}
      <section id="about-us" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-softTurquoise-dark">
            Common Inquiries
          </span>
          <h2 className="text-3xl font-extrabold text-deepTeal">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3 text-left">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl bg-white border border-charcoal/10 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-deepTeal hover:bg-warmSand/20"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-deepTeal shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-charcoal/50 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-charcoal/80 leading-relaxed border-t border-charcoal/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Product Details Modal for featured product clicks */}
      {selectedProductId && (
        <ProductDetailsModal
          productId={selectedProductId}
          onClose={() => setSelectedProductId(null)}
        />
      )}

    </div>
  );
};
