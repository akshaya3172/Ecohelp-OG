import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  User, 
  Product, 
  Order, 
  Notification, 
  CartItem, 
  UserRole, 
  OrderStatus,
  Category,
  StorageCondition,
  UnitType 
} from '../types';
import { 
  SEED_USERS, 
  SEED_PRODUCTS, 
  SEED_ORDERS, 
  SEED_NOTIFICATIONS 
} from '../data/seedData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  products: Product[];
  orders: Order[];
  notifications: Notification[];
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  currentView: string;
  selectedProductId: string | null;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
  isCheckoutModalOpen: boolean;
  isSellModalOpen: boolean;
  toastMessage: string | null;
  isBackendConnected: boolean;
  
  // Navigation & Modals
  setCurrentView: (view: string, productId?: string) => void;
  openAuthModal: (mode?: 'login' | 'register', defaultRole?: UserRole) => void;
  closeAuthModal: () => void;
  openCheckoutModal: () => void;
  closeCheckoutModal: () => void;
  openSellModal: () => void;
  closeSellModal: () => void;
  showToast: (msg: string) => void;
  
  // Auth
  login: (email: string, password?: string) => Promise<boolean>;
  register: (userData: Partial<User>, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchDemoUser: (role: UserRole) => void;
  
  // Cart
  addToCart: (product: Product, quantity: number) => { success: boolean; message: string };
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Products
  addProduct: (productData: {
    name: string;
    category: Category;
    brand: string;
    batchNumber: string;
    quantity: number;
    unit: UnitType;
    manufacturingDate?: string;
    expiryDate: string;
    originalPrice: number;
    discountedPrice: number;
    storageType: StorageCondition;
    storageTemperature?: string;
    description: string;
    imageUrl: string;
    fssaiLicense?: string;
  }) => Promise<{ success: boolean; message: string; product?: Product }>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  
  // Orders
  placeOrder: (details: {
    deliveryType: 'delivery' | 'pickup';
    deliveryAddress?: string;
    pickupLocation?: string;
    pickupTimeSlot?: string;
    notes?: string;
  }) => Promise<{ success: boolean; message: string; order?: Order }>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  
  // Admin & Verification
  verifyBusinessUser: (userId: string, verified: boolean) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  resetDatabase: () => void;
}

const STORAGE_KEY_PREFIX = 'ecohelp_app_';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isBackendConnected = isSupabaseConfigured();

  // Database State with LocalStorage Persistence
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}users`);
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}current_user`);
    if (saved) return JSON.parse(saved);
    // Default to Retailer - Seller so the user sees a rich dashboard immediately
    return SEED_USERS.find(u => u.role === 'seller') || SEED_USERS[0];
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}products`);
    return saved ? JSON.parse(saved) : SEED_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}orders`);
    return saved ? JSON.parse(saved) : SEED_ORDERS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}notifications`);
    return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}cart`);
    return saved ? JSON.parse(saved) : [];
  });

  // UI State
  const [currentView, setCurrentViewInternal] = useState<string>('landing');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state to localStorage for offline robustness
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}products`, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}orders`, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}notifications`, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}cart`, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}current_user`, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}current_user`);
    }
  }, [currentUser]);

  // Initial Supabase Hydration (if configured)
  useEffect(() => {
    if (!isBackendConnected) return;

    async function hydrateFromSupabase() {
      try {
        // 1. Fetch Products
        const { data: supaProducts, error: prodErr } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!prodErr && supaProducts && supaProducts.length > 0) {
          const mapped: Product[] = supaProducts.map((p: any) => ({
            id: p.id,
            sellerId: p.seller_id,
            sellerName: p.seller_name,
            sellerRole: p.seller_role,
            sellerVerified: p.seller_verified,
            fssaiLicense: p.fssai_license,
            name: p.name,
            category: p.category,
            brand: p.brand,
            batchNumber: p.batch_number,
            quantity: p.quantity,
            originalQuantity: p.original_quantity || p.quantity,
            unit: p.unit,
            manufacturingDate: p.manufacturing_date,
            expiryDate: p.expiry_date,
            originalPrice: Number(p.original_price),
            discountedPrice: Number(p.discounted_price),
            storageType: p.storage_type,
            storageTemperature: p.storage_temperature,
            description: p.description,
            imageUrl: p.image_url,
            status: p.status,
            location: p.location,
            createdAt: p.created_at,
            views: p.views || 0,
          }));
          setProducts(mapped);
        }

        // 2. Fetch Profiles
        const { data: supaProfiles, error: profErr } = await supabase
          .from('profiles')
          .select('*');

        if (!profErr && supaProfiles && supaProfiles.length > 0) {
          const mappedUsers: User[] = supaProfiles.map((pr: any) => ({
            id: pr.id,
            name: pr.name,
            email: pr.email,
            role: pr.role,
            phone: pr.phone || '',
            avatar: pr.avatar_url,
            businessName: pr.business_name,
            businessType: pr.business_type,
            contactPerson: pr.contact_person,
            businessAddress: pr.business_address,
            location: pr.location,
            gstNumber: pr.gst_number,
            fssaiNumber: pr.fssai_number,
            verified: pr.verified,
            createdAt: pr.created_at,
          }));
          setUsers(mappedUsers);
        }

        // 3. Check Active Supabase Session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const found = users.find(u => u.id === session.user.id || u.email === session.user.email);
          if (found) {
            setCurrentUser(found);
          }
        }
      } catch (err) {
        console.warn('Supabase initial fetch notice:', err);
      }
    }

    hydrateFromSupabase();

    // Listen to Supabase Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const matching = users.find(u => u.email.toLowerCase() === session.user.email?.toLowerCase());
        if (matching) {
          setCurrentUser(matching);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isBackendConnected]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  const setCurrentView = (view: string, productId?: string) => {
    setCurrentViewInternal(view);
    if (productId !== undefined) {
      setSelectedProductId(productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openCheckoutModal = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty. Add near-expiry items from the marketplace first.');
      return;
    }
    setIsCheckoutModalOpen(true);
  };

  const closeCheckoutModal = () => setIsCheckoutModalOpen(false);

  const openSellModal = () => {
    if (!currentUser) {
      openAuthModal('login');
      showToast('Please sign in to list near-expiry products.');
      return;
    }
    if (currentUser.role !== 'seller' && currentUser.role !== 'distributor' && currentUser.role !== 'admin') {
      showToast(`Your current role is "${currentUser.role}". Only Distributors and Sellers can list products.`);
      return;
    }
    setIsSellModalOpen(true);
  };

  const closeSellModal = () => setIsSellModalOpen(false);

  // Auth Operations
  const login = async (email: string, password?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Try Supabase Auth if backend is configured
    if (isBackendConnected && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        });

        if (!error && data.user) {
          const userProfile = users.find(u => u.email.toLowerCase() === cleanEmail);
          if (userProfile) {
            setCurrentUser(userProfile);
            setIsAuthModalOpen(false);
            showToast(`Welcome back, ${userProfile.name}! Signed in via Supabase Auth.`);
            return true;
          }
        }
      } catch (e) {
        console.warn('Supabase login fallback:', e);
      }
    }

    // 2. Demo User / Local fallback
    const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (found) {
      setCurrentUser(found);
      setIsAuthModalOpen(false);
      showToast(`Welcome back, ${found.name}! Signed in as ${found.role.toUpperCase()}.`);
      return true;
    } else {
      showToast('No account found with this email. Please check or register.');
      return false;
    }
  };

  const register = async (userData: Partial<User>, password?: string): Promise<boolean> => {
    if (!userData.email || !userData.name || !userData.role) {
      showToast('Please fill in all required fields.');
      return false;
    }

    const cleanEmail = userData.email.trim().toLowerCase();
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      showToast('An account with this email already exists. Please log in.');
      return false;
    }

    let assignedId = `user-${Date.now()}`;

    // 1. Try Supabase Auth Sign Up if configured
    if (isBackendConnected && password) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              name: userData.name,
              role: userData.role,
              phone: userData.phone,
              businessName: userData.businessName,
              businessType: userData.businessType,
              contactPerson: userData.contactPerson,
              businessAddress: userData.businessAddress,
              location: userData.location,
              gstNumber: userData.gstNumber,
              fssaiNumber: userData.fssaiNumber,
            },
          },
        });

        if (!authError && authData.user) {
          assignedId = authData.user.id;
        }
      } catch (e) {
        console.warn('Supabase registration fallback:', e);
      }
    }

    const newUser: User = {
      id: assignedId,
      name: userData.name,
      email: cleanEmail,
      role: userData.role,
      phone: userData.phone || '+91 98000 00000',
      businessName: userData.businessName,
      businessType: userData.businessType,
      contactPerson: userData.contactPerson || userData.name,
      businessAddress: userData.businessAddress,
      location: userData.location || 'India',
      gstNumber: userData.gstNumber,
      fssaiNumber: userData.fssaiNumber,
      verified: userData.role === 'consumer',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    showToast(`Registration successful! Welcome to EcoHelp as a ${newUser.role.toUpperCase()}.`);
    return true;
  };

  const logout = async () => {
    if (isBackendConnected) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        // silent catch
      }
    }
    setCurrentUser(null);
    showToast('You have been signed out.');
  };

  const switchDemoUser = (role: UserRole) => {
    const demoUser = users.find((u) => u.role === role);
    if (demoUser) {
      setCurrentUser(demoUser);
      showToast(`Switched active profile to ${demoUser.name} (${demoUser.role.toUpperCase()})`);
    }
  };

  // Cart Operations
  const addToCart = (product: Product, quantity: number) => {
    const isExpired = new Date(product.expiryDate).getTime() < new Date().setHours(0, 0, 0, 0);
    if (isExpired) {
      return { success: false, message: 'Safety Violation: This product has expired and cannot be purchased.' };
    }

    if (quantity <= 0) {
      return { success: false, message: 'Please select a quantity greater than zero.' };
    }

    const currentInCart = cart.find((item) => item.product.id === product.id)?.quantity || 0;
    if (currentInCart + quantity > product.quantity) {
      return { 
        success: false, 
        message: `Only ${product.quantity} ${product.unit} available. You already have ${currentInCart} in your cart.` 
      };
    }

    setCart((prev) => {
      const idx = prev.findIndex((item) => item.product.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += quantity;
        return copy;
      } else {
        return [...prev, { product, quantity }];
      }
    });

    showToast(`Added ${quantity} ${product.unit} of "${product.name}" to cart!`);
    return { success: true, message: 'Product added to cart' };
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = cart.find((i) => i.product.id === productId);
    if (!item) return;

    if (quantity > item.product.quantity) {
      showToast(`Cannot exceed total available stock (${item.product.quantity} ${item.product.unit}).`);
      return;
    }

    setCart((prev) =>
      prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.discountedPrice * item.quantity, 0);

  // Products CRUD
  const addProduct = async (data: {
    name: string;
    category: Category;
    brand: string;
    batchNumber: string;
    quantity: number;
    unit: UnitType;
    manufacturingDate?: string;
    expiryDate: string;
    originalPrice: number;
    discountedPrice: number;
    storageType: StorageCondition;
    storageTemperature?: string;
    description: string;
    imageUrl: string;
    fssaiLicense?: string;
  }) => {
    if (!currentUser) {
      return { success: false, message: 'You must be logged in to list products.' };
    }

    if (!data.name || !data.category || !data.brand || !data.batchNumber || !data.imageUrl) {
      return { success: false, message: 'Please complete all required fields and select or upload an image.' };
    }

    if (data.quantity <= 0) {
      return { success: false, message: 'Available quantity must be greater than zero.' };
    }

    if (data.discountedPrice >= data.originalPrice) {
      return { success: false, message: 'Discounted price must be strictly lower than the original price.' };
    }

    const expiryTime = new Date(data.expiryDate).getTime();
    const todayTime = new Date().setHours(0, 0, 0, 0);
    if (expiryTime <= todayTime) {
      return { 
        success: false, 
        message: 'Food Safety Policy: Expired products cannot be listed on EcoHelp. Expiry date must be in the future.' 
      };
    }

    const daysUntilExpiry = Math.ceil((expiryTime - todayTime) / (1000 * 60 * 60 * 24));
    const status = daysUntilExpiry <= 7 ? 'nearing_expiry' : 'active';
    const prodId = `prod-${Date.now()}`;

    const newProduct: Product = {
      id: prodId,
      sellerId: currentUser.id,
      sellerName: currentUser.businessName || currentUser.name,
      sellerRole: currentUser.role === 'distributor' ? 'distributor' : 'seller',
      sellerVerified: currentUser.verified,
      fssaiLicense: data.fssaiLicense || currentUser.fssaiNumber || 'FSSAI-COMPLIANT',
      name: data.name.trim(),
      category: data.category,
      brand: data.brand.trim(),
      batchNumber: data.batchNumber.trim(),
      quantity: Number(data.quantity),
      originalQuantity: Number(data.quantity),
      unit: data.unit,
      manufacturingDate: data.manufacturingDate,
      expiryDate: data.expiryDate,
      originalPrice: Number(data.originalPrice),
      discountedPrice: Number(data.discountedPrice),
      storageType: data.storageType,
      storageTemperature: data.storageTemperature,
      description: data.description.trim(),
      imageUrl: data.imageUrl,
      status: status,
      location: currentUser.location || 'Central Warehouse',
      createdAt: new Date().toISOString(),
      views: 1,
    };

    // If Supabase is connected, insert into Supabase database
    if (isBackendConnected) {
      try {
        await supabase.from('products').insert([
          {
            id: newProduct.id,
            seller_id: newProduct.sellerId.startsWith('user-') ? null : newProduct.sellerId,
            seller_name: newProduct.sellerName,
            seller_role: newProduct.sellerRole,
            seller_verified: newProduct.sellerVerified,
            fssai_license: newProduct.fssaiLicense,
            name: newProduct.name,
            category: newProduct.category,
            brand: newProduct.brand,
            batch_number: newProduct.batchNumber,
            quantity: newProduct.quantity,
            original_quantity: newProduct.originalQuantity,
            unit: newProduct.unit,
            manufacturing_date: newProduct.manufacturingDate || null,
            expiry_date: newProduct.expiryDate,
            original_price: newProduct.originalPrice,
            discounted_price: newProduct.discountedPrice,
            storage_type: newProduct.storageType,
            storage_temperature: newProduct.storageTemperature,
            description: newProduct.description,
            image_url: newProduct.imageUrl,
            status: newProduct.status,
            location: newProduct.location,
            views: 1,
          },
        ]);
      } catch (err) {
        console.warn('Supabase product insert notice:', err);
      }
    }

    setProducts((prev) => [newProduct, ...prev]);

    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Product Successfully Listed',
      message: `"${newProduct.name}" batch ${newProduct.batchNumber} is now live in the EcoHelp marketplace.`,
      type: 'system',
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Success! "${newProduct.name}" has been published to the marketplace.`);
    return { success: true, message: 'Product listed successfully', product: newProduct };
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    if (isBackendConnected) {
      try {
        await supabase.from('products').update(updates).eq('id', id);
      } catch (err) {
        console.warn('Supabase product update error:', err);
      }
    }

    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    showToast('Product listing updated successfully.');
  };

  const deleteProduct = async (id: string) => {
    if (isBackendConnected) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase product delete error:', err);
      }
    }

    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from marketplace.');
  };

  // Orders
  const placeOrder = async (details: {
    deliveryType: 'delivery' | 'pickup';
    deliveryAddress?: string;
    pickupLocation?: string;
    pickupTimeSlot?: string;
    notes?: string;
  }) => {
    if (!currentUser) {
      return { success: false, message: 'Please sign in to confirm order.' };
    }

    if (cart.length === 0) {
      return { success: false, message: 'Cart is empty.' };
    }

    for (const item of cart) {
      const liveProduct = products.find((p) => p.id === item.product.id);
      if (!liveProduct) {
        return { success: false, message: `Product ${item.product.name} is no longer available.` };
      }
      if (new Date(liveProduct.expiryDate).getTime() < new Date().setHours(0, 0, 0, 0)) {
        return { success: false, message: `Product ${liveProduct.name} has expired and cannot be ordered.` };
      }
      if (liveProduct.quantity < item.quantity) {
        return { 
          success: false, 
          message: `Insufficient stock for ${liveProduct.name}. Only ${liveProduct.quantity} available.` 
        };
      }
    }

    const primarySeller = cart[0].product;
    const subtotal = cartTotal;
    const deliveryFee = details.deliveryType === 'delivery' ? 180 : 0;
    const sustainabilityDiscount = Math.round(subtotal * 0.05);
    const tax = Math.round((subtotal - sustainabilityDiscount) * 0.05);
    const total = subtotal + deliveryFee - sustainabilityDiscount + tax;

    const orderNumber = `ECO-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord-${Date.now()}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerEmail: currentUser.email,
      buyerPhone: currentUser.phone,
      buyerRole: currentUser.role,
      sellerId: primarySeller.sellerId,
      sellerName: primarySeller.sellerName,
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        brand: item.product.brand,
        imageUrl: item.product.imageUrl,
        quantity: item.quantity,
        unit: item.product.unit,
        unitPrice: item.product.discountedPrice,
        originalUnitPrice: item.product.originalPrice,
        subtotal: item.product.discountedPrice * item.quantity,
        sellerId: item.product.sellerId,
        sellerName: item.product.sellerName,
        expiryDate: item.product.expiryDate,
        storageType: item.product.storageType,
      })),
      subtotal,
      deliveryFee,
      sustainabilityDiscount,
      tax,
      total,
      deliveryType: details.deliveryType,
      deliveryAddress: details.deliveryAddress,
      pickupLocation: details.pickupLocation,
      pickupTimeSlot: details.pickupTimeSlot,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: details.notes,
    };

    // Save order in Supabase if configured
    if (isBackendConnected) {
      try {
        await supabase.from('orders').insert([
          {
            id: newOrder.id,
            order_number: newOrder.orderNumber,
            buyer_id: newOrder.buyerId.startsWith('user-') ? null : newOrder.buyerId,
            buyer_name: newOrder.buyerName,
            buyer_email: newOrder.buyerEmail,
            buyer_phone: newOrder.buyerPhone,
            buyer_role: newOrder.buyerRole,
            seller_id: newOrder.sellerId.startsWith('user-') ? null : newOrder.sellerId,
            seller_name: newOrder.sellerName,
            subtotal: newOrder.subtotal,
            delivery_fee: newOrder.deliveryFee,
            sustainability_discount: newOrder.sustainabilityDiscount,
            tax: newOrder.tax,
            total: newOrder.total,
            delivery_type: newOrder.deliveryType,
            delivery_address: newOrder.deliveryAddress,
            pickup_location: newOrder.pickupLocation,
            pickup_time_slot: newOrder.pickupTimeSlot,
            status: newOrder.status,
            notes: newOrder.notes,
          },
        ]);

        for (const it of newOrder.items) {
          await supabase.from('order_items').insert([
            {
              order_id: newOrder.id,
              product_id: it.productId,
              product_name: it.productName,
              brand: it.brand,
              image_url: it.imageUrl,
              quantity: it.quantity,
              unit: it.unit,
              unit_price: it.unitPrice,
              original_unit_price: it.originalUnitPrice,
              subtotal: it.subtotal,
              seller_id: it.sellerId.startsWith('user-') ? null : it.sellerId,
              seller_name: it.sellerName,
              expiry_date: it.expiryDate,
              storage_type: it.storageType,
            },
          ]);

          // Decrement stock in Supabase
          const currentProd = products.find(p => p.id === it.productId);
          if (currentProd) {
            const nextQty = Math.max(0, currentProd.quantity - it.quantity);
            await supabase.from('products').update({ quantity: nextQty }).eq('id', it.productId);
          }
        }
      } catch (err) {
        console.warn('Supabase order insert notice:', err);
      }
    }

    // Deduct stock locally
    setProducts((prev) =>
      prev.map((p) => {
        const cartItem = cart.find((c) => c.product.id === p.id);
        if (cartItem) {
          const remaining = p.quantity - cartItem.quantity;
          return {
            ...p,
            quantity: Math.max(0, remaining),
            status: remaining <= 0 ? 'sold_out' : p.status,
          };
        }
        return p;
      })
    );

    setOrders((prev) => [newOrder, ...prev]);

    // Send notifications
    const buyerNotif: Notification = {
      id: `notif-${Date.now()}-b`,
      userId: currentUser.id,
      title: `Order Placed Successfully #${orderNumber}`,
      message: `Your order for ${cart.length} item(s) has been placed with ${primarySeller.sellerName}. Total: ₹${total.toLocaleString('en-IN')}`,
      type: 'order',
      read: false,
      createdAt: new Date().toISOString(),
    };

    const sellerNotif: Notification = {
      id: `notif-${Date.now()}-s`,
      userId: primarySeller.sellerId,
      title: `New Incoming Order #${orderNumber}`,
      message: `${currentUser.name} has ordered ${cart.reduce((s, i) => s + i.quantity, 0)} units of near-expiry inventory.`,
      type: 'order',
      read: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [buyerNotif, sellerNotif, ...prev]);

    clearCart();
    setIsCheckoutModalOpen(false);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#174B4A', '#65C6C0', '#B9D9C8', '#A9DCEB'],
      });
    } catch {
      // ignore
    }

    showToast(`Order #${orderNumber} confirmed! Check your dashboard for tracking.`);
    return { success: true, message: 'Order created', order: newOrder };
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    if (isBackendConnected) {
      try {
        await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', orderId);
      } catch (err) {
        console.warn('Supabase order update status error:', err);
      }
    }

    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updated = { ...ord, status, updatedAt: new Date().toISOString() };
          
          const notif: Notification = {
            id: `notif-${Date.now()}`,
            userId: ord.buyerId,
            title: `Order Status Update #${ord.orderNumber}`,
            message: `Your order has been updated to "${status.replace('_', ' ').toUpperCase()}".`,
            type: 'order',
            read: false,
            createdAt: new Date().toISOString(),
          };
          setNotifications((n) => [notif, ...n]);

          return updated;
        }
        return ord;
      })
    );
    showToast(`Order status updated to ${status.replace('_', ' ').toUpperCase()}.`);
  };

  const verifyBusinessUser = async (userId: string, verified: boolean) => {
    if (isBackendConnected) {
      try {
        await supabase.from('profiles').update({ verified }).eq('id', userId);
        await supabase.from('products').update({ seller_verified: verified }).eq('seller_id', userId);
      } catch (err) {
        console.warn('Supabase verify user error:', err);
      }
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, verified } : u))
    );
    setProducts((prev) =>
      prev.map((p) => (p.sellerId === userId ? { ...p, sellerVerified: verified } : p))
    );
    showToast(`Business verification updated for user.`);
  };

  const markNotificationRead = async (id: string) => {
    if (isBackendConnected) {
      try {
        await supabase.from('notifications').update({ read: true }).eq('id', id);
      } catch (err) {
        // silent
      }
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = async () => {
    if (!currentUser) return;
    if (isBackendConnected) {
      try {
        await supabase.from('notifications').update({ read: true }).eq('user_id', currentUser.id);
      } catch (err) {
        // silent
      }
    }
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n))
    );
  };

  const resetDatabase = () => {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}users`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}products`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}orders`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}notifications`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}cart`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}current_user`);
    
    setUsers(SEED_USERS);
    setProducts(SEED_PRODUCTS);
    setOrders(SEED_ORDERS);
    setNotifications(SEED_NOTIFICATIONS);
    setCart([]);
    setCurrentUser(SEED_USERS.find(u => u.role === 'seller') || SEED_USERS[0]);
    showToast('Database reset to initial seeds.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        products,
        orders,
        notifications,
        cart,
        cartCount,
        cartTotal,
        currentView,
        selectedProductId,
        isAuthModalOpen,
        authModalMode,
        isCheckoutModalOpen,
        isSellModalOpen,
        toastMessage,
        isBackendConnected,
        setCurrentView,
        openAuthModal,
        closeAuthModal,
        openCheckoutModal,
        closeCheckoutModal,
        openSellModal,
        closeSellModal,
        showToast,
        login,
        register,
        logout,
        switchDemoUser,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        addProduct,
        updateProduct,
        deleteProduct,
        placeOrder,
        updateOrderStatus,
        verifyBusinessUser,
        markNotificationRead,
        markAllNotificationsRead,
        resetDatabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
