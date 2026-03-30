import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasSupabaseEnv = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseServiceRoleKey
);

export const supabase: SupabaseClient | null = hasSupabaseEnv
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

export const supabaseAdmin: SupabaseClient | null = hasSupabaseEnv
  ? createClient(supabaseUrl as string, supabaseServiceRoleKey as string)
  : null;
