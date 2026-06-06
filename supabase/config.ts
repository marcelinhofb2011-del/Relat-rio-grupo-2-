import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kptilycibgboqwpvokga.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwdGlseWNpYmdib3F3cHZva2dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA3MTI4OTMsImV4cCI6MjA5NjI4ODg5M30.bM-3ED5dDpuwDXSYOocqIZKX4-nMqeJp2RHXeZd_si0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
