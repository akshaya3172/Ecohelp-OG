import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if valid Supabase credentials have been configured
export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.length > 0 &&
    supabaseUrl.startsWith('https://') &&
    typeof supabaseAnonKey === 'string' &&
    supabaseAnonKey.length > 20
  );
};

// Initialize Supabase Client with graceful fallback URL to avoid runtime crashes
export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder-project.supabase.co',
  isSupabaseConfigured() ? supabaseAnonKey : 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

/**
 * Upload an actual product image file to Supabase Storage bucket 'product-images'.
 * If Supabase is not configured or the upload fails, returns a Base64 data URL fallback.
 */
export async function uploadProductImage(file: File): Promise<{ url: string; error?: string }> {
  if (!file) {
    return { url: '', error: 'No file provided' };
  }

  // If Supabase is properly configured, upload to storage bucket
  if (isSupabaseConfigured()) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.warn('Supabase storage upload failed, falling back to local encoding:', uploadError.message);
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          return { url: publicUrlData.publicUrl };
        }
      }
    } catch (err: any) {
      console.warn('Storage upload error, using local fallback:', err.message);
    }
  }

  // Fallback: Read as Base64 Data URL so the user's product photo is always preserved
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve({ url: e.target?.result as string });
    };
    reader.onerror = () => {
      resolve({ url: '', error: 'Failed to read image file' });
    };
    reader.readAsDataURL(file);
  });
}
