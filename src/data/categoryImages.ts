import { Category } from '../types';

export interface CategorySampleImage {
  id: string;
  name: string;
  url: string;
  category: Category;
}

export const CATEGORY_SAMPLE_IMAGES: Record<Category, CategorySampleImage[]> = {
  Dairy: [
    {
      id: 'dairy-1',
      name: 'Organic Milk Bottles & Cartons',
      url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
      category: 'Dairy',
    },
    {
      id: 'dairy-2',
      name: 'Artisan Cheese Block & Slices',
      url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80',
      category: 'Dairy',
    },
    {
      id: 'dairy-3',
      name: 'Greek Yogurt Cups with Berries',
      url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
      category: 'Dairy',
    },
    {
      id: 'dairy-4',
      name: 'Fresh Dairy Butter Packs',
      url: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80',
      category: 'Dairy',
    },
  ],
  Beverages: [
    {
      id: 'bev-1',
      name: 'Cold-Pressed Citrus Juices',
      url: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80',
      category: 'Beverages',
    },
    {
      id: 'bev-2',
      name: 'Natural Sparkling Fruit Water',
      url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
      category: 'Beverages',
    },
    {
      id: 'bev-3',
      name: 'Premium Bottled Iced Tea',
      url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
      category: 'Beverages',
    },
    {
      id: 'bev-4',
      name: 'Almond & Oat Energy Milk',
      url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?auto=format&fit=crop&w=800&q=80',
      category: 'Beverages',
    },
  ],
  'Packaged Food': [
    {
      id: 'pkg-1',
      name: 'Roasted Nut & Trail Mix Pack',
      url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=800&q=80',
      category: 'Packaged Food',
    },
    {
      id: 'pkg-2',
      name: 'Organic Rolled Oats & Granola',
      url: 'https://images.unsplash.com/photo-1517093707577-70979bb46757?auto=format&fit=crop&w=800&q=80',
      category: 'Packaged Food',
    },
    {
      id: 'pkg-3',
      name: 'Artisan Pasta & Noodle Boxes',
      url: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281781?auto=format&fit=crop&w=800&q=80',
      category: 'Packaged Food',
    },
    {
      id: 'pkg-4',
      name: 'Dark Chocolate Bars 70%',
      url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
      category: 'Packaged Food',
    },
  ],
  'Personal Care': [
    {
      id: 'pc-1',
      name: 'Herbal Shampoo & Conditioner',
      url: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=800&q=80',
      category: 'Personal Care',
    },
    {
      id: 'pc-2',
      name: 'Natural Moisturizing Body Lotion',
      url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
      category: 'Personal Care',
    },
    {
      id: 'pc-3',
      name: 'Organic Essential Oils Set',
      url: 'https://images.unsplash.com/photo-1608248597359-3832c322b640?auto=format&fit=crop&w=800&q=80',
      category: 'Personal Care',
    },
    {
      id: 'pc-4',
      name: 'Handmade Botanical Soap Bars',
      url: 'https://images.unsplash.com/photo-1607006314644-8cb38b935d28?auto=format&fit=crop&w=800&q=80',
      category: 'Personal Care',
    },
  ],
  'Bakery & Confectionery': [
    {
      id: 'bak-1',
      name: 'Artisan Sourdough Loaf',
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      category: 'Bakery & Confectionery',
    },
    {
      id: 'bak-2',
      name: 'Butter Croissants & Pastries Box',
      url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
      category: 'Bakery & Confectionery',
    },
    {
      id: 'bak-3',
      name: 'Whole Grain Honey Cookies',
      url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80',
      category: 'Bakery & Confectionery',
    },
    {
      id: 'bak-4',
      name: 'Muffins & Cupcake Packs',
      url: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=800&q=80',
      category: 'Bakery & Confectionery',
    },
  ],
  'Fresh Produce': [
    {
      id: 'fp-1',
      name: 'Farm Fresh Organic Apples Crate',
      url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
      category: 'Fresh Produce',
    },
    {
      id: 'fp-2',
      name: 'Sweet Hydroponic Bell Peppers',
      url: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
      category: 'Fresh Produce',
    },
    {
      id: 'fp-3',
      name: 'Ripe Vine Tomatoes Carton',
      url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
      category: 'Fresh Produce',
    },
    {
      id: 'fp-4',
      name: 'Organic Citrus & Valencia Oranges',
      url: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=800&q=80',
      category: 'Fresh Produce',
    },
  ],
  'Grains & Staples': [
    {
      id: 'gs-1',
      name: 'Premium Aged Basmati Rice Bags',
      url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
      category: 'Grains & Staples',
    },
    {
      id: 'gs-2',
      name: 'Organic Red Lentils & Pulses',
      url: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=800&q=80',
      category: 'Grains & Staples',
    },
    {
      id: 'gs-3',
      name: 'Cold-Pressed Mustard Cooking Oil',
      url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
      category: 'Grains & Staples',
    },
    {
      id: 'gs-4',
      name: 'Unpolished Quinoa & Millets Sack',
      url: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=800&q=80',
      category: 'Grains & Staples',
    },
  ],
};
