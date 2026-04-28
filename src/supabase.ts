import { createClient } from '@supabase/supabase-js';

// 這裡就是直接讀取雲端資料的「鑰匙」
const supabaseUrl = 'https://dhocswugqgkiyunhvksu.supabase.co';
const supabaseKey = 'sb_publishable_pgfFIc_TN20PVtw9gVL7lA_dMjfbJOJ';

export const supabase = createClient(supabaseUrl, supabaseKey);