
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fmdtxrqasszrvtfsrczi.supabase.co';
const supabaseKey = 'sb_publishable_Jmc7rLBqSq6XfThKIMk6Xg_nNzlLy7k';

export const supabase = createClient(supabaseUrl, supabaseKey);
