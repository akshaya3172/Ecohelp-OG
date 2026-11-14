export type UserRole = 'distributor' | 'seller' | 'buyer' | 'consumer' | 'admin';

export type Category = 
  | 'Dairy' 
  | 'Beverages' 
  | 'Packaged Food' 
  | 'Personal Care' 
  | 'Bakery & Confectionery' 
  | 'Fresh Produce' 
  | 'Grains & Staples';

export type StorageCondition = 
  | 'Ambient / Room Temp' 
  | 'Refrigerated (2°C - 8°C)' 
  | 'Frozen (-18°C)' 
  | 'Cool & Dry (15°C - 20°C)';

export type ProductStatus = 'active' | 'nearing_expiry' | 'sold_out' | 'expired';

export type UnitType = 'units' | 'kg' | 'boxes' | 'crates' | 'cartons' | 'liters' | 'packets';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  businessName?: string;
  businessType?: string;
  contactPerson?: string;
  businessAddress?: string;
  location?: string;
  gstNumber?: string;
  fssaiNumber?: string;
  verified: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerRole: 'distributor' | 'seller';
  sellerVerified: boolean;
  fssaiLicense?: string;
  name: string;
  category: Category;
  brand: string;
  batchNumber: string;
  quantity: number;
  originalQuantity: number;
  unit: UnitType;
  manufacturingDate?: string;
  expiryDate: string;
  originalPrice: number;
  discountedPrice: number;
  storageType: StorageCondition;
  storageTemperature?: string;
  description: string;
  imageUrl: string;
  status: ProductStatus;
  location: string;
  createdAt: string;
  views?: number;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'processing' 
  | 'ready_for_pickup' 
  | 'completed' 
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  brand: string;
  imageUrl: string;
  quantity: number;
  unit: UnitType;
  unitPrice: number;
  originalUnitPrice: number;
  subtotal: number;
  sellerId: string;
  sellerName: string;
  expiryDate: string;
  storageType: StorageCondition;
}

export interface Order {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerRole: UserRole;
  sellerId: string;
  sellerName: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  sustainabilityDiscount: number;
  tax: number;
  total: number;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress?: string;
  pickupLocation?: string;
  pickupTimeSlot?: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'expiry' | 'system' | 'verification';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
