-- ====================================================================
-- ECOHELP PRODUCTION DATABASE SCHEMA & ROW LEVEL SECURITY (RLS) POLICIES
-- B2B Near-Expiry Inventory Marketplace & Sustainable Commerce Platform
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked to auth.users)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('distributor', 'seller', 'buyer', 'consumer', 'admin')),
    phone TEXT,
    avatar_url TEXT,
    business_name TEXT,
    business_type TEXT,
    contact_person TEXT,
    business_address TEXT,
    location TEXT DEFAULT 'India',
    gst_number TEXT,
    fssai_number TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- --------------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    seller_name TEXT NOT NULL,
    seller_role TEXT NOT NULL DEFAULT 'seller',
    seller_verified BOOLEAN DEFAULT FALSE,
    fssai_license TEXT,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Dairy', 
        'Beverages', 
        'Packaged Food', 
        'Personal Care', 
        'Bakery & Confectionery', 
        'Fresh Produce', 
        'Grains & Staples'
    )),
    brand TEXT NOT NULL,
    batch_number TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    original_quantity INTEGER NOT NULL CHECK (original_quantity > 0),
    unit TEXT NOT NULL DEFAULT 'boxes',
    manufacturing_date DATE,
    expiry_date DATE NOT NULL,
    original_price NUMERIC(10, 2) NOT NULL CHECK (original_price > 0),
    discounted_price NUMERIC(10, 2) NOT NULL CHECK (discounted_price < original_price),
    storage_type TEXT NOT NULL,
    storage_temperature TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'nearing_expiry', 'sold_out', 'expired')),
    location TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Products Policies
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (true);

CREATE POLICY "Authenticated sellers can insert products" 
ON public.products FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their own products" 
ON public.products FOR UPDATE 
TO authenticated
USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their own products" 
ON public.products FOR DELETE 
TO authenticated
USING (auth.uid() = seller_id);

-- --------------------------------------------------------------------
-- 3. ORDERS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL UNIQUE,
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    buyer_name TEXT NOT NULL,
    buyer_email TEXT NOT NULL,
    buyer_phone TEXT NOT NULL,
    buyer_role TEXT NOT NULL,
    seller_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    seller_name TEXT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    sustainability_discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    delivery_type TEXT NOT NULL CHECK (delivery_type IN ('delivery', 'pickup')),
    delivery_address TEXT,
    pickup_location TEXT,
    pickup_time_slot TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 
        'confirmed', 
        'processing', 
        'ready_for_pickup', 
        'completed', 
        'cancelled'
    )),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders Policies
CREATE POLICY "Users can view their own orders as buyer or seller" 
ON public.orders FOR SELECT 
TO authenticated
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Buyers can insert orders" 
ON public.orders FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Sellers and buyers can update orders" 
ON public.orders FOR UPDATE 
TO authenticated
USING (auth.uid() = seller_id OR auth.uid() = buyer_id);

-- --------------------------------------------------------------------
-- 4. ORDER ITEMS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    brand TEXT NOT NULL,
    image_url TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL,
    original_unit_price NUMERIC(10, 2) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    seller_id UUID REFERENCES public.profiles(id),
    seller_name TEXT NOT NULL,
    expiry_date DATE NOT NULL,
    storage_type TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Order Items Policies
CREATE POLICY "Users can view order items for their orders" 
ON public.order_items FOR SELECT 
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
    )
);

CREATE POLICY "Buyers can insert order items" 
ON public.order_items FOR INSERT 
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_items.order_id 
        AND orders.buyer_id = auth.uid()
    )
);

-- --------------------------------------------------------------------
-- 5. NOTIFICATIONS TABLE
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('order', 'expiry', 'system', 'verification')),
    read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Notifications Policies
CREATE POLICY "Users can view their own notifications" 
ON public.notifications FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
ON public.notifications FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "System and users can insert notifications" 
ON public.notifications FOR INSERT 
TO authenticated
WITH CHECK (true);

-- --------------------------------------------------------------------
-- 6. AUTOMATIC USER PROFILE TRIGGER
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        name, 
        email, 
        role, 
        phone, 
        business_name, 
        business_type, 
        contact_person, 
        business_address, 
        location, 
        gst_number, 
        fssai_number, 
        verified
    )
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'name', 'New EcoHelp Member'),
        new.email,
        COALESCE(new.raw_user_meta_data->>'role', 'seller'),
        COALESCE(new.raw_user_meta_data->>'phone', ''),
        new.raw_user_meta_data->>'businessName',
        new.raw_user_meta_data->>'businessType',
        new.raw_user_meta_data->>'contactPerson',
        new.raw_user_meta_data->>'businessAddress',
        COALESCE(new.raw_user_meta_data->>'location', 'India'),
        new.raw_user_meta_data->>'gstNumber',
        new.raw_user_meta_data->>'fssaiNumber',
        CASE WHEN new.raw_user_meta_data->>'role' = 'consumer' THEN TRUE ELSE FALSE END
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger binding to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------------------
-- 7. STORAGE BUCKET CONFIGURATION (product-images)
-- --------------------------------------------------------------------
-- Create storage bucket for product photographs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access policy for product images
CREATE POLICY "Public Access for Product Images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'product-images');

-- Authenticated upload policy for product images
CREATE POLICY "Authenticated users can upload product images" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'product-images');
