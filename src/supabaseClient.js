import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vwjuulhzlqmpdethugdo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3anV1bGh6bHFtcGRldGh1Z2RvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcyODQ3NTAsImV4cCI6MjA2Mjg2MDc1MH0.-obd32AhQyQcM2ZA1wO0fTvxOT-hJzjlq5t0eBsd5cg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);