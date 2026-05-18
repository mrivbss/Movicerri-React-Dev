import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wecbphptughkppeevoqc.supabase.co';
const supabaseKey = 'sb_publishable_oO8BAbBCxZ3QtkdHUVYxDQ_nhWWtxEi';

export const supabase = createClient(supabaseUrl, supabaseKey);