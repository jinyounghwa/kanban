import { createClient } from '@supabase/supabase-js';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 브라우저 환경에서 사용할 클라이언트
export const supabase = typeof window !== 'undefined' 
  ? createPagesBrowserClient() 
  : createClient(supabaseUrl, supabaseAnonKey);
