import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Upload, 
  Check, 
  Image as ImageIcon, 
  Sparkles, 
  Layers, 
  ShieldCheck,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { Category, StorageCondition, UnitType } from '../types';
import { CATEGORY_SAMPLE_IMAGES } from '../data/categoryImages';
import { uploadProductImage } from '../lib/supabase';

export const SellProductModal: React.FC = () => {
  const { isSellModalOpen, closeSellModal, addProduct, showToast } = useApp();

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Dairy');
  const [brand, setBrand] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [quantity, setQuantity] = useState<number | ''>(50);
  const [unit, setUnit] = useState<UnitType>('boxes');
  const [manufacturingDate, setManufacturingDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>(1000);
  const [discountedPrice, setDiscountedPrice] = useState<number | ''>(600);
  const [storageType, setStorageType] = useState<StorageCondition>('Refrigerated (2°C - 8°C)');
  const [storageTemperature, setStorageTemperature] = useState('2°C to 4°C continuous cold storage');
  const [description, setDescription] = useState('');
  const [fssaiLicense, setFssaiLicense] = useState('');

  // Image Upload & Selection State
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>('');
  const [imageUploadType, setImageUploadType] = useState<'sample' | 'custom'>('sample');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Set default sample image whenever category changes
  const categorySamples = CATEGORY_SAMPLE_IMAGES[category] || [];

  useEffect(() => {
    if (imageUploadType === 'sample' && categorySamples.length > 0) {
      setSelectedImageUrl(categorySamples[0].url);
    }
  }, [category]);

  if (!isSellModalOpen) return null;

  // File Upload Handlers with Supabase cloud storage & Base64 fallback
  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size should be less than 5MB.');
      return;
    }

    setIsUploadingImage(true);
    try {
      const res = await uploadProductImage(file);
      if (res.url) {
        setSelectedImageUrl(res.url);
        setImageUploadType('custom');
        showToast('Product photograph processed and ready!');
      } else {
        showToast(res.error || 'Failed to process image');
      }
    } catch (err: any) {
      showToast('Error uploading image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedImageUrl) {
      showToast('Please select an example image or upload your own product photograph.');
      return;
    }

    if (!expiryDate) {
      showToast('Please specify the expiry date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addProduct({
        name,
        category,
        brand,
        batchNumber,
        quantity: Number(quantity),
        unit,
        manufacturingDate,
        expiryDate,
        originalPrice: Number(originalPrice),
        discountedPrice: Number(discountedPrice),
        storageType,
        storageTemperature,
        description,
        imageUrl: selectedImageUrl,
        fssaiLicense,
      });

      if (res.success) {
        closeSellModal();
      } else {
        showToast(res.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-elevated border border-charcoal/10 overflow-hidden my-6 animate-fade-in max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-deepTeal text-warmSand px-6 py-5 flex items-center justify-between shrink-0">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-softTurquoise">
              EcoHelp Seller Desk
            </span>
            <h3 className="text-xl font-bold tracking-tight text-white mt-0.5">
              List Near-Expiry Surplus Inventory
            </h3>
          </div>
          <button
            onClick={closeSellModal}
            className="w-9 h-9 rounded-full bg-deepTeal-hover flex items-center justify-center text-warmSand/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Section 1: Basic Product Information */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-deepTeal uppercase tracking-wider border-b border-charcoal/10 pb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-softTurquoise-dark" />
              <span>Product Specifications</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-charcoal mb-1">Product Title *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Artisanal Greek Yogurt Berry Cartons (Pack of 24)"
                  className="w-full px-3.5 py-2 rounded-xl border border-charcoal/20 text-xs font-medium focus:border-deepTeal focus:ring-1 focus:ring-deepTeal"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs bg-white font-medium"
                >
                  <option value="Dairy">Dairy</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Packaged Food">Packaged Food</option>
                  <option value="Personal Care">Personal Care</option>
                  <option value="Bakery & Confectionery">Bakery & Confectionery</option>
                  <option value="Fresh Produce">Fresh Produce</option>
                  <option value="Grains & Staples">Grains & Staples</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Brand Name *</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Epigamia / Amul / Tata"
                  className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Batch / Lot Number *</label>
                <input
                  type="text"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  placeholder="e.g. BATCH-2026-X89"
                  className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">FSSAI License / Certificate</label>
                <input
                  type="text"
                  value={fssaiLicense}
                  onChange={(e) => setFssaiLicense(e.target.value)}
                  placeholder="e.g. 11521018000452"
                  className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Available Quantity *</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="100"
                  className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Unit of Measurement *</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as UnitType)}
                  className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs bg-white"
                >
                  <option value="boxes">Boxes</option>
                  <option value="cartons">Cartons</option>
                  <option value="crates">Crates</option>
                  <option value="units">Units</option>
                  <option value="packets">Packets</option>
                  <option value="kg">Kilograms (kg)</option>
                  <option value="liters">Liters (L)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Original Price (₹) *</label>
                <input
                  type="number"
                  min="1"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="1000"
                  className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Discounted Price (₹) *</label>
                <input
                  type="number"
                  min="1"
                  value={discountedPrice}
                  onChange={(e) => setDiscountedPrice(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="600"
                  className="w-full px-3 py-2 rounded-xl border border-emerald-400 bg-emerald-50 text-xs font-bold text-emerald-900"
                  required
                />
              </div>
            </div>

            {/* Dates & Expiry Warning */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Manufacturing Date (Optional)</label>
                <input
                  type="date"
                  value={manufacturingDate}
                  onChange={(e) => setManufacturingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Statutory Expiry Date * (Future Date)</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-deepTeal text-xs bg-warmSand/20 font-bold text-deepTeal"
                  required
                />
              </div>
            </div>

            {/* Storage Type & Temperature Conditions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Storage Condition *</label>
                <select
                  value={storageType}
                  onChange={(e) => setStorageType(e.target.value as StorageCondition)}
                  className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs bg-white font-medium"
                >
                  <option value="Ambient / Room Temp">Ambient / Room Temp</option>
                  <option value="Refrigerated (2°C - 8°C)">Refrigerated (2°C - 8°C)</option>
                  <option value="Frozen (-18°C)">Frozen (-18°C)</option>
                  <option value="Cool & Dry (15°C - 20°C)">Cool & Dry (15°C - 20°C)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1">Temperature / Warehouse Instructions</label>
                <input
                  type="text"
                  value={storageTemperature}
                  onChange={(e) => setStorageTemperature(e.target.value)}
                  placeholder="e.g. Keep refrigerated at 2-4°C, avoid moisture"
                  className="w-full px-3 py-2 rounded-xl border border-charcoal/20 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1">Product & Lot Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe seal condition, packaging integrity, why this surplus is being offered, and turnover urgency..."
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl border border-charcoal/20 text-xs leading-relaxed"
              />
            </div>
          </div>

          {/* Section 2: PRODUCT IMAGE SELECTION & UPLOAD (Explicit Prompt Requirements) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-2">
              <h4 className="text-xs font-bold text-deepTeal uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-softTurquoise-dark" />
                <span>Product Image Selection & Photograph Upload</span>
              </h4>
              <span className="text-[11px] text-charcoal/60">Category: <strong className="text-deepTeal">{category}</strong></span>
            </div>

            {/* Mode Tabs: Dynamic Category Examples vs Upload Real Image */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setImageUploadType('sample')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  imageUploadType === 'sample'
                    ? 'bg-deepTeal text-warmSand shadow-sm'
                    : 'bg-warmSand/60 text-charcoal hover:bg-warmSand-dark/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-softTurquoise" />
                <span>Select from {category} Examples</span>
              </button>

              <button
                type="button"
                onClick={() => setImageUploadType('custom')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  imageUploadType === 'custom'
                    ? 'bg-deepTeal text-warmSand shadow-sm'
                    : 'bg-warmSand/60 text-charcoal hover:bg-warmSand-dark/30'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-softTurquoise" />
                <span>Upload Your Actual Photograph</span>
              </button>
            </div>

            {/* Dynamic Category Example Images Grid */}
            {imageUploadType === 'sample' ? (
              <div className="space-y-2">
                <p className="text-[11px] text-charcoal/70">
                  Select a representative example image for your <strong>{category}</strong> listing:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {categorySamples.map((img) => (
                    <div
                      key={img.id}
                      onClick={() => setSelectedImageUrl(img.url)}
                      className={`relative aspect-4/3 rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                        selectedImageUrl === img.url
                          ? 'border-deepTeal ring-2 ring-softTurquoise shadow-md'
                          : 'border-transparent hover:border-charcoal/30 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img.url}
                        alt={img.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-charcoal/70 via-transparent to-transparent flex items-end p-2">
                        <span className="text-[10px] font-bold text-white line-clamp-1">{img.name}</span>
                      </div>
                      {selectedImageUrl === img.url && (
                        <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-deepTeal text-warmSand flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 text-softTurquoise" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Custom File Upload Drag & Drop Area */
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors ${
                  isDragging 
                    ? 'border-softTurquoise bg-softTurquoise/10' 
                    : 'border-charcoal/20 hover:border-deepTeal bg-warmSand/20 hover:bg-warmSand/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-full bg-deepTeal/10 text-deepTeal mx-auto flex items-center justify-center mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-deepTeal">
                  Click to select actual product photo or drag & drop here
                </p>
                <p className="text-[11px] text-charcoal/60 mt-1">
                  Supports JPG, PNG, WEBP up to 5MB. Shows real batch packaging to buyers.
                </p>
              </div>
            )}

            {/* Selected Image Preview & Management */}
            {selectedImageUrl && (
              <div className="p-3.5 rounded-2xl bg-warmSand/40 border border-charcoal/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedImageUrl}
                    alt="Listing Preview"
                    className="w-14 h-14 rounded-xl object-cover border border-charcoal/20 shadow-xs"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-deepTeal tracking-wider block">
                      Active Listing Image Preview
                    </span>
                    <p className="text-xs font-bold text-charcoal">
                      {imageUploadType === 'custom' ? 'Custom Photograph Uploaded' : 'Category Template Selected'}
                    </p>
                    <span className="text-[10px] text-emerald-700 font-medium">✓ Ready for publication</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (imageUploadType === 'custom') {
                        fileInputRef.current?.click();
                      } else {
                        // cycle to next sample
                        const idx = categorySamples.findIndex(s => s.url === selectedImageUrl);
                        const next = categorySamples[(idx + 1) % categorySamples.length];
                        if (next) setSelectedImageUrl(next.url);
                      }
                    }}
                    className="p-2 rounded-lg bg-white hover:bg-warmSand text-charcoal border border-charcoal/10 text-xs font-medium flex items-center gap-1"
                    title="Replace image"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Replace</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="p-2 rounded-lg bg-white hover:bg-rose-50 text-rose-600 border border-charcoal/10 text-xs font-medium flex items-center gap-1"
                    title="Remove image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Remove</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Food Safety & Accuracy Pledge */}
          <div className="p-3.5 rounded-2xl bg-sageMint/30 border border-sageMint/60 flex items-start gap-3 text-xs text-charcoal/80">
            <ShieldCheck className="w-5 h-5 text-deepTeal shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-deepTeal">Statutory Quality Commitment</p>
              <p className="text-[11px] leading-relaxed">
                By publishing this near-expiry inventory lot, you certify that the products are stored under prescribed ambient/cold-chain specifications, within statutory expiry dates, and covered by applicable FSSAI documentation.
              </p>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-charcoal/10">
            <button
              type="button"
              onClick={closeSellModal}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-charcoal/20 text-xs font-bold text-charcoal hover:bg-warmSand disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploadingImage}
              className="px-6 py-2.5 rounded-xl bg-softTurquoise text-deepTeal text-xs font-bold hover:bg-softTurquoise-hover shadow-soft flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Publishing...' : isUploadingImage ? 'Uploading Image...' : 'Publish to Marketplace'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
