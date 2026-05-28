import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tnqbtfehdokgqyyywrwg.supabase.co';
const supabaseKey = 'sb_publishable_X9pgn6T-Iv2iTAYNRGd0xg_J87cqELV';

export const supabase = createClient(supabaseUrl, supabaseKey);
