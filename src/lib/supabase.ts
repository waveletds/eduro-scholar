import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xhzssxxwjcyvcrscdpiq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhoenNzeHh3amN5dmNyc2NkcGlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NDA1NTksImV4cCI6MjA5MzExNjU1OX0.KPiqD1Of-0hUGH5H0tM3CA884wWlrQWsLqHKSmSfrl4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
