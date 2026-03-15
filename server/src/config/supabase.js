// WHY: Creates one Supabase client for all routes to share.
// Uses service_role key (not anon) because backend is trusted.
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
export default supabase;