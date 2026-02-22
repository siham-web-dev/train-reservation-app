export const MAP_TILER_API_KEY = process.env.NEXT_PUBLIC_MAP_TILER_API_KEY || '';
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Mailtrap Credentials
export const MAILTRAP_HOST = process.env.MAILTRAP_HOST || '';
export const MAILTRAP_PORT = parseInt(process.env.MAILTRAP_PORT || '587');
export const MAILTRAP_USER = process.env.MAILTRAP_USER || '';
export const MAILTRAP_PASS = process.env.MAILTRAP_PASS || '';