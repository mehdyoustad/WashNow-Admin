import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://haixofmqptipzqvmonzg.supabase.co';
const supabaseKey = 'sb_publishable_XPRpMqiUOvTFtck_YQ9tBQ_vUlq0uqE';

export const supabase = createClient(supabaseUrl, supabaseKey);